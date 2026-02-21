from django.contrib import admin

from django.contrib import admin
from .models import Residence, ResidenceImage, Availability


class ResidenceImageInline(admin.TabularInline):
    model = ResidenceImage
    extra = 1


@admin.register(Residence)
class ResidenceAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "city",
        "price_per_night",
        "is_active",
        "is_verified",
        "created_at",
    )
    list_filter = ("city", "is_active", "is_verified")
    search_fields = ("title", "neighborhood")
    inlines = [ResidenceImageInline]


admin.site.register(Availability)
