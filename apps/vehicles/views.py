# apps/vehicles/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Vehicle, VehicleImage
from .serializers import VehicleSerializer, VehicleImageSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self):
        # ✅ Public pour voir, connexion pour créer/modifier
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        qs = Vehicle.objects.filter(is_active=True)  # ✅ Afficher seulement les actifs par défaut
        
        if self.request.query_params.get('owner') == 'me':
            if self.request.user.is_authenticated:
                return Vehicle.objects.filter(owner=self.request.user)
            return Vehicle.objects.none()
        
        owner_id = self.request.query_params.get('owner_id')
        if owner_id:
            qs = qs.filter(owner_id=owner_id)
        
        return qs
    
    def perform_create(self, serializer):
        # ✅ Vérifier que l'utilisateur peut créer des VÉHICULES
        if not self.request.user.can_create_vehicles():
            raise permissions.PermissionDenied(
                "Vous devez être propriétaire de véhicules pour créer une annonce"
            )
        serializer.save(owner=self.request.user)
    
    def perform_update(self, serializer):
        vehicle = self.get_object()
        if vehicle.owner != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("Permission refusée")
        serializer.save()
    
    def perform_destroy(self, instance):
        if instance.owner != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("Permission refusée")
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def my_stats(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=401)
        
        # ✅ Retourner 0 si l'utilisateur ne peut pas avoir de véhicules
        if not request.user.can_create_vehicles():
            return Response({
                "total_vehicles": 0,
                "available": 0,
                "unavailable": 0,
                "total_bookings": 0,
                "active_bookings": 0,
            })
        
        vehicles = Vehicle.objects.filter(owner=request.user)
        
        from apps.bookings.models import Booking
        vehicle_ct = ContentType.objects.get_for_model(Vehicle)
        my_vehicle_ids = list(vehicles.values_list('id', flat=True))
        
        stats = {
            "total_vehicles": vehicles.count(),
            "available": vehicles.filter(is_active=True).count(),
            "unavailable": vehicles.filter(is_active=False).count(),
            "total_bookings": Booking.objects.filter(
                content_type=vehicle_ct,
                object_id__in=my_vehicle_ids
            ).count(),
            "active_bookings": Booking.objects.filter(
                content_type=vehicle_ct,
                object_id__in=my_vehicle_ids,
                status='confirmed'
            ).count(),
        }
        
        return Response(stats)


class VehicleImageViewSet(viewsets.ModelViewSet):
    queryset = VehicleImage.objects.all()
    serializer_class = VehicleImageSerializer
    permission_classes = [permissions.AllowAny]  # ✅ Images publiques