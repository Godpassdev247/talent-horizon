#!/usr/bin/env python
"""Add realistic test jobs"""
import os
import django
import sys
from datetime import datetime, timedelta
import random

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'talent_horizon.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.utils.text import slugify
from jobs.models import Job, Company

User = get_user_model()

def create_test_jobs():
    """Create realistic job postings"""
    
    # Get all companies and employers
    companies = Company.objects.all()
    
    if not companies.exists():
        print("No companies found. Please run add_test_companies.py first.")
        return
    
    print(f"Found {companies.count()} companies")
    
    # Job postings data
    job_postings = [
        {
            "title": "Senior Software Engineer",
            "description": """We are seeking an experienced Senior Software Engineer to join our growing engineering team. You will be responsible for designing, developing, and maintaining scalable software solutions that power our platform.

Key Responsibilities:
• Design and implement robust, scalable backend services
• Collaborate with cross-functional teams to define and ship new features
• Mentor junior developers and contribute to technical decisions
• Write clean, maintainable code with comprehensive test coverage
• Participate in code reviews and architectural discussions

Requirements:
• 5+ years of professional software development experience
• Strong proficiency in Python, Java, or similar languages
• Experience with cloud platforms (AWS, Azure, or GCP)
• Solid understanding of databases, APIs, and system design
• Excellent problem-solving and communication skills

What We Offer:
• Competitive salary and equity package
• Comprehensive health insurance
• Flexible work arrangements
• Professional development opportunities
• Collaborative and innovative team environment""",
            "job_type": "full_time",
            "experience_level": "senior",
            "location": "San Francisco, CA",
            "is_remote": True,
            "salary_min": 140000,
            "salary_max": 180000,
            "show_salary": True,
            "skills": "Python, Java, AWS, Docker, Kubernetes, PostgreSQL, Redis",
            "is_featured": True,
        },
        {
            "title": "Full Stack Developer",
            "description": """Join our dynamic team as a Full Stack Developer where you'll work on cutting-edge web applications that serve millions of users worldwide.

About the Role:
• Build and maintain web applications using modern frameworks
• Develop RESTful APIs and integrate with third-party services
• Optimize application performance and user experience
• Collaborate with designers to implement pixel-perfect UIs
• Contribute to architecture and technology decisions

Qualifications:
• 3+ years of full stack development experience
• Proficiency in React, Vue.js, or Angular
• Strong backend skills with Node.js, Python, or Ruby
• Experience with SQL and NoSQL databases
• Understanding of web security best practices

Benefits:
• Competitive compensation
• Health, dental, and vision insurance
• 401(k) matching
• Unlimited PTO
• Remote-friendly culture""",
            "job_type": "full_time",
            "experience_level": "mid_level",
            "location": "New York, NY",
            "is_remote": True,
            "salary_min": 100000,
            "salary_max": 140000,
            "show_salary": True,
            "skills": "React, Node.js, TypeScript, MongoDB, Express.js, Git",
        },
        {
            "title": "DevOps Engineer",
            "description": """We're looking for a talented DevOps Engineer to help us build and maintain our infrastructure, ensuring high availability and scalability.

Responsibilities:
• Design and implement CI/CD pipelines
• Manage cloud infrastructure (AWS/Azure)
• Automate deployment processes
• Monitor system performance and troubleshoot issues
• Implement security best practices

Required Skills:
• 4+ years of DevOps experience
• Strong knowledge of Docker and Kubernetes
• Experience with Terraform or CloudFormation
• Proficiency in scripting (Python, Bash, or Go)
• Understanding of networking and security concepts

We Offer:
• Excellent salary and benefits
• Stock options
• Professional development budget
• Modern tools and technologies
• Work-life balance""",
            "job_type": "full_time",
            "experience_level": "senior",
            "location": "Austin, TX",
            "is_remote": True,
            "salary_min": 130000,
            "salary_max": 170000,
            "show_salary": True,
            "skills": "Docker, Kubernetes, AWS, Terraform, Jenkins, Python, Git",
        },
        {
            "title": "Frontend Developer",
            "description": """We're seeking a creative Frontend Developer to build beautiful, responsive user interfaces for our web applications.

What You'll Do:
• Develop responsive web applications using React
• Collaborate with UX designers to implement designs
• Optimize applications for maximum speed and scalability
• Write reusable, testable code
• Stay up-to-date with emerging technologies

Requirements:
• 2+ years of frontend development experience
• Expert knowledge of HTML, CSS, and JavaScript
• Strong React or Vue.js skills
• Experience with state management (Redux, Vuex)
• Eye for design and attention to detail

Perks:
• Competitive salary
• Health insurance
• Flexible hours
• Remote work options
• Learning and development opportunities""",
            "job_type": "full_time",
            "experience_level": "mid_level",
            "location": "Seattle, WA",
            "is_remote": True,
            "salary_min": 90000,
            "salary_max": 130000,
            "show_salary": True,
            "skills": "React, JavaScript, TypeScript, CSS, HTML, Redux, Jest",
        },
        {
            "title": "Data Engineer",
            "description": """Join our data team as a Data Engineer to build and maintain robust data pipelines that power our analytics and machine learning platforms.

Key Duties:
• Design and implement scalable data pipelines
• Optimize data infrastructure for performance
• Collaborate with data scientists and analysts
• Ensure data quality and integrity
• Implement data security measures

Qualifications:
• 3+ years of data engineering experience
• Strong SQL and Python skills
• Experience with Apache Spark, Airflow, or similar
• Knowledge of data warehousing concepts
• Familiarity with cloud data platforms

Benefits Package:
• Competitive compensation
• Comprehensive health coverage
• 401(k) with company match
• Flexible work environment
• Career growth opportunities""",
            "job_type": "full_time",
            "experience_level": "mid_level",
            "location": "Boston, MA",
            "is_remote": True,
            "salary_min": 110000,
            "salary_max": 150000,
            "show_salary": True,
            "skills": "Python, SQL, Apache Spark, Airflow, AWS, Redshift, ETL",
        },
        {
            "title": "Mobile App Developer",
            "description": """We're looking for a skilled Mobile App Developer to create exceptional iOS and Android applications.

Responsibilities:
• Develop native or cross-platform mobile applications
• Implement new features and functionality
• Optimize app performance and user experience
• Collaborate with design and backend teams
• Ensure code quality through testing and reviews

Requirements:
• 3+ years of mobile development experience
• Proficiency in Swift/Kotlin or React Native/Flutter
• Understanding of mobile UI/UX principles
• Experience with RESTful APIs
• Strong problem-solving abilities

What We Offer:
• Excellent compensation package
• Health and wellness benefits
• Remote work flexibility
• Latest devices and tools
• Continuous learning opportunities""",
            "job_type": "full_time",
            "experience_level": "mid_level",
            "location": "Los Angeles, CA",
            "is_remote": True,
            "salary_min": 105000,
            "salary_max": 145000,
            "show_salary": True,
            "skills": "Swift, Kotlin, React Native, Flutter, iOS, Android, Firebase",
        },
        {
            "title": "Junior Software Developer",
            "description": """Kick-start your career as a Junior Software Developer in our supportive and innovative environment.

What You'll Learn:
• Modern software development practices
• Working with production-scale systems
• Agile methodologies and collaboration
• Code quality and testing
• Professional software engineering

We're Looking For:
• 0-2 years of professional experience
• Strong fundamentals in programming
• Passion for learning and technology
• Good communication skills
• Computer Science degree or equivalent experience

Why Join Us:
• Mentorship from senior engineers
• Structured learning program
• Competitive entry-level salary
• Health insurance
• Growth potential""",
            "job_type": "full_time",
            "experience_level": "entry",
            "location": "Denver, CO",
            "is_remote": False,
            "salary_min": 70000,
            "salary_max": 90000,
            "show_salary": True,
            "skills": "JavaScript, Python, Git, SQL, HTML, CSS",
        },
        {
            "title": "Product Manager",
            "description": """We're seeking an experienced Product Manager to lead the development of our flagship products.

Your Role:
• Define product vision and strategy
• Work with engineering to deliver features
• Conduct user research and gather feedback
• Prioritize roadmap and backlog
• Analyze metrics and drive data-informed decisions

Requirements:
• 4+ years of product management experience
• Technical background preferred
• Strong analytical and communication skills
• Experience with agile development
• Track record of successful product launches

Compensation & Benefits:
• Competitive salary plus equity
• Full benefits package
• Unlimited PTO
• Remote-friendly
• Impact on product direction""",
            "job_type": "full_time",
            "experience_level": "senior",
            "location": "Chicago, IL",
            "is_remote": True,
            "salary_min": 120000,
            "salary_max": 160000,
            "show_salary": True,
            "skills": "Product Management, Agile, Analytics, User Research, Roadmapping",
        },
        {
            "title": "QA Engineer",
            "description": """Join our quality assurance team to ensure our products meet the highest standards of quality and reliability.

Responsibilities:
• Design and execute test plans
• Automate testing processes
• Identify, document, and track bugs
• Collaborate with development teams
• Ensure quality across all releases

Required Experience:
• 2+ years of QA experience
• Knowledge of testing frameworks (Selenium, Jest, etc.)
• Understanding of CI/CD processes
• Scripting skills (Python, JavaScript)
• Detail-oriented mindset

Benefits:
• Competitive salary
• Health insurance
• Professional development
• Flexible schedule
• Collaborative environment""",
            "job_type": "full_time",
            "experience_level": "mid_level",
            "location": "Portland, OR",
            "is_remote": True,
            "salary_min": 85000,
            "salary_max": 115000,
            "show_salary": True,
            "skills": "Selenium, Python, JavaScript, Test Automation, CI/CD, JIRA",
        },
        {
            "title": "Security Engineer",
            "description": """Protect our infrastructure and users as a Security Engineer on our dedicated security team.

Key Responsibilities:
• Implement security best practices
• Conduct security audits and assessments
• Respond to security incidents
• Develop security tools and automation
• Train teams on security awareness

Qualifications:
• 4+ years of security engineering experience
• Knowledge of security frameworks and standards
• Experience with penetration testing
• Understanding of network security
• Relevant certifications (CISSP, CEH) preferred

We Provide:
• Excellent compensation
• Comprehensive benefits
• Continuous training
• Latest security tools
• Impactful work""",
            "job_type": "full_time",
            "experience_level": "senior",
            "location": "Washington, DC",
            "is_remote": True,
            "salary_min": 135000,
            "salary_max": 175000,
            "show_salary": True,
            "skills": "Security, Penetration Testing, Network Security, Python, CISSP",
        },
    ]
    
    jobs_created = 0
    
    # Create jobs for each company
    for company in companies:
        # Each company gets 1-2 random jobs
        num_jobs = random.randint(1, 2)
        selected_jobs = random.sample(job_postings, min(num_jobs, len(job_postings)))
        
        for job_data in selected_jobs:
            # Make title unique by adding company context if needed
            base_title = job_data["title"]
            title = base_title
            counter = 1
            
            # Check if similar job already exists
            while Job.objects.filter(title=title).exists():
                title = f"{base_title} - {company.name}"
                if Job.objects.filter(title=title).exists():
                    counter += 1
                    title = f"{base_title} #{counter}"
                else:
                    break
            
            # Create job
            created_days_ago = random.randint(1, 45)
            created_at = datetime.now() - timedelta(days=created_days_ago)
            
            # Generate unique slug
            base_slug = slugify(title)
            slug = base_slug
            slug_counter = 1
            while Job.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{slug_counter}"
                slug_counter += 1
            
            job = Job.objects.create(
                company=company,
                title=title,
                slug=slug,
                description=job_data["description"],
                job_type=job_data["job_type"],
                experience_level=job_data["experience_level"],
                location=job_data["location"],
                is_remote=job_data["is_remote"],
                salary_min=job_data["salary_min"],
                salary_max=job_data["salary_max"],
                show_salary=job_data["show_salary"],
                skills=job_data["skills"],
                status='published',
                is_featured=job_data.get("is_featured", False),
                is_urgent=random.choice([True, False]) if random.random() > 0.7 else False,
            )
            
            # Publish the job
            job.publish()
            
            # Update timestamps
            Job.objects.filter(id=job.id).update(
                created_at=created_at,
                updated_at=created_at
            )
            
            jobs_created += 1
            print(f"Created job: {job.title} at {company.name}")
    
    print(f"\n✅ Successfully created {jobs_created} job postings!")
    print(f"Total published jobs: {Job.objects.filter(status='published').count()}")


if __name__ == '__main__':
    print("Adding test jobs...")
    create_test_jobs()
    print("\nDone!")
