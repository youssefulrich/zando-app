from .models import Residence, ResidenceImage, Availability
from rest_framework import serializers
from apps.accounts.serializers import OwnerPublicSerializer


class ResidenceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResidenceImage
        fields = "__all__"


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = "__all__"


class ResidenceSerializer(serializers.ModelSerializer):
    owner = OwnerPublicSerializer(read_only=True) 

    images = ResidenceImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Residence
        fields = "__all__"
        read_only_fields = ["owner"]

    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])

        residence = Residence.objects.create(**validated_data)

        for image in uploaded_images:
            ResidenceImage.objects.create(
                residence=residence,
                image=image
            )

        return residence
