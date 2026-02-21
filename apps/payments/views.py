from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Payment, Refund, Payout
from .serializers import PaymentSerializer, RefundSerializer, PayoutSerializer
from apps.bookings.models import Booking


# ✅ MODE PAIEMENT MANUEL ACTIVÉ
MANUAL_PAYMENT_MODE = True  # Passez à False pour utiliser PayDunya


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Les utilisateurs voient leurs paiements
        # Les admins voient tous les paiements
        if self.request.user.is_staff:
            return Payment.objects.all()
        return Payment.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Créer un paiement (mode manuel ou PayDunya)"""
        print("=" * 50)
        print("📦 CRÉATION PAIEMENT")
        print("👤 USER:", request.user)
        print("=" * 50)

        booking_id = request.data.get("booking")
        
        if not booking_id:
            return Response({"error": "Booking ID requis"}, status=400)

        try:
            booking_id = int(booking_id)
        except (ValueError, TypeError):
            return Response({"error": "Booking ID invalide"}, status=400)

        booking = get_object_or_404(
            Booking,
            id=booking_id,
            client=request.user
        )
        
        print(f"✅ Booking trouvé: {booking.booking_number}")

        # Créer le paiement
        payment = Payment.objects.create(
            user=request.user,
            booking=booking,
            amount=booking.total_price,
            payment_method=request.data.get("payment_method", "mobile_money"),
            status="PENDING"  # En attente de preuve
        )
        
        print(f"💳 Payment créé: {payment.transaction_id}")

        # Mode manuel activé
        if MANUAL_PAYMENT_MODE:
            return Response({
                "success": True,
                "payment_id": payment.id,
                "transaction_id": payment.transaction_id,
                "amount": float(payment.amount),
                "status": payment.status,
                "payment_method": payment.payment_method,
                "message": "Paiement créé. Veuillez soumettre votre preuve de paiement.",
                "manual_mode": True
            })
        
        # Sinon, utiliser PayDunya (votre code actuel)
        # ... votre code PayDunya ...

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_proof(self, request, pk=None):
        """
        Upload la preuve de paiement
        POST /api/payments/{id}/upload_proof/
        Body: payment_proof (file), payment_reference (string)
        """
        payment = self.get_object()
        
        # Vérifier que le paiement appartient au user
        if payment.user != request.user:
            return Response(
                {"error": "Permission refusée"},
                status=403
            )
        
        if payment.status == "COMPLETED":
            return Response(
                {"error": "Ce paiement est déjà complété"},
                status=400
            )
        
        proof = request.FILES.get('payment_proof')
        reference = request.data.get('payment_reference', '')
        
        if not proof:
            return Response(
                {"error": "Aucune image fournie"},
                status=400
            )
        
        # Sauvegarder la preuve
        payment.payment_proof = proof
        payment.payment_reference = reference
        payment.status = "processing"  # En cours de vérification
        payment.save()
        
        print(f"📸 Preuve uploadée pour {payment.transaction_id}")
        print(f"📋 Référence: {reference}")
        
        return Response({
            "success": True,
            "message": "Preuve de paiement envoyée. En attente de vérification par l'administrateur.",
            "payment": PaymentSerializer(payment).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def verify(self, request, pk=None):
        """
        Vérifier un paiement (admin/staff uniquement)
        POST /api/payments/{id}/verify/
        Body: action ('approve' ou 'reject'), reason (si reject)
        """
        payment = self.get_object()
        action_type = request.data.get('action')
        
        if action_type == 'approve':
            payment.status = "COMPLETED"
            payment.verified_by = request.user
            payment.verified_at = timezone.now()
            payment.completed_at = timezone.now()
            payment.save()
            
            # Marquer la réservation comme payée
            payment.booking.status = "paid"
            payment.booking.save()
            
            print(f"✅ Paiement {payment.transaction_id} approuvé par {request.user}")
            
            return Response({
                "success": True,
                "message": "Paiement approuvé",
                "payment": PaymentSerializer(payment).data
            })
        
        elif action_type == 'reject':
            reason = request.data.get('reason', 'Preuve de paiement invalide')
            payment.status = "FAILED"
            payment.error_message = f"Rejeté par {request.user.get_full_name()}: {reason}"
            payment.save()
            
            print(f"❌ Paiement {payment.transaction_id} rejeté: {reason}")
            
            return Response({
                "success": True,
                "message": "Paiement rejeté",
                "payment": PaymentSerializer(payment).data
            })
        
        return Response({"error": "Action invalide. Utilisez 'approve' ou 'reject'"}, status=400)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def pending(self, request):
        """Liste des paiements en attente de vérification"""
        pending_payments = Payment.objects.filter(status='processing')
        serializer = PaymentSerializer(pending_payments, many=True)
        return Response({
            "count": pending_payments.count(),
            "payments": serializer.data
        })


class RefundViewSet(viewsets.ModelViewSet):
    queryset = Refund.objects.all()
    serializer_class = RefundSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Refund.objects.filter(payment__user=self.request.user)


class PayoutViewSet(viewsets.ModelViewSet):
    queryset = Payout.objects.all()
    serializer_class = PayoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payout.objects.filter(owner=self.request.user)