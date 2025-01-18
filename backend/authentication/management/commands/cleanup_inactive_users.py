from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.conf import settings

class Command(BaseCommand):
    help = "Deletes unactivated user accounts that have expired token or exceeded grace period."

    def handle(self, *args, **options):

        User = get_user_model()
        expiry_time = timezone.now() - timedelta(seconds=settings.PASSWORD_RESET_TIMEOUT)
        
        # Filter for users who are still inactive and whose date_joined is older than the expiry time
        queryset = User.objects.filter(is_active=False, date_joined__lt=expiry_time)
        num_to_delete = len(queryset)
        queryset.delete()
        
        self.stdout.write(
            self.style.SUCCESS(
                f"Deleted {num_to_delete} unactivated user(s) who exceeded the grace period."
            )
        )