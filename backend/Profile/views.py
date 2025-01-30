from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token



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