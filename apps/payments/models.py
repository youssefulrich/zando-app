from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
import uuid


class Payment(models.Model):
    """Modèle pour les paiements"""
    
    METHOD_CHOICES = (
        ('mobile_money', 'Mobile Money'),
        ('orange_money', 'Orange Money'),
        ('mtn_money', 'MTN Money'),
        ('moov_money', 'Moov Money'),
        ('wave', 'Wave'),
        ('card', 'Carte bancaire'),
        ('cash', 'Espèces'),
        ('bank_transfer', 'Virement bancaire'),
    )
    
    STATUS_CHOICES = (
        ('PENDING', 'En attente'),
        ('processing', 'En cours'),
        ('COMPLETED', 'Complété'),
        ('FAILED', 'Échoué'),
        ('PAID', 'Payé'),
        ('refunded', 'Remboursé'),
        ('cancelled', 'Annulé'),
    )
    
    # Identifiants
    transaction_id = models.CharField(
        'ID de transaction',
        max_length=100,
        unique=True,
        editable=False
    )
    external_id = models.CharField(  # ✅ AJOUTÉ
        'ID PayDunya',
        max_length=200,
        blank=True,
        help_text='Token PayDunya'
    )
    external_transaction_id = models.CharField(
        'ID transaction externe',
        max_length=200,
        blank=True,
        help_text='ID fourni par le prestataire de paiement'
    )
    
    # URLs PayDunya
    checkout_url = models.URLField(  # ✅ AJOUTÉ
        'URL de paiement',
        max_length=500,
        blank=True
    )
    
    # Réservation associée
    booking = models.ForeignKey(
        'bookings.Booking',
        on_delete=models.CASCADE,
        related_name='payments',
        verbose_name='réservation'
    )
    
    # Utilisateur
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payments',
        verbose_name='utilisateur'
    )
    
    # Montant
    amount = models.DecimalField(
        'montant (FCFA)',
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField('devise', max_length=3, default='XOF')
    
    phone_number = models.CharField('numéro de téléphone', max_length=20, blank=True)
    card_last4 = models.CharField('4 derniers chiffres carte', max_length=4, blank=True)

    # Commission plateforme
    platform_commission = models.DecimalField(
        'commission plateforme (FCFA)',
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    owner_amount = models.DecimalField(
        'montant propriétaire (FCFA)',
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # Méthode et statut
    payment_method = models.CharField('méthode de paiement', max_length=30, choices=METHOD_CHOICES, default='mobile_money')
    status = models.CharField('statut', max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    # Informations de paiement
    phone_number = models.CharField('numéro de téléphone', max_length=20, blank=True)
    card_last4 = models.CharField('4 derniers chiffres carte', max_length=4, blank=True)
    
    # Détails et metadata
    description = models.TextField('description', blank=True)
    metadata = models.JSONField('métadonnées', default=dict, blank=True)
    
    # Messages d'erreur
    error_message = models.TextField('message d\'erreur', blank=True)
    
    # Dates
    created_at = models.DateTimeField('date de création', auto_now_add=True)
    updated_at = models.DateTimeField('dernière modification', auto_now=True)
    completed_at = models.DateTimeField('date de complétion', null=True, blank=True)

     # ✅ PAIEMENT MANUEL - Preuve de paiement
    payment_proof = models.ImageField(
        'Preuve de paiement',
        upload_to='payment_proofs/',
        null=True,
        blank=True,
        help_text='Capture d\'écran du transfert'
    )
    
    payment_reference = models.CharField(
        'Référence de paiement',
        max_length=100,
        blank=True,
        help_text='Numéro de transaction fourni par le client'
    )
    
    # ✅ PAIEMENT MANUEL - Vérification admin
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_payments',
        verbose_name='Vérifié par'
    )
    
    verified_at = models.DateTimeField(
        'Date de vérification',
        null=True,
        blank=True
    )
    
    class Meta:
        verbose_name = 'paiement'
        verbose_name_plural = 'paiements'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Paiement {self.transaction_id} - {self.amount} FCFA ({self.get_status_display()})"
    
    def save(self, *args, **kwargs):
        if not self.transaction_id:
            self.transaction_id = f"PAY-{uuid.uuid4().hex[:12].upper()}"
        
        if not self.owner_amount and self.amount:
            commission_rate = getattr(settings, 'PLATFORM_COMMISSION_RATE', 0.10)
            self.platform_commission = float(self.amount) * commission_rate
            self.owner_amount = float(self.amount) - self.platform_commission
        
        super().save(*args, **kwargs)
    
    def mark_as_completed(self):
        from django.utils import timezone
        self.status = 'COMPLETED'
        self.completed_at = timezone.now()
        self.save()
        
        if self.booking.status == 'pending':
            self.booking.status = 'confirmed'
            self.booking.confirmed_at = timezone.now()
            self.booking.save()
    
    def mark_as_failed(self, error_message=''):
        self.status = 'FAILED'
        self.error_message = error_message
        self.save()


# Gardez Refund et Payout inchangés...
class Refund(models.Model):
    """Modèle pour les remboursements"""
    
    STATUS_CHOICES = (
        ('pending', 'En attente'),
        ('processing', 'En cours'),
        ('completed', 'Complété'),
        ('failed', 'Échoué'),
    )
    
    REASON_CHOICES = (
        ('cancellation', 'Annulation de réservation'),
        ('error', 'Erreur de paiement'),
        ('duplicate', 'Paiement en double'),
        ('other', 'Autre'),
    )
    
    refund_id = models.CharField('ID de remboursement', max_length=100, unique=True, editable=False)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='refunds', verbose_name='paiement')
    amount = models.DecimalField('montant remboursé (FCFA)', max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    reason = models.CharField('raison', max_length=20, choices=REASON_CHOICES)
    reason_details = models.TextField('détails', blank=True)
    status = models.CharField('statut', max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField('date de création', auto_now_add=True)
    completed_at = models.DateTimeField('date de complétion', null=True, blank=True)
    
    class Meta:
        verbose_name = 'remboursement'
        verbose_name_plural = 'remboursements'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Remboursement {self.refund_id} - {self.amount} FCFA"
    
    def save(self, *args, **kwargs):
        if not self.refund_id:
            self.refund_id = f"REF-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)


class Payout(models.Model):
    """Modèle pour les versements aux propriétaires"""
    
    STATUS_CHOICES = (
        ('pending', 'En attente'),
        ('processing', 'En cours'),
        ('completed', 'Complété'),
        ('failed', 'Échoué'),
    )
    
    payout_id = models.CharField('ID de versement', max_length=100, unique=True, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payouts', verbose_name='propriétaire')
    amount = models.DecimalField('montant (FCFA)', max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    payments = models.ManyToManyField(Payment, related_name='payouts', verbose_name='paiements inclus')
    payment_method = models.CharField('méthode', max_length=50)
    account_details = models.TextField('détails du compte')
    status = models.CharField('statut', max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField('date de création', auto_now_add=True)
    completed_at = models.DateTimeField('date de complétion', null=True, blank=True)
    
    class Meta:
        verbose_name = 'versement'
        verbose_name_plural = 'versements'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Versement {self.payout_id} - {self.owner.get_full_name()} - {self.amount} FCFA"
    
    def save(self, *args, **kwargs):
        if not self.payout_id:
            self.payout_id = f"OUT-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)