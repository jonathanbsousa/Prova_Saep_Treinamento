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

    def get_queryset(self):
        status = self.request.query_params.get('status')
        if status:
            return Tarefa.objects.filter(status=status)
        return Tarefa.objects.all()

class TarefaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer


class UserListView(ListAPIView):
    
    queryset = User.objects.all()
    serializer_class = UserListSerializer