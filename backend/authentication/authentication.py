from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

# CookieHandlerJWTAuthentication checks if tokens are valid 
class CookieHandlerJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Cookieヘッダーからaccess_tokenを取得
        access_token = request.COOKIES.get('access')
        if not access_token:
            Response({"message": 'no Token'})
        else:
            Response(access_token)

        if access_token:
            request.META['HTTP_AUTHORIZATION'] = '{header_type} {access_token}'.format(
                header_type=settings.SIMPLE_JWT['AUTH_HEADER_TYPES'][0], access_token=access_token)

        return super().authenticate(request)
    

UserModel = get_user_model()

class EmailAuthenticationBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **credentials):
        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return None
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
    