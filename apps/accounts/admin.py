from django.contrib import admin

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'user_type', 'is_verified']
    list_filter = ['user_type', 'is_verified', 'is_active']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informations IvoryRent', {
            'fields': ('user_type', 'phone', 'city', 'avatar', 'is_verified')
        }),



        (
        "Informations de paiement",
            {
                "fields": (
                    "wave_number",
                    "orange_money_number",
                    "mtn_money_number",
                    "moov_money_number",
                )
            },
        ),
    )