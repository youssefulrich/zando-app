from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify


class Vehicle(models.Model):
    """Modèle pour les véhicules à louer"""

    TYPE_CHOICES = (
        ('citadine', 'Citadine'),
        ('berline', 'Berline'),
        ('suv', 'SUV/4x4'),
        ('minibus', 'Minibus'),
        ('pickup', 'Pick-up'),
        ('moto', 'Moto'),
    )

    TRANSMISSION_CHOICES = (
        ('manuelle', 'Manuelle'),
        ('automatique', 'Automatique'),
    )

    FUEL_CHOICES = (
        ('essence', 'Essence'),
        ('diesel', 'Diesel'),
        ('hybride', 'Hybride'),
        ('electrique', 'Électrique'),
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

    # ======================
    # INFORMATIONS DE BASE
    # ======================

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='vehicles'
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    brand = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    transmission = models.CharField(max_length=20, choices=TRANSMISSION_CHOICES)
    fuel_type = models.CharField(max_length=20, choices=FUEL_CHOICES)

    seats = models.PositiveIntegerField(default=5)
    doors = models.PositiveIntegerField(default=4)
    color = models.CharField(max_length=50)
    plate_number = models.CharField(max_length=20, unique=True)

    city = models.CharField(max_length=50, choices=CITY_CHOICES)
    pickup_location = models.TextField()

    # ======================
    # TARIFICATION
    # ======================

    price_per_day = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        validators=[MinValueValidator(0)]
    )

    platform_fee_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=10
    )

    platform_fee_amount = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        default=0
    )

    final_price_per_day = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        default=0
    )

    deposit = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        default=0
    )

    # ======================
    # OPTIONS
    # ======================

    driver_available = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)

    slug = models.SlugField(unique=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ======================
    # SAVE METHOD
    # ======================

    def save(self, *args, **kwargs):

        # Calcul commission
        self.platform_fee_amount = (
            self.price_per_day * self.platform_fee_percentage
        ) / 100

        # Prix final affiché au client
        self.final_price_per_day = (
            self.price_per_day + self.platform_fee_amount
        )

        # Génération slug automatique
        if not self.slug:
            self.slug = slugify(
                f"{self.brand}-{self.model}-{self.year}-{self.plate_number}"
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"

class VehicleImage(models.Model):

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name='images'
    )

    image = models.ImageField(upload_to='vehicles/')
    caption = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-is_primary']

    def save(self, *args, **kwargs):
        if self.is_primary:
            VehicleImage.objects.filter(
                vehicle=self.vehicle,
                is_primary=True
            ).exclude(id=self.id).update(is_primary=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Image de {self.vehicle.brand} {self.vehicle.model}"
