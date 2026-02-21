from django.contrib import admin

from django.contrib import admin
from .models import Booking, BookingReview, Favorite


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "booking_number",
        "client",
        "status",
        "start_date",
        "end_date",
        "total_price",
    )
    list_filter = ("status",)
    search_fields = ("booking_number", "client__email")


admin.site.register(BookingReview)
admin.site.register(Favorite)
