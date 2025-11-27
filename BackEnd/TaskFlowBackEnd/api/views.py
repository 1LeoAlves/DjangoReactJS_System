from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Só retorna tarefas do usuário logado
        return Task.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()  # usuário criado com create_user

        # Criando token **após garantir que o usuário existe**
        try:
            refresh = RefreshToken.for_user(user)
            data = {
                "id": user.id,
                "username": user.username,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }
        except Exception as e:
            # Em caso de erro, pelo menos retorna o usuário criado
            data = {
                "id": user.id,
                "username": user.username,
                "error": str(e)
            }

        return Response(data, status=201)
