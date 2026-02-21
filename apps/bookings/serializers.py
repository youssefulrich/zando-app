from rest_framework import serializers
from decimal import Decimal
from django.contrib.contenttypes.models import ContentType
from .models import Booking, BookingReview, Favorite
from apps.vehicles.models import Vehicle
from apps.residences.models import Residence


class BookingSerializer(serializers.ModelSerializer):

    # ===== Champs affichage =====
    booking_number = serializers.ReadOnlyField()
    duration = serializers.ReadOnlyField()
    subtotal = serializers.ReadOnlyField()
    fees = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()
    status = serializers.CharField(required=False)
    transaction_number = serializers.CharField(required=False)

    # ✅ AJOUT ICI (IMPORTANT)
    content_type_model = serializers.SerializerMethodField(read_only=True)

    # ===== Champs création =====
    vehicle = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(),
        required=False,
        write_only=True
    )

    residence = serializers.PrimaryKeyRelatedField(
        queryset=Residence.objects.all(),
        required=False,
        write_only=True
    )

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_number",

            # DB
            "content_type",
            "object_id",

            # affichage custom
            "content_type_model",

            # création
            "vehicle",
            "residence",

            "start_date",
            "end_date",
            "duration",
            "subtotal",
            "fees",
            "total_price",

            "status",
            "transaction_number",

            "client",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "client",
            "booking_number",
            "duration",
            "subtotal",
            "fees",
            "total_price",
            "status",
            "created_at",
            "updated_at",
            "content_type",
            "object_id",
        ]

    # ✅ maintenant DRF le connait
    def get_content_type_model(self, obj):
        return obj.content_type.model

    def validate(self, data):

        # ✅ Si c'est un update (paiement), on laisse passer
        if self.instance:
            return data

        if 'vehicle' in data and 'residence' in data:
            raise serializers.ValidationError(
                "Vous ne pouvez réserver qu'un véhicule OU une résidence"
            )
            
        if 'vehicle' not in data and 'residence' not in data:
            raise serializers.ValidationError(
                "Vous devez spécifier un véhicule ou une résidence"
            )

        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError({
                'end_date': 'La date de fin doit être après la date de début'
            })
            
        from django.utils import timezone
        if data['start_date'] < timezone.now().date():
            raise serializers.ValidationError({
                'start_date': 'La date de début ne peut pas être dans le passé'
            })
            
        return data

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["client"] = request.user

        # Déterminer le type d'objet et le champ de prix
        if 'vehicle' in validated_data:
            obj = validated_data.pop('vehicle')
            content_type = ContentType.objects.get_for_model(Vehicle)
            price_field = 'price_per_day'
            has_cleaning_fee = False
        elif 'residence' in validated_data:
            obj = validated_data.pop('residence')
            content_type = ContentType.objects.get_for_model(Residence)
            price_field = 'price_per_night'
            has_cleaning_fee = True
        else:
            raise serializers.ValidationError("Type d'objet non spécifié")

        validated_data['content_type'] = content_type
        validated_data['object_id'] = obj.id

        # Calcul des jours/nuits
        days = (validated_data["end_date"] - validated_data["start_date"]).days
        if days == 0:
            days = 1

        # Récupérer le prix selon le type d'objet
        price_per_period = getattr(obj, price_field, None)

        if not price_per_period:
            raise serializers.ValidationError(f"Objet sans prix. Champ requis: {price_field}")

        # Calcul du sous-total
        subtotal = Decimal(str(price_per_period)) * days
        
        # Calcul des frais selon le type
        if has_cleaning_fee:
            # Pour les résidences : frais de ménage fixes
            cleaning_fee = getattr(obj, 'cleaning_fee', Decimal('0.00'))
            fees = Decimal(str(cleaning_fee)) if cleaning_fee else Decimal('0.00')
        else:
            # Pour les véhicules : 10% de commission
            fees = subtotal * Decimal("0.10")

        validated_data["duration"] = days
        validated_data["subtotal"] = subtotal
        validated_data["fees"] = fees
        validated_data["total_price"] = subtotal + fees

        return super().create(validated_data)
    

    def update(self, instance, validated_data):
        # Autoriser seulement transaction_number + status pour paiement
        if "transaction_number" in validated_data:
            instance.transaction_number = validated_data["transaction_number"]
            instance.status = "pending_payment_validation"
            instance.save()
            return instance

        return super().update(instance, validated_data)


class BookingReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingReview
        fields = "__all__"
        read_only_fields = ["booking", "created_at"]


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = "__all__"
        read_only_fields = ["user"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


