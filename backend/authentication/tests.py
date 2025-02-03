from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

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