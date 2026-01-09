from django.db import models
from django.conf import settings
from django.utils import timezone


class Company(models.Model):
    """Company model for employers"""
    
    COMPANY_SIZE_CHOICES = [
        ('1-10', '1-10 employees'),
        ('11-50', '11-50 employees'),
        ('51-200', '51-200 employees'),
        ('201-500', '201-500 employees'),
        ('501-1000', '501-1000 employees'),
        ('1001-5000', '1001-5000 employees'),
        ('5001+', '5001+ employees'),
    ]
    
    name = models.CharField('Company Name', max_length=255)
    slug = models.SlugField('Slug', unique=True)
    logo = models.ImageField('Logo', upload_to='company_logos/', blank=True, null=True)
    cover_image = models.ImageField('Cover Image', upload_to='company_covers/', blank=True, null=True)
    description = models.TextField('Description', blank=True, null=True)
    website = models.URLField('Website', blank=True, null=True)
    industry = models.CharField('Industry', max_length=100, blank=True, null=True)
    company_size = models.CharField('Company Size', max_length=20, choices=COMPANY_SIZE_CHOICES, blank=True, null=True)
    founded_year = models.IntegerField('Founded Year', blank=True, null=True)
    headquarters = models.CharField('Headquarters', max_length=255, blank=True, null=True)
    
    linkedin = models.URLField('LinkedIn', blank=True, null=True)
    twitter = models.URLField('Twitter', blank=True, null=True)
    facebook = models.URLField('Facebook', blank=True, null=True)
    
    benefits = models.JSONField('Benefits', default=list, blank=True)
    
    is_verified = models.BooleanField('Verified', default=False)
    is_featured = models.BooleanField('Featured', default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class Job(models.Model):
    """Job listing model"""
    
    JOB_TYPE_CHOICES = [
        ('full-time', 'Full-time'),
        ('part-time', 'Part-time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('temporary', 'Temporary'),
        ('remote', 'Remote'),
    ]
    
    EXPERIENCE_LEVEL_CHOICES = [
        ('entry', 'Entry Level'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior Level'),
        ('executive', 'Executive'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('closed', 'Closed'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField('Job Title', max_length=255)
    slug = models.SlugField('Slug', unique=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='posted_jobs')
    
    description = models.TextField('Description')
    requirements = models.TextField('Requirements', blank=True, null=True)
    responsibilities = models.TextField('Responsibilities', blank=True, null=True)
    benefits = models.TextField('Benefits', blank=True, null=True)
    
    job_type = models.CharField('Job Type', max_length=20, choices=JOB_TYPE_CHOICES, default='full-time')
    experience_level = models.CharField('Experience Level', max_length=20, choices=EXPERIENCE_LEVEL_CHOICES, default='mid')
    
    location = models.CharField('Location', max_length=255)
    is_remote = models.BooleanField('Remote Work', default=False)
    
    salary_min = models.IntegerField('Minimum Salary', blank=True, null=True)
    salary_max = models.IntegerField('Maximum Salary', blank=True, null=True)
    salary_currency = models.CharField('Salary Currency', max_length=10, default='USD')
    show_salary = models.BooleanField('Show Salary', default=True)
    
    skills = models.JSONField('Required Skills', default=list, blank=True)
    
    status = models.CharField('Status', max_length=20, choices=STATUS_CHOICES, default='draft')
    is_featured = models.BooleanField('Featured', default=False)
    is_urgent = models.BooleanField('Urgent', default=False)
    
    application_deadline = models.DateField('Application Deadline', blank=True, null=True)
    
    views_count = models.IntegerField('Views', default=0)
    applications_count = models.IntegerField('Applications', default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField('Published At', blank=True, null=True)
    
    class Meta:
        verbose_name = 'Job'
        verbose_name_plural = 'Jobs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} at {self.company.name}"
    
    def publish(self):
        self.status = 'published'
        self.published_at = timezone.now()
        self.save()


class Application(models.Model):
    """Job application model"""
    
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('interview', 'Interview Scheduled'),
        ('offered', 'Offered'),
        ('hired', 'Hired'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    
    resume = models.ForeignKey('Resume', on_delete=models.SET_NULL, null=True, blank=True, related_name='applications')
    cover_letter = models.TextField('Cover Letter', blank=True, null=True)
    
    status = models.CharField('Status', max_length=20, choices=STATUS_CHOICES, default='submitted')
    
    screening_answers = models.JSONField('Screening Answers', default=dict, blank=True)
    
    applicant_notes = models.TextField('Applicant Notes', blank=True, null=True)
    employer_notes = models.TextField('Employer Notes', blank=True, null=True)
    
    interview_date = models.DateTimeField('Interview Date', blank=True, null=True)
    interview_type = models.CharField('Interview Type', max_length=50, blank=True, null=True)
    interview_location = models.CharField('Interview Location', max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Application'
        verbose_name_plural = 'Applications'
        ordering = ['-created_at']
        unique_together = ['job', 'applicant']
    
    def __str__(self):
        return f"{self.applicant.full_name} - {self.job.title}"


class Resume(models.Model):
    """Resume/CV model"""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resumes')
    name = models.CharField('Resume Name', max_length=255)
    file = models.FileField('Resume File', upload_to='resumes/')
    is_primary = models.BooleanField('Primary Resume', default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Resume'
        verbose_name_plural = 'Resumes'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.user.full_name}"
    
    def save(self, *args, **kwargs):
        if self.is_primary:
            Resume.objects.filter(user=self.user, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)


class SavedJob(models.Model):
    """Saved/bookmarked jobs"""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Saved Job'
        verbose_name_plural = 'Saved Jobs'
        unique_together = ['user', 'job']
    
    def __str__(self):
        return f"{self.user.full_name} saved {self.job.title}"


class Message(models.Model):
    """Messages between applicants and employers"""
    
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='messages', blank=True, null=True)
    
    subject = models.CharField('Subject', max_length=255, blank=True, null=True)
    content = models.TextField('Content')
    
    is_read = models.BooleanField('Read', default=False)
    read_at = models.DateTimeField('Read At', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"From {self.sender.full_name} to {self.recipient.full_name}"
