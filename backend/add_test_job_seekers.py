import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'talent_horizon.settings')
django.setup()

from core.models import User
from jobs.models import Job, Application
from django.utils import timezone
from datetime import timedelta

# Delete existing test job seekers (optional - to avoid duplicates)
User.objects.filter(email__in=[
    'john.doe@example.com',
    'sarah.williams@example.com',
    'michael.chen@example.com',
    'emily.garcia@example.com',
    'david.brown@example.com'
]).delete()

# Create 5 diverse job seekers
job_seekers = [
    {
        'email': 'john.doe@example.com',
        'password': 'password123',
        'first_name': 'John',
        'last_name': 'Doe',
        'role': 'job_seeker',
        'phone': '+1 (555) 123-4567',
        'location': 'New York, NY',
        'headline': 'Senior Software Engineer | Full Stack Developer',
        'bio': 'Experienced software engineer with 8+ years in web development. Passionate about building scalable applications.',
        'is_verified': True,
        'is_featured': True,
        'open_to_work': True,
        'desired_salary_min': 120000,
        'desired_salary_max': 160000,
    },
    {
        'email': 'sarah.williams@example.com',
        'password': 'password123',
        'first_name': 'Sarah',
        'last_name': 'Williams',
        'role': 'job_seeker',
        'phone': '+1 (555) 234-5678',
        'location': 'San Francisco, CA',
        'headline': 'Product Designer | UX/UI Specialist',
        'bio': 'Creative product designer with a keen eye for user experience. 5 years of experience in tech startups.',
        'is_verified': True,
        'is_featured': False,
        'open_to_work': True,
        'desired_salary_min': 90000,
        'desired_salary_max': 130000,
        'linkedin': 'https://linkedin.com/in/sarahwilliams',
    },
    {
        'email': 'michael.chen@example.com',
        'password': 'password123',
        'first_name': 'Michael',
        'last_name': 'Chen',
        'role': 'job_seeker',
        'phone': '+1 (555) 345-6789',
        'location': 'Austin, TX',
        'headline': 'Data Scientist | Machine Learning Engineer',
        'bio': 'PhD in Computer Science specializing in machine learning and AI. Published researcher.',
        'is_verified': False,
        'is_featured': False,
        'open_to_work': True,
        'desired_salary_min': 110000,
        'desired_salary_max': 150000,
    },
    {
        'email': 'emily.garcia@example.com',
        'password': 'password123',
        'first_name': 'Emily',
        'last_name': 'Garcia',
        'role': 'job_seeker',
        'phone': '+1 (555) 456-7890',
        'location': 'Seattle, WA',
        'headline': 'Marketing Manager | Digital Strategy Expert',
        'bio': 'Results-driven marketing professional with proven track record in digital marketing and brand strategy.',
        'is_verified': True,
        'is_featured': False,
        'open_to_work': False,
        'desired_salary_min': 85000,
        'desired_salary_max': 115000,
        'website': 'https://emilygarcia.com',
    },
    {
        'email': 'david.brown@example.com',
        'password': 'password123',
        'first_name': 'David',
        'last_name': 'Brown',
        'role': 'job_seeker',
        'phone': '+1 (555) 567-8901',
        'location': 'Boston, MA',
        'headline': 'DevOps Engineer | Cloud Infrastructure Specialist',
        'bio': 'Certified AWS Solutions Architect with expertise in Kubernetes, Docker, and CI/CD pipelines.',
        'is_verified': False,
        'is_featured': True,
        'open_to_work': True,
        'is_suspended': True,
        'suspend_reason': 'Multiple spam applications detected',
        'admin_notes': 'User reported for sending automated job applications. Suspended pending investigation.',
        'desired_salary_min': 100000,
        'desired_salary_max': 140000,
    },
]

print("Creating job seekers...")
created_users = []

for seeker_data in job_seekers:
    password = seeker_data.pop('password')
    user = User.objects.create(**seeker_data)
    user.set_password(password)
    user.save()
    created_users.append(user)
    
    status = []
    if user.is_verified:
        status.append("✓ Verified")
    if user.is_featured:
        status.append("★ Featured")
    if user.is_suspended:
        status.append("✗ Suspended")
    if user.open_to_work:
        status.append("✓ Open to Work")
    
    status_str = " | ".join(status) if status else "No special status"
    print(f"✓ Created: {user.get_full_name()} ({user.email}) - {status_str}")

print(f"\n✓ Successfully created {len(created_users)} job seekers!")
print("\nTest credentials:")
print("Email: john.doe@example.com | Password: password123")
print("Email: sarah.williams@example.com | Password: password123")
print("Email: michael.chen@example.com | Password: password123")
print("Email: emily.garcia@example.com | Password: password123")
print("Email: david.brown@example.com | Password: password123")
print("\nYou can now test the Job Seekers Management at http://localhost:8000/admin-panel/job-seekers/")
