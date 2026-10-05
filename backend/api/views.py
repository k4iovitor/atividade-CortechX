from django.db.models import Avg, Count, Q
from django.utils import timezone
from rest_framework import viewsets, status
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

    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        total = Tarefas.objects.count()
        media = Tarefas.objects.aggregate(m=Avg('prioridade'))['m']
        por_status = {
            item['status']: item['qtd']
            for item in Tarefas.objects.values('status').annotate(qtd=Count('id'))
        }
        return Response({
            'total': total,
            'por_status': por_status,
            'prioridade_media': round(media, 2) if media is not None else 0,
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def busca(self, request):
        q = request.query_params.get('q', '').strip()
        if not q:
            return Response({'erro': 'Parâmetro "q" é obrigatório.'},
                            status=status.HTTP_400_BAD_REQUEST)
        tarefas = self.get_queryset().filter(
            Q(titulo__icontains=q) | Q(descricao__icontains=q)
        )
        serializer = self.get_serializer(tarefas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def concluir(self, request, pk=None):
        tarefa = self.get_object()
        if tarefa.status == 'concluida':
            return Response({'erro': 'Tarefa já está concluída.'},
                            status=status.HTTP_409_CONFLICT)
        tarefa.status = 'concluida'
        tarefa.data_fim = timezone.now()
        tarefa.save()
        return Response(self.get_serializer(tarefa).data,
                        status=status.HTTP_200_OK)