from django.db import models

from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Residence(models.Model):
    """Modèle pour les résidences à louer"""
    
    TYPE_CHOICES = (
        ('appartement', 'Appartement'),
        ('villa', 'Villa'),
        ('maison', 'Maison'),
        ('studio', 'Studio'),
        ('duplex', 'Duplex'),
    )
    
    CITY_CHOICES = (
        ('abidjan', 'Abidjan'),
        ('yamoussoukro', 'Yamoussoukro'),
        ('bouake', 'Bouaké'),
        ('san_pedro', 'San-Pédro'),
        ('korhogo', 'Korhogo'),
        ('daloa', 'Daloa'),
        ('man', 'Man'),
    )
    
    # Informations de base
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='residences',
        verbose_name='propriétaire'
    )
    title = models.CharField('titre', max_length=200)
    description = models.TextField('description')
    type = models.CharField('type', max_length=20, choices=TYPE_CHOICES)
    
    # Localisation
    city = models.CharField('ville', max_length=50, choices=CITY_CHOICES)
    neighborhood = models.CharField('quartier', max_length=100)
    address = models.TextField('adresse complète')
    latitude = models.DecimalField(
        'latitude',
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    longitude = models.DecimalField(
        'longitude',
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    
    # Caractéristiques
    bedrooms = models.PositiveIntegerField('nombre de chambres', default=1)
    bathrooms = models.PositiveIntegerField('nombre de salles de bain', default=1)
    capacity = models.PositiveIntegerField('capacité (personnes)', default=2)
    surface_area = models.PositiveIntegerField('superficie (m²)', null=True, blank=True)
    
    # Tarification
    price_per_night = models.DecimalField(
        'prix par nuit (FCFA)',
        max_digits=10,
        decimal_places=0,
        validators=[MinValueValidator(0)]
    )
    cleaning_fee = models.DecimalField(
        'frais de ménage (FCFA)',
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # Équipements
    has_wifi = models.BooleanField('WiFi', default=False)
    has_ac = models.BooleanField('Climatisation', default=False)
    has_tv = models.BooleanField('Télévision', default=False)
    has_kitchen = models.BooleanField('Cuisine équipée', default=False)
    has_parking = models.BooleanField('Parking', default=False)
    has_pool = models.BooleanField('Piscine', default=False)
    has_security = models.BooleanField('Gardiennage/Sécurité', default=False)
    has_generator = models.BooleanField('Groupe électrogène', default=False)
    
    # Règles
    allow_pets = models.BooleanField('Animaux autorisés', default=False)
    allow_smoking = models.BooleanField('Fumeur autorisé', default=False)
    min_nights = models.PositiveIntegerField('nombre minimum de nuits', default=1)
    
    # Statut
    is_active = models.BooleanField('active', default=True)
    is_verified = models.BooleanField('vérifiée', default=False)
    
    # Statistiques
    views_count = models.PositiveIntegerField('nombre de vues', default=0)
    bookings_count = models.PositiveIntegerField('nombre de réservations', default=0)
    rating_average = models.DecimalField(
        'note moyenne',
        max_digits=3,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    reviews_count = models.PositiveIntegerField('nombre d\'avis', default=0)
    
    # Dates
    created_at = models.DateTimeField('date de création', auto_now_add=True)
    updated_at = models.DateTimeField('dernière modification', auto_now=True)
    
    class Meta:
        verbose_name = 'résidence'
        verbose_name_plural = 'résidences'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.get_city_display()}"
    
    def get_total_price(self, nights):
        """Calcule le prix total pour un nombre de nuits donné"""
        return (self.price_per_night * nights) + self.cleaning_fee


class ResidenceImage(models.Model):
    """Images des résidences"""
    
    residence = models.ForeignKey(
        Residence,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='résidence'
    )
    image = models.ImageField('image', upload_to='residences/')
    caption = models.CharField('légende', max_length=200, blank=True)
    is_primary = models.BooleanField('image principale', default=False)
    order = models.PositiveIntegerField('ordre', default=0)
    
    created_at = models.DateTimeField('date d\'ajout', auto_now_add=True)
    
    platform_fee_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=10
    )

    class Meta:
        verbose_name = 'image de résidence'
        verbose_name_plural = 'images de résidence'
        ordering = ['order', '-is_primary']
    
    def __str__(self):
        return f"Image de {self.residence.title}"
    
    def save(self, *args, **kwargs):
        # Si c'est marqué comme image principale, retirer le flag des autres
        if self.is_primary:
            ResidenceImage.objects.filter(
                vehicle=self.residence,
                is_primary=True
            ).exclude(id=self.id).update(is_primary=False)



class Availability(models.Model):
    """Gestion de la disponibilité des résidences"""
    
    residence = models.ForeignKey(
        Residence,
        on_delete=models.CASCADE,
        related_name='availabilities',
        verbose_name='résidence'
    )
    date = models.DateField('date')
    is_available = models.BooleanField('disponible', default=True)
    custom_price = models.DecimalField(
        'prix personnalisé (FCFA)',
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Laisser vide pour utiliser le prix par défaut'
    )
    
    class Meta:
        verbose_name = 'disponibilité'
        verbose_name_plural = 'disponibilités'
        unique_together = ['residence', 'date']
        ordering = ['date']
    
    def __str__(self):
        status = "Disponible" if self.is_available else "Indisponible"
        return f"{self.residence.title} - {self.date} ({status})"
    
def get_platform_fee(self, amount):
    return (amount * self.platform_fee_percentage) / 100

