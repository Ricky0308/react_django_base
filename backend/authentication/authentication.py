from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from django.conf import settings
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import  force_str
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model

User = get_user_model()

# CookieHandlerJWTAuthentication checks if tokens are valid 
class CookieHandlerJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        
        # allow requests to /swagger and /redoc
        if request.path.startswith('/swagger/') or request.path.startswith('/redoc/'):
            return None  # Skip authentication
        
        # get access_token from Cookie header
        access_token = request.COOKIES.get('access')
        if not access_token:
            Response({"message": 'no Token'})
        else:
            Response(access_token)

        if access_token:
            request.META['HTTP_AUTHORIZATION'] = '{header_type} {access_token}'.format(
                header_type=settings.SIMPLE_JWT['AUTH_HEADER_TYPES'][0], access_token=access_token)

        return super().authenticate(request)
    
class UserActivationAuthentication(BaseAuthentication):
    def authenticate(self, request):
        kwargs = request.parser_context["kwargs"]
        uidb64 = kwargs.get('uidb64')
        token = kwargs.get('token')

        if uidb64 and token:
            try:
                decoded_uid = urlsafe_base64_decode(uidb64)
                id = force_str(decoded_uid)
                user = User.objects.get(id=id)
                if user:
                    return (user, None)
                else:
                    raise AuthenticationFailed('Invalid activation token')
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                raise AuthenticationFailed('Invalid user ID')
        return None