from django.db import models
from django.contrib.auth import get_user_model
from utils.primary_key import generate_secure_short_id

User = get_user_model()


class Profile(models.Model):
    id = models.CharField(max_length=16, primary_key=True, default=generate_secure_short_id, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_text = models.TextField(max_length=1000, blank=True)