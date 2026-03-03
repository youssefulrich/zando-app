from django.urls import path
from .views import (
    EventListView,
    EventDetailView,
    EventCreateView,
    BuyTicketView
)

urlpatterns = [
    path("", EventListView.as_view()),
    path("<int:pk>/", EventDetailView.as_view()),
    path("create/", EventCreateView.as_view()),
    path("buy/<int:ticket_type_id>/", BuyTicketView.as_view()),
]