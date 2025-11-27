from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            # Cria o usuário
            user = serializer.save()

            # Gera tokens
            try:
                refresh = RefreshToken.for_user(user)
                data = {
                    "id": user.id,
                    "username": user.username,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }
            except Exception:
                # Caso algo dê errado com o token, retorna só os dados do usuário
                data = {
                    "id": user.id,
                    "username": user.username,
                    "access": None,
                    "refresh": None,
                }

            return Response(data, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Retorna erro amigável sem quebrar o backend
            return Response(
                {"detail": "Erro ao criar usuário.", "error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
