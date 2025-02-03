from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class PasswordResetTests(APITestCase):
    def test_password_reset_request(self):
        url = reverse('password-reset')
        data = {'email': 'user@example.com'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_reset_confirm(self):
        # Assuming you have a way to generate a valid token and uid
        url = reverse('password-reset-confirm')
        data = {'uidb64': 'valid_uid', 'token': 'valid_token', 'new_password': 'new_password123'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class SignOutTests(APITestCase):
    def test_sign_out(self):
        url = reverse('sign-out')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "Successfully signed out.")

class UserDeleteTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='user@example.com', password='password123')
        self.client.force_authenticate(user=self.user)

    def test_user_delete(self):
        url = reverse('user-delete')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(email='user@example.com').exists()) 