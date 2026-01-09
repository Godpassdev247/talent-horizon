#!/usr/bin/env python
"""
Add realistic test companies to the database
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'talent_horizon.settings')
django.setup()

from jobs.models import Company
from django.utils.text import slugify

# Delete existing test companies
print("🗑️  Deleting existing test companies...\n")
Company.objects.all().delete()

companies = [
    {
        'name': 'TechVision Solutions',
        'description': '''TechVision Solutions is a leading AI and machine learning company specializing in enterprise-scale solutions. We help Fortune 500 companies transform their operations through cutting-edge artificial intelligence, predictive analytics, and automation technologies. 

Our team of world-class engineers and data scientists has delivered solutions that process over 10 billion transactions daily, serving millions of users globally. We're passionate about pushing the boundaries of what's possible with AI while maintaining the highest standards of ethics and privacy.

Join us in shaping the future of intelligent systems and be part of a team that's making a real impact on how businesses operate in the digital age.''',
        'website': 'https://www.techvision.io',
        'industry': 'Artificial Intelligence & Machine Learning',
        'company_size': '201-500',
        'founded_year': 2015,
        'headquarters': 'San Francisco, CA, USA',
        'linkedin': 'https://www.linkedin.com/company/techvision-solutions',
        'twitter': 'https://twitter.com/techvision',
        'benefits': [
            'Competitive salary with equity options',
            'Comprehensive health, dental, and vision insurance',
            'Unlimited PTO policy',
            '401(k) with 6% company match',
            'Remote-first culture',
            'Learning & development budget ($5,000/year)',
            'Home office setup allowance',
            'Parental leave (16 weeks)',
            'Mental health support',
            'Team retreats and conferences'
        ],
        'is_verified': True,
        'is_featured': True,
    },
    {
        'name': 'CloudNative Technologies',
        'description': '''CloudNative Technologies is revolutionizing cloud infrastructure and DevOps practices for modern enterprises. As a fast-growing startup backed by top-tier venture capital, we're building the next generation of cloud-native tools that make scaling applications effortless.

With over 150 engineers across the globe, we've helped hundreds of companies migrate to cloud-native architectures, reducing their infrastructure costs by an average of 40% while improving reliability and performance. Our platform handles millions of deployments monthly for companies ranging from startups to Fortune 100 enterprises.

We're looking for talented individuals who are passionate about distributed systems, automation, and building tools that developers love to use.''',
        'website': 'https://www.cloudnative.tech',
        'industry': 'Cloud Infrastructure & DevOps',
        'company_size': '51-200',
        'founded_year': 2018,
        'headquarters': 'New York, NY, USA',
        'linkedin': 'https://www.linkedin.com/company/cloudnative-tech',
        'twitter': 'https://twitter.com/cloudnativetech',
        'benefits': [
            'Competitive base salary + stock options',
            'Full health coverage (medical, dental, vision)',
            'Flexible work hours',
            '401(k) matching',
            'Work from anywhere',
            'Professional development stipend',
            'Latest MacBook Pro or Linux workstation',
            'Generous parental leave',
            'Wellness programs',
            'Annual company offsite'
        ],
        'is_verified': True,
        'is_featured': True,
    },
    {
        'name': 'FinTech Pro',
        'description': '''FinTech Pro is transforming the financial services industry with innovative payment solutions and blockchain technology. We provide secure, scalable payment processing for over 2 million customers worldwide, handling billions in transactions annually.

Our platform combines traditional financial infrastructure with cutting-edge blockchain technology to offer faster, more transparent, and cost-effective payment solutions. We work with major banks, payment processors, and fintech startups to modernize the global financial system.

If you're excited about the future of finance and want to work on systems that impact millions of people's daily lives, FinTech Pro is the place for you.''',
        'website': 'https://www.fintechpro.com',
        'industry': 'Financial Technology',
        'company_size': '501-1000',
        'founded_year': 2014,
        'headquarters': 'Chicago, IL, USA',
        'linkedin': 'https://www.linkedin.com/company/fintechpro',
        'twitter': 'https://twitter.com/fintechpro',
        'benefits': [
            'Highly competitive compensation',
            'Equity/stock options',
            'Premium health insurance',
            'Retirement plans with matching',
            'Hybrid work model',
            'Annual bonus program',
            'Education reimbursement',
            'Commuter benefits',
            'Life & disability insurance',
            'Employee assistance program'
        ],
        'is_verified': True,
        'is_featured': False,
    },
    {
        'name': 'DataStream Analytics',
        'description': '''DataStream Analytics is a leader in big data and real-time analytics solutions. Our platform processes petabytes of data daily, providing actionable insights to enterprises across healthcare, retail, and manufacturing sectors.

As a remote-first company, we've built a culture that values autonomy, innovation, and work-life balance. Our engineering team has created one of the fastest real-time analytics engines in the market, capable of processing millions of events per second with sub-millisecond latency.

Join our distributed team of data engineers, scientists, and architects who are passionate about solving complex data challenges at scale.''',
        'website': 'https://www.datastream.io',
        'industry': 'Big Data & Analytics',
        'company_size': '201-500',
        'founded_year': 2016,
        'headquarters': 'Austin, TX, USA',
        'linkedin': 'https://www.linkedin.com/company/datastream-analytics',
        'twitter': 'https://twitter.com/datastreamio',
        'benefits': [
            'Market-rate salaries',
            'Employee stock purchase plan',
            'Full remote work',
            'Health, dental, vision coverage',
            'Unlimited vacation',
            'Home office budget',
            'Professional conference budget',
            'Learning platform subscriptions',
            'Quarterly bonuses',
            'Wellness stipend'
        ],
        'is_verified': True,
        'is_featured': False,
    },
    {
        'name': 'CyberSafe Security',
        'description': '''CyberSafe Security is at the forefront of cybersecurity, protecting government agencies and Fortune 100 companies from advanced persistent threats. Our security platform monitors and protects over 10 million endpoints globally, preventing thousands of cyber attacks daily.

With a team of elite security researchers and ethical hackers, we continuously innovate to stay ahead of emerging threats. Our solutions combine AI-powered threat detection with human expertise to provide comprehensive security coverage.

If you're passionate about cybersecurity and want to make a real difference in protecting critical infrastructure and sensitive data, join our mission.''',
        'website': 'https://www.cybersafe.security',
        'industry': 'Cybersecurity',
        'company_size': '1001-5000',
        'founded_year': 2012,
        'headquarters': 'Seattle, WA, USA',
        'linkedin': 'https://www.linkedin.com/company/cybersafe-security',
        'twitter': 'https://twitter.com/cybersafesec',
        'benefits': [
            'Top-tier compensation packages',
            'Security clearance support',
            'Comprehensive benefits',
            'Retirement planning',
            'Flexible scheduling',
            'Certification reimbursement',
            'Conference attendance',
            'Continuing education',
            'Relocation assistance',
            'Performance bonuses'
        ],
        'is_verified': True,
        'is_featured': False,
    },
    {
        'name': 'HealthTech Innovations',
        'description': '''HealthTech Innovations is revolutionizing healthcare delivery through advanced electronic health record (EHR) systems and telemedicine platforms. Our HIPAA-compliant solutions serve over 500 hospitals and 10,000 healthcare providers, improving patient care and operational efficiency.

We're committed to making healthcare more accessible, efficient, and patient-centered through technology. Our platform integrates with major healthcare systems and uses AI to help doctors make better diagnostic decisions and reduce administrative burden.

Join us in our mission to transform healthcare and improve patient outcomes through innovative technology solutions.''',
        'website': 'https://www.healthtech-innovations.com',
        'industry': 'Healthcare Technology',
        'company_size': '501-1000',
        'founded_year': 2013,
        'headquarters': 'Boston, MA, USA',
        'linkedin': 'https://www.linkedin.com/company/healthtech-innovations',
        'twitter': 'https://twitter.com/healthtechinno',
        'benefits': [
            'Competitive salary packages',
            'Healthcare coverage (ironic, we know!)',
            'Dental & vision insurance',
            '401(k) with matching',
            'Hybrid work options',
            'Professional development',
            'Tuition reimbursement',
            'Paid parental leave',
            'Employee wellness programs',
            'Volunteer time off'
        ],
        'is_verified': False,
        'is_featured': False,
    },
    {
        'name': 'MobileFirst Studios',
        'description': '''MobileFirst Studios is a premier mobile app development company creating award-winning iOS and Android applications. With over 50 million downloads across our portfolio, we've built apps for startups and established brands alike.

Our design-first approach combines beautiful user interfaces with powerful functionality. We specialize in consumer apps, mobile games, and enterprise mobile solutions. Our apps have been featured by Apple and Google, and several have topped the charts in their categories.

If you love mobile technology and want to create apps that millions of people use daily, we'd love to have you on our team.''',
        'website': 'https://www.mobilefirst.studio',
        'industry': 'Mobile App Development',
        'company_size': '51-200',
        'founded_year': 2017,
        'headquarters': 'Los Angeles, CA, USA',
        'linkedin': 'https://www.linkedin.com/company/mobilefirst-studios',
        'twitter': 'https://twitter.com/mobilefirststudio',
        'benefits': [
            'Competitive compensation',
            'Stock options available',
            'Health insurance coverage',
            'Dental & vision plans',
            'Flexible work arrangements',
            'Latest devices for testing',
            'Learning resources',
            'Team building events',
            'Casual dress code',
            'Snacks & beverages'
        ],
        'is_verified': True,
        'is_featured': False,
    },
    {
        'name': 'Quantum Labs',
        'description': '''Quantum Labs is pioneering the future of quantum computing and its practical applications. Our team of PhD researchers and quantum physicists is working on breakthrough technologies that will revolutionize computing, cryptography, and scientific research.

We collaborate with leading universities and research institutions worldwide, pushing the boundaries of what's possible with quantum systems. Our work spans from fundamental quantum mechanics research to practical applications in drug discovery, financial modeling, and optimization problems.

Join us at the cutting edge of technology and be part of the quantum revolution that will transform computing as we know it.''',
        'website': 'https://www.quantumlabs.tech',
        'industry': 'Quantum Computing Research',
        'company_size': '11-50',
        'founded_year': 2019,
        'headquarters': 'Palo Alto, CA, USA',
        'linkedin': 'https://www.linkedin.com/company/quantum-labs',
        'twitter': 'https://twitter.com/quantumlabs',
        'benefits': [
            'Research-level compensation',
            'Equity in cutting-edge startup',
            'Full health benefits',
            'Retirement contributions',
            'Publication support',
            'Conference presentations',
            'Research equipment budget',
            'PhD mentorship program',
            'Collaboration with universities',
            'Flexible research time'
        ],
        'is_verified': True,
        'is_featured': True,
    },
]

# Create companies
print("🏢 Creating realistic test companies...\n")
created_count = 0

for comp_data in companies:
    company = Company.objects.create(
        name=comp_data['name'],
        slug=slugify(comp_data['name']),
        description=comp_data['description'],
        website=comp_data['website'],
        industry=comp_data['industry'],
        company_size=comp_data['company_size'],
        founded_year=comp_data['founded_year'],
        headquarters=comp_data['headquarters'],
        linkedin=comp_data.get('linkedin', ''),
        twitter=comp_data.get('twitter', ''),
        benefits=comp_data.get('benefits', []),
        is_verified=comp_data['is_verified'],
        is_featured=comp_data['is_featured'],
    )
    
    status_indicators = []
    if comp_data['is_verified']:
        status_indicators.append('✓ verified')
    if comp_data['is_featured']:
        status_indicators.append('⭐ featured')
    
    status_str = f" ({', '.join(status_indicators)})" if status_indicators else ""
    print(f"  ✓ {company.name}{status_str}")
    print(f"    🏭 {comp_data['industry']}")
    print(f"    👥 {comp_data['company_size']} employees")
    print(f"    📍 {comp_data['headquarters']}")
    print()
    created_count += 1

print(f"✅ Successfully created {created_count} realistic companies!")
print("🌐 Companies now have detailed descriptions, benefits, and social links")
print("💼 These companies can now be used to post jobs\n")
