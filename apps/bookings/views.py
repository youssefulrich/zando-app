# apps/bookings/views.py
# REMPLACEZ TOUT LE FICHIER PAR CE CODE

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum
from django.contrib.contenttypes.models import ContentType
from django.db import models as django_models
from decimal import Decimal

from .models import Booking, BookingReview, Favorite
from .serializers import BookingSerializer, BookingReviewSerializer, FavoriteSerializer


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(client=self.request.user)

    def get_serializer_context(self):
        return {"request": self.request}

    http_method_names = ["get", "post", "patch", "delete"]

    # ===== VOS MÉTHODES EXISTANTES =====
    
    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()

        if not booking.can_be_cancelled():
            return Response(
                {"error": "Impossible d'annuler cette réservation"},
                status=status.HTTP_400_BAD_REQUEST
            )

        refund_amount = booking.calculate_refund_amount()

        booking.status = "cancelled"
        booking.cancelled_at = timezone.now()
        booking.cancellation_reason = request.data.get("reason", "Annulation par le client")
        booking.save()

        return Response({
            "message": "Réservation annulée avec succès",
            "refund_amount": float(refund_amount),
            "booking": BookingSerializer(booking).data
        })

    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        booking = self.get_object()

        if not booking.can_be_confirmed():
            return Response(
                {"error": "Cette réservation ne peut pas être confirmée"},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "confirmed"
        booking.confirmed_at = timezone.now()
        booking.save()

        return Response({
            "message": "Réservation confirmée",
            "booking": BookingSerializer(booking).data
        })

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        booking = self.get_object()

        if not booking.can_be_rejected():
            return Response(
                {"error": "Cette réservation ne peut pas être rejetée"},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "rejected"
        booking.rejected_at = timezone.now()
        booking.rejection_reason = request.data.get("reason", "Rejeté par le propriétaire")
        booking.save()

        return Response({
            "message": "Réservation rejetée",
            "booking": BookingSerializer(booking).data
        })
    
    # ===== NOUVELLES MÉTHODES POUR L'ESPACE PROPRIÉTAIRE =====
    
    @action(detail=False, methods=['get'])
    def received(self, request):
        """
        Réservations REÇUES par le propriétaire
        GET /api/bookings/received/
        
        ✅ CORRIGÉ pour GenericForeignKey
        """
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Import des modèles
        from apps.vehicles.models import Vehicle
        from apps.residences.models import Residence
        
        # Récupérer les ContentTypes
        vehicle_ct = ContentType.objects.get_for_model(Vehicle)
        residence_ct = ContentType.objects.get_for_model(Residence)
        
        # IDs de mes véhicules et résidences
        my_vehicle_ids = list(Vehicle.objects.filter(owner=request.user).values_list('id', flat=True))
        my_residence_ids = list(Residence.objects.filter(owner=request.user).values_list('id', flat=True))
        
        # Réservations pour MES véhicules ou MES résidences
        bookings = Booking.objects.filter(
            django_models.Q(
                content_type=vehicle_ct,
                object_id__in=my_vehicle_ids
            ) | django_models.Q(
                content_type=residence_ct,
                object_id__in=my_residence_ids
            )
        ).select_related('client', 'content_type').prefetch_related('content_object').order_by('-created_at')
        
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """
        Accepter une réservation (propriétaire)
        POST /api/bookings/{id}/accept/
        """
        booking = self.get_object()
        
        # Vérifier que c'est bien le propriétaire
        if hasattr(booking.content_object, 'owner'):
            is_owner = booking.content_object.owner == request.user
        else:
            is_owner = False
        
        if not is_owner and not request.user.is_staff:
            return Response(
                {"error": "Vous n'êtes pas le propriétaire"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if booking.status != 'pending':
            return Response(
                {"error": "Cette réservation ne peut plus être acceptée"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.status = 'confirmed'
        booking.confirmed_at = timezone.now()
        booking.save()
        
        return Response({
            "success": True,
            "message": "Réservation acceptée",
            "booking": BookingSerializer(booking).data
        })
    
    @action(detail=True, methods=['post'])
    def owner_reject(self, request, pk=None):
        """
        Refuser une réservation (propriétaire)
        POST /api/bookings/{id}/owner_reject/
        """
        booking = self.get_object()
        
        # Vérifier que c'est bien le propriétaire
        if hasattr(booking.content_object, 'owner'):
            is_owner = booking.content_object.owner == request.user
        else:
            is_owner = False
        
        if not is_owner and not request.user.is_staff:
            return Response(
                {"error": "Permission refusée"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if booking.status != 'pending':
            return Response(
                {"error": "Cette réservation ne peut plus être refusée"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reason = request.data.get('reason', 'Indisponible')
        
        booking.status = 'rejected'
        booking.rejected_at = timezone.now()
        booking.rejection_reason = reason
        booking.save()
        
        return Response({
            "success": True,
            "message": "Réservation refusée",
            "booking": BookingSerializer(booking).data
        })
    
    @action(detail=False, methods=['get'])
    def owner_stats(self, request):
        """
        Statistiques des réservations pour le propriétaire
        GET /api/bookings/owner_stats/
        
        ✅ CORRIGÉ pour GenericForeignKey
        """
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        from apps.vehicles.models import Vehicle
        from apps.residences.models import Residence
        
        # ContentTypes
        vehicle_ct = ContentType.objects.get_for_model(Vehicle)
        residence_ct = ContentType.objects.get_for_model(Residence)
        
        # IDs de mes biens
        my_vehicle_ids = list(Vehicle.objects.filter(owner=request.user).values_list('id', flat=True))
        my_residence_ids = list(Residence.objects.filter(owner=request.user).values_list('id', flat=True))
        
        # Toutes mes réservations
        bookings = Booking.objects.filter(
            django_models.Q(
                content_type=vehicle_ct,
                object_id__in=my_vehicle_ids
            ) | django_models.Q(
                content_type=residence_ct,
                object_id__in=my_residence_ids
            )
        )
        
        stats = {
            "total_bookings": bookings.count(),
            "pending": bookings.filter(status='pending').count(),
            "confirmed": bookings.filter(status='confirmed').count(),
            "completed": bookings.filter(status='completed').count(),
            "cancelled": bookings.filter(status='cancelled').count(),
            "rejected": bookings.filter(status='rejected').count(),
            "total_revenue": float(bookings.filter(
                status__in=['confirmed', 'completed']
            ).aggregate(
                total=Sum('total_price')
            )['total'] or Decimal('0')),
        }
        
        return Response(stats)


class BookingReviewViewSet(viewsets.ModelViewSet):
    serializer_class = BookingReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BookingReview.objects.filter(
            booking__client=self.request.user
        )


class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        return {"request": self.request}