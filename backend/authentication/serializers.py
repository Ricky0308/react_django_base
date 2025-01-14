from rest_framework import serializers
from django.contrib.auth import get_user_model
import re

User = get_user_model()

# related to AuthUser not Profile
class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
        
class UserBaseSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['email', 'password']

class UserSignUpSerializer(UserBaseSerializer):
    
    def validate_email(self, email):
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, email):
            raise serializers.ValidationError("Invalid email format.")
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email is already in use.")
        return email

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user