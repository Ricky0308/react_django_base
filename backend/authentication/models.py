import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta

class User(AbstractUser):
    """
    Custom User model where the ID is a UUID instead of an integer.
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    pending_email = models.EmailField(blank=True, null=True)
    pending_email_expiration = models.DateTimeField(blank=True, null=True)

    def set_pending_email(self, email):
        self.pending_email = email
        self.pending_email_expiration = timezone.now() + timedelta(hours=1)  # 1 hour expiration
        self.save()