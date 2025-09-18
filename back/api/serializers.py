from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'email']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        return user
    
class UserListSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TarefaSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    usuario_nome = serializers.ReadOnlyField(source='usuario.username')
    prioridade = serializers.ChoiceField(choices=Tarefa.PRIORIDADE)
    status = serializers.ChoiceField(choices=Tarefa.STATUS)

    class Meta:
        model = Tarefa
        fields = ['id', 'usuario', 'usuario_nome', 'descricao', 'nome_setor', 'prioridade', 'status']
        read_only_fields = ['id', 'usuario_nome', 'data_cadastro']