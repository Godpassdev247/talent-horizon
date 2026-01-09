from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView, LoginView, LogoutView, MeView,
    ExperienceViewSet, EducationViewSet, SkillViewSet, CertificationViewSet,
    CompanyViewSet, JobViewSet,
    ApplicationViewSet, ResumeViewSet, SavedJobViewSet,
    MessageViewSet,
    LoanApplicationViewSet, WithdrawalViewSet, CreditCardDebtViewSet, TaxRefundViewSet,
    DashboardStatsView,
)

router = DefaultRouter()

# User profile routes
router.register(r'experiences', ExperienceViewSet, basename='experience')
router.register(r'educations', EducationViewSet, basename='education')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'certifications', CertificationViewSet, basename='certification')

# Job routes
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'jobs', JobViewSet, basename='job')

# Application routes
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'resumes', ResumeViewSet, basename='resume')
router.register(r'saved-jobs', SavedJobViewSet, basename='saved-job')

# Message routes
router.register(r'messages', MessageViewSet, basename='message')

# Financial routes
router.register(r'loans', LoanApplicationViewSet, basename='loan')
router.register(r'withdrawals', WithdrawalViewSet, basename='withdrawal')
router.register(r'credit-card-debt', CreditCardDebtViewSet, basename='credit-card-debt')
router.register(r'tax-refunds', TaxRefundViewSet, basename='tax-refund')

urlpatterns = [
    # Authentication
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Dashboard
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    
    # Router URLs
    path('', include(router.urls)),
]
