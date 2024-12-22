from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS, IsAdminUser

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.utils.decorators import method_decorator
from rest_framework import viewsets

from rest_framework import serializers

from django.contrib.auth import get_user_model

User = get_user_model()



class HelloWorld(APIView):
    def get(self, request):
        return Response({"message": "Hello, world!"}, status=status.HTTP_200_OK)

from rest_framework import permissions
from django.shortcuts import get_object_or_404

class IsUserItselfOrAdmin(permissions.BasePermission):
    
    def has_object_permission(self, request, view, target_user):
        if request.user.is_staff:
            return True
        return request.user.id == target_user.id
    
    def has_permission(self, request, view):
        # print(f"{request.user.id=}")
        return request.user.is_authenticated



# related to AuthUser not Profile
class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

@method_decorator(name='list', decorator=swagger_auto_schema(
    operation_description="description from swagger_auto_schema via method_decorator"
))
class AuthUserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsUserItselfOrAdmin]
    queryset = User.objects.all()
    serializer_class = AuthUserSerializer
    http_method_names = ['get', 'patch']
    
    def get_permissions(self):
        """
        Assign different permissions based on the action.
        """
        if self.action == 'list':
            # Allow access only to admin users
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsUserItselfOrAdmin]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        return User.objects.all()

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj