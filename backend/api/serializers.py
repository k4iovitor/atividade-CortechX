from rest_framework import serializers
from .models import Tarefas

STATUS_VALIDOS = ['aberta', 'em_andamento', 'concluida']

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

    def validate_status(self, value):
        if value not in STATUS_VALIDOS:
            raise serializers.ValidationError(
                f"Status inválido. Use um desses: {', '.join(STATUS_VALIDOS)}."
            )
        return value