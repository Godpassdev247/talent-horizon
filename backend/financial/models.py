from django.db import models
from django.conf import settings
import uuid


class LoanApplication(models.Model):
    """Loan application model"""
    
    LOAN_TYPE_CHOICES = [
        ('personal', 'Personal Loan'),
        ('business', 'Business Loan'),
    ]
    
    CREDIT_SCORE_CHOICES = [
        ('excellent', 'Excellent (750+)'),
        ('good', 'Good (700-749)'),
        ('fair', 'Fair (650-699)'),
        ('poor', 'Poor (Below 650)'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    application_number = models.CharField('Application Number', max_length=20, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='loan_applications')
    
    loan_type = models.CharField('Loan Type', max_length=20, choices=LOAN_TYPE_CHOICES)
    amount = models.DecimalField('Loan Amount', max_digits=12, decimal_places=2)
    credit_score_range = models.CharField('Credit Score Range', max_length=20, choices=CREDIT_SCORE_CHOICES)
    
    full_name = models.CharField('Full Name', max_length=255)
    email = models.EmailField('Email')
    phone = models.CharField('Phone', max_length=20)
    address = models.TextField('Address')
    
    annual_income = models.DecimalField('Annual Income', max_digits=12, decimal_places=2)
    monthly_rent_mortgage = models.DecimalField('Monthly Rent/Mortgage', max_digits=10, decimal_places=2)
    employment_status = models.CharField('Employment Status', max_length=50)
    employer_name = models.CharField('Employer Name', max_length=255, blank=True, null=True)
    
    business_name = models.CharField('Business Name', max_length=255, blank=True, null=True)
    business_type = models.CharField('Business Type', max_length=100, blank=True, null=True)
    business_address = models.TextField('Business Address', blank=True, null=True)
    annual_revenue = models.DecimalField('Annual Revenue', max_digits=12, decimal_places=2, blank=True, null=True)
    years_in_business = models.IntegerField('Years in Business', blank=True, null=True)
    
    status = models.CharField('Status', max_length=20, choices=STATUS_CHOICES, default='pending')
    
    admin_notes = models.TextField('Admin Notes', blank=True, null=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_loans')
    reviewed_at = models.DateTimeField('Reviewed At', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Loan Application'
        verbose_name_plural = 'Loan Applications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.application_number} - {self.full_name}"
    
    def save(self, *args, **kwargs):
        if not self.application_number:
            self.application_number = f"LN{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class Withdrawal(models.Model):
    """Withdrawal request for approved loans"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    withdrawal_number = models.CharField('Withdrawal Number', max_length=20, unique=True, editable=False)
    loan_application = models.ForeignKey(LoanApplication, on_delete=models.CASCADE, related_name='withdrawals')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='withdrawals')
    
    amount = models.DecimalField('Withdrawal Amount', max_digits=12, decimal_places=2)
    
    bank_name = models.CharField('Bank Name', max_length=255)
    account_holder_name = models.CharField('Account Holder Name', max_length=255)
    account_number = models.CharField('Account Number', max_length=50)
    routing_number = models.CharField('Routing Number', max_length=20)
    
    status = models.CharField('Status', max_length=20, choices=STATUS_CHOICES, default='pending')
    
    admin_notes = models.TextField('Admin Notes', blank=True, null=True)
    processed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='processed_withdrawals')
    processed_at = models.DateTimeField('Processed At', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Withdrawal'
        verbose_name_plural = 'Withdrawals'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.withdrawal_number} - ${self.amount}"
    
    def save(self, *args, **kwargs):
        if not self.withdrawal_number:
            self.withdrawal_number = f"WD{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class CreditCardDebt(models.Model):
    """Credit card debt clearance application"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('under_review', 'Under Review'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]
    
    application_number = models.CharField('Application Number', max_length=20, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='credit_card_debt_applications')
    
    full_name = models.CharField('Full Name', max_length=255)
    email = models.EmailField('Email')
    phone = models.CharField('Phone', max_length=20)
    address = models.TextField('Address')
    
    credit_card_limit = models.DecimalField('Credit Card Limit', max_digits=12, decimal_places=2)
    current_debt = models.DecimalField('Current Debt Amount', max_digits=12, decimal_places=2)
    bank_name = models.CharField('Bank Name', max_length=255)
    card_type = models.CharField('Card Type', max_length=100, blank=True, null=True)
    
    status = models.CharField('Status', max_length=20, choices=STATUS_CHOICES, default='pending')
    
    admin_notes = models.TextField('Admin Notes', blank=True, null=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_credit_debts')
    reviewed_at = models.DateTimeField('Reviewed At', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Credit Card Debt Application'
        verbose_name_plural = 'Credit Card Debt Applications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.application_number} - {self.full_name}"
    
    def save(self, *args, **kwargs):
        if not self.application_number:
            self.application_number = f"CD{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class TaxRefund(models.Model):
    """Tax refund filing application"""
    
    FILING_TYPE_CHOICES = [
        ('individual', 'Individual'),
        ('business', 'Business'),
        ('both', 'Both'),
    ]
    
    EMPLOYMENT_STATUS_CHOICES = [
        ('employed', 'Employed'),
        ('self_employed', 'Self-Employed'),
        ('unemployed', 'Unemployed'),
        ('retired', 'Retired'),
        ('student', 'Student'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('documents_required', 'Documents Required'),
        ('in_progress', 'In Progress'),
        ('filed', 'Filed'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    application_number = models.CharField('Application Number', max_length=20, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tax_refund_applications')
    
    full_name = models.CharField('Full Name', max_length=255)
    email = models.EmailField('Email')
    phone = models.CharField('Phone', max_length=20)
    address = models.TextField('Address')
    ssn_last_four = models.CharField('SSN Last 4 Digits', max_length=4)
    
    filing_type = models.CharField('Filing Type', max_length=20, choices=FILING_TYPE_CHOICES)
    tax_year = models.IntegerField('Tax Year')
    employment_status = models.CharField('Employment Status', max_length=20, choices=EMPLOYMENT_STATUS_CHOICES)
    
    annual_income = models.DecimalField('Annual Income', max_digits=12, decimal_places=2)
    expected_refund = models.DecimalField('Expected Refund', max_digits=12, decimal_places=2, blank=True, null=True)
    actual_refund = models.DecimalField('Actual Refund', max_digits=12, decimal_places=2, blank=True, null=True)
    
    business_name = models.CharField('Business Name', max_length=255, blank=True, null=True)
    business_ein = models.CharField('Business EIN', max_length=20, blank=True, null=True)
    business_revenue = models.DecimalField('Business Revenue', max_digits=12, decimal_places=2, blank=True, null=True)
    
    status = models.CharField('Status', max_length=20, choices=STATUS_CHOICES, default='pending')
    
    documents = models.JSONField('Uploaded Documents', default=list, blank=True)
    
    admin_notes = models.TextField('Admin Notes', blank=True, null=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tax_refunds')
    reviewed_at = models.DateTimeField('Reviewed At', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Tax Refund Application'
        verbose_name_plural = 'Tax Refund Applications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.application_number} - {self.full_name}"
    
    def save(self, *args, **kwargs):
        if not self.application_number:
            self.application_number = f"TX{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
