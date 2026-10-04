from rest_framework import serializers
from .models import Tarefas

class TarefasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarefas
        fields = [
            'id',
            'titulo',
            'descricao',
            'status',
            'prioridade',
            'data_inicio',
            'data_fim',
        ]