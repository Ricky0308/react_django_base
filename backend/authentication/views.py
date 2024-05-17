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
