from django.utils import timezone
from django.db.models import Avg, Count, Q
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

    @action(detail=True, methods=['post', 'patch'])
    def marcar_concluida(self, request, pk=None):
        tarefa = self.get_object()
        if tarefa.status == 'concluída' or tarefa.status == 'concluída':
            return Response(
                {'erro': 'essa tarefa já foi concluída'},
                status=status.HTTP_400_BAD_REQUEST
            )
        tarefa.status = 'concluída'
        tarefa.data_fim = timezone.now()
        tarefa.save()
        return Response(
            {'status': 'tarefa marcada como concluída'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def busca_por_titulo(self, request):
        consulta = request.query_params.get('q', None)
        if not consulta:
            return Response(
                {'erro': 'deve-se fornecer o termo de busca no parâmetro "q"'},
                status=status.HTTP_400_BAD_REQUEST
            )
        tarefas = self.get_queryset().filter(titulo__icontains=consulta)
        if not tarefas.exists():
            return Response(
                {'erro': 'nenhuma tarefa foi encontrada com esse titulo'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = self.get_serializer(tarefas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
