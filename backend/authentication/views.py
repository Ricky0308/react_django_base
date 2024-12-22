from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt import exceptions as jwt_exp
from rest_framework_simplejwt.serializers import TokenRefreshSerializer, TokenObtainSerializer
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status, serializers, exceptions
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser

from drf_yasg.utils import swagger_auto_schema
from django.utils.decorators import method_decorator
from rest_framework import viewsets

from rest_framework import serializers
from config.permissions import IsUserItselfOrAdmin
from django.contrib.auth import get_user_model


User = get_user_model()


# related to AuthUser not Profile
class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


@method_decorator(name='list', decorator=swagger_auto_schema(
    operation_description="description from swagger_auto_schema via method_decorator"
))
class AuthUserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsUserItselfOrAdmin]
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
            permission_classes = [IsUserItselfOrAdmin]
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

        self.fields["email"] = serializers.CharField(write_only=True)
        
    def validate(self, attrs):
        authenticate_kwargs = {
            self.username_field: attrs[self.username_field],
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
        # Retrieve the desired Serializer (in this case, the serializers.TokenObtainPairSerializer used by TokenObtainPairView)
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except jwt_exp.TokenError as e:
            raise jwt_exp.InvalidToken(e.args[0])

        res = Response(serializer.validated_data, status=status.HTTP_200_OK)

        try:
            res.delete_cookie("access_token")
        except Exception as e:
            print(e)

        print("validated_data", serializer.validated_data)
        # Set the Token in the Cookie header
        res.set_cookie(
            "access",
            serializer.validated_data["access"],
            max_age=60 * 60 * 24,
            httponly=True,
        )
        res.set_cookie(
            "refresh",
            serializer.validated_data["refresh"],
            max_age=60 * 60 * 24 * 30,
            httponly=True,
        )

        # Finally, return the access_token and refresh_token
        return res


class TokenRefresh(APIView):
    def post(self, request, *args, **kwargs):
        if not request.COOKIES.get("refresh"):
            raise Exception("refresh token is not set")
        data = {"refresh":request.COOKIES["refresh"]}
        serializer = TokenRefreshSerializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
        except jwt_exp.TokenError as e:
            raise jwt_exp.InvalidToken(e.args[0])

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        # delete existing cookies
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        response.set_cookie(
            "access",
            serializer.validated_data["access"],
            max_age=60 * 24 * 24 * 30,
            httponly=True,
        )
        response.set_cookie(
            "refresh",
            serializer.validated_data["refresh"],
            max_age=60 * 24 * 24 * 30,
            httponly=True,
        )
        return response
