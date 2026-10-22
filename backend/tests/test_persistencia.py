from rest_framework.test import APITestCase
from rest_framework import status
from api.models import Tarefas

class TarefaTeste(APITestCase):

    def setUp(self):

        self.dado = {
            "titulo": "Leitura",
            "descricao": "Finalizar leitura sobre redes neurais",
            "status": "aberta",
            "prioridade": 3,
            "data_inicio": "2026-10-17T10:45:00-03:00",
            "data_fim": "2026-10-17T16:45:00-03:00"
        }

        # cria o objeto na base de dados para que seja possivel fazer o teste com o PATCH e o PUT
        Tarefas.objects.create(**self.dado)

    def test_put_atualiza_o_banco(self):
        carga = self.dado.copy()
        carga["titulo"] = "Titulo novo"
        carga["prioridade"] = 5
        carga["status"] = "em_andamento"

        response = self.client.put('/tarefas/1/', carga, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # consulta o banco direto, sem usar a API
        tarefa = Tarefas.objects.get(id=1)
        self.assertEqual(tarefa.titulo, "Titulo novo")
        self.assertEqual(tarefa.prioridade, 5)
        self.assertEqual(tarefa.status, "em_andamento")
        # o PUT atualiza a tarefa existente, nao cria outra
        self.assertEqual(Tarefas.objects.count(), 1)

    def test_requisicao_rejeitada_nao_altera_o_banco(self):
        # prioridade 6 e invalida, entao a API recusa todas as requisicoes
        carga = self.dado.copy()
        carga["titulo"] = "Titulo novo"
        carga["prioridade"] = 6

        # teste para o POST
        response = self.client.post('/tarefas/', carga, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Tarefas.objects.count(), 1)

        # teste para o PATCH
        response = self.client.patch('/tarefas/1/', carga, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # teste para o PUT
        response = self.client.put('/tarefas/1/', carga, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # a tarefa continua exatamente como foi criada no setUp
        tarefa = Tarefas.objects.get(id=1)
        self.assertEqual(tarefa.titulo, "Leitura")
        self.assertEqual(tarefa.prioridade, 3)
        self.assertEqual(Tarefas.objects.count(), 1)