from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from django.core.validators import RegexValidator
import regex as re

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

descricao_validator = RegexValidator(
    regex=r'^[\wÀ-ÖØ-öø-ÿ0-9 ,.?!\'"()\-]{3,255}$',
    message='Descrição inválida'
)
setor_validator = RegexValidator(
    regex=r'^[\w\d .,&-]{2,100}$',
    message='Setor inválido'
)
class TarefaSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    usuario_nome = serializers.ReadOnlyField(source='usuario.username')
    prioridade = serializers.ChoiceField(choices=Tarefa.PRIORIDADE)
    status = serializers.ChoiceField(choices=Tarefa.STATUS)
    descricao = serializers.CharField(validators=[descricao_validator])
    nome_setor = serializers.CharField(validators=[setor_validator])

    class Meta:
        model = Tarefa
        fields = ['id', 'usuario', 'usuario_nome', 'descricao', 'nome_setor', 'prioridade', 'status']
        read_only_fields = ['id', 'usuario_nome', 'data_cadastro']

    def validate_prioridade(self, value):
        if value == 'media':
            return 'média'
        return value

    def validate_status(self, value):
        return value.strip()

    def update(self, instance, validated_data):
        allowed_transitions = {
            'a fazer': ['fazendo'],
            'fazendo': ['concluido', 'a fazer'], 
            'concluido': [] 
        }

        new_status = validated_data.get('status', instance.status)
        old_status = instance.status

        if new_status != old_status:
            allowed = allowed_transitions.get(old_status, [])
            if new_status not in allowed:
                raise serializers.ValidationError({
                    'status': f"Transição inválida de '{old_status}' para '{new_status}'"
                })

        from django.db import transaction
        with transaction.atomic():
            locked = Tarefa.objects.select_for_update().get(pk=instance.pk)
            for attr, value in validated_data.items():
                setattr(locked, attr, value)
            locked.save()
            return locked
