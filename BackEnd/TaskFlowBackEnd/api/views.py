from rest_framework import viewsets
from .models import Task, User
from .serializers import TaskSerializer, UserSerializer

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