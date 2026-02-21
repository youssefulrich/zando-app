# apps/payments/serializers.py

from rest_framework import serializers
from .models import Payment, Refund, Payout


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"
        
        read_only_fields = ["id", "created_at", "updated_at"] 


class RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = "__all__"


class PayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout
        fields = "__all__"