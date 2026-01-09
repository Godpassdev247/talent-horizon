from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication"""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'admin')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Custom User model for Talent Horizon"""
    
    ROLE_CHOICES = [
        ('applicant', 'Applicant'),
        ('employer', 'Employer'),
        ('admin', 'Admin'),
    ]
    
    username = None
    email = models.EmailField('Email Address', unique=True)
    first_name = models.CharField('First Name', max_length=150)
    last_name = models.CharField('Last Name', max_length=150)
    phone = models.CharField('Phone Number', max_length=20, blank=True, null=True)
    role = models.CharField('Role', max_length=20, choices=ROLE_CHOICES, default='applicant')
    avatar = models.ImageField('Avatar', upload_to='avatars/', blank=True, null=True)
    
    headline = models.CharField('Professional Headline', max_length=255, blank=True, null=True)
    bio = models.TextField('Bio/Summary', blank=True, null=True)
    location = models.CharField('Location', max_length=255, blank=True, null=True)
    website = models.URLField('Website', blank=True, null=True)
    linkedin = models.URLField('LinkedIn Profile', blank=True, null=True)
    
    open_to_work = models.BooleanField('Open to Work', default=False)
    desired_salary_min = models.IntegerField('Desired Salary Min', blank=True, null=True)
    desired_salary_max = models.IntegerField('Desired Salary Max', blank=True, null=True)
    desired_job_types = models.JSONField('Desired Job Types', default=list, blank=True)
    desired_locations = models.JSONField('Desired Locations', default=list, blank=True)
    
    # Admin control fields
    is_verified = models.BooleanField('Verified User', default=False, help_text='Verified badge for trusted users')
    is_featured = models.BooleanField('Featured User', default=False, help_text='Premium/featured user status')
    is_suspended = models.BooleanField('Suspended', default=False, help_text='Temporarily suspended account')
    suspend_reason = models.TextField('Suspension Reason', blank=True, null=True)
    admin_notes = models.TextField('Admin Notes', blank=True, null=True, help_text='Private notes visible only to admins')
    last_login_ip = models.GenericIPAddressField('Last Login IP', blank=True, null=True)
    
    created_at = models.DateTimeField('Created At', default=timezone.now)
    updated_at = models.DateTimeField('Updated At', auto_now=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def get_full_name(self):
        """Return full name (method for compatibility)"""
        return f"{self.first_name} {self.last_name}"


class Experience(models.Model):
    """Work experience for users"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='experiences')
    company = models.CharField('Company', max_length=255)
    title = models.CharField('Job Title', max_length=255)
    location = models.CharField('Location', max_length=255, blank=True, null=True)
    start_date = models.DateField('Start Date')
    end_date = models.DateField('End Date', blank=True, null=True)
    is_current = models.BooleanField('Currently Working Here', default=False)
    description = models.TextField('Description', blank=True, null=True)
    achievements = models.JSONField('Achievements', default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Experience'
        verbose_name_plural = 'Experiences'
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.title} at {self.company}"


class Education(models.Model):
    """Education history for users"""
    
    DEGREE_CHOICES = [
        ('high_school', 'High School'),
        ('associate', 'Associate Degree'),
        ('bachelor', "Bachelor's Degree"),
        ('master', "Master's Degree"),
        ('doctorate', 'Doctorate'),
        ('certificate', 'Certificate'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='education')
    institution = models.CharField('Institution', max_length=255)
    degree = models.CharField('Degree Type', max_length=50, choices=DEGREE_CHOICES)
    field_of_study = models.CharField('Field of Study', max_length=255)
    start_date = models.DateField('Start Date')
    end_date = models.DateField('End Date', blank=True, null=True)
    gpa = models.DecimalField('GPA', max_digits=3, decimal_places=2, blank=True, null=True)
    honors = models.CharField('Honors', max_length=255, blank=True, null=True)
    description = models.TextField('Description', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Education'
        verbose_name_plural = 'Education'
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.degree} in {self.field_of_study} from {self.institution}"


class Skill(models.Model):
    """Skills for users"""
    
    PROFICIENCY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    SKILL_TYPE_CHOICES = [
        ('technical', 'Technical'),
        ('soft', 'Soft Skill'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField('Skill Name', max_length=100)
    skill_type = models.CharField('Skill Type', max_length=20, choices=SKILL_TYPE_CHOICES, default='technical')
    proficiency = models.CharField('Proficiency', max_length=20, choices=PROFICIENCY_CHOICES, default='intermediate')
    years_of_experience = models.IntegerField('Years of Experience', blank=True, null=True)
    
    class Meta:
        verbose_name = 'Skill'
        verbose_name_plural = 'Skills'
        unique_together = ['user', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.proficiency})"


class Certification(models.Model):
    """Certifications for users"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certifications')
    name = models.CharField('Certification Name', max_length=255)
    issuing_organization = models.CharField('Issuing Organization', max_length=255)
    issue_date = models.DateField('Issue Date')
    expiry_date = models.DateField('Expiry Date', blank=True, null=True)
    credential_id = models.CharField('Credential ID', max_length=100, blank=True, null=True)
    credential_url = models.URLField('Credential URL', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Certification'
        verbose_name_plural = 'Certifications'
        ordering = ['-issue_date']
    
    def __str__(self):
        return f"{self.name} from {self.issuing_organization}"


class Conversation(models.Model):
    """Conversation between two users"""
    participant1 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='conversations_as_participant1'
    )
    participant2 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='conversations_as_participant2'
    )
    # Metadata for professional messaging context (stored as JSON)
    # Example: {"sender_name": "John Smith", "sender_position": "CEO", "job_title": "Software Engineer", "company_name": "TechCorp"}
    metadata = models.JSONField(null=True, blank=True, default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        unique_together = [['participant1', 'participant2']]
        verbose_name = 'Conversation'
        verbose_name_plural = 'Conversations'
    
    def __str__(self):
        return f"Conversation between {self.participant1.email} and {self.participant2.email}"
    
    def get_other_participant(self, user):
        """Get the other participant in the conversation"""
        return self.participant2 if self.participant1 == user else self.participant1
    
    def get_display_name(self, for_user):
        """Get custom display name based on user perspective"""
        other_user = self.get_other_participant(for_user)
        
        # If there's sender context and the current user is viewing it
        if self.metadata and for_user == self.participant2:
            return self.metadata.get('sender_name', other_user.get_full_name())
        
        return other_user.get_full_name()
    
    def get_sender_position(self, for_user):
        """Get sender position if viewing as recipient"""
        if self.metadata and for_user == self.participant2:
            return self.metadata.get('sender_position')
        return None
    
    def get_last_message(self):
        """Get the last message in the conversation"""
        return self.chat_messages.order_by('-created_at').first()
    
    def get_unread_count(self, user):
        """Get unread message count for a user"""
        return self.chat_messages.filter(is_read=False).exclude(sender=user).count()


class ChatMessage(models.Model):
    """Individual message in a conversation"""
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='chat_messages'
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_chat_messages'
    )
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
        verbose_name = 'Chat Message'
        verbose_name_plural = 'Chat Messages'
    
    def __str__(self):
        return f"Message from {self.sender.email} at {self.created_at}"
