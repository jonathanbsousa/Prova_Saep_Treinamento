from django.shortcuts import render
from .serializers import *
from .models import *
from django.contrib.auth.models import User
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView, ListAPIView

class SignUpView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TarefaView(ListCreateAPIView):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer
    
    # def perform_create(self, serializer):
    #     serializer.save(usuario=self.request.user)

    def get_queryset(self):
        return Tarefa.objects.filter(status='a fazer')

class TarefaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer

    # def get_queryset(self):
    #     return Tarefa.objects.filter(usuario=self.request.user)

class UserListView(ListAPIView):
    
    queryset = User.objects.all()
    serializer_class = UserListSerializer