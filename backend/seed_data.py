import os
# Force SQLite by removing PostgreSQL env vars
if 'DATABASE_URL' in os.environ:
    del os.environ['DATABASE_URL']
if 'DB_HOST' in os.environ:
    del os.environ['DB_HOST']

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'talent_horizon.settings')
django.setup()

from core.models import User
from jobs.models import Company, Job

# Create sample companies
companies_data = [
    {
        'name': 'TechVentures Inc.',
        'slug': 'techventures-inc',
        'description': 'Leading technology company specializing in enterprise software solutions and cloud computing.',
        'website': 'https://techventures.example.com',
        'industry': 'Technology',
        'company_size': '1001-5000',
        'founded_year': 2010,
        'headquarters': 'San Francisco, CA',
        'is_verified': True,
        'is_featured': True,
    },
    {
        'name': 'Global Finance Corp',
        'slug': 'global-finance-corp',
        'description': 'International financial services company providing investment banking and wealth management.',
        'website': 'https://globalfinance.example.com',
        'industry': 'Finance',
        'company_size': '5001-10000',
        'founded_year': 1995,
        'headquarters': 'New York, NY',
        'is_verified': True,
        'is_featured': True,
    },
    {
        'name': 'HealthFirst Systems',
        'slug': 'healthfirst-systems',
        'description': 'Healthcare technology company revolutionizing patient care through innovative solutions.',
        'website': 'https://healthfirst.example.com',
        'industry': 'Healthcare',
        'company_size': '501-1000',
        'founded_year': 2015,
        'headquarters': 'Boston, MA',
        'is_verified': True,
        'is_featured': False,
    },
    {
        'name': 'Creative Studios',
        'slug': 'creative-studios',
        'description': 'Award-winning creative agency specializing in branding, design, and digital marketing.',
        'website': 'https://creativestudios.example.com',
        'industry': 'Marketing',
        'company_size': '51-200',
        'founded_year': 2018,
        'headquarters': 'Los Angeles, CA',
        'is_verified': True,
        'is_featured': False,
    },
]

for company_data in companies_data:
    company, created = Company.objects.get_or_create(
        slug=company_data['slug'],
        defaults=company_data
    )
    if created:
        print(f'Created company: {company.name}')
    else:
        print(f'Company already exists: {company.name}')

# Get admin user for posting jobs
admin_user = User.objects.filter(is_superuser=True).first()

# Create sample jobs
jobs_data = [
    {
        'title': 'Senior Software Engineer',
        'slug': 'senior-software-engineer-techventures',
        'company_slug': 'techventures-inc',
        'description': 'We are looking for a Senior Software Engineer to join our growing team.',
        'requirements': "Bachelor's degree in Computer Science. 5+ years experience.",
        'responsibilities': 'Design and develop software solutions. Mentor junior developers.',
        'benefits': 'Competitive salary. Health insurance. 401(k) matching.',
        'job_type': 'full_time',
        'experience_level': 'senior',
        'location': 'San Francisco, CA',
        'is_remote': True,
        'salary_min': 150000,
        'salary_max': 200000,
        'show_salary': True,
        'skills': ['Python', 'JavaScript', 'AWS', 'Docker'],
        'status': 'published',
        'is_featured': True,
    },
    {
        'title': 'Financial Analyst',
        'slug': 'financial-analyst-globalfinance',
        'company_slug': 'global-finance-corp',
        'description': 'Join our team as a Financial Analyst.',
        'requirements': "Bachelor's degree in Finance. 3+ years experience.",
        'responsibilities': 'Analyze financial data. Create reports.',
        'benefits': 'Competitive compensation. Annual bonus.',
        'job_type': 'full_time',
        'experience_level': 'mid',
        'location': 'New York, NY',
        'is_remote': False,
        'salary_min': 85000,
        'salary_max': 120000,
        'show_salary': True,
        'skills': ['Excel', 'Financial Modeling', 'SQL'],
        'status': 'published',
        'is_featured': True,
    },
    {
        'title': 'Healthcare Data Scientist',
        'slug': 'healthcare-data-scientist-healthfirst',
        'company_slug': 'healthfirst-systems',
        'description': 'Seeking a Data Scientist to analyze healthcare data.',
        'requirements': "Master's degree in Data Science. 3+ years experience.",
        'responsibilities': 'Analyze datasets. Develop predictive models.',
        'benefits': 'Competitive salary. Flexible work schedule.',
        'job_type': 'full_time',
        'experience_level': 'mid',
        'location': 'Boston, MA',
        'is_remote': True,
        'salary_min': 110000,
        'salary_max': 150000,
        'show_salary': True,
        'skills': ['Python', 'R', 'Machine Learning'],
        'status': 'published',
        'is_featured': False,
    },
    {
        'title': 'Marketing Manager',
        'slug': 'marketing-manager-creativestudios',
        'company_slug': 'creative-studios',
        'description': 'Lead our marketing efforts.',
        'requirements': "Bachelor's degree in Marketing. 5+ years experience.",
        'responsibilities': 'Develop marketing strategies. Manage team.',
        'benefits': 'Competitive salary. Creative work environment.',
        'job_type': 'full_time',
        'experience_level': 'senior',
        'location': 'Los Angeles, CA',
        'is_remote': False,
        'salary_min': 90000,
        'salary_max': 130000,
        'show_salary': True,
        'skills': ['Digital Marketing', 'SEO', 'Content Strategy'],
        'status': 'published',
        'is_featured': False,
    },
]

for job_data in jobs_data:
    company_slug = job_data.pop('company_slug')
    company = Company.objects.get(slug=company_slug)
    
    job, created = Job.objects.get_or_create(
        slug=job_data['slug'],
        defaults={**job_data, 'company': company, 'posted_by': admin_user}
    )
    if created:
        print(f'Created job: {job.title}')
    else:
        print(f'Job already exists: {job.title}')

print('\nSeed data created successfully!')
