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

    def validate(self, data):
        if self.instance:
            inicio = data.get('data_inicio', self.instance.data_inicio)
            fim = data.get('data_fim', self.instance.data_fim)
        else:
            inicio = data.get('data_inicio')
            fim = data.get('data_fim')

        if inicio and fim and fim < inicio:
            raise serializers.ValidationError(
                {'data_fim': 'A data de fim não pode ser anterior à data de início.'}
            )
        return data