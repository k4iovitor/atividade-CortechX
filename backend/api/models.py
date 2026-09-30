from django.db import models

class Tarefas(models.Model):
    titulo = models.CharField(max_length=255, default='sem título')
    descricao = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, default='aberta')
    prioridade = models.IntegerField(default=0)
    data_inicio = models.DateTimeField('data de inicio', null=True, blank=True)
    data_fim = models.DateTimeField('data de fim', null=True, blank=True)

    def __str__(self):
        return self.titulo

    