#!/usr/bin/env python3
"""
Add realistic profile data to test job seekers
"""
import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'talent_horizon.settings')
django.setup()

from core.models import User, Experience, Education, Skill, Certification

# Profile data for each job seeker
profiles = {
    'john.doe@example.com': {
        'experiences': [
            {
                'company': 'Tech Innovations Inc',
                'title': 'Senior Software Engineer',
                'location': 'San Francisco, CA',
                'start_date': date(2022, 1, 15),
                'end_date': None,
                'is_current': True,
                'description': 'Led development of microservices architecture for high-traffic e-commerce platform. Managed team of 5 engineers and implemented CI/CD pipelines reducing deployment time by 60%.',
            },
            {
                'company': 'Digital Solutions LLC',
                'title': 'Software Engineer',
                'location': 'San Jose, CA',
                'start_date': date(2019, 6, 1),
                'end_date': date(2021, 12, 31),
                'is_current': False,
                'description': 'Developed RESTful APIs and responsive web applications using React and Node.js. Collaborated with cross-functional teams to deliver features on time.',
            },
            {
                'company': 'StartupX',
                'title': 'Junior Developer',
                'location': 'Palo Alto, CA',
                'start_date': date(2017, 8, 15),
                'end_date': date(2019, 5, 30),
                'is_current': False,
                'description': 'Built web applications using Django and PostgreSQL. Participated in code reviews and agile development processes.',
            },
        ],
        'education': [
            {
                'institution': 'Stanford University',
                'degree': 'master',
                'field_of_study': 'Computer Science',
                'start_date': date(2015, 9, 1),
                'end_date': date(2017, 6, 15),
                'gpa': 3.85,
                'honors': 'Magna Cum Laude',
                'description': 'Specialized in Artificial Intelligence and Machine Learning. Thesis on Neural Network Optimization.',
            },
            {
                'institution': 'University of California, Berkeley',
                'degree': 'bachelor',
                'field_of_study': 'Software Engineering',
                'start_date': date(2011, 9, 1),
                'end_date': date(2015, 5, 20),
                'gpa': 3.70,
                'honors': 'Cum Laude',
            },
        ],
        'skills': [
            {'name': 'Python', 'skill_type': 'technical', 'proficiency': 'expert', 'years_of_experience': 8},
            {'name': 'JavaScript', 'skill_type': 'technical', 'proficiency': 'expert', 'years_of_experience': 7},
            {'name': 'React', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 5},
            {'name': 'Node.js', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 5},
            {'name': 'Django', 'skill_type': 'technical', 'proficiency': 'expert', 'years_of_experience': 6},
            {'name': 'PostgreSQL', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 6},
            {'name': 'Docker', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 4},
            {'name': 'Kubernetes', 'skill_type': 'technical', 'proficiency': 'intermediate', 'years_of_experience': 3},
            {'name': 'Team Leadership', 'skill_type': 'soft', 'proficiency': 'advanced', 'years_of_experience': 4},
            {'name': 'Agile Methodologies', 'skill_type': 'soft', 'proficiency': 'expert', 'years_of_experience': 7},
        ],
        'certifications': [
            {
                'name': 'AWS Certified Solutions Architect',
                'issuing_organization': 'Amazon Web Services',
                'issue_date': date(2023, 3, 15),
                'expiry_date': date(2026, 3, 15),
                'credential_id': 'AWS-SA-2023-12345',
            },
            {
                'name': 'Certified Kubernetes Administrator',
                'issuing_organization': 'Cloud Native Computing Foundation',
                'issue_date': date(2022, 8, 10),
                'expiry_date': date(2025, 8, 10),
                'credential_id': 'CKA-2022-67890',
            },
        ],
    },
    'sarah.williams@example.com': {
        'experiences': [
            {
                'company': 'Marketing Masters Agency',
                'title': 'Senior Marketing Manager',
                'location': 'New York, NY',
                'start_date': date(2021, 3, 1),
                'end_date': None,
                'is_current': True,
                'description': 'Leading digital marketing campaigns for Fortune 500 clients. Increased client ROI by 45% through data-driven strategies and creative content marketing.',
            },
            {
                'company': 'Brand Builders Inc',
                'title': 'Marketing Specialist',
                'location': 'New York, NY',
                'start_date': date(2018, 7, 1),
                'end_date': date(2021, 2, 28),
                'is_current': False,
                'description': 'Managed social media campaigns, SEO optimization, and content creation. Grew social media following by 200%.',
            },
        ],
        'education': [
            {
                'institution': 'New York University',
                'degree': 'master',
                'field_of_study': 'Marketing',
                'start_date': date(2016, 9, 1),
                'end_date': date(2018, 5, 15),
                'gpa': 3.92,
                'honors': 'Summa Cum Laude',
            },
            {
                'institution': 'Boston University',
                'degree': 'bachelor',
                'field_of_study': 'Business Administration',
                'start_date': date(2012, 9, 1),
                'end_date': date(2016, 5, 20),
                'gpa': 3.75,
            },
        ],
        'skills': [
            {'name': 'Digital Marketing', 'skill_type': 'technical', 'proficiency': 'expert', 'years_of_experience': 7},
            {'name': 'SEO/SEM', 'skill_type': 'technical', 'proficiency': 'expert', 'years_of_experience': 6},
            {'name': 'Google Analytics', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 7},
            {'name': 'Social Media Marketing', 'skill_type': 'technical', 'proficiency': 'expert', 'years_of_experience': 8},
            {'name': 'Content Strategy', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 6},
            {'name': 'Adobe Creative Suite', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 5},
            {'name': 'Communication', 'skill_type': 'soft', 'proficiency': 'expert', 'years_of_experience': 8},
            {'name': 'Project Management', 'skill_type': 'soft', 'proficiency': 'advanced', 'years_of_experience': 5},
        ],
        'certifications': [
            {
                'name': 'Google Analytics Certification',
                'issuing_organization': 'Google',
                'issue_date': date(2023, 1, 20),
                'expiry_date': date(2024, 1, 20),
            },
            {
                'name': 'HubSpot Inbound Marketing',
                'issuing_organization': 'HubSpot Academy',
                'issue_date': date(2022, 6, 10),
                'expiry_date': None,
            },
        ],
    },
    'michael.chen@example.com': {
        'experiences': [
            {
                'company': 'Finance Pro Solutions',
                'title': 'Financial Analyst',
                'location': 'Chicago, IL',
                'start_date': date(2020, 9, 1),
                'end_date': None,
                'is_current': True,
                'description': 'Conducting financial modeling and analysis for investment decisions. Prepared reports that influenced $50M+ in investment strategies.',
            },
            {
                'company': 'Accounting Services Ltd',
                'title': 'Junior Analyst',
                'location': 'Chicago, IL',
                'start_date': date(2019, 1, 15),
                'end_date': date(2020, 8, 30),
                'is_current': False,
                'description': 'Assisted senior analysts with financial forecasting and budgeting. Streamlined reporting processes saving 10+ hours weekly.',
            },
        ],
        'education': [
            {
                'institution': 'University of Chicago',
                'degree': 'bachelor',
                'field_of_study': 'Finance',
                'start_date': date(2015, 9, 1),
                'end_date': date(2019, 5, 15),
                'gpa': 3.65,
            },
        ],
        'skills': [
            {'name': 'Financial Modeling', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 5},
            {'name': 'Excel', 'skill_type': 'technical', 'proficiency': 'expert', 'years_of_experience': 6},
            {'name': 'SQL', 'skill_type': 'technical', 'proficiency': 'intermediate', 'years_of_experience': 3},
            {'name': 'Python for Finance', 'skill_type': 'technical', 'proficiency': 'intermediate', 'years_of_experience': 2},
            {'name': 'Bloomberg Terminal', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 4},
            {'name': 'Analytical Thinking', 'skill_type': 'soft', 'proficiency': 'expert', 'years_of_experience': 5},
            {'name': 'Attention to Detail', 'skill_type': 'soft', 'proficiency': 'expert', 'years_of_experience': 6},
        ],
        'certifications': [
            {
                'name': 'CFA Level I',
                'issuing_organization': 'CFA Institute',
                'issue_date': date(2021, 12, 1),
                'expiry_date': None,
            },
        ],
    },
    'emily.garcia@example.com': {
        'experiences': [
            {
                'company': 'Creative Design Studio',
                'title': 'Lead UX/UI Designer',
                'location': 'Los Angeles, CA',
                'start_date': date(2020, 4, 1),
                'end_date': date(2025, 12, 31),
                'is_current': False,
                'description': 'Led design team of 8 designers creating user-centered designs for mobile and web applications. Improved user satisfaction scores by 40% through iterative design processes.',
            },
            {
                'company': 'Digital Arts Agency',
                'title': 'UX Designer',
                'location': 'Los Angeles, CA',
                'start_date': date(2017, 6, 1),
                'end_date': date(2020, 3, 31),
                'is_current': False,
                'description': 'Designed wireframes, prototypes, and high-fidelity mockups. Conducted user research and usability testing.',
            },
        ],
        'education': [
            {
                'institution': 'Art Center College of Design',
                'degree': 'bachelor',
                'field_of_study': 'Graphic Design',
                'start_date': date(2013, 9, 1),
                'end_date': date(2017, 5, 15),
                'gpa': 3.88,
                'honors': 'Dean\'s List',
            },
        ],
        'skills': [
            {'name': 'Figma', 'skill_type': 'technical', 'proficiency': 'expert', 'years_of_experience': 7},
            {'name': 'Adobe XD', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 6},
            {'name': 'Sketch', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 5},
            {'name': 'User Research', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 6},
            {'name': 'Prototyping', 'skill_type': 'technical', 'proficiency': 'expert', 'years_of_experience': 7},
            {'name': 'HTML/CSS', 'skill_type': 'technical', 'proficiency': 'intermediate', 'years_of_experience': 5},
            {'name': 'Creativity', 'skill_type': 'soft', 'proficiency': 'expert', 'years_of_experience': 8},
            {'name': 'Collaboration', 'skill_type': 'soft', 'proficiency': 'expert', 'years_of_experience': 7},
        ],
        'certifications': [
            {
                'name': 'Google UX Design Certificate',
                'issuing_organization': 'Google',
                'issue_date': date(2021, 8, 15),
                'expiry_date': None,
            },
        ],
    },
    'david.brown@example.com': {
        'experiences': [
            {
                'company': 'Cloud Infrastructure Co',
                'title': 'DevOps Engineer',
                'location': 'Boston, MA',
                'start_date': date(2021, 1, 1),
                'end_date': None,
                'is_current': True,
                'description': 'Architecting and maintaining cloud infrastructure on AWS and Azure. Automated deployment processes reducing manual errors by 85% and deployment time by 70%.',
            },
            {
                'company': 'Systems Integration Inc',
                'title': 'Systems Administrator',
                'location': 'Boston, MA',
                'start_date': date(2018, 5, 1),
                'end_date': date(2020, 12, 31),
                'is_current': False,
                'description': 'Managed Linux servers, implemented monitoring solutions, and maintained 99.9% uptime for critical systems.',
            },
            {
                'company': 'Tech Support Solutions',
                'title': 'IT Support Specialist',
                'location': 'Cambridge, MA',
                'start_date': date(2016, 7, 1),
                'end_date': date(2018, 4, 30),
                'is_current': False,
                'description': 'Provided technical support to 500+ users. Resolved hardware and software issues efficiently.',
            },
        ],
        'education': [
            {
                'institution': 'Northeastern University',
                'degree': 'bachelor',
                'field_of_study': 'Information Technology',
                'start_date': date(2012, 9, 1),
                'end_date': date(2016, 5, 20),
                'gpa': 3.55,
            },
        ],
        'skills': [
            {'name': 'AWS', 'skill_type': 'technical', 'proficiency': 'expert', 'years_of_experience': 6},
            {'name': 'Azure', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 4},
            {'name': 'Docker', 'skill_type': 'technical', 'proficiency': 'expert', 'years_of_experience': 5},
            {'name': 'Kubernetes', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 4},
            {'name': 'Terraform', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 3},
            {'name': 'Jenkins', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 4},
            {'name': 'Linux Administration', 'skill_type': 'technical', 'proficiency': 'expert', 'years_of_experience': 7},
            {'name': 'Python Scripting', 'skill_type': 'technical', 'proficiency': 'advanced', 'years_of_experience': 5},
            {'name': 'Bash Scripting', 'skill_type': 'technical', 'proficiency': 'expert', 'years_of_experience': 6},
            {'name': 'Problem Solving', 'skill_type': 'soft', 'proficiency': 'expert', 'years_of_experience': 8},
        ],
        'certifications': [
            {
                'name': 'AWS Certified DevOps Engineer',
                'issuing_organization': 'Amazon Web Services',
                'issue_date': date(2023, 7, 20),
                'expiry_date': date(2026, 7, 20),
                'credential_id': 'AWS-DEVOPS-2023-54321',
            },
            {
                'name': 'Certified Kubernetes Administrator',
                'issuing_organization': 'Cloud Native Computing Foundation',
                'issue_date': date(2022, 11, 5),
                'expiry_date': date(2025, 11, 5),
                'credential_id': 'CKA-2022-98765',
            },
        ],
    },
}

print("\n📝 Adding profile data to test job seekers...\n")

for email, data in profiles.items():
    try:
        user = User.objects.get(email=email)
        print(f"✓ Processing {user.get_full_name()}...")
        
        # Delete existing profile data to avoid duplicates
        user.experiences.all().delete()
        user.education.all().delete()
        user.skills.all().delete()
        user.certifications.all().delete()
        
        # Add experiences
        for exp_data in data.get('experiences', []):
            Experience.objects.create(user=user, **exp_data)
        print(f"  - Added {len(data.get('experiences', []))} work experience(s)")
        
        # Add education
        for edu_data in data.get('education', []):
            Education.objects.create(user=user, **edu_data)
        print(f"  - Added {len(data.get('education', []))} education record(s)")
        
        # Add skills
        for skill_data in data.get('skills', []):
            Skill.objects.create(user=user, **skill_data)
        print(f"  - Added {len(data.get('skills', []))} skill(s)")
        
        # Add certifications
        for cert_data in data.get('certifications', []):
            Certification.objects.create(user=user, **cert_data)
        print(f"  - Added {len(data.get('certifications', []))} certification(s)")
        
        print()
        
    except User.DoesNotExist:
        print(f"⚠️  User {email} not found, skipping...")
        continue

print("✅ Profile data added successfully!\n")
print("🎉 Now check the job seeker detail pages to see the rich profiles!\n")
