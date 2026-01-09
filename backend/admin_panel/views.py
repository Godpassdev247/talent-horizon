from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.db.models import Sum, Count, Q
from django.http import HttpResponseForbidden

from core.models import User
from jobs.models import Job, Company, Application
from financial.models import LoanApplication, Withdrawal, CreditCardDebt, TaxRefund


def is_admin(user):
    """Check if user is admin"""
    return user.is_authenticated and (user.role == 'admin' or user.is_superuser)


def admin_login(request):
    """Admin login view"""
    if request.user.is_authenticated and is_admin(request.user):
        return redirect('/admin-panel/')
    
    error = None
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            if user.role == 'admin' or user.is_superuser:
                login(request, user)
                return redirect('/admin-panel/')
            else:
                error = 'You do not have admin access.'
        else:
            error = 'Invalid email or password.'
    
    return render(request, 'admin_panel/login.html', {'error': error})


def admin_logout(request):
    """Admin logout view"""
    logout(request)
    return redirect('/admin-panel/login/')


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def dashboard(request):
    """Admin dashboard view"""
    # Get statistics
    stats = {
        'total_jobs': Job.objects.count(),
        'total_applications': Application.objects.count(),
        'total_users': User.objects.count(),
        'total_companies': Company.objects.count(),
        'pending_loans': LoanApplication.objects.filter(status='pending').count(),
        'pending_withdrawals': Withdrawal.objects.filter(status='pending').count(),
        'total_loan_amount': LoanApplication.objects.filter(status='approved').aggregate(total=Sum('amount'))['total'] or 0,
    }
    
    # Get recent data
    recent_jobs = Job.objects.select_related('company').order_by('-created_at')[:5]
    recent_applications = Application.objects.select_related('applicant', 'job').order_by('-created_at')[:5]
    recent_loans = LoanApplication.objects.select_related('user').order_by('-created_at')[:5]
    
    context = {
        'stats': stats,
        'recent_jobs': recent_jobs,
        'recent_applications': recent_applications,
        'recent_loans': recent_loans,
    }
    return render(request, 'admin_panel/dashboard.html', context)


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def jobs_list(request):
    """Jobs list view with filtering"""
    jobs = Job.objects.select_related('company', 'posted_by').order_by('-created_at')
    
    # Filter by status
    status_filter = request.GET.get('status')
    if status_filter and status_filter != 'all':
        jobs = jobs.filter(status=status_filter)
    
    # Filter by job type
    type_filter = request.GET.get('type')
    if type_filter and type_filter != 'all':
        jobs = jobs.filter(job_type=type_filter)
    
    # Search
    search_query = request.GET.get('search')
    if search_query:
        jobs = jobs.filter(
            Q(title__icontains=search_query) |
            Q(company__name__icontains=search_query) |
            Q(location__icontains=search_query)
        )
    
    # Filter by featured
    featured_filter = request.GET.get('featured')
    if featured_filter == 'true':
        jobs = jobs.filter(is_featured=True)
    
    # Get counts for stats
    all_jobs = Job.objects.all()
    stats = {
        'total': all_jobs.count(),
        'published': all_jobs.filter(status='published').count(),
        'draft': all_jobs.filter(status='draft').count(),
        'closed': all_jobs.filter(status='closed').count(),
    }
    
    context = {
        'jobs': jobs,
        'stats': stats,
        'status_filter': status_filter or 'all',
        'type_filter': type_filter or 'all',
        'search_query': search_query or '',
        'featured_filter': featured_filter or '',
    }
    return render(request, 'admin_panel/jobs_list.html', context)


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def job_detail(request, job_id):
    """View job details"""
    job = get_object_or_404(Job.objects.select_related('company', 'posted_by'), id=job_id)
    applications = job.applications.select_related('applicant').order_by('-created_at')[:10]
    
    context = {
        'job': job,
        'applications': applications,
    }
    return render(request, 'admin_panel/job_detail.html', context)


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def job_create(request):
    """Create a new job"""
    if request.method == 'POST':
        try:
            from django.utils.text import slugify
            import json
            
            title = request.POST.get('title')
            company_id = request.POST.get('company')
            description = request.POST.get('description', '')
            requirements = request.POST.get('requirements', '')
            responsibilities = request.POST.get('responsibilities', '')
            benefits = request.POST.get('benefits', '')
            job_type = request.POST.get('job_type', 'full-time')
            experience_level = request.POST.get('experience_level', 'mid')
            location = request.POST.get('location', '')
            is_remote = request.POST.get('is_remote') == 'on'
            salary_min = request.POST.get('salary_min')
            salary_max = request.POST.get('salary_max')
            show_salary = request.POST.get('show_salary') == 'on'
            status = request.POST.get('status', 'draft')
            is_featured = request.POST.get('is_featured') == 'on'
            is_urgent = request.POST.get('is_urgent') == 'on'
            
            # Parse skills from comma-separated
            skills_input = request.POST.get('skills', '')
            skills = [s.strip() for s in skills_input.split(',') if s.strip()]
            
            company = Company.objects.get(id=company_id)
            
            # Generate unique slug
            base_slug = slugify(title)
            slug = base_slug
            counter = 1
            while Job.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            job = Job.objects.create(
                title=title,
                slug=slug,
                company=company,
                posted_by=request.user,
                description=description,
                requirements=requirements,
                responsibilities=responsibilities,
                benefits=benefits,
                job_type=job_type,
                experience_level=experience_level,
                location=location,
                is_remote=is_remote,
                salary_min=int(salary_min) if salary_min else None,
                salary_max=int(salary_max) if salary_max else None,
                show_salary=show_salary,
                skills=skills,
                status=status,
                is_featured=is_featured,
                is_urgent=is_urgent,
            )
            
            if status == 'published':
                job.publish()
            
            messages.success(request, f'Job "{job.title}" has been created successfully.')
            return redirect('/admin-panel/jobs/')
            
        except Exception as e:
            messages.error(request, f'Error creating job: {str(e)}')
    
    companies = Company.objects.all().order_by('name')
    context = {
        'companies': companies,
        'job_types': Job.JOB_TYPE_CHOICES,
        'experience_levels': Job.EXPERIENCE_LEVEL_CHOICES,
    }
    return render(request, 'admin_panel/job_form.html', context)


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def job_edit(request, job_id):
    """Edit an existing job"""
    job = get_object_or_404(Job, id=job_id)
    
    if request.method == 'POST':
        try:
            from django.utils.text import slugify
            
            job.title = request.POST.get('title')
            job.company = Company.objects.get(id=request.POST.get('company'))
            job.description = request.POST.get('description', '')
            job.requirements = request.POST.get('requirements', '')
            job.responsibilities = request.POST.get('responsibilities', '')
            job.benefits = request.POST.get('benefits', '')
            job.job_type = request.POST.get('job_type', 'full-time')
            job.experience_level = request.POST.get('experience_level', 'mid')
            job.location = request.POST.get('location', '')
            job.is_remote = request.POST.get('is_remote') == 'on'
            
            salary_min = request.POST.get('salary_min')
            salary_max = request.POST.get('salary_max')
            job.salary_min = int(salary_min) if salary_min else None
            job.salary_max = int(salary_max) if salary_max else None
            job.show_salary = request.POST.get('show_salary') == 'on'
            
            # Parse skills
            skills_input = request.POST.get('skills', '')
            job.skills = [s.strip() for s in skills_input.split(',') if s.strip()]
            
            old_status = job.status
            job.status = request.POST.get('status', 'draft')
            job.is_featured = request.POST.get('is_featured') == 'on'
            job.is_urgent = request.POST.get('is_urgent') == 'on'
            
            # Update slug if title changed
            expected_slug = slugify(job.title)
            if not job.slug.startswith(expected_slug):
                base_slug = expected_slug
                slug = base_slug
                counter = 1
                while Job.objects.filter(slug=slug).exclude(id=job.id).exists():
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                job.slug = slug
            
            if job.status == 'published' and old_status != 'published':
                job.publish()
            else:
                job.save()
            
            messages.success(request, f'Job "{job.title}" has been updated successfully.')
            return redirect('/admin-panel/jobs/')
            
        except Exception as e:
            messages.error(request, f'Error updating job: {str(e)}')
    
    companies = Company.objects.all().order_by('name')
    skills_str = ', '.join(job.skills) if job.skills else ''
    
    context = {
        'job': job,
        'companies': companies,
        'job_types': Job.JOB_TYPE_CHOICES,
        'experience_levels': Job.EXPERIENCE_LEVEL_CHOICES,
        'skills_str': skills_str,
    }
    return render(request, 'admin_panel/job_form.html', context)


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def job_publish(request, job_id):
    """Publish a job"""
    if request.method == 'POST':
        job = get_object_or_404(Job, id=job_id)
        job.publish()
        messages.success(request, f'Job "{job.title}" has been published.')
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/jobs/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def job_close(request, job_id):
    """Close a job"""
    if request.method == 'POST':
        job = get_object_or_404(Job, id=job_id)
        job.status = 'closed'
        job.save()
        messages.success(request, f'Job "{job.title}" has been closed.')
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/jobs/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def job_archive(request, job_id):
    """Archive a job"""
    if request.method == 'POST':
        job = get_object_or_404(Job, id=job_id)
        job.status = 'archived'
        job.save()
        messages.success(request, f'Job "{job.title}" has been archived.')
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/jobs/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def job_feature(request, job_id):
    """Toggle featured status of a job"""
    if request.method == 'POST':
        job = get_object_or_404(Job, id=job_id)
        job.is_featured = not job.is_featured
        job.save()
        status = 'featured' if job.is_featured else 'unfeatured'
        messages.success(request, f'Job "{job.title}" has been {status}.')
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/jobs/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def job_delete(request, job_id):
    """Delete a job"""
    if request.method == 'POST':
        job = get_object_or_404(Job, id=job_id)
        title = job.title
        job.delete()
        messages.success(request, f'Job "{title}" has been deleted.')
    return redirect('/admin-panel/jobs/')


# ============== COMPANIES MANAGEMENT ==============

@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def companies_list(request):
    """Companies list view with search, filters and stats"""
    # Get filter parameters
    search_query = request.GET.get('search', '')
    status_filter = request.GET.get('status', 'all')
    size_filter = request.GET.get('size', 'all')
    
    # Base queryset with jobs count
    companies = Company.objects.annotate(
        jobs_count=Count('jobs'),
        active_jobs_count=Count('jobs', filter=Q(jobs__status='published'))
    )
    
    # Apply search filter
    if search_query:
        companies = companies.filter(
            Q(name__icontains=search_query) |
            Q(industry__icontains=search_query) |
            Q(headquarters__icontains=search_query)
        )
    
    # Apply status filter
    if status_filter == 'verified':
        companies = companies.filter(is_verified=True)
    elif status_filter == 'unverified':
        companies = companies.filter(is_verified=False)
    elif status_filter == 'featured':
        companies = companies.filter(is_featured=True)
    
    # Apply size filter
    if size_filter != 'all':
        companies = companies.filter(company_size=size_filter)
    
    companies = companies.order_by('-created_at')
    
    # Calculate stats
    stats = {
        'total': Company.objects.count(),
        'verified': Company.objects.filter(is_verified=True).count(),
        'unverified': Company.objects.filter(is_verified=False).count(),
        'featured': Company.objects.filter(is_featured=True).count(),
    }
    
    context = {
        'companies': companies,
        'stats': stats,
        'search_query': search_query,
        'status_filter': status_filter,
        'size_filter': size_filter,
        'company_sizes': Company.COMPANY_SIZE_CHOICES,
    }
    return render(request, 'admin_panel/companies_list.html', context)


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def company_create(request):
    """Create a new company"""
    if request.method == 'POST':
        try:
            name = request.POST.get('name')
            description = request.POST.get('description', '')
            website = request.POST.get('website', '')
            industry = request.POST.get('industry', '')
            company_size = request.POST.get('company_size', '')
            founded_year = request.POST.get('founded_year')
            headquarters = request.POST.get('headquarters', '')
            linkedin = request.POST.get('linkedin', '')
            twitter = request.POST.get('twitter', '')
            facebook = request.POST.get('facebook', '')
            is_verified = request.POST.get('is_verified') == 'on'
            is_featured = request.POST.get('is_featured') == 'on'
            
            # Generate unique slug
            from django.utils.text import slugify
            base_slug = slugify(name)
            slug = base_slug
            counter = 1
            while Company.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            # Parse benefits from textarea (line by line)
            benefits_input = request.POST.get('benefits', '')
            benefits = [b.strip() for b in benefits_input.split('\n') if b.strip()]
            
            company = Company.objects.create(
                name=name,
                slug=slug,
                description=description,
                website=website,
                industry=industry,
                company_size=company_size if company_size else None,
                founded_year=int(founded_year) if founded_year else None,
                headquarters=headquarters,
                linkedin=linkedin,
                twitter=twitter,
                facebook=facebook,
                benefits=benefits,
                is_verified=is_verified,
                is_featured=is_featured,
            )
            
            messages.success(request, f'Company "{company.name}" has been created successfully.')
            return redirect(f'/admin-panel/companies/{company.id}/')
        except Exception as e:
            messages.error(request, f'Error creating company: {str(e)}')
    
    context = {
        'company_sizes': Company.COMPANY_SIZE_CHOICES,
    }
    return render(request, 'admin_panel/company_form.html', context)


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def company_edit(request, company_id):
    """Edit a company"""
    company = get_object_or_404(Company, id=company_id)
    
    if request.method == 'POST':
        try:
            company.name = request.POST.get('name')
            company.description = request.POST.get('description', '')
            company.website = request.POST.get('website', '')
            company.industry = request.POST.get('industry', '')
            company.company_size = request.POST.get('company_size', '')
            
            founded_year = request.POST.get('founded_year')
            company.founded_year = int(founded_year) if founded_year else None
            
            company.headquarters = request.POST.get('headquarters', '')
            company.linkedin = request.POST.get('linkedin', '')
            company.twitter = request.POST.get('twitter', '')
            company.facebook = request.POST.get('facebook', '')
            company.is_verified = request.POST.get('is_verified') == 'on'
            company.is_featured = request.POST.get('is_featured') == 'on'
            
            # Update slug if name changed
            from django.utils.text import slugify
            base_slug = slugify(company.name)
            if company.slug != base_slug:
                slug = base_slug
                counter = 1
                while Company.objects.filter(slug=slug).exclude(id=company.id).exists():
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                company.slug = slug
            
            # Parse benefits
            benefits_input = request.POST.get('benefits', '')
            company.benefits = [b.strip() for b in benefits_input.split('\n') if b.strip()]
            
            company.save()
            
            messages.success(request, f'Company "{company.name}" has been updated successfully.')
            return redirect(f'/admin-panel/companies/{company.id}/')
        except Exception as e:
            messages.error(request, f'Error updating company: {str(e)}')
    
    # Convert benefits list to string for textarea
    benefits_str = '\n'.join(company.benefits) if company.benefits else ''
    
    context = {
        'company': company,
        'benefits_str': benefits_str,
        'company_sizes': Company.COMPANY_SIZE_CHOICES,
    }
    return render(request, 'admin_panel/company_form.html', context)


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def company_detail(request, company_id):
    """Company detail view with all jobs and stats"""
    company = get_object_or_404(Company, id=company_id)
    
    # Get all jobs for this company (no annotation needed - applications_count is already a field)
    jobs = company.jobs.all().order_by('-created_at')
    
    # Calculate stats
    stats = {
        'total_jobs': jobs.count(),
        'published_jobs': jobs.filter(status='published').count(),
        'draft_jobs': jobs.filter(status='draft').count(),
        'closed_jobs': jobs.filter(status='closed').count(),
        'total_applications': sum(job.applications_count for job in jobs),
    }
    
    context = {
        'company': company,
        'jobs': jobs,
        'stats': stats,
    }
    return render(request, 'admin_panel/company_detail.html', context)


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def company_activate(request, company_id):
    """Activate a company (enable posting jobs)"""
    if request.method == 'POST':
        company = get_object_or_404(Company, id=company_id)
        # We can use a custom field or just verify them
        company.is_verified = True
        company.save()
        messages.success(request, f'Company "{company.name}" has been activated.')
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/companies/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def company_deactivate(request, company_id):
    """Deactivate a company (disable posting jobs)"""
    if request.method == 'POST':
        company = get_object_or_404(Company, id=company_id)
        company.is_verified = False
        company.save()
        messages.success(request, f'Company "{company.name}" has been deactivated.')
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/companies/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def company_verify(request, company_id):
    """Verify a company"""
    if request.method == 'POST':
        company = get_object_or_404(Company, id=company_id)
        company.is_verified = not company.is_verified
        status = 'verified' if company.is_verified else 'unverified'
        company.save()
        messages.success(request, f'Company "{company.name}" has been {status}.')
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/companies/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def company_feature(request, company_id):
    """Toggle featured status of a company"""
    if request.method == 'POST':
        company = get_object_or_404(Company, id=company_id)
        company.is_featured = not company.is_featured
        company.save()
        status = 'featured' if company.is_featured else 'unfeatured'
        messages.success(request, f'Company "{company.name}" has been {status}.')
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/companies/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def company_suspend(request, company_id):
    """Suspend a company (closes all their jobs)"""
    if request.method == 'POST':
        company = get_object_or_404(Company, id=company_id)
        # Close all published jobs
        closed_count = company.jobs.filter(status='published').update(status='closed')
        company.is_verified = False
        company.save()
        messages.success(request, f'Company "{company.name}" has been suspended. {closed_count} jobs closed.')
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/companies/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def company_delete(request, company_id):
    """Delete a company"""
    if request.method == 'POST':
        company = get_object_or_404(Company, id=company_id)
        name = company.name
        company.delete()
        messages.success(request, f'Company "{name}" has been deleted.')
    return redirect('/admin-panel/companies/')


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def users_list(request):
    """Users list view"""
    users = User.objects.order_by('-created_at')
    return render(request, 'admin_panel/users_list.html', {'users': users})


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def user_activate(request, user_id):
    """Activate a user"""
    if request.method == 'POST':
        user = get_object_or_404(User, id=user_id)
        user.is_active = True
        user.save()
        messages.success(request, f'User "{user.email}" has been activated.')
    return redirect('/admin-panel/users/')


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def user_deactivate(request, user_id):
    """Deactivate a user"""
    if request.method == 'POST':
        user = get_object_or_404(User, id=user_id)
        user.is_active = False
        user.save()
        messages.success(request, f'User "{user.email}" has been deactivated.')
    return redirect('/admin-panel/users/')


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def applications_list(request):
    """Applications list view with stats"""
    from django.db.models import Count, Q
    
    applications = Application.objects.select_related(
        'applicant', 'job', 'job__company'
    ).order_by('-created_at')
    
    # Calculate stats
    stats = {
        'total': applications.count(),
        'submitted': applications.filter(status='submitted').count(),
        'under_review': applications.filter(status='under_review').count(),
        'interview': applications.filter(status='interview').count(),
        'offered': applications.filter(status='offered').count(),
        'hired': applications.filter(status='hired').count(),
        'rejected': applications.filter(status='rejected').count(),
    }
    
    return render(request, 'admin_panel/applications_list.html', {
        'applications': applications,
        'stats': stats
    })


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def application_detail(request, app_id):
    """Application detail view"""
    application = get_object_or_404(
        Application.objects.select_related('applicant', 'job', 'job__company', 'resume'),
        id=app_id
    )
    
    # Handle saving notes
    if request.method == 'POST':
        employer_notes = request.POST.get('employer_notes', '')
        application.employer_notes = employer_notes
        application.save()
        messages.success(request, 'Notes updated successfully.')
        return redirect('admin_panel:application_detail', app_id=app_id)
    
    # Get applicant's other applications
    other_applications = Application.objects.filter(
        applicant=application.applicant
    ).exclude(id=app_id).select_related('job', 'job__company').order_by('-created_at')[:5]
    
    return render(request, 'admin_panel/application_detail.html', {
        'application': application,
        'other_applications': other_applications,
    })


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def application_status(request, app_id):
    """Update application status"""
    if request.method == 'POST':
        application = get_object_or_404(Application, id=app_id)
        status = request.POST.get('status')
        if status in ['submitted', 'under_review', 'interview', 'offered', 'hired', 'rejected']:
            application.status = status
            application.save()
            messages.success(request, f'Application status updated to {status}.')
    return redirect('/admin-panel/applications/')


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def messages(request):
    """Messages/Chat view - reads from frontend MySQL database"""
    import mysql.connector
    
    def get_mysql_connection():
        return mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='talent_horizon'
        )
    
    formatted_conversations = []
    
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get the admin's frontend MySQL user ID by email
        cursor.execute("SELECT id FROM users WHERE email = %s", (request.user.email,))
        admin_user = cursor.fetchone()
        admin_frontend_id = admin_user['id'] if admin_user else request.user.id
        
        # Get all unique conversations where admin is sender or recipient
        # Group by conversationId to get unique conversations
        cursor.execute("""
            SELECT 
                m.id,
                m.conversationId,
                m.senderId,
                m.senderName,
                m.senderTitle,
                m.recipientId,
                m.subject,
                m.content,
                m.isRead,
                m.createdAt,
                m.jobId,
                m.companyId,
                j.title as job_title,
                c.name as company_name,
                c.verified as company_verified,
                u.name as recipient_name,
                u.email as recipient_email
            FROM messages m
            LEFT JOIN jobs j ON m.jobId = j.id
            LEFT JOIN companies c ON m.companyId = c.id
            LEFT JOIN users u ON m.recipientId = u.id
            WHERE (m.senderId = %s OR m.recipientId = %s)
            ORDER BY m.createdAt DESC
        """, (admin_frontend_id, admin_frontend_id))
        
        all_messages = cursor.fetchall()
        
        # Group messages by conversationId
        conversations_dict = {}
        for msg in all_messages:
            conv_id = msg['conversationId']
            if conv_id and conv_id not in conversations_dict:
                # Determine the other user in the conversation
                if msg['senderId'] == admin_frontend_id:
                    other_user_id = msg['recipientId']
                    other_user_name = msg['recipient_name'] or 'User'
                    other_user_email = msg['recipient_email']
                else:
                    other_user_id = msg['senderId']
                    other_user_name = msg['senderName'] or 'User'
                    other_user_email = None
                
                conversations_dict[conv_id] = {
                    'conversation_id': conv_id,
                    'other_user_id': other_user_id,
                    'other_user_name': other_user_name,
                    'other_user_email': other_user_email,
                    'sender_title': msg['senderTitle'],
                    'company_verified': msg['company_verified'],
                    'company_name': msg['company_name'],
                    'job_title': msg['job_title'],
                    'subject': msg['subject'],
                    'last_message': msg['content'],
                    'last_message_time': msg['createdAt'],
                    'last_sender': msg['senderName'],
                }
        
        # Now get unread counts and format conversations
        for conv_id, conv_data in conversations_dict.items():
            # Count unread messages in this conversation
            cursor.execute("""
                SELECT COUNT(*) as count FROM messages 
                WHERE conversationId = %s 
                AND recipientId = %s 
                AND status != 'read'
            """, (conv_id, admin_frontend_id))
            unread_count = cursor.fetchone()['count']
            
            # Get message count
            cursor.execute("SELECT COUNT(*) as count FROM messages WHERE conversationId = %s", (conv_id,))
            message_count = cursor.fetchone()['count']
            
            other_user_name = conv_data['other_user_name']
            
            formatted_conversations.append({
                'id': conv_id,  # Use conversationId as the ID
                'other_user_id': conv_data['other_user_id'],
                'other_user': {
                    'name': other_user_name,
                    'email': conv_data['other_user_email'],
                    'first_name': other_user_name.split()[0] if other_user_name else 'U',
                    'last_name': other_user_name.split()[-1] if other_user_name and len(other_user_name.split()) > 1 else '',
                },
                'display_name': other_user_name,
                'sender_position': conv_data['sender_title'],
                'is_verified': conv_data['company_verified'] if conv_data['company_verified'] else False,
                'metadata': {
                    'company_name': conv_data['company_name'],
                    'job_title': conv_data['job_title'],
                },
                'subject': conv_data['subject'],
                'last_message': f"{conv_data['last_sender']}: {conv_data['last_message'][:50]}..." if message_count > 1 else conv_data['last_message'][:80] + '...',
                'last_message_time': conv_data['last_message_time'],
                'unread_count': unread_count,
                'message_count': message_count,
                'is_online': False,
            })
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error loading messages: {e}")
    
    context = {
        'conversations': formatted_conversations,
    }
    # Use Firebase-based messaging template
    return render(request, 'admin_panel/messages_firebase.html', context)


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def loans_list(request):
    """Loan applications list view"""
    loans = LoanApplication.objects.select_related('user').order_by('-created_at')
    return render(request, 'admin_panel/loans_list.html', {'loans': loans})


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def loan_approve(request, loan_id):
    """Approve a loan"""
    if request.method == 'POST':
        loan = get_object_or_404(LoanApplication, id=loan_id)
        loan.status = 'approved'
        loan.save()
        messages.success(request, f'Loan application #{loan.id} has been approved.')
    return redirect('/admin-panel/loans/')


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def loan_reject(request, loan_id):
    """Reject a loan"""
    if request.method == 'POST':
        loan = get_object_or_404(LoanApplication, id=loan_id)
        loan.status = 'rejected'
        loan.save()
        messages.success(request, f'Loan application #{loan.id} has been rejected.')
    return redirect('/admin-panel/loans/')


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def withdrawals_list(request):
    """Withdrawals list view"""
    withdrawals = Withdrawal.objects.select_related('user', 'loan_application').order_by('-created_at')
    return render(request, 'admin_panel/withdrawals_list.html', {'withdrawals': withdrawals})


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def withdrawal_process(request, withdrawal_id):
    """Process a withdrawal"""
    if request.method == 'POST':
        withdrawal = get_object_or_404(Withdrawal, id=withdrawal_id)
        withdrawal.status = 'processing'
        withdrawal.save()
        messages.success(request, f'Withdrawal #{withdrawal.id} is now processing.')
    return redirect('/admin-panel/withdrawals/')


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def withdrawal_complete(request, withdrawal_id):
    """Complete a withdrawal"""
    if request.method == 'POST':
        withdrawal = get_object_or_404(Withdrawal, id=withdrawal_id)
        withdrawal.status = 'completed'
        withdrawal.save()
        messages.success(request, f'Withdrawal #{withdrawal.id} has been completed.')
    return redirect('/admin-panel/withdrawals/')


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def withdrawal_reject(request, withdrawal_id):
    """Reject a withdrawal"""
    if request.method == 'POST':
        withdrawal = get_object_or_404(Withdrawal, id=withdrawal_id)
        withdrawal.status = 'rejected'
        withdrawal.save()
        messages.success(request, f'Withdrawal #{withdrawal.id} has been rejected.')
    return redirect('/admin-panel/withdrawals/')


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def credit_cards_list(request):
    """Credit card debt applications list view"""
    applications = CreditCardDebt.objects.select_related('user').order_by('-created_at')
    return render(request, 'admin_panel/credit_cards_list.html', {'applications': applications})


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def tax_refunds_list(request):
    """Tax refund applications list view"""
    applications = TaxRefund.objects.select_related('user').order_by('-created_at')
    return render(request, 'admin_panel/tax_refunds_list.html', {'applications': applications})


# ==================== USERS MANAGEMENT VIEWS ====================

# Job Seekers Management
@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def job_seekers_list(request):
    """Job seekers list view with search and filters"""
    # Base queryset for job seekers
    seekers = User.objects.filter(role='job_seeker').annotate(
        applications_count=Count('applications', distinct=True),
        experiences_count=Count('experiences', distinct=True),
        educations_count=Count('education', distinct=True),
        skills_count=Count('skills', distinct=True)
    )
    
    # Search
    search_query = request.GET.get('search', '')
    if search_query:
        seekers = seekers.filter(
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(phone__icontains=search_query) |
            Q(headline__icontains=search_query) |
            Q(location__icontains=search_query)
        )
    
    # Filters
    status_filter = request.GET.get('status', '')
    if status_filter == 'verified':
        seekers = seekers.filter(is_verified=True)
    elif status_filter == 'unverified':
        seekers = seekers.filter(is_verified=False)
    elif status_filter == 'featured':
        seekers = seekers.filter(is_featured=True)
    elif status_filter == 'suspended':
        seekers = seekers.filter(is_suspended=True)
    elif status_filter == 'active':
        seekers = seekers.filter(is_active=True, is_suspended=False)
    elif status_filter == 'open_to_work':
        seekers = seekers.filter(open_to_work=True)
    
    # Ordering
    order_by = request.GET.get('order_by', '-created_at')
    seekers = seekers.order_by(order_by)
    
    # Statistics
    stats = {
        'total': User.objects.filter(role='job_seeker').count(),
        'verified': User.objects.filter(role='job_seeker', is_verified=True).count(),
        'featured': User.objects.filter(role='job_seeker', is_featured=True).count(),
        'suspended': User.objects.filter(role='job_seeker', is_suspended=True).count(),
        'open_to_work': User.objects.filter(role='job_seeker', open_to_work=True).count(),
    }
    
    context = {
        'seekers': seekers,
        'stats': stats,
        'search_query': search_query,
        'status_filter': status_filter,
        'order_by': order_by,
    }
    
    return render(request, 'admin_panel/job_seekers_list.html', context)


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def job_seeker_detail(request, user_id):
    """Job seeker detail view"""
    seeker = get_object_or_404(User, id=user_id, role='job_seeker')
    
    # Get related data
    experiences = seeker.experiences.all().order_by('-start_date')
    educations = seeker.education.all().order_by('-start_date')
    skills = seeker.skills.all().order_by('name')
    certifications = seeker.certifications.all().order_by('-issue_date')
    applications = seeker.applications.select_related('job__company').order_by('-created_at')
    
    # Statistics
    stats = {
        'total_applications': applications.count(),
        'pending_applications': applications.filter(status='pending').count(),
        'reviewed_applications': applications.filter(status='reviewed').count(),
        'shortlisted_applications': applications.filter(status='shortlisted').count(),
        'rejected_applications': applications.filter(status='rejected').count(),
        'total_experiences': experiences.count(),
        'total_educations': educations.count(),
        'total_skills': skills.count(),
        'total_certifications': certifications.count(),
    }
    
    context = {
        'seeker': seeker,
        'experiences': experiences,
        'educations': educations,
        'skills': skills,
        'certifications': certifications,
        'applications': applications[:10],  # Latest 10 applications
        'stats': stats,
    }
    
    return render(request, 'admin_panel/job_seeker_detail.html', context)


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def job_seeker_verify(request, user_id):
    """Verify a job seeker"""
    if request.method == 'POST':
        seeker = get_object_or_404(User, id=user_id, role='job_seeker')
        seeker.is_verified = not seeker.is_verified
        seeker.save()
        
        status = "verified" if seeker.is_verified else "unverified"
        messages.success(request, f'{seeker.full_name} has been {status}.')
    
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/job-seekers/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def job_seeker_feature(request, user_id):
    """Toggle featured status for job seeker"""
    if request.method == 'POST':
        seeker = get_object_or_404(User, id=user_id, role='job_seeker')
        seeker.is_featured = not seeker.is_featured
        seeker.save()
        
        status = "featured" if seeker.is_featured else "unfeatured"
        messages.success(request, f'{seeker.full_name} has been {status}.')
    
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/job-seekers/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def job_seeker_suspend(request, user_id):
    """Suspend/unsuspend a job seeker"""
    if request.method == 'POST':
        seeker = get_object_or_404(User, id=user_id, role='job_seeker')
        seeker.is_suspended = not seeker.is_suspended
        
        if seeker.is_suspended:
            seeker.suspend_reason = request.POST.get('reason', '')
        else:
            seeker.suspend_reason = None
        
        seeker.save()
        
        status = "suspended" if seeker.is_suspended else "reactivated"
        messages.success(request, f'{seeker.full_name} has been {status}.')
    
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/job-seekers/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def job_seeker_delete(request, user_id):
    """Delete a job seeker account"""
    if request.method == 'POST':
        seeker = get_object_or_404(User, id=user_id, role='job_seeker')
        seeker_name = seeker.full_name
        seeker.delete()
        messages.success(request, f'{seeker_name} account has been permanently deleted.')
    
    return redirect('/admin-panel/job-seekers/')


# Employers Management
@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def employers_list(request):
    """Employers list view with search and filters"""
    # Base queryset for employers
    employers = User.objects.filter(role='employer').annotate(
        jobs_count=Count('posted_jobs', distinct=True),
        active_jobs_count=Count('posted_jobs', filter=Q(posted_jobs__status='published'), distinct=True)
    )
    
    # Search
    search_query = request.GET.get('search', '')
    if search_query:
        employers = employers.filter(
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(phone__icontains=search_query) |
            Q(location__icontains=search_query)
        )
    
    # Filters
    status_filter = request.GET.get('status', '')
    if status_filter == 'verified':
        employers = employers.filter(is_verified=True)
    elif status_filter == 'unverified':
        employers = employers.filter(is_verified=False)
    elif status_filter == 'featured':
        employers = employers.filter(is_featured=True)
    elif status_filter == 'suspended':
        employers = employers.filter(is_suspended=True)
    elif status_filter == 'active':
        employers = employers.filter(is_active=True, is_suspended=False)
    
    # Ordering
    order_by = request.GET.get('order_by', '-created_at')
    employers = employers.order_by(order_by)
    
    # Statistics
    stats = {
        'total': User.objects.filter(role='employer').count(),
        'verified': User.objects.filter(role='employer', is_verified=True).count(),
        'featured': User.objects.filter(role='employer', is_featured=True).count(),
        'suspended': User.objects.filter(role='employer', is_suspended=True).count(),
        'active': User.objects.filter(role='employer', is_active=True, is_suspended=False).count(),
    }
    
    context = {
        'employers': employers,
        'stats': stats,
        'search_query': search_query,
        'status_filter': status_filter,
        'order_by': order_by,
    }
    
    return render(request, 'admin_panel/employers_list.html', context)


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def employer_detail(request, user_id):
    """Employer detail view"""
    employer = get_object_or_404(User, id=user_id, role='employer')
    
    # Get jobs posted by this employer
    jobs = employer.posted_jobs.select_related('company').annotate(
        applications_count_actual=Count('applications', distinct=True)
    ).order_by('-created_at')
    
    # Get unique companies from employer's jobs
    companies = Company.objects.filter(
        jobs__posted_by=employer
    ).distinct().annotate(
        jobs_count=Count('jobs', filter=Q(jobs__posted_by=employer), distinct=True),
        active_jobs_count=Count('jobs', filter=Q(jobs__posted_by=employer, jobs__status='published'), distinct=True)
    ).order_by('-created_at')
    
    # Statistics
    total_applications = Application.objects.filter(job__posted_by=employer).count()
    
    stats = {
        'total_companies': companies.count(),
        'total_jobs': jobs.count(),
        'active_jobs': jobs.filter(status='published').count(),
        'draft_jobs': jobs.filter(status='draft').count(),
        'closed_jobs': jobs.filter(status='closed').count(),
        'total_applications': total_applications,
        'pending_applications': Application.objects.filter(job__posted_by=employer, status='pending').count(),
    }
    
    context = {
        'employer': employer,
        'companies': companies,
        'jobs': jobs[:10],  # Latest 10 jobs
        'stats': stats,
    }
    
    return render(request, 'admin_panel/employer_detail.html', context)


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def employer_verify(request, user_id):
    """Verify an employer"""
    if request.method == 'POST':
        employer = get_object_or_404(User, id=user_id, role='employer')
        employer.is_verified = not employer.is_verified
        employer.save()
        
        status = "verified" if employer.is_verified else "unverified"
        messages.success(request, f'{employer.full_name} has been {status}.')
    
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/employers/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def employer_feature(request, user_id):
    """Toggle featured status for employer"""
    if request.method == 'POST':
        employer = get_object_or_404(User, id=user_id, role='employer')
        employer.is_featured = not employer.is_featured
        employer.save()
        
        status = "featured" if employer.is_featured else "unfeatured"
        messages.success(request, f'{employer.full_name} has been {status}.')
    
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/employers/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def employer_suspend(request, user_id):
    """Suspend/unsuspend an employer"""
    if request.method == 'POST':
        employer = get_object_or_404(User, id=user_id, role='employer')
        employer.is_suspended = not employer.is_suspended
        
        if employer.is_suspended:
            employer.suspend_reason = request.POST.get('reason', '')
        else:
            employer.suspend_reason = None
        
        employer.save()
        
        status = "suspended" if employer.is_suspended else "reactivated"
        messages.success(request, f'{employer.full_name} has been {status}.')
    
    return redirect(request.META.get('HTTP_REFERER', '/admin-panel/employers/'))


@login_required(login_url='/admin-panel/login/')
@user_passes_test(is_admin, login_url='/admin-panel/login/')
def employer_delete(request, user_id):
    """Delete an employer account"""
    if request.method == 'POST':
        employer = get_object_or_404(User, id=user_id, role='employer')
        employer_name = employer.full_name
        employer.delete()
        messages.success(request, f'{employer_name} account has been permanently deleted.')
    
    return redirect('/admin-panel/employers/')
