#!/usr/bin/env python3
"""
Sync jobs and companies from frontend MySQL database to Django SQLite database.
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'talent_horizon.settings')
sys.path.insert(0, '/home/ubuntu/talent-horizon/backend')
django.setup()

import mysql.connector
from jobs.models import Job, Company
from core.models import User
from django.utils.text import slugify

# Connect to frontend MySQL database
mysql_conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='',
    database='talent_horizon'
)
cursor = mysql_conn.cursor(dictionary=True)

# Get admin user for posting jobs
admin_user = User.objects.filter(is_superuser=True).first()
if not admin_user:
    admin_user = User.objects.first()
print(f"Using user: {admin_user.email if admin_user else 'None'}")

# Sync companies first
print("\n=== Syncing Companies ===")
cursor.execute("SELECT * FROM companies")
frontend_companies = cursor.fetchall()

company_mapping = {}  # Map frontend company ID to Django company

for fc in frontend_companies:
    # Check if company already exists by slug
    company, created = Company.objects.update_or_create(
        slug=fc['slug'],
        defaults={
            'name': fc['name'],
            'description': fc.get('description', ''),
            'industry': fc.get('industry', ''),
            'company_size': fc.get('size', '51-200'),
            'headquarters': fc.get('location', ''),
            'website': fc.get('website', ''),
            'is_verified': bool(fc.get('verified', False)),
        }
    )
    company_mapping[fc['id']] = company
    status = "Created" if created else "Updated"
    print(f"  {status}: {company.name}")

# Sync jobs
print("\n=== Syncing Jobs ===")
cursor.execute("SELECT * FROM jobs")
frontend_jobs = cursor.fetchall()

# Map frontend job types to Django job types
job_type_map = {
    'full-time': 'full_time',
    'part-time': 'part_time',
    'contract': 'contract',
    'internship': 'internship',
    'temporary': 'temporary',
}

# Map frontend experience levels to Django
exp_level_map = {
    'entry': 'entry',
    'mid': 'mid',
    'senior': 'senior',
    'executive': 'executive',
}

# Map frontend status to Django status
status_map = {
    'active': 'published',
    'draft': 'draft',
    'paused': 'closed',
    'closed': 'closed',
    'filled': 'archived',
}

for fj in frontend_jobs:
    company = company_mapping.get(fj['companyId'])
    if not company:
        print(f"  Skipping job {fj['title']} - company not found")
        continue
    
    # Map values
    job_type = job_type_map.get(fj.get('jobType', 'full-time'), 'full_time')
    exp_level = exp_level_map.get(fj.get('experienceLevel', 'mid'), 'mid')
    status = status_map.get(fj.get('status', 'active'), 'published')
    is_remote = fj.get('locationType') == 'remote'
    
    # Create or update job
    job, created = Job.objects.update_or_create(
        slug=fj['slug'],
        defaults={
            'title': fj['title'],
            'company': company,
            'posted_by': admin_user,
            'description': fj.get('description', ''),
            'requirements': fj.get('requirements', ''),
            'benefits': fj.get('benefits', ''),
            'job_type': job_type,
            'experience_level': exp_level,
            'location': fj.get('location', ''),
            'is_remote': is_remote,
            'salary_min': fj.get('salaryMin'),
            'salary_max': fj.get('salaryMax'),
            'show_salary': bool(fj.get('showSalary', True)),
            'status': status,
            'is_featured': bool(fj.get('featured', False)),
            'is_urgent': bool(fj.get('urgent', False)),
            'views_count': fj.get('viewCount', 0),
            'applications_count': fj.get('applicationCount', 0),
        }
    )
    status_text = "Created" if created else "Updated"
    print(f"  {status_text}: {job.title} at {company.name}")

# Close MySQL connection
cursor.close()
mysql_conn.close()

print("\n=== Sync Complete ===")
print(f"Total companies in Django: {Company.objects.count()}")
print(f"Total jobs in Django: {Job.objects.count()}")
