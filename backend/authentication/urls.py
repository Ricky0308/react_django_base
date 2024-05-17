from authentication.views import TokenObtainView, TokenRefresh
from rest_framework.routers import DefaultRouter
from django.urls import path

router = DefaultRouter()

urlpatterns = [
    path('', TokenObtainView.as_view()),
    path('refresh/', TokenRefresh.as_view())
]
urlpatterns += router.urls