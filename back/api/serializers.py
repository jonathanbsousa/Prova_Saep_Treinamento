from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class TarefaSerializer(serializers.ModelSerializer):
    usuario = serializers.ReadOnlyField(source='usuario.username')
    prioridade = serializers.ChoiceField(choices=[('baixa', 'Baixa'), ('media', 'Media'), ('alta', 'Alta')])
    status = serializers.ChoiceField(choices=[('a fazer', 'A fazer'), ('fazendo', 'Fazendo'), ('pronto', 'Pronto')])

    class Meta:
        model = Tarefa
        fields = ['id', 'usuario', 'descricao', 'nome_setor', 'prioridade', 'data_cadastro', 'status']
        read_only_fields = ['id', 'usuario', 'data_cadastro']