#!/usr/bin/env python3
"""
Add realistic test employers with high-quality data
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'talent_horizon.settings')
django.setup()

from core.models import User
from datetime import datetime

# Test employers data - realistic companies
employers = [
    {
        'email': 'careers@techvision.io',
        'first_name': 'TechVision',
        'last_name': 'Solutions',
        'phone': '+1 (415) 555-0123',
        'location': 'San Francisco, CA, USA',
        'headline': 'Pioneering AI-Powered Enterprise Solutions',
        'bio': 'TechVision Solutions is a leading software company specializing in artificial intelligence and machine learning solutions for Fortune 500 companies. With over 500 employees across 12 global offices, we help businesses transform their operations through cutting-edge technology. Our mission is to democratize AI and make it accessible to organizations of all sizes.',
        'website': 'https://techvision.io',
        'is_verified': True,
        'is_featured': True,
        'is_suspended': False,
    },
    {
        'email': 'jobs@cloudnative.dev',
        'first_name': 'CloudNative',
        'last_name': 'Technologies',
        'phone': '+1 (646) 555-0234',
        'location': 'New York, NY, USA',
        'headline': 'Cloud Infrastructure & DevOps Innovators',
        'bio': 'CloudNative Technologies builds next-generation cloud infrastructure tools that power thousands of applications worldwide. We are a fast-growing startup backed by top-tier venture capital firms, with a team of 150+ engineers passionate about Kubernetes, microservices, and distributed systems. Join us in shaping the future of cloud computing.',
        'website': 'https://cloudnative.dev',
        'is_verified': True,
        'is_featured': True,
        'is_suspended': False,
    },
    {
        'email': 'talent@fintech-pro.com',
        'first_name': 'FinTech',
        'last_name': 'Pro',
        'phone': '+1 (212) 555-0345',
        'location': 'Chicago, IL, USA',
        'headline': 'Revolutionizing Financial Services with Technology',
        'bio': 'FinTech Pro is transforming the financial services industry with innovative payment solutions and blockchain technology. We serve over 2 million customers globally and process billions of dollars in transactions annually. Our engineering team works on challenging problems in security, scalability, and real-time data processing.',
        'website': 'https://fintechpro.com',
        'is_verified': True,
        'is_featured': False,
        'is_suspended': False,
    },
    {
        'email': 'recruiting@datastream.ai',
        'first_name': 'DataStream',
        'last_name': 'Analytics',
        'phone': '+1 (512) 555-0456',
        'location': 'Austin, TX, USA',
        'headline': 'Big Data Analytics & Business Intelligence Platform',
        'bio': 'DataStream Analytics provides enterprise-grade data analytics and visualization tools that help companies make data-driven decisions. Our platform processes petabytes of data daily for clients in healthcare, retail, and manufacturing. We offer competitive salaries, equity, and a flexible remote-first work culture.',
        'website': 'https://datastream.ai',
        'is_verified': True,
        'is_featured': False,
        'is_suspended': False,
    },
    {
        'email': 'hr@cybersafe.security',
        'first_name': 'CyberSafe',
        'last_name': 'Security',
        'phone': '+1 (206) 555-0567',
        'location': 'Seattle, WA, USA',
        'headline': 'Enterprise Cybersecurity & Threat Intelligence',
        'bio': 'CyberSafe Security is a leading cybersecurity firm protecting enterprises from advanced cyber threats. Our team of ethical hackers, security researchers, and engineers develops cutting-edge security solutions including threat detection, incident response, and vulnerability management. We work with government agencies and Fortune 100 companies to secure critical infrastructure.',
        'website': 'https://cybersafe.security',
        'is_verified': True,
        'is_featured': False,
        'is_suspended': False,
    },
    {
        'email': 'contact@healthtech-inc.com',
        'first_name': 'HealthTech',
        'last_name': 'Innovations',
        'phone': '+1 (617) 555-0678',
        'location': 'Boston, MA, USA',
        'headline': 'Digital Health Solutions & Medical Software',
        'bio': 'HealthTech Innovations develops software that improves patient care and streamlines healthcare operations. Our electronic health record (EHR) system is used by over 500 hospitals nationwide. We are committed to using technology to solve healthcare\'s biggest challenges, from reducing administrative burden to improving patient outcomes.',
        'website': 'https://healthtech-inc.com',
        'is_verified': False,
        'is_featured': False,
        'is_suspended': False,
    },
    {
        'email': 'jobs@mobilefirst.app',
        'first_name': 'MobileFirst',
        'last_name': 'Studios',
        'phone': '+1 (310) 555-0789',
        'location': 'Los Angeles, CA, USA',
        'headline': 'Mobile App Development & User Experience Design',
        'bio': 'MobileFirst Studios creates award-winning mobile applications for iOS and Android with over 50 million downloads globally. Our talented team of designers and developers focuses on creating delightful user experiences. We work with startups and established brands to bring their mobile app ideas to life.',
        'website': 'https://mobilefirst.app',
        'is_verified': True,
        'is_featured': False,
        'is_suspended': False,
    },
    {
        'email': 'careers@quantum-labs.tech',
        'first_name': 'Quantum',
        'last_name': 'Labs',
        'phone': '+1 (650) 555-0890',
        'location': 'Palo Alto, CA, USA',
        'headline': 'Quantum Computing Research & Development',
        'bio': 'Quantum Labs is at the forefront of quantum computing research, developing practical quantum algorithms and hardware. Our team includes PhD researchers and engineers working on problems that classical computers cannot solve. We collaborate with universities and research institutions worldwide to advance quantum technology.',
        'website': 'https://quantum-labs.tech',
        'is_verified': True,
        'is_featured': True,
        'is_suspended': False,
    },
]

# Delete existing test employers if they exist
print("\n🗑️  Deleting existing test employers...")
User.objects.filter(email__in=[emp['email'] for emp in employers]).delete()

# Create employers
print("👔 Creating realistic test employers...\n")
created_count = 0

for emp_data in employers:
    employer = User.objects.create_user(
        email=emp_data['email'],
        password='password123',
        first_name=emp_data['first_name'],
        last_name=emp_data['last_name'],
        phone=emp_data['phone'],
        role='employer',
        location=emp_data['location'],
        headline=emp_data['headline'],
        bio=emp_data.get('bio', ''),
        website=emp_data.get('website', ''),
        is_verified=emp_data['is_verified'],
        is_featured=emp_data['is_featured'],
        is_suspended=emp_data['is_suspended'],
    )
    
    status_indicators = []
    if emp_data['is_verified']:
        status_indicators.append('✓ verified')
    if emp_data['is_featured']:
        status_indicators.append('⭐ featured')
    if emp_data['is_suspended']:
        status_indicators.append('🚫 suspended')
    
    status_str = f" ({', '.join(status_indicators)})" if status_indicators else ""
    print(f"  ✓ {employer.get_full_name()}{status_str}")
    print(f"    📍 {emp_data['location']}")
    created_count += 1

print(f"\n✅ Successfully created {created_count} realistic employers!")
print("📧 All employers use password: password123")
print("🌐 Employers now have detailed bios and website information\n")
