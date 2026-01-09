from django.urls import path
from . import views
from . import messaging_views

app_name = 'admin_panel'

urlpatterns = [
    # Auth
    path('login/', views.admin_login, name='login'),
    path('logout/', views.admin_logout, name='logout'),
    
    # Dashboard
    path('', views.dashboard, name='dashboard'),
    
    # Jobs
    path('jobs/', views.jobs_list, name='jobs_list'),
    path('jobs/create/', views.job_create, name='job_create'),
    path('jobs/<int:job_id>/', views.job_detail, name='job_detail'),
    path('jobs/<int:job_id>/edit/', views.job_edit, name='job_edit'),
    path('jobs/<int:job_id>/publish/', views.job_publish, name='job_publish'),
    path('jobs/<int:job_id>/close/', views.job_close, name='job_close'),
    path('jobs/<int:job_id>/archive/', views.job_archive, name='job_archive'),
    path('jobs/<int:job_id>/feature/', views.job_feature, name='job_feature'),
    path('jobs/<int:job_id>/delete/', views.job_delete, name='job_delete'),
    
    # Companies
    path('companies/', views.companies_list, name='companies_list'),
    path('companies/create/', views.company_create, name='company_create'),
    path('companies/<int:company_id>/', views.company_detail, name='company_detail'),
    path('companies/<int:company_id>/edit/', views.company_edit, name='company_edit'),
    path('companies/<int:company_id>/activate/', views.company_activate, name='company_activate'),
    path('companies/<int:company_id>/deactivate/', views.company_deactivate, name='company_deactivate'),
    path('companies/<int:company_id>/verify/', views.company_verify, name='company_verify'),
    path('companies/<int:company_id>/feature/', views.company_feature, name='company_feature'),
    path('companies/<int:company_id>/suspend/', views.company_suspend, name='company_suspend'),
    path('companies/<int:company_id>/delete/', views.company_delete, name='company_delete'),
    
    # Users
    path('users/', views.users_list, name='users_list'),
    path('users/<int:user_id>/activate/', views.user_activate, name='user_activate'),
    path('users/<int:user_id>/deactivate/', views.user_deactivate, name='user_deactivate'),
    
    # Applications
    path('applications/', views.applications_list, name='applications_list'),
    path('applications/<int:app_id>/', views.application_detail, name='application_detail'),
    path('applications/<int:app_id>/status/', views.application_status, name='application_status'),
    
    # Messages - Main View
    path('messages/', views.messages, name='messages'),
    
    # Messages - API Endpoints
    path('messaging/start-conversation/', messaging_views.start_conversation, name='api_start_conversation'),
    path('api/messages/conversations/', messaging_views.get_conversations, name='api_get_conversations'),
    path('api/messages/conversations/<str:conversation_id>/', messaging_views.get_conversation, name='api_get_conversation'),
    path('api/messages/send/', messaging_views.send_message, name='api_send_message'),
    path('api/messages/mark-read/', messaging_views.mark_read, name='api_mark_read'),
    path('api/messages/users/', messaging_views.get_users, name='api_get_users'),
    
    # Loans
    path('loans/', views.loans_list, name='loans_list'),
    path('loans/<int:loan_id>/approve/', views.loan_approve, name='loan_approve'),
    path('loans/<int:loan_id>/reject/', views.loan_reject, name='loan_reject'),
    
    # Withdrawals
    path('withdrawals/', views.withdrawals_list, name='withdrawals_list'),
    path('withdrawals/<int:withdrawal_id>/process/', views.withdrawal_process, name='withdrawal_process'),
    path('withdrawals/<int:withdrawal_id>/complete/', views.withdrawal_complete, name='withdrawal_complete'),
    path('withdrawals/<int:withdrawal_id>/reject/', views.withdrawal_reject, name='withdrawal_reject'),
    
    # Credit Cards
    path('credit-cards/', views.credit_cards_list, name='credit_cards_list'),
    
    # Tax Refunds
    path('tax-refunds/', views.tax_refunds_list, name='tax_refunds_list'),
    
    # Job Seekers Management
    path('job-seekers/', views.job_seekers_list, name='job_seekers_list'),
    path('job-seekers/<int:user_id>/', views.job_seeker_detail, name='job_seeker_detail'),
    path('job-seekers/<int:user_id>/verify/', views.job_seeker_verify, name='job_seeker_verify'),
    path('job-seekers/<int:user_id>/feature/', views.job_seeker_feature, name='job_seeker_feature'),
    path('job-seekers/<int:user_id>/suspend/', views.job_seeker_suspend, name='job_seeker_suspend'),
    path('job-seekers/<int:user_id>/delete/', views.job_seeker_delete, name='job_seeker_delete'),
    
    # Employers Management
    path('employers/', views.employers_list, name='employers_list'),
    path('employers/<int:user_id>/', views.employer_detail, name='employer_detail'),
    path('employers/<int:user_id>/verify/', views.employer_verify, name='employer_verify'),
    path('employers/<int:user_id>/feature/', views.employer_feature, name='employer_feature'),
    path('employers/<int:user_id>/suspend/', views.employer_suspend, name='employer_suspend'),
    path('employers/<int:user_id>/delete/', views.employer_delete, name='employer_delete'),
]
