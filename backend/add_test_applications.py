#!/usr/bin/env python
"""Add realistic test job applications"""
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
from jobs.models import Job, Application, Resume

User = get_user_model()

def create_test_applications():
    """Create realistic job applications"""
    
    # Get all job seekers and jobs
    job_seekers = User.objects.filter(role='job_seeker')
    jobs = Job.objects.filter(status='published')
    
    if not job_seekers.exists():
        print("No job seekers found. Please run add_test_job_seekers.py first.")
        return
    
    if not jobs.exists():
        print("No published jobs found. Please create some jobs first.")
        return
    
    print(f"Found {job_seekers.count()} job seekers and {jobs.count()} jobs")
    
    # Cover letters templates
    cover_letters = [
        """Dear Hiring Manager,

I am writing to express my strong interest in the {position} position at {company}. With my background in {field} and proven track record in delivering high-quality solutions, I am confident I would be a valuable addition to your team.

Throughout my career, I have developed expertise in modern development practices, collaborative team environments, and customer-focused solutions. I am particularly drawn to {company}'s commitment to innovation and excellence in the industry.

I am excited about the opportunity to contribute to your team's success and would welcome the chance to discuss how my skills and experience align with your needs.

Thank you for considering my application.

Best regards""",
        """Hello,

I am excited to apply for the {position} role at {company}. Your company's reputation for {field} excellence and innovative approach to problem-solving aligns perfectly with my career goals and professional values.

In my previous roles, I have consistently delivered results through a combination of technical expertise, creative problem-solving, and strong collaboration skills. I thrive in dynamic environments where I can contribute to meaningful projects and continuous improvement.

I am particularly impressed by {company}'s work in the industry and would be honored to bring my skills and enthusiasm to your team.

I look forward to the opportunity to discuss this position further.

Sincerely""",
        """Dear Hiring Team,

I am reaching out regarding the {position} opportunity at {company}. With extensive experience in {field} and a passion for creating impactful solutions, I believe I would be an excellent fit for this role.

My professional journey has equipped me with a diverse skill set, including strong technical abilities, effective communication, and a results-oriented mindset. I am drawn to {company} because of your innovative projects and collaborative culture.

I am confident that my background and enthusiasm would make me a strong contributor to your team's continued success.

Thank you for your time and consideration.

Best""",
    ]
    
    # Application statuses with realistic distribution
    status_distribution = [
        ('submitted', 20),
        ('under_review', 30),
        ('interview', 25),
        ('offered', 10),
        ('hired', 5),
        ('rejected', 8),
        ('withdrawn', 2),
    ]
    
    # Create weighted list
    weighted_statuses = []
    for status, weight in status_distribution:
        weighted_statuses.extend([status] * weight)
    
    applications_created = 0
    
    # Each job seeker applies to 2-5 random jobs
    for seeker in job_seekers:
        num_applications = random.randint(2, 5)
        selected_jobs = random.sample(list(jobs), min(num_applications, jobs.count()))
        
        for job in selected_jobs:
            # Check if application already exists
            if Application.objects.filter(applicant=seeker, job=job).exists():
                continue
            
            # Get the seeker's primary resume
            resume = Resume.objects.filter(user=seeker, is_primary=True).first()
            
            # Create application
            status = random.choice(weighted_statuses)
            created_days_ago = random.randint(1, 60)
            created_at = datetime.now() - timedelta(days=created_days_ago)
            
            # Generate personalized cover letter
            cover_letter_template = random.choice(cover_letters)
            cover_letter = cover_letter_template.format(
                position=job.title,
                company=job.company.name,
                field=seeker.headline if hasattr(seeker, 'headline') and seeker.headline else 'technology'
            )
            
            # Employer notes for reviewed applications
            employer_notes = ""
            if status in ['interview', 'offered', 'hired']:
                notes_options = [
                    "Strong technical background. Good cultural fit. Proceeded to next round.",
                    "Excellent communication skills. Experience aligns well with requirements.",
                    "Impressive portfolio and past achievements. Recommended for interview.",
                    "Great problem-solving abilities demonstrated in assessment. Moving forward.",
                    "Good candidate with relevant experience. Schedule technical interview.",
                ]
                employer_notes = random.choice(notes_options)
            elif status == 'rejected':
                notes_options = [
                    "Qualifications don't match current requirements. Keeping on file for future.",
                    "Position filled with another candidate. Thank you for applying.",
                    "Looking for more specific experience in this area.",
                ]
                employer_notes = random.choice(notes_options)
            
            application = Application.objects.create(
                applicant=seeker,
                job=job,
                resume=resume,  # Attach resume
                cover_letter=cover_letter,
                status=status,
                employer_notes=employer_notes,
            )
            
            # Update timestamps to be realistic
            Application.objects.filter(id=application.id).update(
                created_at=created_at,
                updated_at=created_at + timedelta(days=random.randint(0, 7))
            )
            
            applications_created += 1
            print(f"Created application: {seeker.get_full_name()} → {job.title} at {job.company.name} ({status})")
    
    print(f"\n✅ Successfully created {applications_created} job applications!")
    
    # Print statistics
    print("\n📊 Application Statistics:")
    for status, _ in status_distribution:
        count = Application.objects.filter(status=status).count()
        print(f"  {status.replace('_', ' ').title()}: {count}")
    print(f"  Total: {Application.objects.count()}")


if __name__ == '__main__':
    print("Adding test job applications...")
    create_test_applications()
    print("\nDone!")
