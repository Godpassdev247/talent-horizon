from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import LoanApplication, Withdrawal, CreditCardDebt, TaxRefund


class WithdrawalInline(admin.TabularInline):
    model = Withdrawal
    extra = 0
    fields = ['withdrawal_number', 'amount', 'bank_name', 'status', 'created_at']
    readonly_fields = ['withdrawal_number', 'created_at']
    show_change_link = True


@admin.register(LoanApplication)
class LoanApplicationAdmin(admin.ModelAdmin):
    list_display = ['application_number', 'full_name', 'loan_type', 'amount_display', 'credit_score_range', 'status_badge', 'reviewed_by', 'created_at']
    list_filter = ['status', 'loan_type', 'credit_score_range', 'created_at']
    search_fields = ['application_number', 'full_name', 'email', 'phone', 'user__email']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Application Info', {'fields': ('application_number', 'user', 'loan_type', 'amount', 'credit_score_range')}),
        ('Personal Information', {'fields': ('full_name', 'email', 'phone', 'address')}),
        ('Financial Information', {'fields': ('annual_income', 'monthly_rent_mortgage', 'employment_status', 'employer_name')}),
        ('Business Information (For Business Loans)', {
            'fields': ('business_name', 'business_type', 'business_address', 'annual_revenue', 'years_in_business'),
            'classes': ('collapse',),
        }),
        ('Status & Review', {'fields': ('status', 'admin_notes', 'reviewed_by', 'reviewed_at')}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['application_number', 'created_at', 'updated_at']
    raw_id_fields = ['user', 'reviewed_by']
    inlines = [WithdrawalInline]
    
    actions = ['approve_applications', 'reject_applications', 'mark_under_review']
    
    def amount_display(self, obj):
        return f"${obj.amount:,.2f}"
    amount_display.short_description = 'Amount'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#f59e0b',
            'under_review': '#3b82f6',
            'approved': '#10b981',
            'rejected': '#ef4444',
            'withdrawn': '#6b7280',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html('<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px;">{}</span>', color, obj.get_status_display())
    status_badge.short_description = 'Status'
    
    def approve_applications(self, request, queryset):
        queryset.update(status='approved', reviewed_by=request.user, reviewed_at=timezone.now())
        self.message_user(request, f"{queryset.count()} applications approved.")
    approve_applications.short_description = "Approve selected applications"
    
    def reject_applications(self, request, queryset):
        queryset.update(status='rejected', reviewed_by=request.user, reviewed_at=timezone.now())
        self.message_user(request, f"{queryset.count()} applications rejected.")
    reject_applications.short_description = "Reject selected applications"
    
    def mark_under_review(self, request, queryset):
        queryset.update(status='under_review')
        self.message_user(request, f"{queryset.count()} applications marked as under review.")
    mark_under_review.short_description = "Mark as Under Review"


@admin.register(Withdrawal)
class WithdrawalAdmin(admin.ModelAdmin):
    list_display = ['withdrawal_number', 'user', 'loan_application', 'amount_display', 'bank_name', 'status_badge', 'processed_by', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['withdrawal_number', 'user__email', 'user__first_name', 'user__last_name', 'bank_name', 'account_holder_name']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Withdrawal Info', {'fields': ('withdrawal_number', 'loan_application', 'user', 'amount')}),
        ('Bank Details', {'fields': ('bank_name', 'account_holder_name', 'account_number', 'routing_number')}),
        ('Status & Processing', {'fields': ('status', 'admin_notes', 'processed_by', 'processed_at')}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['withdrawal_number', 'created_at', 'updated_at']
    raw_id_fields = ['loan_application', 'user', 'processed_by']
    
    actions = ['process_withdrawals', 'complete_withdrawals', 'fail_withdrawals']
    
    def amount_display(self, obj):
        return f"${obj.amount:,.2f}"
    amount_display.short_description = 'Amount'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#f59e0b',
            'processing': '#3b82f6',
            'completed': '#10b981',
            'failed': '#ef4444',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html('<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px;">{}</span>', color, obj.get_status_display())
    status_badge.short_description = 'Status'
    
    def process_withdrawals(self, request, queryset):
        queryset.update(status='processing', processed_by=request.user)
        self.message_user(request, f"{queryset.count()} withdrawals marked as processing.")
    process_withdrawals.short_description = "Mark as Processing"
    
    def complete_withdrawals(self, request, queryset):
        queryset.update(status='completed', processed_by=request.user, processed_at=timezone.now())
        self.message_user(request, f"{queryset.count()} withdrawals completed.")
    complete_withdrawals.short_description = "Mark as Completed"
    
    def fail_withdrawals(self, request, queryset):
        queryset.update(status='failed', processed_by=request.user, processed_at=timezone.now())
        self.message_user(request, f"{queryset.count()} withdrawals marked as failed.")
    fail_withdrawals.short_description = "Mark as Failed"


@admin.register(CreditCardDebt)
class CreditCardDebtAdmin(admin.ModelAdmin):
    list_display = ['application_number', 'full_name', 'bank_name', 'credit_limit_display', 'debt_display', 'status_badge', 'reviewed_by', 'created_at']
    list_filter = ['status', 'bank_name', 'created_at']
    search_fields = ['application_number', 'full_name', 'email', 'phone', 'bank_name']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Application Info', {'fields': ('application_number', 'user')}),
        ('Personal Information', {'fields': ('full_name', 'email', 'phone', 'address')}),
        ('Debt Information', {'fields': ('credit_card_limit', 'current_debt', 'bank_name', 'card_type')}),
        ('Status & Review', {'fields': ('status', 'admin_notes', 'reviewed_by', 'reviewed_at')}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['application_number', 'created_at', 'updated_at']
    raw_id_fields = ['user', 'reviewed_by']
    
    actions = ['start_processing', 'complete_clearance', 'reject_applications']
    
    def credit_limit_display(self, obj):
        return f"${obj.credit_card_limit:,.2f}"
    credit_limit_display.short_description = 'Credit Limit'
    
    def debt_display(self, obj):
        return f"${obj.current_debt:,.2f}"
    debt_display.short_description = 'Current Debt'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#f59e0b',
            'under_review': '#3b82f6',
            'in_progress': '#8b5cf6',
            'completed': '#10b981',
            'rejected': '#ef4444',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html('<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px;">{}</span>', color, obj.get_status_display())
    status_badge.short_description = 'Status'
    
    def start_processing(self, request, queryset):
        queryset.update(status='in_progress', reviewed_by=request.user, reviewed_at=timezone.now())
        self.message_user(request, f"{queryset.count()} applications started processing.")
    start_processing.short_description = "Start Processing"
    
    def complete_clearance(self, request, queryset):
        queryset.update(status='completed', reviewed_by=request.user, reviewed_at=timezone.now())
        self.message_user(request, f"{queryset.count()} debt clearances completed.")
    complete_clearance.short_description = "Mark as Completed"
    
    def reject_applications(self, request, queryset):
        queryset.update(status='rejected', reviewed_by=request.user, reviewed_at=timezone.now())
        self.message_user(request, f"{queryset.count()} applications rejected.")
    reject_applications.short_description = "Reject Applications"


@admin.register(TaxRefund)
class TaxRefundAdmin(admin.ModelAdmin):
    list_display = ['application_number', 'full_name', 'filing_type', 'tax_year', 'income_display', 'expected_refund_display', 'status_badge', 'assigned_to', 'created_at']
    list_filter = ['status', 'filing_type', 'tax_year', 'employment_status', 'created_at']
    search_fields = ['application_number', 'full_name', 'email', 'phone', 'business_name']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Application Info', {'fields': ('application_number', 'user')}),
        ('Personal Information', {'fields': ('full_name', 'email', 'phone', 'address', 'ssn_last_four')}),
        ('Filing Information', {'fields': ('filing_type', 'tax_year', 'employment_status')}),
        ('Income Information', {'fields': ('annual_income', 'expected_refund', 'actual_refund')}),
        ('Business Information', {
            'fields': ('business_name', 'business_ein', 'business_revenue'),
            'classes': ('collapse',),
        }),
        ('Documents', {'fields': ('documents',)}),
        ('Status & Assignment', {'fields': ('status', 'admin_notes', 'assigned_to', 'reviewed_at')}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['application_number', 'created_at', 'updated_at']
    raw_id_fields = ['user', 'assigned_to']
    
    actions = ['request_documents', 'start_filing', 'mark_filed', 'approve_refund']
    
    def income_display(self, obj):
        return f"${obj.annual_income:,.2f}"
    income_display.short_description = 'Annual Income'
    
    def expected_refund_display(self, obj):
        if obj.expected_refund:
            return f"${obj.expected_refund:,.2f}"
        return "Not calculated"
    expected_refund_display.short_description = 'Expected Refund'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#f59e0b',
            'documents_required': '#ef4444',
            'in_progress': '#3b82f6',
            'filed': '#8b5cf6',
            'approved': '#10b981',
            'rejected': '#dc2626',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html('<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px;">{}</span>', color, obj.get_status_display())
    status_badge.short_description = 'Status'
    
    def request_documents(self, request, queryset):
        queryset.update(status='documents_required')
        self.message_user(request, f"{queryset.count()} applications marked as documents required.")
    request_documents.short_description = "Request Documents"
    
    def start_filing(self, request, queryset):
        queryset.update(status='in_progress', assigned_to=request.user)
        self.message_user(request, f"{queryset.count()} filings started.")
    start_filing.short_description = "Start Filing"
    
    def mark_filed(self, request, queryset):
        queryset.update(status='filed', reviewed_at=timezone.now())
        self.message_user(request, f"{queryset.count()} returns marked as filed.")
    mark_filed.short_description = "Mark as Filed"
    
    def approve_refund(self, request, queryset):
        queryset.update(status='approved', reviewed_at=timezone.now())
        self.message_user(request, f"{queryset.count()} refunds approved.")
    approve_refund.short_description = "Approve Refund"
