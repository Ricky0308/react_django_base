import uuid
from rest_framework import status, serializers, exceptions, generics
from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt import exceptions as jwt_exp
from rest_framework_simplejwt.serializers import TokenRefreshSerializer, TokenObtainSerializer
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
import logging

# Initialize security logger
logger_security = logging.getLogger("security")

from drf_yasg.utils import swagger_auto_schema
from django.utils.decorators import method_decorator
from rest_framework import viewsets
from drf_yasg import openapi
from config.permissions import IsAccessingOwnAccount
from django.contrib.auth import get_user_model

from.serializers import AuthUserSerializer, UserSignUpSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer, EmailChangeSerializer, UserUpdateSerializer, UserSerializer

from django.utils.encoding import force_bytes, force_str
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.conf import settings
from .authentication import UserActivationAuthentication
from rest_framework.permissions import AllowAny

from django_ratelimit.decorators import ratelimit
from django.db import transaction
from rest_framework.permissions import IsAuthenticated

from utils.webpage_urls import get_webpage_user_activation_url

from rest_framework.decorators import api_view
from rest_framework.authentication import TokenAuthentication

from django.utils import timezone

User = get_user_model()


class UserSignUpView(generics.CreateAPIView):
    serializer_class = UserSignUpSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Endpoint for user registration. Accepts user data and sends an activation email.",
        request_body=UserSignUpSerializer,
        responses={
            201: openapi.Response(
                description="User successfully created. Activation email sent.",
                examples={
                    "application/json": {
                        "email": "user@example.com",
                        "username": "user_12345678",
                    }
                },
            ),
            400: "Invalid input data.",
        },
    )
    @method_decorator(ratelimit(key='ip', rate='10/m', block=True))
    def post(self, request, *args, **kwargs):
        client_ip = request.META.get('REMOTE_ADDR', 'unknown')
        logger_security.info("User registration attempt", extra={
            "ip": client_ip,
            "email": request.data.get('email', '[no email]')
        })
        
        serializer = UserSignUpSerializer(data=request.data)
        if not serializer.is_valid():
            logger_security.warning("Failed user registration", extra={
                "ip": client_ip,
                "email": request.data.get('email', '[no email]'),
                "reason": "validation error"
            })
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = self.perform_create(serializer)
            self.send_user_activation_email(user)
            logger_security.info("User registered successfully", extra={
                "user_id": user.id,
                "email": user.email,
                "ip": client_ip
            })
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger_security.error("Exception during user registration", extra={
                "email": request.data.get('email', '[no email]'),
                "ip": client_ip,
                "error": str(e)
            })
            raise

    @transaction.atomic
    def perform_create(self, serializer):
        random_username = self.generate_random_username()
        user = serializer.save(username=random_username)
        user.is_active = False
        user.save()
        return user

    def generate_random_username(self):
        while True:
            username = f"user_{uuid.uuid4().hex[:8]}"
            if not User.objects.filter(username=username).exists():
                return username

    def send_user_activation_email(self, user):
        # replace below with frontend url
        activation_url = self.get_activation_url(user)
        email_subject = "Welcome to Hub of AI!"
        email_body = strip_tags(render_to_string("email/user_activation.txt", {"activation_url":activation_url}))
        
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [user.email]
        send_mail(email_subject, email_body, from_email, recipient_list)

    def get_activation_url(self, user):
        uid = urlsafe_base64_encode(force_bytes(user.id))
        token = default_token_generator.make_token(user)
        return get_webpage_user_activation_url(uid, token)

class UserActivationView(APIView):
    authentication_classes = [UserActivationAuthentication]

    def get(self, request, uidb64, token):
        client_ip = request.META.get('REMOTE_ADDR', 'unknown')
        logger_security.info("Account activation attempt", extra={
            "uidb64": uidb64,
            "ip": client_ip
        })
        
        try:
            decoded_uid = urlsafe_base64_decode(uidb64)
            id = force_str(decoded_uid)
            user = User.objects.get(id=id)
            
            validation_result = self.validate_activation_token(user, token) and not user.is_active
            if validation_result:
                user.is_active = True 
                user.save()
                logger_security.info("User activated successfully", extra={
                    "user_id": user.id,
                    "email": user.email,
                    "ip": client_ip
                })
                return Response({"message" : "User activated!", "success" : True})
            else:
                reason = "invalid token" if not self.validate_activation_token(user, token) else "already active"
                logger_security.warning("Failed account activation", extra={
                    "user_id": user.id,
                    "email": user.email,
                    "reason": reason,
                    "ip": client_ip
                })
                return Response({"message":"Something went wrong", "success" : False})
        except Exception as e:
            logger_security.error("Exception during account activation", extra={
                "uidb64": uidb64,
                "ip": client_ip,
                "error": str(e)
            })
            return Response({"message":"Something went wrong", "success" : False})
    
    def validate_activation_token(self, user, token):
        token_generator = default_token_generator
        return token_generator.check_token(user, token)

@method_decorator(name='list', decorator=swagger_auto_schema(
    operation_description="description from swagger_auto_schema via method_decorator"
))
class AuthUserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAccessingOwnAccount, IsAdminUser]
    queryset = User.objects.all()
    serializer_class = AuthUserSerializer
    http_method_names = ['get', 'patch']
    
    def get_permissions(self):
        """
        Assign different permissions based on the action.
        """
        if self.action == 'list':
            # Allow access only to admin users
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAccessingOwnAccount, IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        return User.objects.all()

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj



### Token 

class ExtendedTokenObtainSerializer(TokenObtainSerializer):
    
    token_class = RefreshToken
    
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        # Remove the username field and add the email field
        self.fields.pop(self.username_field, None)
        self.fields["email"] = serializers.CharField(write_only=True)
        
    def validate(self, attrs):
        # Use email for authentication
        authenticate_kwargs = {
            "email": attrs["email"],
            "password": attrs["password"],
        }
        try:
            authenticate_kwargs["request"] = self.context["request"]
        except KeyError:
            pass

        self.user = authenticate(**authenticate_kwargs)

        if not api_settings.USER_AUTHENTICATION_RULE(self.user):
            raise exceptions.AuthenticationFailed(
                self.error_messages["no_active_account"],
                "no_active_account",
            )
            
        data = {}
        
        refresh = self.get_token(self.user)

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data
        


class TokenObtainView(jwt_views.TokenObtainPairView):

    # @method_decorator(ratelimit(key='ip', rate='1/h'))
    # @method_decorator(ratelimit(key='post:email', rate='7/h'))
    
    def __init__(self):
        super().__init__()
        self.serializer_class = ExtendedTokenObtainSerializer
    
    def post(self, request, *args, **kwargs):
        client_ip = request.META.get('REMOTE_ADDR', 'unknown')
        email = request.data.get('email', '[no email]')
        logger_security.info("Login attempt", extra={
            "email": email,
            "ip": client_ip
        })
        
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except jwt_exp.TokenError as e:
            logger_security.warning("Token error during login attempt", extra={
                "email": email,
                "ip": client_ip,
                "error_type": type(e).__name__
            })
            raise jwt_exp.InvalidToken(e.args[0])
        except exceptions.AuthenticationFailed as e:
            logger_security.warning("Authentication failed", extra={
                "email": email,
                "ip": client_ip,
                "error_type": type(e).__name__
            })
            raise

        # Log successful login
        user_id = getattr(serializer.user, 'id', '[unknown]')
        logger_security.info("Successful login", extra={
            "user_id": user_id,
            "email": email,
            "ip": client_ip
        })

        res = Response({"message": "Login successful", "success": True}, status=status.HTTP_200_OK)

        try:
            res.delete_cookie("access_token")
        except Exception as e:
            print(e)

        # Set the Token in the Cookie header
        res.set_cookie(
            "access",
            serializer.validated_data["access"],
            max_age=settings.ACCESS_TOKEN_LIFETIME,
            httponly=True,
            samesite=settings.ACCESS_TOKEN_SAMESITE,
            secure=settings.ACCESS_TOKEN_SECURE
        )
        res.set_cookie(
            "refresh",
            serializer.validated_data["refresh"],
            max_age=settings.REFRESH_TOKEN_LIFETIME,
            httponly=True,
            samesite=settings.ACCESS_TOKEN_SAMESITE,
            secure=settings.ACCESS_TOKEN_SECURE
        )

        # Finally, return the access_token and refresh_token
        return res


class TokenRefresh(APIView):
    
    permission_classes = [AllowAny] # accessible even after access token expires
    
    def post(self, request, *args, **kwargs):
        client_ip = request.META.get('REMOTE_ADDR', 'unknown')
        logger_security.info("Token refresh attempt", extra={
            "ip": client_ip
        })
        
        if not request.COOKIES.get("refresh"):
            logger_security.warning("Token refresh failed - refresh token not found in cookies", extra={
                "ip": client_ip
            })
            raise Exception("refresh token is not set")
            
        data = {"refresh":request.COOKIES["refresh"]}
        serializer = TokenRefreshSerializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
        except jwt_exp.TokenError as e:
            logger_security.warning("Invalid refresh token used", extra={
                "ip": client_ip,
                "error_type": type(e).__name__
            })
            raise jwt_exp.InvalidToken(e.args[0])

        logger_security.info("Token refresh successful", extra={
            "ip": client_ip
        })
        response = Response({"message": "Token refresh successful", "success": True}, status=status.HTTP_200_OK)
        # delete existing cookies
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        response.set_cookie(
            "access",
            serializer.validated_data["access"],
            httponly=True,
            max_age=settings.ACCESS_TOKEN_LIFETIME,
            samesite=settings.ACCESS_TOKEN_SAMESITE,
            secure=settings.ACCESS_TOKEN_SECURE
        )
        response.set_cookie(
            "refresh",
            serializer.validated_data["refresh"],
            httponly=True,
            max_age=settings.REFRESH_TOKEN_LIFETIME,
            samesite=settings.ACCESS_TOKEN_SAMESITE,
            secure=settings.ACCESS_TOKEN_SECURE
        )
        return response

class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer
    permission_classes = [AllowAny]

    @method_decorator(ratelimit(key='ip', rate='5/m', block=True))
    def post(self, request, *args, **kwargs):
        client_ip = request.META.get('REMOTE_ADDR', 'unknown')
        email = request.data.get('email', '[no email]')
        logger_security.info("Password reset requested", extra={
            "email": email,
            "ip": client_ip
        })
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger_security.info("Password reset email sent", extra={
                "email": email,
                "ip": client_ip
            })
            return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)
        else:
            logger_security.warning("Invalid password reset request", extra={
                "email": email,
                "ip": client_ip
            })
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    @method_decorator(ratelimit(key='ip', rate='5/m', block=True))
    def post(self, request, *args, **kwargs):
        client_ip = request.META.get('REMOTE_ADDR', 'unknown')
        uidb64 = request.data.get('uidb64', '[no uid]')
        logger_security.info("Password reset confirmation attempt", extra={
            "uidb64": uidb64,
            "ip": client_ip
        })
        
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            logger_security.info("Password reset successfully completed", extra={
                "uidb64": uidb64,
                "ip": client_ip
            })
            return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            logger_security.warning("Password reset confirmation failed", extra={
                "uidb64": uidb64,
                "ip": client_ip,
                "error": str(e)
            })
            raise

class SignOutView(APIView):
    def post(self, request):
        client_ip = request.META.get('REMOTE_ADDR', 'unknown')
        user_id = getattr(request.user, 'id', '[unknown]')
        logger_security.info("User sign-out", extra={
            "user_id": user_id,
            "ip": client_ip
        })
        
        response = Response({"message": "Successfully signed out."}, status=status.HTTP_200_OK)
        response.delete_cookie('access')  # Assuming JWT token is stored in a cookie named 'access'
        response.delete_cookie('refresh')  # If you have a refresh token
        return response

class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        client_ip = request.META.get('REMOTE_ADDR', 'unknown')
        user = request.user
        user_id = user.id
        email = user.email
        
        logger_security.warning("Account deletion initiated", extra={
            "user_id": user_id,
            "email": email,
            "ip": client_ip
        })
        
        try:
            user.delete()
            logger_security.warning("Account successfully deleted", extra={
                "user_id": user_id,
                "email": email,
                "ip": client_ip
            })
            response = Response({"message": "User deleted successfully."}, status=status.HTTP_200_OK)
            # delete all cookies
            response.delete_cookie('access')
            response.delete_cookie('refresh')
            return response
        except Exception as e:
            logger_security.error("Account deletion failed", extra={
                "user_id": user_id,
                "email": email,
                "ip": client_ip,
                "error": str(e)
            })
            raise

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        client_ip = request.META.get('REMOTE_ADDR', 'unknown')
        user = request.user
        logger_security.info("User info accessed", extra={
            "user_id": user.id,
            "ip": client_ip
        })
        
        serializer = UserSerializer(user)
        return Response(serializer.data)

class EmailChangeView(generics.GenericAPIView):

    serializer_class = EmailChangeSerializer

    def post(self, request):
        client_ip = request.META.get('REMOTE_ADDR', 'unknown')
        user_id = request.user.id
        new_email = request.data.get('email', '[no email]')
        logger_security.info("Email change requested", extra={
            "user_id": user_id,
            "new_email": new_email,
            "ip": client_ip
        })
        
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            logger_security.info("Email change confirmation sent", extra={
                "user_id": user_id,
                "new_email": new_email,
                "ip": client_ip
            })
            return Response({"message": "Confirmation email sent."}, status=status.HTTP_200_OK)
        
        logger_security.warning("Invalid email change request", extra={
            "user_id": user_id,
            "new_email": new_email,
            "ip": client_ip
        })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmailChangeConfirmView(generics.GenericAPIView):

    def get(self, request, uidb64, token):
        client_ip = request.META.get('REMOTE_ADDR', 'unknown')
        logger_security.info("Email change confirmation attempt", extra={
            "uidb64": uidb64,
            "ip": client_ip
        })
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            if default_token_generator.check_token(user, token) and user.pending_email_expiration > timezone.now():
                user.email = user.pending_email
                user.pending_email = None
                user.pending_email_expiration = None

                user.save()
                logger_security.info("Email successfully changed", extra={
                    "user_id": user.id,
                    "new_email": user.email,
                    "ip": client_ip
                })
                return Response({"message": "Email updated successfully."}, status=status.HTTP_200_OK)
            
            logger_security.warning("Invalid or expired email change token", extra={
                "user_id": user.id,
                "ip": client_ip
            })
            return Response({"message": "Invalid or expired link."}, status=status.HTTP_400_BAD_REQUEST)
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
            logger_security.warning("Invalid email change link", extra={
                "uidb64": uidb64,
                "ip": client_ip,
                "error": str(e)
            })
            return Response({"message": "Invalid link."}, status=status.HTTP_400_BAD_REQUEST)

class UserUpdateView(APIView):

    @swagger_auto_schema(
        request_body=UserUpdateSerializer,
        responses={
            200: UserUpdateSerializer,
            400: 'Invalid input'
        }
    )
    @method_decorator(ratelimit(key='user', rate='2/7d', block=True)) # 2 updates per week
    def put(self, request, *args, **kwargs):
        client_ip = request.META.get('REMOTE_ADDR', 'unknown')
        user = get_object_or_404(User, pk=request.user.pk)
        user_id = user.id
        
        logger_security.info("Account update requested", extra={
            "user_id": user_id,
            "ip": client_ip
        })
        
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            logger_security.info("Account successfully updated", extra={
                "user_id": user_id,
                "ip": client_ip,
                "updated_fields": list(request.data.keys())
            })
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        logger_security.warning("Invalid account update attempt", extra={
            "user_id": user_id,
            "ip": client_ip
        })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
