from authentication.views import TokenObtainView, TokenRefresh
from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import AuthUserViewSet
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('token/', TokenObtainView.as_view()),
    path('token/refresh/', TokenRefresh.as_view())
]

router = DefaultRouter()
router.register(r"user", AuthUserViewSet, basename='')
urlpatterns += router.urls