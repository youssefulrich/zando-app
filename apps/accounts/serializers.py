from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    # 🔥 Champs paiement
    wave_number = serializers.CharField(required=False, allow_blank=True)
    orange_money_number = serializers.CharField(required=False, allow_blank=True)
    mtn_money_number = serializers.CharField(required=False, allow_blank=True)
    moov_money_number = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "username", "email", "password", "password_confirm",
            "first_name", "last_name", "phone", "user_type",

            # 🔥 Paiement
            "wave_number",
            "orange_money_number",
            "mtn_money_number",
            "moov_money_number",
        ]

        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate(self, data):

        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                "password": "Les mots de passe ne correspondent pas"
            })

        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({
                "email": "Cet email est déjà utilisé"
            })

        # 🔥 Si propriétaire → au moins un numéro obligatoire
        if data.get("user_type") in [
            "proprietaire_vehicule",
            "proprietaire_residence",
            "proprietaire",
        ]:
            if not any([
                data.get("wave_number"),
                data.get("orange_money_number"),
                data.get("mtn_money_number"),
                data.get("moov_money_number"),
            ]):
                raise serializers.ValidationError({
                    "payment": "Un propriétaire doit renseigner au moins un moyen de paiement."
                })

        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            user_type=validated_data.get('user_type', 'client'),

            # 🔥 Paiement
            wave_number=validated_data.get('wave_number', ''),
            orange_money_number=validated_data.get('orange_money_number', ''),
            mtn_money_number=validated_data.get('mtn_money_number', ''),
            moov_money_number=validated_data.get('moov_money_number', ''),
        )

        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"



class OwnerPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "orange_money_number",
            "wave_number",
            "mtn_money_number",
            "moov_money_number",
        ]
