from rest_framework import serializers
from .models import Task, User

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__' # pode trocar por ['title', 'description', ...] se quiser limitar

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'