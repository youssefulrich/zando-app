from django.contrib import admin
from django.utils.html import format_html
from .models import Event, TicketType, Ticket


class TicketTypeInline(admin.TabularInline):
    model = TicketType
    extra = 1


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "location", "event_date", "image_preview")
    inlines = [TicketTypeInline]

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="80" height="80" style="border-radius:8px;" />',
                obj.image.url
            )
        return "-"
    
    image_preview.short_description = "Preview"