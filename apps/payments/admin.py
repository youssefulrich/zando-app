from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import Payment, Refund, Payout


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'transaction_id',
        'user_display',
        'amount_display',
        'payment_method',
        'status_badge',
        'has_proof',
        'created_at',
        'action_buttons'
    ]
    list_filter = ['status', 'payment_method', 'created_at', 'verified_by']
    search_fields = ['transaction_id', 'user__email', 'user__first_name', 'user__last_name', 'payment_reference']
    readonly_fields = [
        'transaction_id',
        'created_at',
        'updated_at',
        'verified_by',
        'verified_at',
        'proof_preview'
    ]
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('transaction_id', 'user', 'booking', 'amount', 'currency', 'payment_method')
        }),
        ('Preuve de paiement manuel', {
            'fields': ('payment_reference', 'payment_proof', 'proof_preview', 'status')
        }),
        ('Vérification', {
            'fields': ('verified_by', 'verified_at', 'error_message')
        }),
        ('Commission', {
            'fields': ('platform_commission', 'owner_amount'),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at', 'completed_at')
        }),
    )
    
    actions = ['approve_payments', 'reject_payments']
    
    def user_display(self, obj):
        return f"{obj.user.get_full_name()} ({obj.user.email})"
    user_display.short_description = "Client"
    
    def amount_display(self, obj):
        return format_html(
            '<strong style="color: #059669;">{} FCFA</strong>',
            f"{obj.amount:,.0f}"
        )
    amount_display.short_description = "Montant"
    
    def status_badge(self, obj):
        colors = {
            'PENDING': 'gray',
            'processing': 'orange',
            'COMPLETED': 'green',
            'FAILED': 'red',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = "Statut"
    
    def has_proof(self, obj):
        return "✅ Oui" if obj.payment_proof else "❌ Non"

    has_proof.short_description = "Preuve"
    has_proof.boolean = False

    
    def proof_preview(self, obj):
        if obj.payment_proof:
            return format_html(
                '<a href="{}" target="_blank"><img src="{}" width="300" style="border: 2px solid #ddd; border-radius: 8px;"/></a>',
                obj.payment_proof.url,
                obj.payment_proof.url
            )
        return "Aucune preuve uploadée"
    proof_preview.short_description = "Aperçu de la preuve"
    
    def action_buttons(self, obj):
        if obj.status == 'processing':
            return format_html(
                '<a class="button" href="/admin/payments/payment/{}/change/">Vérifier</a>',
                obj.pk
            )
        return "-"
    action_buttons.short_description = "Actions"
    
    def approve_payments(self, request, queryset):
        """Approuver les paiements sélectionnés"""
        count = 0
        for payment in queryset.filter(status='processing'):
            payment.status = 'COMPLETED'
            payment.verified_by = request.user
            payment.verified_at = timezone.now()
            payment.completed_at = timezone.now()
            payment.save()
            
            # Marquer la réservation comme payée
            payment.booking.status = 'paid'
            payment.booking.save()
            count += 1
        
        self.message_user(request, f"✅ {count} paiement(s) approuvé(s)")
    approve_payments.short_description = "✅ Approuver les paiements sélectionnés"
    
    def reject_payments(self, request, queryset):
        """Rejeter les paiements sélectionnés"""
        count = queryset.filter(status='processing').update(
            status='FAILED',
            error_message=f"Rejeté par {request.user.get_full_name()}"
        )
        self.message_user(request, f"❌ {count} paiement(s) rejeté(s)")
    reject_payments.short_description = "❌ Rejeter les paiements sélectionnés"
    
    # Filtre personnalisé pour voir rapidement les paiements en attente
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Afficher d'abord les paiements en attente de vérification
        return qs.order_by('-created_at')


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ['refund_id', 'payment', 'amount', 'reason', 'status', 'created_at']
    list_filter = ['status', 'reason', 'created_at']
    search_fields = ['refund_id', 'payment__transaction_id']


@admin.register(Payout)
class PayoutAdmin(admin.ModelAdmin):
    list_display = ['payout_id', 'owner', 'amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['payout_id', 'owner__email']