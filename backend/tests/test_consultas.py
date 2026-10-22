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

        # cria o objeto na base de dados para que seja possivel consultar a tarefa de id 1
        Tarefas.objects.create(**self.dado)

    def test_listar_tarefas(self):
        # cria uma segunda tarefa, ficando 2 no total
        Tarefas.objects.create(**self.dado)

        response = self.client.get('/tarefas/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_detalhe_da_tarefa(self):
        response = self.client.get('/tarefas/1/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['titulo'], "Leitura")

    # a tarefa criada no setUp tem prioridade 3, entao nunca aparece na lista de maior prioridade
    @parameterized.expand([
        ("prioridade_3", 3, False),
        ("prioridade_4", 4, True),
        ("prioridade_5", 5, True),
    ])
    
    def test_maior_prioridade(self, nome_teste, prioridade, deve_aparecer):
        carga = self.dado.copy()
        carga["titulo"] = "Teste prioridade"
        carga["prioridade"] = prioridade
        Tarefas.objects.create(**carga)

        response = self.client.get('/tarefas/maior_prioridade/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titulos = [tarefa['titulo'] for tarefa in response.data]
        self.assertEqual("Teste prioridade" in titulos, deve_aparecer)

    @parameterized.expand([
        ("minusculo", "leitura"),
        ("maiusculo", "LEITURA"),
        ("parte_do_titulo", "eit"),
    ])

    def test_busca_por_titulo(self, nome_teste, termo):
        response = self.client.get('/tarefas/busca_por_titulo/', {'q': termo})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['titulo'], "Leitura")

    def test_estatisticas(self):
        # junto com a tarefa do setUp (aberta, prioridade 3): 2 abertas e 1 concluida
        aberta = self.dado.copy()
        aberta["prioridade"] = 5
        Tarefas.objects.create(**aberta)

        concluida = self.dado.copy()
        concluida["status"] = "concluida"
        concluida["prioridade"] = 1
        Tarefas.objects.create(**concluida)

        response = self.client.get('/tarefas/estatisticas/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total'], 3)
        self.assertEqual(response.data['por_status'], {'aberta': 2, 'concluida': 1})
        # media de (3 + 5 + 1) / 3
        self.assertEqual(response.data['prioridade_media'], 3.0)

    # sem o parametro q, ou com o q vazio, a busca e recusada
    @parameterized.expand([
        ("sem_q", {}),
        ("q_vazio", {"q": ""}),
    ])

    def test_busca_por_titulo_sem_termo(self, nome_teste, parametros):
        response = self.client.get('/tarefas/busca_por_titulo/', parametros)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("erro", response.data)

    def test_busca_por_titulo_sem_resultado(self):
        response = self.client.get('/tarefas/busca_por_titulo/', {'q': 'inexistente'})

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("erro", response.data)

    def test_estatisticas_banco_vazio(self):
        # apaga a tarefa criada no setUp para o banco ficar vazio
        Tarefas.objects.all().delete()

        response = self.client.get('/tarefas/estatisticas/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total'], 0)
        self.assertEqual(response.data['por_status'], {})
        self.assertEqual(response.data['prioridade_media'], 0)