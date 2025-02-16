from rest_framework import serializers
from django.contrib.auth import get_user_model
import re
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

# related to AuthUser not Profile
class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
        
class UserBaseSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, validators=[validate_password])

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

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return value

    def save(self):
        request = self.context.get('request')
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"{settings.WEBPAGE_DOMAIN}/password-reset-confirm/{uid}/{token}/"
        
        send_mail(
            "Password Reset Request",
            f"Use the link below to reset your password:\n{reset_url}",
            settings.EMAIL_HOST_USER,
            [email],
        )

class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate(self, attrs):
        try:
            uid = force_str(urlsafe_base64_decode(attrs['uidb64']))
            user = User.objects.get(pk=uid)
            print("(debug) uid: ", uid)
            print("(debug) user: ", user)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid password reset link.")

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError("Invalid password reset link.")

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()

class EmailChangeSerializer(serializers.Serializer):
    new_email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = self.context['request'].user
        if not user.check_password(data['password']):
            raise serializers.ValidationError("Incorrect password.")
        
        if User.objects.filter(email=data['new_email']).exists():
            raise serializers.ValidationError("Email is already in use.")
        
        return data

    def save(self):
        user = self.context['request'].user
        new_email = self.validated_data['new_email']
        old_email = user.email
        user.set_pending_email(new_email)
        
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        confirmation_url = f"{settings.WEBPAGE_DOMAIN}/reset-email-confirm/{uid}/{token}"
        
        # Send confirmation email to the new email address
        send_mail(
            "Confirm your new email address",
            f"Please confirm your new email address by clicking the link: {confirmation_url}",
            settings.EMAIL_HOST_USER,
            [new_email],
        )
        
        # Send notification email to the old email address
        send_mail(
            "Email Change Requested",
            f"A request to change your email address to {new_email} was made. If you did not make this request, please contact support.",
            settings.EMAIL_HOST_USER,
            [old_email],
        )