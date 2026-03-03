from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Event, TicketType, Ticket
from .serializers import EventSerializer, TicketSerializer


# Liste publique
class EventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]


# Détail public
class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]


# Création événement (organisateur)
class EventCreateView(generics.CreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)


# Achat ticket
class BuyTicketView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, ticket_type_id):
        try:
            ticket_type = TicketType.objects.get(id=ticket_type_id)
        except TicketType.DoesNotExist:
            return Response({"error": "Ticket type not found"}, status=404)

        quantity = int(request.data.get("quantity", 1))

        if ticket_type.quantity < quantity:
            return Response({"error": "Not enough tickets"}, status=400)

        ticket_type.quantity -= quantity
        ticket_type.save()

        Ticket.objects.create(
            ticket_type=ticket_type,
            user=request.user,
            quantity=quantity
        )

        return Response({"message": "Ticket purchased successfully"})