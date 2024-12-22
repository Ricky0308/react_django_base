from django.urls import path
from .views import HelloWorld
from .views import AuthUserViewSet
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('hello/', HelloWorld.as_view(), name='hello-world'),
]

router = DefaultRouter()
router.register(r'auth_user', AuthUserViewSet, basename='')
urlpatterns += router.urls