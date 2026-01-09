from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import Company, Job, Application, Resume, SavedJob, Message


class JobInline(admin.TabularInline):
    model = Job
    extra = 0
    fields = ['title', 'job_type', 'location', 'status', 'created_at']
    readonly_fields = ['created_at']
    show_change_link = True


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'logo_preview', 'industry', 'company_size', 'headquarters', 'is_verified', 'is_featured', 'jobs_count', 'created_at']
    list_filter = ['is_verified', 'is_featured', 'industry', 'company_size', 'created_at']
    search_fields = ['name', 'industry', 'headquarters']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('name', 'slug', 'logo', 'cover_image')}),
        ('Company Info', {'fields': ('description', 'website', 'industry', 'company_size', 'founded_year', 'headquarters')}),
        ('Social Links', {'fields': ('linkedin', 'twitter', 'facebook')}),
        ('Benefits', {'fields': ('benefits',)}),
        ('Status', {'fields': ('is_verified', 'is_featured')}),
    )
    
    inlines = [JobInline]
    
    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" width="40" height="40" style="border-radius: 8px; object-fit: cover;" />', obj.logo.url)
        return format_html('<span style="color: #999;">No logo</span>')
    logo_preview.short_description = 'Logo'
    
    def jobs_count(self, obj):
        count = obj.jobs.count()
        return format_html('<span style="font-weight: bold;">{}</span>', count)
    jobs_count.short_description = 'Jobs'


class ApplicationInline(admin.TabularInline):
    model = Application
    extra = 0
    fields = ['applicant', 'status', 'created_at']
    readonly_fields = ['created_at']
    raw_id_fields = ['applicant']
    show_change_link = True


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'job_type', 'experience_level', 'location', 'salary_range', 'status_badge', 'is_featured', 'applications_count', 'views_count', 'created_at']
    list_filter = ['status', 'job_type', 'experience_level', 'is_featured', 'is_urgent', 'is_remote', 'created_at']
    search_fields = ['title', 'company__name', 'location', 'description']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (None, {'fields': ('title', 'slug', 'company', 'posted_by')}),
        ('Job Details', {'fields': ('description', 'requirements', 'responsibilities', 'benefits')}),
        ('Job Type & Level', {'fields': ('job_type', 'experience_level')}),
        ('Location', {'fields': ('location', 'is_remote')}),
        ('Salary', {'fields': ('salary_min', 'salary_max', 'salary_currency', 'show_salary')}),
        ('Skills', {'fields': ('skills',)}),
        ('Status & Visibility', {'fields': ('status', 'is_featured', 'is_urgent', 'application_deadline')}),
        ('Statistics', {'fields': ('views_count', 'applications_count')}),
        ('Dates', {'fields': ('created_at', 'updated_at', 'published_at')}),
    )
    
    readonly_fields = ['views_count', 'applications_count', 'created_at', 'updated_at', 'published_at']
    raw_id_fields = ['company', 'posted_by']
    inlines = [ApplicationInline]
    
    actions = ['publish_jobs', 'close_jobs', 'feature_jobs', 'unfeature_jobs']
    
    def salary_range(self, obj):
        if obj.salary_min and obj.salary_max:
            return f"${obj.salary_min:,} - ${obj.salary_max:,}"
        elif obj.salary_min:
            return f"From ${obj.salary_min:,}"
        elif obj.salary_max:
            return f"Up to ${obj.salary_max:,}"
        return "Not specified"
    salary_range.short_description = 'Salary'
    
    def status_badge(self, obj):
        colors = {
            'draft': '#6b7280',
            'published': '#10b981',
            'closed': '#ef4444',
            'archived': '#9ca3af',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html('<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px;">{}</span>', color, obj.get_status_display())
    status_badge.short_description = 'Status'
    
    def publish_jobs(self, request, queryset):
        queryset.update(status='published', published_at=timezone.now())
        self.message_user(request, f"{queryset.count()} jobs published.")
    publish_jobs.short_description = "Publish selected jobs"
    
    def close_jobs(self, request, queryset):
        queryset.update(status='closed')
        self.message_user(request, f"{queryset.count()} jobs closed.")
    close_jobs.short_description = "Close selected jobs"
    
    def feature_jobs(self, request, queryset):
        queryset.update(is_featured=True)
        self.message_user(request, f"{queryset.count()} jobs featured.")
    feature_jobs.short_description = "Feature selected jobs"
    
    def unfeature_jobs(self, request, queryset):
        queryset.update(is_featured=False)
        self.message_user(request, f"{queryset.count()} jobs unfeatured.")
    unfeature_jobs.short_description = "Unfeature selected jobs"


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['id', 'applicant', 'job', 'status_badge', 'resume_link', 'interview_date', 'created_at']
    list_filter = ['status', 'created_at', 'interview_date']
    search_fields = ['applicant__email', 'applicant__first_name', 'applicant__last_name', 'job__title', 'job__company__name']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (None, {'fields': ('job', 'applicant', 'resume')}),
        ('Application Details', {'fields': ('cover_letter', 'screening_answers')}),
        ('Status', {'fields': ('status',)}),
        ('Interview', {'fields': ('interview_date', 'interview_type', 'interview_location')}),
        ('Notes', {'fields': ('applicant_notes', 'employer_notes')}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    raw_id_fields = ['job', 'applicant', 'resume']
    
    actions = ['mark_under_review', 'schedule_interview', 'mark_rejected', 'mark_hired']
    
    def status_badge(self, obj):
        colors = {
            'submitted': '#3b82f6',
            'under_review': '#f59e0b',
            'interview': '#8b5cf6',
            'offered': '#10b981',
            'hired': '#059669',
            'rejected': '#ef4444',
            'withdrawn': '#6b7280',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html('<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px;">{}</span>', color, obj.get_status_display())
    status_badge.short_description = 'Status'
    
    def resume_link(self, obj):
        if obj.resume:
            return format_html('<a href="{}" target="_blank">View Resume</a>', obj.resume.file.url)
        return format_html('<span style="color: #999;">No resume</span>')
    resume_link.short_description = 'Resume'
    
    def mark_under_review(self, request, queryset):
        queryset.update(status='under_review')
        self.message_user(request, f"{queryset.count()} applications marked as under review.")
    mark_under_review.short_description = "Mark as Under Review"
    
    def schedule_interview(self, request, queryset):
        queryset.update(status='interview')
        self.message_user(request, f"{queryset.count()} applications scheduled for interview.")
    schedule_interview.short_description = "Schedule Interview"
    
    def mark_rejected(self, request, queryset):
        queryset.update(status='rejected')
        self.message_user(request, f"{queryset.count()} applications rejected.")
    mark_rejected.short_description = "Mark as Rejected"
    
    def mark_hired(self, request, queryset):
        queryset.update(status='hired')
        self.message_user(request, f"{queryset.count()} applications marked as hired.")
    mark_hired.short_description = "Mark as Hired"


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'is_primary', 'file_link', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['name', 'user__email', 'user__first_name', 'user__last_name']
    ordering = ['-created_at']
    raw_id_fields = ['user']
    
    def file_link(self, obj):
        if obj.file:
            return format_html('<a href="{}" target="_blank">Download</a>', obj.file.url)
        return format_html('<span style="color: #999;">No file</span>')
    file_link.short_description = 'File'


@admin.register(SavedJob)
class SavedJobAdmin(admin.ModelAdmin):
    list_display = ['user', 'job', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'job__title']
    ordering = ['-created_at']
    raw_id_fields = ['user', 'job']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'recipient', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['sender__email', 'recipient__email', 'subject', 'content']
    ordering = ['-created_at']
    raw_id_fields = ['sender', 'recipient', 'application']
    
    fieldsets = (
        (None, {'fields': ('sender', 'recipient', 'application')}),
        ('Message', {'fields': ('subject', 'content')}),
        ('Status', {'fields': ('is_read', 'read_at')}),
        ('Dates', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ['created_at']
