# apps/accounts/models.py
# VERSION ADAPTÉE À VOTRE CODE EXISTANT

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Modèle utilisateur personnalisé pour Zando"""
    
    # ✅ MODIFIEZ vos choix existants
    USER_TYPE_CHOICES = (
        ('client', 'Client'),
        ('proprietaire_vehicule', 'Propriétaire de véhicules'),      # ✅ NOUVEAU
        ('proprietaire_residence', 'Propriétaire de résidences'),    # ✅ NOUVEAU
        ('proprietaire', 'Propriétaire (véhicules et résidences)'),  # ✅ RENOMMÉ (= both)
        ('admin', 'Administrateur'),
    )
    
    email = models.EmailField('adresse email', unique=True)
    phone = models.CharField('téléphone', max_length=20, blank=True)
    user_type = models.CharField(
        'type utilisateur', 
        max_length=30,  # ✅ Augmenté de 20 à 30 pour les nouveaux types
        choices=USER_TYPE_CHOICES,
        default='client'
    )
    
    # Informations de profil
    avatar = models.ImageField(
        'photo de profil',
        upload_to='avatars/',
        blank=True,
        null=True
    )
    
    # Vérification d'identité
    is_verified = models.BooleanField('compte vérifié', default=False)
    
    # Localisation
    city = models.CharField('ville', max_length=100, blank=True)
    
    # Champs propriétaires
    business_name = models.CharField(
        'Nom de l\'entreprise',
        max_length=200,
        blank=True,
        help_text='Pour les propriétaires professionnels'
    )
    
    bio = models.TextField(
        'Biographie',
        blank=True,
        help_text='Présentation du propriétaire'
    )
    
    verified_owner = models.BooleanField(
        'Propriétaire vérifié',
        default=False,
        help_text='Propriétaire dont l\'identité a été vérifiée'
    )
    # === INFORMATIONS DE PAIEMENT MANUEL ===

    wave_number = models.CharField(
        "Numéro Wave",
        max_length=20,
        blank=True
    )

    orange_money_number = models.CharField(
        "Numéro Orange Money",
        max_length=20,
        blank=True
    )

    mtn_money_number = models.CharField(
        "Numéro MTN Money",
        max_length=20,
        blank=True
    )

    moov_money_number = models.CharField(
        "Numéro Moov Money",
        max_length=20,
        blank=True
    )

        
    created_at = models.DateTimeField('date de création', auto_now_add=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    # ✅ MÉTHODES ADAPTÉES
    def is_owner(self):
        """Vérifie si l'utilisateur peut créer des annonces (n'importe lesquelles)"""
        return self.user_type in [
            'proprietaire_vehicule', 
            'proprietaire_residence', 
            'proprietaire',  # = both
            'admin'
        ]
    
    def can_create_vehicles(self):
        """Vérifie si l'utilisateur peut créer des véhicules"""
        return self.user_type in ['proprietaire_vehicule', 'proprietaire', 'admin']
    
    def can_create_residences(self):
        """Vérifie si l'utilisateur peut créer des résidences"""
        return self.user_type in ['proprietaire_residence', 'proprietaire', 'admin']
    
    def is_client(self):
        """Vérifie si l'utilisateur peut faire des réservations"""
        # Tous peuvent réserver
        return True
    
    def get_total_vehicles(self):
        """Nombre de véhicules du propriétaire"""
        return self.owned_vehicles.count() if self.can_create_vehicles() else 0
    
    def get_total_residences(self):
        """Nombre de résidences du propriétaire"""
        return self.owned_residences.count() if self.can_create_residences() else 0
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    class Meta:
        verbose_name = 'utilisateur'
        verbose_name_plural = 'utilisateurs'


