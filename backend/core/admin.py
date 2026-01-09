from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Experience, Education, Skill, Certification


class ExperienceInline(admin.TabularInline):
    model = Experience
    extra = 0
    fields = ['company', 'title', 'location', 'start_date', 'end_date', 'is_current']


class EducationInline(admin.TabularInline):
    model = Education
    extra = 0
    fields = ['institution', 'degree', 'field_of_study', 'start_date', 'end_date']


class SkillInline(admin.TabularInline):
    model = Skill
    extra = 0
    fields = ['name', 'skill_type', 'proficiency', 'years_of_experience']


class CertificationInline(admin.TabularInline):
    model = Certification
    extra = 0
    fields = ['name', 'issuing_organization', 'issue_date', 'expiry_date']


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'full_name', 'role', 'avatar_preview', 'open_to_work', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'is_staff', 'open_to_work', 'created_at']
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone', 'avatar', 'role')}),
        ('Professional Info', {'fields': ('headline', 'bio', 'location', 'website', 'linkedin')}),
        ('Job Preferences', {'fields': ('open_to_work', 'desired_salary_min', 'desired_salary_max', 'desired_job_types', 'desired_locations')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'role'),
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'date_joined', 'last_login']
    inlines = [ExperienceInline, EducationInline, SkillInline, CertificationInline]
    
    def avatar_preview(self, obj):
        if obj.avatar:
            return format_html('<img src="{}" width="40" height="40" style="border-radius: 50%; object-fit: cover;" />', obj.avatar.url)
        return format_html('<span style="color: #999;">No avatar</span>')
    avatar_preview.short_description = 'Avatar'


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'company', 'location', 'start_date', 'end_date', 'is_current']
    list_filter = ['is_current', 'start_date']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'company', 'title']
    ordering = ['-start_date']
    raw_id_fields = ['user']


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['user', 'institution', 'degree', 'field_of_study', 'start_date', 'end_date']
    list_filter = ['degree', 'start_date']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'institution', 'field_of_study']
    ordering = ['-start_date']
    raw_id_fields = ['user']


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'skill_type', 'proficiency', 'years_of_experience']
    list_filter = ['skill_type', 'proficiency']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'name']
    raw_id_fields = ['user']


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'issuing_organization', 'issue_date', 'expiry_date']
    list_filter = ['issuing_organization', 'issue_date']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'name', 'issuing_organization']
    ordering = ['-issue_date']
    raw_id_fields = ['user']
