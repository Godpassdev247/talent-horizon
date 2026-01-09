#!/usr/bin/env python3
"""
Sync John Doe's application from frontend MySQL to Django backend
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'talent_horizon.settings')
django.setup()

from jobs.models import Application, Job, Company, Resume
from core.models import User

# First, ensure John Doe exists in Django
john, created = User.objects.get_or_create(
    email='john@talenthorizon.com',
    defaults={
        'first_name': 'John',
        'last_name': 'Doe',
        'phone': '+1 (555) 123-4567',
        'location': 'San Francisco, CA',
        'headline': 'Senior Software Engineer | Full Stack Developer',
        'bio': '''Experienced software engineer with 7+ years of experience in building scalable web applications. Passionate about clean code, agile methodologies, and mentoring junior developers. Skilled in React, Node.js, Python, and cloud technologies.''',
        'is_active': True,
    }
)
if created:
    john.set_password('john123')
    john.save()
    print(f"Created user: {john.email}")
else:
    print(f"User already exists: {john.email}")

# Get the Senior Software Engineer job at TechVentures Inc.
try:
    techventures = Company.objects.get(name='TechVentures Inc.')
    job = Job.objects.get(title='Senior Software Engineer', company=techventures)
    print(f"Found job: {job.title} at {job.company.name}")
except (Company.DoesNotExist, Job.DoesNotExist) as e:
    print(f"Error finding job: {e}")
    sys.exit(1)

# Create resume for John (using correct field names)
resume, created = Resume.objects.get_or_create(
    user=john,
    defaults={
        'name': 'John_Doe_Resume_2026.pdf',
        'is_primary': True,
    }
)
if created:
    print(f"Created resume: {resume.name}")
else:
    print(f"Resume already exists: {resume.name}")

# Create the application
cover_letter = '''Dear Hiring Manager,

I am writing to express my strong interest in the Senior Software Engineer position at TechVentures Inc. With over 7 years of experience in full-stack development and a proven track record of building scalable applications, I am confident that I would be a valuable addition to your team.

In my current role at Tech Startup Inc., I have led the development of a microservices architecture that serves over 2 million users daily. I have extensive experience with React, Node.js, and cloud technologies including AWS, which aligns perfectly with the requirements of this position.

Key achievements that demonstrate my qualifications:
• Architected and implemented a real-time data processing pipeline that reduced latency by 60%
• Led a team of 5 engineers in delivering a major product feature 2 weeks ahead of schedule
• Mentored 3 junior developers, helping them grow into mid-level engineers
• Implemented CI/CD pipelines that reduced deployment time from 2 hours to 15 minutes

I am particularly excited about TechVentures Inc.'s mission to innovate in the technology space, and I believe my skills and experience would help drive your continued success.

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.

Best regards,
John Doe'''

application, created = Application.objects.get_or_create(
    job=job,
    applicant=john,
    defaults={
        'resume': resume,
        'cover_letter': cover_letter,
        'status': 'pending',
        'applicant_notes': '',
        'employer_notes': '',
    }
)

if created:
    print(f"\n✅ Successfully created application!")
    print(f"   Applicant: {john.first_name} {john.last_name}")
    print(f"   Job: {job.title}")
    print(f"   Company: {job.company.name}")
    print(f"   Status: {application.status}")
    print(f"   Applied at: {application.created_at}")
else:
    print(f"\n⚠️ Application already exists for {john.email} to {job.title}")

# Show all applications
print("\n=== All Applications in Django ===")
for app in Application.objects.all():
    print(f"- {app.applicant.first_name} {app.applicant.last_name} applied for {app.job.title} at {app.job.company.name} (Status: {app.status})")
