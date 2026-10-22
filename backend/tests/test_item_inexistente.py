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

        # cria o objeto na base de dados pra fazer o teste com o PATCH e o PUT
        Tarefas.objects.create(**self.dado)

    def test_item_inexistente(self):
        # o id 999 nao existe no banco

        # teste para o GET
        response = self.client.get('/tarefas/999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # teste para o PATCH
        response = self.client.patch('/tarefas/999/', self.dado, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # teste para o PUT
        response = self.client.put('/tarefas/999/', self.dado, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)