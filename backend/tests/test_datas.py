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

    def test_data_fim_anterior_ao_inicio(self):
        # a data_inicio e 10:45, entao 09:00 vem antes dela
        carga = self.dado.copy()
        carga["data_fim"] = "2026-10-17T09:00:00-03:00"

        # teste para o POST
        response = self.client.post('/tarefas/', carga, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("data_fim", response.data)

        # teste para o PATCH (so a data_fim e enviada, a comparacao usa a data_inicio ja salva)
        response = self.client.patch('/tarefas/1/', {"data_fim": "2026-10-17T09:00:00-03:00"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("data_fim", response.data)

        # teste para o PUT
        response = self.client.put('/tarefas/1/', carga, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("data_fim", response.data)

    def test_data_fim_igual_ao_inicio(self):
        # data_fim igual a data_inicio e aceita, so a anterior e recusada
        carga = self.dado.copy()
        carga["data_fim"] = carga["data_inicio"]

        # teste para o POST
        response = self.client.post('/tarefas/', carga, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # teste para o PUT
        response = self.client.put('/tarefas/1/', carga, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)