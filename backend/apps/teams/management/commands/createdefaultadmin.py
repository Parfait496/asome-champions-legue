from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from decouple import config


class Command(BaseCommand):
    help = 'Creates default admin user if none exists'

    def handle(self, *args, **kwargs):
        username = config('ADMIN_USERNAME', default='admin')
        password = config('ADMIN_PASSWORD', default='admin123')
        email = config('ADMIN_EMAIL', default='admin@asome.com')

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(
                username=username,
                password=password,
                email=email,
            )
            self.stdout.write(
                self.style.SUCCESS(f'✅ Admin user "{username}" created')
            )
        else:
            self.stdout.write(f'ℹ️ Admin user "{username}" already exists')