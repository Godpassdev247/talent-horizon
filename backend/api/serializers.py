from rest_framework import serializers
from django.contrib.auth import get_user_model
from core.models import User, Experience, Education, Skill, Certification
from jobs.models import Company, Job, Application, Resume, SavedJob, Message
from financial.models import LoanApplication, Withdrawal, CreditCardDebt, TaxRefund

User = get_user_model()


# ============ USER SERIALIZERS ============

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'password_confirm', 'role']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'company', 'title', 'location', 'description', 'achievements', 
                  'start_date', 'end_date', 'is_current', 'created_at']
        read_only_fields = ['id', 'created_at']


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'institution', 'degree', 'field_of_study', 'description',
                  'gpa', 'start_date', 'end_date', 'created_at']
        read_only_fields = ['id', 'created_at']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'skill_type', 'proficiency', 'years_of_experience']
        read_only_fields = ['id']


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['id', 'name', 'issuing_organization', 'credential_id', 'credential_url',
                  'issue_date', 'expiry_date', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserProfileSerializer(serializers.ModelSerializer):
    experiences = ExperienceSerializer(many=True, read_only=True)
    educations = EducationSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    certifications = CertificationSerializer(many=True, read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'phone', 'avatar',
                  'role', 'headline', 'bio', 'location', 'website', 'linkedin',
                  'open_to_work', 'desired_salary_min', 'desired_salary_max',
                  'desired_job_types', 'desired_locations',
                  'experiences', 'educations', 'skills', 'certifications',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'email', 'created_at', 'updated_at']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'avatar', 'headline', 'bio',
                  'location', 'website', 'linkedin', 'open_to_work',
                  'desired_salary_min', 'desired_salary_max', 'desired_job_types', 'desired_locations']


# ============ COMPANY SERIALIZERS ============

class CompanyListSerializer(serializers.ModelSerializer):
    jobs_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'slug', 'logo', 'industry', 'company_size', 
                  'headquarters', 'is_verified', 'is_featured', 'jobs_count']
    
    def get_jobs_count(self, obj):
        return obj.jobs.filter(status='published').count()


class CompanyDetailSerializer(serializers.ModelSerializer):
    jobs_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'slug', 'logo', 'cover_image', 'description', 'website',
                  'industry', 'company_size', 'founded_year', 'headquarters',
                  'linkedin', 'twitter', 'facebook', 'benefits',
                  'is_verified', 'is_featured', 'jobs_count', 'created_at']
    
    def get_jobs_count(self, obj):
        return obj.jobs.filter(status='published').count()


# ============ JOB SERIALIZERS ============

class JobListSerializer(serializers.ModelSerializer):
    company = CompanyListSerializer(read_only=True)
    salary_range = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = ['id', 'title', 'slug', 'company', 'job_type', 'experience_level',
                  'location', 'is_remote', 'salary_range', 'skills',
                  'is_featured', 'is_urgent', 'views_count', 'applications_count',
                  'application_deadline', 'created_at']
    
    def get_salary_range(self, obj):
        if obj.show_salary and obj.salary_min and obj.salary_max:
            return f"${obj.salary_min:,} - ${obj.salary_max:,}"
        elif obj.show_salary and obj.salary_min:
            return f"From ${obj.salary_min:,}"
        elif obj.show_salary and obj.salary_max:
            return f"Up to ${obj.salary_max:,}"
        return None


class JobDetailSerializer(serializers.ModelSerializer):
    company = CompanyDetailSerializer(read_only=True)
    salary_range = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = ['id', 'title', 'slug', 'company', 'description', 'requirements',
                  'responsibilities', 'benefits', 'job_type', 'experience_level',
                  'location', 'is_remote', 'salary_min', 'salary_max', 'salary_currency',
                  'show_salary', 'salary_range', 'skills', 'status',
                  'is_featured', 'is_urgent', 'views_count', 'applications_count',
                  'application_deadline', 'is_saved', 'has_applied',
                  'created_at', 'published_at']
    
    def get_salary_range(self, obj):
        if obj.show_salary and obj.salary_min and obj.salary_max:
            return f"${obj.salary_min:,} - ${obj.salary_max:,}"
        elif obj.show_salary and obj.salary_min:
            return f"From ${obj.salary_min:,}"
        elif obj.show_salary and obj.salary_max:
            return f"Up to ${obj.salary_max:,}"
        return None
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False
    
    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Application.objects.filter(applicant=request.user, job=obj).exists()
        return False


class JobCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['title', 'company', 'description', 'requirements', 'responsibilities',
                  'benefits', 'job_type', 'experience_level', 'location', 'is_remote',
                  'salary_min', 'salary_max', 'salary_currency', 'show_salary',
                  'skills', 'status', 'is_featured', 'is_urgent', 'application_deadline']


# ============ APPLICATION SERIALIZERS ============

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'name', 'file', 'is_primary', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ApplicationListSerializer(serializers.ModelSerializer):
    job = JobListSerializer(read_only=True)
    resume = ResumeSerializer(read_only=True)
    
    class Meta:
        model = Application
        fields = ['id', 'job', 'status', 'resume', 'interview_date', 'interview_type',
                  'interview_location', 'created_at', 'updated_at']


class ApplicationDetailSerializer(serializers.ModelSerializer):
    job = JobDetailSerializer(read_only=True)
    applicant = UserProfileSerializer(read_only=True)
    resume = ResumeSerializer(read_only=True)
    
    class Meta:
        model = Application
        fields = ['id', 'job', 'applicant', 'resume', 'cover_letter', 'screening_answers',
                  'status', 'interview_date', 'interview_type', 'interview_location',
                  'applicant_notes', 'employer_notes', 'created_at', 'updated_at']


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['job', 'resume', 'cover_letter', 'screening_answers']


class ApplicationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status', 'interview_date', 'interview_type', 'interview_location',
                  'applicant_notes', 'employer_notes']


# ============ SAVED JOB SERIALIZERS ============

class SavedJobSerializer(serializers.ModelSerializer):
    job = JobListSerializer(read_only=True)
    
    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'created_at']


# ============ MESSAGE SERIALIZERS ============

class MessageSerializer(serializers.ModelSerializer):
    sender = UserProfileSerializer(read_only=True)
    recipient = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'application', 'subject', 'content',
                  'is_read', 'read_at', 'created_at']


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['recipient', 'application', 'subject', 'content']


# ============ FINANCIAL SERIALIZERS ============

class LoanApplicationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanApplication
        fields = ['id', 'application_number', 'loan_type', 'amount', 'status',
                  'created_at', 'reviewed_at']


class LoanApplicationDetailSerializer(serializers.ModelSerializer):
    reviewed_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = LoanApplication
        fields = ['id', 'application_number', 'loan_type', 'amount', 'credit_score_range',
                  'full_name', 'email', 'phone', 'address', 'annual_income',
                  'monthly_rent_mortgage', 'employment_status', 'employer_name',
                  'business_name', 'business_type', 'business_address',
                  'annual_revenue', 'years_in_business',
                  'status', 'admin_notes', 'reviewed_by_name', 'reviewed_at',
                  'created_at', 'updated_at']
    
    def get_reviewed_by_name(self, obj):
        if obj.reviewed_by:
            return f"{obj.reviewed_by.first_name} {obj.reviewed_by.last_name}".strip()
        return None


class LoanApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanApplication
        fields = ['loan_type', 'amount', 'credit_score_range', 'full_name', 'email',
                  'phone', 'address', 'annual_income', 'monthly_rent_mortgage',
                  'employment_status', 'employer_name', 'business_name', 'business_type',
                  'business_address', 'annual_revenue', 'years_in_business']


class WithdrawalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdrawal
        fields = ['id', 'withdrawal_number', 'loan_application', 'amount',
                  'bank_name', 'account_holder_name', 'account_number', 'routing_number',
                  'status', 'admin_notes', 'processed_at', 'created_at']
        read_only_fields = ['id', 'withdrawal_number', 'status', 'admin_notes', 
                           'processed_at', 'created_at']


class WithdrawalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdrawal
        fields = ['loan_application', 'amount', 'bank_name', 'account_holder_name',
                  'account_number', 'routing_number']


class CreditCardDebtSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditCardDebt
        fields = ['id', 'application_number', 'full_name', 'email', 'phone', 'address',
                  'credit_card_limit', 'current_debt', 'bank_name', 'card_type',
                  'status', 'admin_notes', 'reviewed_at', 'created_at', 'updated_at']


class CreditCardDebtCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditCardDebt
        fields = ['full_name', 'email', 'phone', 'address', 'credit_card_limit',
                  'current_debt', 'bank_name', 'card_type']


class TaxRefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxRefund
        fields = ['id', 'application_number', 'full_name', 'email', 'phone', 'address',
                  'ssn_last_four', 'filing_type', 'tax_year', 'employment_status',
                  'annual_income', 'expected_refund', 'actual_refund',
                  'business_name', 'business_ein', 'business_revenue',
                  'documents', 'status', 'admin_notes', 'reviewed_at',
                  'created_at', 'updated_at']


class TaxRefundCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxRefund
        fields = ['full_name', 'email', 'phone', 'address', 'ssn_last_four',
                  'filing_type', 'tax_year', 'employment_status', 'annual_income',
                  'business_name', 'business_ein', 'business_revenue']
