from rest_framework import serializers
from .models import Vehicle, VehicleImage
from apps.accounts.serializers import OwnerPublicSerializer



# ===============================
# IMAGE SERIALIZER
# ===============================

class VehicleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImage
        fields = "__all__"
        read_only_fields = ["vehicle"]


# ===============================
# VEHICLE SERIALIZER
# ===============================

class VehicleSerializer(serializers.ModelSerializer):


    owner = OwnerPublicSerializer(read_only=True)  

    # Affichage images existantes
    images = VehicleImageSerializer(many=True, read_only=True)

    # Upload images à la création
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Vehicle
        fields = "__all__"

        read_only_fields = [
            "owner",
            "platform_fee_amount",
            "final_price_per_day",
            "platform_fee_percentage",
            "slug",
            "created_at",
            "updated_at",
        ]

    # ===============================
    # CREATE
    # ===============================

    def create(self, validated_data):
        request = self.context["request"]
        uploaded_images = validated_data.pop("uploaded_images", [])

        vehicle = Vehicle.objects.create(
            **validated_data
        )

        # Création des images
        for index, image in enumerate(uploaded_images):
            VehicleImage.objects.create(
                vehicle=vehicle,
                image=image,
                order=index,
                is_primary=(index == 0)  # première image = principale
            )

        return vehicle

    # ===============================
    # UPDATE
    # ===============================

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # Ajouter nouvelles images si envoyées
        for image in uploaded_images:
            VehicleImage.objects.create(
                vehicle=instance,
                image=image
            )

        return instance
