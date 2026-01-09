#!/usr/bin/env python
"""Create realistic resume content and enrich job seeker profiles"""
import os
import django
import sys
from datetime import datetime
from io import BytesIO
from django.core.files.base import ContentFile

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'talent_horizon.settings')
django.setup()

from django.contrib.auth import get_user_model
from jobs.models import Resume
from core.models import Experience, Education, Skill, Certification

# Import ReportLab for PDF generation
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfgen import canvas

User = get_user_model()

def create_pdf_resume(user):
    """Generate professional PDF resume"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, 
                          rightMargin=0.75*inch, leftMargin=0.75*inch,
                          topMargin=0.75*inch, bottomMargin=0.75*inch)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=6,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=20,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=8,
        spaceBefore=16,
        fontName='Helvetica-Bold',
        borderWidth=0,
        borderColor=colors.HexColor('#3b82f6'),
        borderPadding=0,
        leftIndent=0,
        borderRadius=0
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8,
        leading=14
    )
    
    job_title_style = ParagraphStyle(
        'JobTitle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#0f172a'),
        fontName='Helvetica-Bold',
        spaceAfter=2
    )
    
    company_style = ParagraphStyle(
        'Company',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#475569'),
        spaceAfter=4
    )
    
    # Header - Name
    name = Paragraph(user.get_full_name().upper(), title_style)
    elements.append(name)
    
    # Contact Info
    contact_parts = []
    if user.email:
        contact_parts.append(user.email)
    if user.phone:
        contact_parts.append(user.phone)
    if user.location:
        contact_parts.append(user.location)
    
    contact_info = Paragraph(' • '.join(contact_parts), subtitle_style)
    elements.append(contact_info)
    
    # Professional Summary
    if user.bio:
        elements.append(Paragraph('PROFESSIONAL SUMMARY', heading_style))
        elements.append(Paragraph(user.bio, body_style))
        elements.append(Spacer(1, 0.1*inch))
    
    # Skills
    skills = Skill.objects.filter(user=user)
    if skills.exists():
        elements.append(Paragraph('SKILLS', heading_style))
        skill_text = ' • '.join([skill.name for skill in skills[:12]])  # Limit to 12 skills
        elements.append(Paragraph(skill_text, body_style))
        elements.append(Spacer(1, 0.1*inch))
    
    # Work Experience
    experiences = Experience.objects.filter(user=user).order_by('-start_date')
    if experiences.exists():
        elements.append(Paragraph('WORK EXPERIENCE', heading_style))
        
        for exp in experiences:
            # Job Title
            elements.append(Paragraph(exp.title, job_title_style))
            
            # Company and dates
            end_date = exp.end_date.strftime('%B %Y') if exp.end_date else 'Present'
            company_line = f"{exp.company} | {exp.start_date.strftime('%B %Y')} - {end_date}"
            elements.append(Paragraph(company_line, company_style))
            
            # Description
            if exp.description:
                elements.append(Paragraph(exp.description, body_style))
            
            elements.append(Spacer(1, 0.1*inch))
    
    # Education
    educations = Education.objects.filter(user=user).order_by('-start_date')
    if educations.exists():
        elements.append(Paragraph('EDUCATION', heading_style))
        
        for edu in educations:
            # Degree and Field
            degree_text = f"{edu.degree} in {edu.field_of_study}"
            elements.append(Paragraph(degree_text, job_title_style))
            
            # Institution and dates
            end_date = edu.end_date.strftime('%Y') if edu.end_date else 'Present'
            edu_line = f"{edu.institution} | {edu.start_date.strftime('%Y')} - {end_date}"
            elements.append(Paragraph(edu_line, company_style))
            
            if edu.description:
                elements.append(Paragraph(edu.description, body_style))
            
            elements.append(Spacer(1, 0.1*inch))
    
    # Certifications
    certifications = Certification.objects.filter(user=user)
    if certifications.exists():
        elements.append(Paragraph('CERTIFICATIONS', heading_style))
        
        for cert in certifications:
            cert_text = f"<b>{cert.name}</b> - {cert.issuing_organization}"
            if cert.issue_date:
                cert_text += f" ({cert.issue_date.strftime('%B %Y')})"
            elements.append(Paragraph(cert_text, body_style))
        
        elements.append(Spacer(1, 0.1*inch))
    
    # Build PDF
    doc.build(elements)
    
    # Get the value of the BytesIO buffer
    pdf_content = buffer.getvalue()
    buffer.close()
    
    return pdf_content


def create_resume_content(user):
    """Generate realistic resume content as text (fallback)"""
    resume_text = f"""
{user.get_full_name()}
{user.email} | {user.phone if user.phone else 'N/A'} | {user.location if user.location else 'N/A'}

PROFESSIONAL SUMMARY
{user.bio if user.bio else 'Experienced professional seeking new opportunities.'}

SKILLS
"""
    
    # Add skills
    skills = Skill.objects.filter(user=user)
    if skills.exists():
        for skill in skills:
            resume_text += f"• {skill.name} - {skill.get_proficiency_display()}\n"
    else:
        resume_text += "• Communication\n• Problem Solving\n• Team Collaboration\n"
    
    resume_text += "\nWORK EXPERIENCE\n"
    
    # Add experience
    experiences = Experience.objects.filter(user=user).order_by('-start_date')
    if experiences.exists():
        for exp in experiences:
            end_date = exp.end_date.strftime('%B %Y') if exp.end_date else 'Present'
            resume_text += f"\n{exp.title} | {exp.company}\n"
            resume_text += f"{exp.start_date.strftime('%B %Y')} - {end_date}\n"
            if exp.description:
                resume_text += f"{exp.description}\n"
    else:
        resume_text += "\nRelevant work experience to be discussed during interview.\n"
    
    resume_text += "\nEDUCATION\n"
    
    # Add education
    educations = Education.objects.filter(user=user).order_by('-start_date')
    if educations.exists():
        for edu in educations:
            end_date = edu.end_date.strftime('%Y') if edu.end_date else 'Present'
            resume_text += f"\n{edu.degree} in {edu.field_of_study}\n"
            resume_text += f"{edu.institution} | {edu.start_date.strftime('%Y')} - {end_date}\n"
            if edu.description:
                resume_text += f"{edu.description}\n"
    
    # Add certifications
    certifications = Certification.objects.filter(user=user)
    if certifications.exists():
        resume_text += "\nCERTIFICATIONS\n"
        for cert in certifications:
            issue_date = cert.issue_date.strftime('%B %Y') if cert.issue_date else 'N/A'
            resume_text += f"\n{cert.name} | {cert.issuing_organization}\n"
            resume_text += f"Issued: {issue_date}\n"
            if cert.credential_id:
                resume_text += f"Credential ID: {cert.credential_id}\n"
    
    return resume_text


def create_resumes_for_applicants():
    """Create resume files for all job seekers"""
    
    job_seekers = User.objects.filter(role='job_seeker')
    
    if not job_seekers.exists():
        print("No job seekers found. Please run add_test_job_seekers.py first.")
        return
    
    print(f"Found {job_seekers.count()} job seekers")
    
    created_count = 0
    updated_count = 0
    
    for seeker in job_seekers:
        try:
            # Generate PDF resume
            pdf_content = create_pdf_resume(seeker)
            
            # Create resume file
            resume_file = ContentFile(pdf_content)
            filename = f"{seeker.first_name}_{seeker.last_name}_Resume.pdf"
            
            # Check if resume already exists
            existing_resume = Resume.objects.filter(user=seeker, is_primary=True).first()
            
            if existing_resume:
                # Update existing resume
                existing_resume.file.save(filename, resume_file, save=True)
                updated_count += 1
                print(f"✅ Updated PDF resume for {seeker.get_full_name()}")
            else:
                # Create new resume
                resume = Resume.objects.create(
                    user=seeker,
                    name=f"{seeker.get_full_name()} - Professional Resume",
                    is_primary=True
                )
                resume.file.save(filename, resume_file, save=True)
                created_count += 1
                print(f"✅ Created PDF resume for {seeker.get_full_name()}")
                
        except Exception as e:
            print(f"❌ Error creating resume for {seeker.get_full_name()}: {str(e)}")
            continue
    
    print(f"\n✅ Created {created_count} new PDF resumes")
    print(f"✅ Updated {updated_count} existing PDF resumes")
    print(f"Total resumes: {Resume.objects.count()}")


def enrich_profiles():
    """Add missing profile information for job seekers"""
    
    job_seekers = User.objects.filter(role='job_seeker')
    
    enrichment_data = [
        {
            'email': 'john.doe@example.com',
            'headline': 'Senior Software Engineer | Full Stack Development Expert',
            'bio': 'Results-driven Senior Software Engineer with 8+ years of experience building scalable web applications. Expertise in React, Node.js, Python, and cloud technologies. Proven track record of leading development teams and delivering high-quality software solutions. Passionate about clean code, best practices, and continuous learning.',
            'skills': ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'PostgreSQL', 'Git'],
            'desired_salary_min': 140000,
            'desired_salary_max': 180000,
        },
        {
            'email': 'sarah.williams@example.com',
            'headline': 'Product Designer | UX/UI Specialist | User-Centered Design Advocate',
            'bio': 'Creative Product Designer with 5+ years of experience crafting intuitive user experiences for web and mobile applications. Strong background in user research, wireframing, prototyping, and visual design. Proficient in Figma, Sketch, and Adobe Creative Suite. Committed to creating designs that solve real user problems.',
            'skills': ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing', 'Design Systems'],
            'desired_salary_min': 90000,
            'desired_salary_max': 130000,
        },
        {
            'email': 'michael.chen@example.com',
            'headline': 'DevOps Engineer | Cloud Infrastructure | Automation Specialist',
            'bio': 'Experienced DevOps Engineer with 6+ years managing cloud infrastructure and implementing CI/CD pipelines. Expert in AWS, Kubernetes, Docker, and Infrastructure as Code. Strong automation mindset with a focus on reliability, scalability, and security. Certified AWS Solutions Architect.',
            'skills': ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Python', 'Linux', 'CI/CD'],
            'desired_salary_min': 130000,
            'desired_salary_max': 170000,
        },
        {
            'email': 'emily.garcia@example.com',
            'headline': 'Data Scientist | Machine Learning Engineer | Analytics Expert',
            'bio': 'Analytical Data Scientist with 4+ years of experience in machine learning, statistical analysis, and data visualization. Proficient in Python, R, SQL, and various ML frameworks. Experience working with large datasets to derive actionable insights and build predictive models. Strong communicator who translates complex data into business value.',
            'skills': ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Pandas', 'Data Visualization', 'Statistics'],
            'desired_salary_min': 110000,
            'desired_salary_max': 150000,
        },
        {
            'email': 'david.brown@example.com',
            'headline': 'Frontend Developer | React Specialist | Performance Optimization',
            'bio': 'Passionate Frontend Developer with 5+ years creating responsive, performant web applications. Deep expertise in React, TypeScript, and modern JavaScript. Strong focus on accessibility, user experience, and code quality. Experience with micro-frontends and component libraries. Active open-source contributor.',
            'skills': ['React', 'TypeScript', 'JavaScript', 'CSS/SASS', 'Redux', 'Webpack', 'Testing', 'Accessibility'],
            'desired_salary_min': 100000,
            'desired_salary_max': 140000,
        },
    ]
    
    updated = 0
    for data in enrichment_data:
        try:
            user = User.objects.get(email=data['email'])
            
            # Update profile info
            user.headline = data['headline']
            user.bio = data['bio']
            user.desired_salary_min = data['desired_salary_min']
            user.desired_salary_max = data['desired_salary_max']
            user.open_to_work = True
            user.is_verified = True
            user.save()
            
            # Add skills if they don't exist
            for skill_name in data['skills']:
                Skill.objects.get_or_create(
                    user=user,
                    name=skill_name,
                    defaults={'proficiency': 'advanced'}
                )
            
            updated += 1
            print(f"Enriched profile for {user.get_full_name()}")
            
        except User.DoesNotExist:
            print(f"User not found: {data['email']}")
            continue
    
    print(f"\n✅ Enriched {updated} profiles")


if __name__ == '__main__':
    print("="*60)
    print("📄 PROFESSIONAL PDF RESUME GENERATOR")
    print("="*60)
    
    print("\nStep 1: Enriching job seeker profiles...")
    enrich_profiles()
    
    print("\n" + "="*60)
    print("Step 2: Creating professional PDF resumes...")
    print("="*60)
    create_resumes_for_applicants()
    
    print("\n" + "="*60)
    print("✅ All done! Resumes are now professional PDFs with nice layout!")
    print("✅ Users can download them just like on Indeed/ZipRecruiter!")
    print("="*60)
