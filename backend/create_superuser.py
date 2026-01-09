import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'talent_horizon.settings')
django.setup()

from core.models import User

if not User.objects.filter(email='admin@talenthorizon.com').exists():
    User.objects.create_superuser(
        email='admin@talenthorizon.com',
        password='Admin123',
        first_name='Admin',
        last_name='User'
    )
    print('Superuser created successfully')
else:
    print('Superuser already exists')
