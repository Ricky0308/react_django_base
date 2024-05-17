from django.db import models
import uuid

def generate_id():
    return str(uuid.uuid4()).replace('-', '')[:9]  # Take first 9 characters of UUID

class User(models.Model):
    user_id = models.CharField(max_length=9, primary_key=True, default=generate_id, editable=False)
    name = models.CharField(max_length=100)
    
    class Meta:
        db_table = "user"

    def __str__(self):
        return self.name
