from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response # ✅ Important



User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            # Générer les tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Inscription réussie',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': str(e),
                'details': serializer.errors if hasattr(serializer, 'errors') else {}
            }, status=status.HTTP_400_BAD_REQUEST)




class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'error': 'Données invalides',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        # Chercher l'utilisateur par email OU username
        user = None
        
        # Si c'est un email
        if '@' in username:
            try:
                user = User.objects.get(email=username)
            except User.DoesNotExist:
                pass
        else:
            # Si c'est un username
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                pass
        
        # Vérifier le mot de passe
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Connexion réussie',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'user_type': user.user_type,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Identifiants invalides'
        }, status=status.HTTP_401_UNAUTHORIZED)
    

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'user_type': user.user_type,
        })
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """GET /api/auth/user/"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)