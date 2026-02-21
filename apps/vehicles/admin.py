from django.contrib import admin

from django.contrib import admin
from .models import Vehicle, VehicleImage


class VehicleImageInline(admin.TabularInline):
    model = VehicleImage
    extra = 1


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = (
        "brand",
        "model",
        "year",
        "city",
        "price_per_day",
        "is_active",
    )
    list_filter = ("city", "type", "is_active")
    search_fields = ("brand", "model", "plate_number")
    inlines = [VehicleImageInline]
