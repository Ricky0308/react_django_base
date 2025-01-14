from authentication.views import TokenObtainView, TokenRefresh
from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import AuthUserViewSet, UserSignUpView, UserActivationView
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('token/', TokenObtainView.as_view()),
    path('token/refresh/', TokenRefresh.as_view()), 
    
    path('sign-up/', UserSignUpView.as_view(), name='sign-up'),
    path('user-activate/<str:uidb64>/<str:token>/', UserActivationView.as_view(), name='user-activate'),
]

router = DefaultRouter()
router.register(r"user", AuthUserViewSet, basename='')
urlpatterns += router.urls