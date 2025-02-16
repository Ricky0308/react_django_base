from django.urls import path
from .views import HelloWorld, ProfileUpdateView

urlpatterns = [
    path('hello/', HelloWorld.as_view(), name='hello-world'),
    path('update/', ProfileUpdateView.as_view(), name='profile-update'),
]
