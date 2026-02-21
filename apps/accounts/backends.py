from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()


class EmailOrUsernameBackend(ModelBackend):
    """
    Permet l'authentification avec email OU username
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Rechercher par email OU username
            user = User.objects.get(
                Q(email=username) | Q(username=username)
            )
            
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
        except User.MultipleObjectsReturned:
            # Si plusieurs utilisateurs trouvés, prendre le premier
            user = User.objects.filter(
                Q(email=username) | Q(username=username)
            ).first()
            
            if user and user.check_password(password):
                return user
        
        return None