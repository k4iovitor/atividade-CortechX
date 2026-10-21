from rest_framework.test import APITestCase
from rest_framework import status
from parameterized import parameterized
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

        # cria o objeto na base de dados para que seja possivel fazer o teste com o PATCH
        Tarefas.objects.create(
            titulo="Leitura",
            descricao="Finalizar leitura sobre redes neurais",
            status="aberta",
            prioridade=3,
            data_inicio="2026-10-17T10:45:00-03:00",
            data_fim="2026-10-17T16:45:00-03:00"
        )

    @parameterized.expand([
        ("status_errado", "status", "fazendo")
    ])
    def test_status_desconhecido(self, atributo_teste, atributo, valor_invalido):
        carga = self.dado.copy()
        carga[atributo] = valor_invalido

        # teste para o POST
        response = self.client.post('/tarefas/', carga, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(atributo, response.data)

        # teste para o PATCH
        response = self.client.patch('/tarefas/1/', carga, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(atributo, response.data)

        # teste para o PUT
        response = self.client.put('/tarefas/1/', carga, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(atributo, response.data)


    @parameterized.expand([
        ("status_correto", "status", "aberta"),
        ("status_correto", "status", "em_andamento"),
        ("status_correto", "status", "concluida"),
    ])
    def test_status_conhecido(self, atributo_teste, atributo, valor_invalido):
        carga = self.dado.copy()
        carga[atributo] = valor_invalido

        # teste para o POST
        response = self.client.post('/tarefas/', carga, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # teste para o PATCH
        response = self.client.patch('/tarefas/1/', carga, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # teste para o PUT
        response = self.client.put('/tarefas/1/', carga, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

