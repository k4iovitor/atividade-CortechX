from rest_framework import viewsets
from .models import Tarefas 
from .serializers import TarefasSerializer 

class TarefaViewSet(viewsets.ModelViewSet):
    queryset = Tarefas.objects.all() 
    serializer_class = TarefasSerializer
