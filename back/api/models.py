from django.db import models
from django.contrib.auth.models import User

class Tarefa(models.Model):
    PRIORIDADE = [
        ('baixa', 'Baixa'),
        ('média', 'Média'),
        ('alta', 'Alta')
    ]

    STATUS = [
        ('a fazer', 'A fazer'),
        ('fazendo', 'Fazendo'),
        ('pronto', 'Pronto')
    ]
    
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tarefas')
    descricao = models.CharField(max_length=255)
    nome_setor = models.CharField(max_length=255)
    prioridade = models.CharField(max_length=10, choices=PRIORIDADE, default='baixa')
    data_cadastro = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS, default='a fazer')
