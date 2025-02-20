from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token
from rest_framework import status
from .models import Profile
from .serializers import ProfileSerializer
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit



class HelloWorld(APIView):
    def get(self, request):
        print(request)
        return Response({"message": "Hello, world!"})

    def post(self, request):
        
        cookie_token = request.COOKIES.get('csrftoken', 'No csrftoken cookie')
        header_token = request.META.get('HTTP_X_CSRFTOKEN', 'No X-CSRFToken header')
        print("get_token:", get_token(request))
        print("cookie_token:", cookie_token)
        print("header_token:", header_token)
        return Response({"message": "Hello, world!"})

class ProfileUpdateView(APIView):

    @method_decorator(ratelimit(key='user', rate='20/h', block=True), name='dispatch')
    @swagger_auto_schema(
        request_body=ProfileSerializer,
        responses={
            200: ProfileSerializer,
            400: 'Invalid input'
        }
    )
    def put(self, request, *args, **kwargs):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)