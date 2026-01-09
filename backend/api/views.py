from rest_framework import viewsets, status, generics, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.db.models import Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from core.models import User, Experience, Education, Skill, Certification
from jobs.models import Company, Job, Application, Resume, SavedJob, Message
from financial.models import LoanApplication, Withdrawal, CreditCardDebt, TaxRefund

from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer, UserUpdateSerializer,
    ExperienceSerializer, EducationSerializer, SkillSerializer, CertificationSerializer,
    CompanyListSerializer, CompanyDetailSerializer,
    JobListSerializer, JobDetailSerializer, JobCreateUpdateSerializer,
    ApplicationListSerializer, ApplicationDetailSerializer, ApplicationCreateSerializer, ApplicationUpdateSerializer,
    ResumeSerializer, SavedJobSerializer,
    MessageSerializer, MessageCreateSerializer,
    LoanApplicationListSerializer, LoanApplicationDetailSerializer, LoanApplicationCreateSerializer,
    WithdrawalSerializer, WithdrawalCreateSerializer,
    CreditCardDebtSerializer, CreditCardDebtCreateSerializer,
    TaxRefundSerializer, TaxRefundCreateSerializer,
)

User = get_user_model()


# ============ AUTHENTICATION VIEWS ============

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)
            
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': UserProfileSerializer(user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                })
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logged out successfully'})
        except Exception:
            return Response({'message': 'Logged out successfully'})


class MeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserProfileSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============ USER PROFILE VIEWS ============

class ExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Experience.objects.filter(user=self.request.user).order_by('-start_date')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EducationViewSet(viewsets.ModelViewSet):
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Education.objects.filter(user=self.request.user).order_by('-start_date')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Skill.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CertificationViewSet(viewsets.ModelViewSet):
    serializer_class = CertificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Certification.objects.filter(user=self.request.user).order_by('-issue_date')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ============ COMPANY VIEWS ============

class CompanyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Company.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'industry', 'headquarters']
    ordering_fields = ['name', 'created_at']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CompanyDetailSerializer
        return CompanyListSerializer
    
    @action(detail=True, methods=['get'])
    def jobs(self, request, slug=None):
        company = self.get_object()
        jobs = company.jobs.filter(status='published')
        serializer = JobListSerializer(jobs, many=True)
        return Response(serializer.data)


# ============ JOB VIEWS ============

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location', 'company__name']
    ordering_fields = ['created_at', 'salary_min', 'views_count']
    filterset_fields = ['job_type', 'experience_level', 'is_remote', 'status', 'is_featured']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return JobDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return JobCreateUpdateSerializer
        return JobListSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_queryset(self):
        queryset = Job.objects.all()
        
        # Filter by status for public access
        if not self.request.user.is_authenticated or self.request.user.role != 'employer':
            queryset = queryset.filter(status='published')
        
        # Additional filters from query params
        job_type = self.request.query_params.get('job_type')
        experience_level = self.request.query_params.get('experience_level')
        location = self.request.query_params.get('location')
        salary_min = self.request.query_params.get('salary_min')
        salary_max = self.request.query_params.get('salary_max')
        
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        if experience_level:
            queryset = queryset.filter(experience_level=experience_level)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if salary_min:
            queryset = queryset.filter(salary_min__gte=salary_min)
        if salary_max:
            queryset = queryset.filter(salary_max__lte=salary_max)
        
        return queryset.order_by('-is_featured', '-created_at')
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)


# ============ APPLICATION VIEWS ============

class ApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ApplicationDetailSerializer
        elif self.action == 'create':
            return ApplicationCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ApplicationUpdateSerializer
        return ApplicationListSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'employer':
            # Employers see applications for their jobs
            return Application.objects.filter(job__posted_by=user).order_by('-created_at')
        # Applicants see their own applications
        return Application.objects.filter(applicant=user).order_by('-created_at')
    
    def perform_create(self, serializer):
        job = serializer.validated_data['job']
        # Check if already applied
        if Application.objects.filter(applicant=self.request.user, job=job).exists():
            raise serializers.ValidationError({'error': 'You have already applied to this job'})
        
        # Increment application count
        job.applications_count += 1
        job.save(update_fields=['applications_count'])
        
        serializer.save(applicant=self.request.user)
    
    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        application = self.get_object()
        if application.applicant != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        application.status = 'withdrawn'
        application.save()
        return Response({'message': 'Application withdrawn'})


# ============ RESUME VIEWS ============

class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        # If this is the first resume, make it primary
        is_first = not Resume.objects.filter(user=self.request.user).exists()
        serializer.save(user=self.request.user, is_primary=is_first)
    
    @action(detail=True, methods=['post'])
    def set_primary(self, request, pk=None):
        resume = self.get_object()
        # Remove primary from all other resumes
        Resume.objects.filter(user=request.user).update(is_primary=False)
        resume.is_primary = True
        resume.save()
        return Response({'message': 'Resume set as primary'})


# ============ SAVED JOB VIEWS ============

class SavedJobViewSet(viewsets.ModelViewSet):
    serializer_class = SavedJobSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user).order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        job_id = request.data.get('job_id')
        if not job_id:
            return Response({'error': 'job_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
        
        saved_job, created = SavedJob.objects.get_or_create(user=request.user, job=job)
        
        if not created:
            return Response({'message': 'Job already saved'}, status=status.HTTP_200_OK)
        
        serializer = self.get_serializer(saved_job)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['delete'])
    def unsave(self, request):
        job_id = request.data.get('job_id')
        if not job_id:
            return Response({'error': 'job_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        deleted, _ = SavedJob.objects.filter(user=request.user, job_id=job_id).delete()
        if deleted:
            return Response({'message': 'Job unsaved'})
        return Response({'error': 'Saved job not found'}, status=status.HTTP_404_NOT_FOUND)


# ============ MESSAGE VIEWS ============

class MessageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return MessageCreateSerializer
        return MessageSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | Q(recipient=user)
        ).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        message = self.get_object()
        if message.recipient != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        message.is_read = True
        message.read_at = timezone.now()
        message.save()
        return Response({'message': 'Marked as read'})
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = Message.objects.filter(recipient=request.user, is_read=False).count()
        return Response({'count': count})


# ============ FINANCIAL VIEWS ============

class LoanApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LoanApplicationDetailSerializer
        elif self.action == 'create':
            return LoanApplicationCreateSerializer
        return LoanApplicationListSerializer
    
    def get_queryset(self):
        return LoanApplication.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WithdrawalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return WithdrawalCreateSerializer
        return WithdrawalSerializer
    
    def get_queryset(self):
        return Withdrawal.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        loan_application = serializer.validated_data['loan_application']
        
        # Verify loan is approved and belongs to user
        if loan_application.user != self.request.user:
            raise serializers.ValidationError({'error': 'Not authorized'})
        if loan_application.status != 'approved':
            raise serializers.ValidationError({'error': 'Loan must be approved before withdrawal'})
        
        serializer.save(user=self.request.user)


class CreditCardDebtViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreditCardDebtCreateSerializer
        return CreditCardDebtSerializer
    
    def get_queryset(self):
        return CreditCardDebt.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaxRefundViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TaxRefundCreateSerializer
        return TaxRefundSerializer
    
    def get_queryset(self):
        return TaxRefund.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ============ DASHBOARD STATS VIEW ============

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        stats = {
            'applications_count': Application.objects.filter(applicant=user).count(),
            'saved_jobs_count': SavedJob.objects.filter(user=user).count(),
            'resumes_count': Resume.objects.filter(user=user).count(),
            'unread_messages': Message.objects.filter(recipient=user, is_read=False).count(),
            'pending_loans': LoanApplication.objects.filter(user=user, status='pending').count(),
            'approved_loans': LoanApplication.objects.filter(user=user, status='approved').count(),
        }
        
        # Recent applications
        recent_applications = Application.objects.filter(applicant=user).order_by('-created_at')[:5]
        stats['recent_applications'] = ApplicationListSerializer(recent_applications, many=True).data
        
        # Application status breakdown
        stats['application_status'] = {
            'submitted': Application.objects.filter(applicant=user, status='submitted').count(),
            'under_review': Application.objects.filter(applicant=user, status='under_review').count(),
            'interview': Application.objects.filter(applicant=user, status='interview').count(),
            'offered': Application.objects.filter(applicant=user, status='offered').count(),
            'hired': Application.objects.filter(applicant=user, status='hired').count(),
            'rejected': Application.objects.filter(applicant=user, status='rejected').count(),
        }
        
        return Response(stats)
