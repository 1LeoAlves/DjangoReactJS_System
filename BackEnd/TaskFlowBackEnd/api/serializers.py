from rest_framework import serializers
from .models import Task, User
from django.contrib.auth.hashers import make_password

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__' # pode trocar por ['title', 'description', ...] se quiser limitar

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'name']  # incluir 'name'

    def create(self, validated_data):
        validated_data['hash_password'] = make_password(validated_data.pop('password'))
        # se não tiver name, usar o username
        if 'name' not in validated_data:
            validated_data['name'] = validated_data.get('username', '')
        return super().create(validated_data)