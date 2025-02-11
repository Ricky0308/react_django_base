from authentication.views import TokenObtainView, TokenRefresh, PasswordResetView, PasswordResetConfirmView
from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import AuthUserViewSet, UserSignUpView, UserActivationView, SignOutView, UserDeleteView, UserInfoView
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('token/', TokenObtainView.as_view()),
    path('token/refresh/', TokenRefresh.as_view()), 
    
    path('sign-up/', UserSignUpView.as_view(), name='sign-up'),
    path('user-activate/<str:uidb64>/<str:token>/', UserActivationView.as_view(), name='user-activate'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('sign-out/', SignOutView.as_view(), name='sign-out'),
    path('user-delete/', UserDeleteView.as_view(), name='user-delete'),
    path('user-info/', UserInfoView.as_view(), name='user-info'),
]

router = DefaultRouter()
router.register(r"user", AuthUserViewSet, basename='')
urlpatterns += router.urls