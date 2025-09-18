from django.urls import path
from .views import *


urlpatterns = [
    path('tarefas/', TarefaView.as_view(), name='tarefa-list-create'),
    path('tarefas/<int:pk>', TarefaDetailView.as_view()),
    path('register/', SignUpView.as_view(), name='register'),
     path('pessoas/', UserListView.as_view(), name='user-list'),
]