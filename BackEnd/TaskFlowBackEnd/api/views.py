from .models import Task, User
from .serializers import TaskSerializer, UserSerializer
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken

# @api_view(['GET'])
# def hello_world(request):
#     return Response({"message": "Olá, mundo! Sua API Django está funcionando 🚀"}, status= status.HTTP_200_OK)

from rest_framework import viewsets, permissions
from .models import Task, User
from .serializers import TaskSerializer, UserSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]  # 🔒 precisa de token

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # 👤 cadastro liberado

    def create(self, request, *args, **kwargs):
        # Sobrescreve create para criar usuário e retornar tokens JWT
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Criptografa senha antes de salvar
        serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
        user = serializer.save()

        # Gera tokens JWT
        refresh = RefreshToken.for_user(user)

        data = {
            "id": user.id,
            "username": user.username,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }

        return Response(data, status=status.HTTP_201_CREATED)