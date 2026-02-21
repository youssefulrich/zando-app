from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.utils import timezone
import uuid


class Booking(models.Model):
    """Modèle pour les réservations (résidences et véhicules)"""
    
    STATUS_CHOICES = (
        ('pending', 'En attente'),
        ('pending_payment_validation', 'En attente de validation paiement'),
        ('confirmed', 'Confirmée'),
        ('paid', 'Payée'),
        ('ongoing', 'En cours'),
        ('completed', 'Terminée'),
        ('cancelled', 'Annulée'),
        ('rejected', 'Rejetée'),
        ('refunded', 'Remboursée'),
    )
    
    # Identifiant unique
    booking_number = models.CharField('numéro de réservation', max_length=20, unique=True, editable=False)
    
    # Utilisateur
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings',
        verbose_name='client'
    )
    
    # Bien loué (résidence ou véhicule) - Utilisation de Generic Foreign Key
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Dates
    start_date = models.DateField('date de début')
    end_date = models.DateField('date de fin')
    
    # Nombre de jours/nuits
    duration = models.PositiveIntegerField('durée (jours)', editable=False)
    
    # Options pour véhicules
    with_driver = models.BooleanField('avec chauffeur', default=False)
    
    # Informations de contact
    phone = models.CharField('téléphone', max_length=20, blank=True)
    email = models.EmailField('email', blank=True)
    special_requests = models.TextField('demandes spéciales', blank=True)
    
    # Prix
    subtotal = models.DecimalField(
        'sous-total (FCFA)',
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    fees = models.DecimalField(
        'frais de service (FCFA)',
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    total_price = models.DecimalField(
        'prix total (FCFA)',
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    transaction_number = models.CharField(
        "numéro de transaction",
        max_length=100,
        blank=True,
        null=True
    )

    
    # Statut
    status = models.CharField('statut', max_length=40, choices=STATUS_CHOICES, default='pending')
    
    # Dates importantes
    created_at = models.DateTimeField('date de création', auto_now_add=True)
    updated_at = models.DateTimeField('dernière modification', auto_now=True)
    confirmed_at = models.DateTimeField('date de confirmation', null=True, blank=True)
    cancelled_at = models.DateTimeField('date d\'annulation', null=True, blank=True)
    cancellation_reason = models.TextField('raison d\'annulation', blank=True)
    rejected_at = models.DateTimeField('date de rejet', null=True, blank=True)
    rejection_reason = models.TextField('raison de rejet', blank=True)
    
    class Meta:
        verbose_name = 'réservation'
        verbose_name_plural = 'réservations'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'start_date']),
            models.Index(fields=['content_type', 'object_id', 'status']),
        ]
    
    def __str__(self):
        return f"Réservation {self.booking_number} - {self.client.get_full_name()}"
    
    def save(self, *args, **kwargs):
        if not self.booking_number:
            self.booking_number = f"ZAN-{uuid.uuid4().hex[:8].upper()}"

        if self.start_date and self.end_date:
            self.duration = (self.end_date - self.start_date).days or 1

        # Calcul sécurisé backend
        self.total_price = self.subtotal + self.fees

        super().save(*args, **kwargs)

    def clean(self):
        if self.start_date and self.end_date:
            if self.start_date >= self.end_date:
                raise ValidationError("La date de fin doit être après la date de début")

            if self.start_date < timezone.now().date():
                raise ValidationError("Impossible de réserver dans le passé")
    
    def get_booking_type(self):
        """Retourne le type de réservation (résidence ou véhicule)"""
        return self.content_type.model
    
    # ✅ VÉRIFICATION DE DISPONIBILITÉ
    @classmethod
    def check_availability(cls, obj, start_date, end_date, exclude_booking_id=None):
        """
        Vérifie si un objet est disponible pour une période donnée.
        
        Args:
            obj: L'objet (Vehicle ou Residence) à vérifier
            start_date: Date de début
            end_date: Date de fin
            exclude_booking_id: ID d'une réservation à exclure (pour les modifications)
        
        Returns:
            bool: True si disponible, False sinon
        """
        content_type = ContentType.objects.get_for_model(obj.__class__)
        
        query = cls.objects.filter(
            content_type=content_type,
            object_id=obj.id,
            status__in=['pending', 'confirmed', 'paid', 'ongoing'],
        )
        
        if exclude_booking_id:
            query = query.exclude(id=exclude_booking_id)
        
        # Vérifier les chevauchements
        overlapping = query.filter(
            start_date__lt=end_date,
            end_date__gt=start_date
        ).exists()
        
        return not overlapping

    @classmethod
    def get_unavailable_dates(cls, obj, days_ahead=90):
        """
        Retourne les dates indisponibles pour un objet.
        Utile pour afficher dans un calendrier.
        """
        from datetime import timedelta
        
        content_type = ContentType.objects.get_for_model(obj.__class__)
        end_range = timezone.now().date() + timedelta(days=days_ahead)
        
        bookings = cls.objects.filter(
            content_type=content_type,
            object_id=obj.id,
            status__in=['pending', 'confirmed', 'paid', 'ongoing'],
            start_date__lte=end_range
        ).values('start_date', 'end_date')
        
        unavailable_dates = []
        for booking in bookings:
            current_date = booking['start_date']
            while current_date < booking['end_date']:
                unavailable_dates.append(current_date.isoformat())
                current_date += timedelta(days=1)
        
        return unavailable_dates
    
    def can_be_cancelled(self):
        """Vérifie si la réservation peut être annulée"""
        if self.status in ['cancelled', 'completed', 'refunded', 'rejected']:
            return False
        
        # Impossible d'annuler si la location a déjà commencé
        if self.start_date <= timezone.now().date():
            return False
        
        return True

    def can_be_confirmed(self):
        """Vérifie si la réservation peut être confirmée par le propriétaire"""
        return self.status == 'pending'

    def can_be_rejected(self):
        """Vérifie si la réservation peut être rejetée par le propriétaire"""
        return self.status == 'pending'

    def calculate_refund_amount(self):
        """Calcule le montant du remboursement selon la politique d'annulation"""
        if self.status not in ['pending', 'confirmed', 'paid']:
            return 0
        
        days_until_start = (self.start_date - timezone.now().date()).days
        
        if days_until_start > 30:
            return self.total_price  # Remboursement complet
        elif days_until_start > 14:
            return self.total_price * 0.75  # 75%
        elif days_until_start > 7:
            return self.total_price * 0.5  # 50%
        else:
            return 0  # Pas de remboursement


class BookingReview(models.Model):
    """Avis sur les réservations"""
    
    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name='review',
        verbose_name='réservation'
    )
    rating = models.IntegerField(
        'note',
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField('commentaire')
    
    # Critères détaillés
    cleanliness_rating = models.IntegerField(
        'propreté',
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True,
        blank=True
    )
    communication_rating = models.IntegerField(
        'communication',
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True,
        blank=True
    )
    value_rating = models.IntegerField(
        'rapport qualité/prix',
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True,
        blank=True
    )
    
    # Photos de l'avis (optionnel)
    photos = models.JSONField('photos', default=list, blank=True)
    
    # Réponse du propriétaire
    owner_response = models.TextField('réponse du propriétaire', blank=True)
    owner_response_date = models.DateTimeField('date de réponse', null=True, blank=True)
    
    created_at = models.DateTimeField('date de création', auto_now_add=True)
    updated_at = models.DateTimeField('dernière modification', auto_now=True)
    
    class Meta:
        verbose_name = 'avis de réservation'
        verbose_name_plural = 'avis de réservations'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Avis de {self.booking.client.get_full_name()} - {self.rating}★"


class Favorite(models.Model):
    """Liste des favoris des utilisateurs"""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favorites',
        verbose_name='utilisateur'
    )
    
    # Bien favori (résidence ou véhicule)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    created_at = models.DateTimeField('date d\'ajout', auto_now_add=True)
    
    class Meta:
        verbose_name = 'favori'
        verbose_name_plural = 'favoris'
        unique_together = ['user', 'content_type', 'object_id']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Favori de {self.user.get_full_name()}"