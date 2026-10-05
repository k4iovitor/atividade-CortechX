from django.utils import timezone

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Tarefas 
from .serializers import TarefasSerializer 

class TarefaViewSet(viewsets.ModelViewSet):
    queryset = Tarefas.objects.all() 
    serializer_class = TarefasSerializer

    @action(detail=False, methods=['get'])
    def maior_prioridade(self, request):
        tarefas = self.get_queryset().filter(prioridade__gte=4)
        serializer = self.get_serializer(tarefas, many=True)
        
        return Response(serializer.data)

    @action(detail=True, methods=['post', 'patch'])
    def marcar_concluida(self, request, pk=None):
        tarefa = self.get_object()
        tarefa.status = 'concluída'
        tarefa.data_fim = timezone.now()
        tarefa.save()

        return Response({'status': 'tarefa marcada como concluída'})

    @action(detail=False, methods=['get'])
    def busca_por_titulo(self, request):
        consulta = request.query_params.get('q', None)
        
        if consulta:
            tarefas = self.get_queryset().filter(titulo__icontains=consulta)
        else:
            tarefas = self.get_queryset()

        serializer = self.get_serializer(tarefas, many=True)

        return Response(serializer.data)

