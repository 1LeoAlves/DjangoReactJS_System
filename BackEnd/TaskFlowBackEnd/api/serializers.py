from rest_framework import serializers
from .models import Task, User
from django.contrib.auth.hashers import make_password

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__' # pode trocar por ['title', 'description', ...] se quiser limitar

class UserSerializer(serializers.ModelSerializer):
    # Cria um campo write_only para senha
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # use apenas os campos que você quer expor no cadastro
        fields = ['id', 'username', 'password']

    # Sobrescreve o create para salvar senha hash
    def create(self, validated_data):
        validated_data['hash_password'] = make_password(validated_data.pop('password'))
        return super().create(validated_data)