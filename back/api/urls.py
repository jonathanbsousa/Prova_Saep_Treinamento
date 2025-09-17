from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('tarefas/', TarefaView.as_view(), name='tarefa-list-create'),
    path('tarefas/<int:pk>', TarefaDetailView.as_view()),
    path('register/', SignUpView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]