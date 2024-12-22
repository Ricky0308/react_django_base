from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response



class HelloWorld(APIView):
    def get(self, request):
        return Response({"message": "Hello, world!"}, status=status.HTTP_200_OK)