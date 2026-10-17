from django.db import models

class Tarefas(models.Model):

    escolhas = [
        ('aberta', 'Aberta'),
        ('em_andamento', 'Em Andamento'),
        ('concluida', 'Concluída'),
    ]

    prioridades = [
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5'),
    ]

    titulo = models.CharField(max_length=255, default='sem título')
    descricao = models.TextField()
    status = models.CharField(max_length=50, choices=escolhas)
    prioridade = models.IntegerField(choices=prioridades, default=1)
    data_inicio = models.DateTimeField('data de inicio', null=False, blank=False)
    data_fim = models.DateTimeField('data de fim', null=True, blank=True)

    def __str__(self):
        return self.titulo
