from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from api.models import Tarefas


class CicloDeVidaCrudTeste(APITestCase):
    """
    Testes do ciclo de vida do CRUD de tarefas: criar, concluir/reabrir e excluir.

    O APITestCase cria um banco de dados TEMPORÁRIO só para os testes e o apaga no fim.
    Por isso estes testes nunca mexem no db.sqlite3 de verdade, e cada teste começa
    com o banco vazio.

    Rodar (na pasta backend, com o venv ativo):  python manage.py test
    """

    def criar_tarefa(self, **campos):
        """Cria uma tarefa direto no banco (sem passar pela API) para servir de ponto de partida."""
        dados = {
            'titulo': 'Estudar Django',
            'descricao': 'Revisar ViewSets e serializers',
            'status': 'aberta',
            'prioridade': 3,
            'data_inicio': timezone.now(),
            'data_fim': None,
        }
        dados.update(campos)  # permite trocar qualquer campo em cada teste
        return Tarefas.objects.create(**dados)

    # ------------------------------------------------------------------
    # 1) CRIAÇÃO COM SUCESSO: POST com dados 100% válidos
    # ------------------------------------------------------------------
    def test_criar_tarefa_valida_retorna_201_e_grava_no_banco(self):
        """POST válido deve devolver 201 Created e o registro deve existir de verdade no banco."""
        payload = {
            'titulo': 'Ler capítulo 3',
            'descricao': 'Resumir o capítulo sobre redes neurais',
            'status': 'aberta',
            'prioridade': 4,
            'data_inicio': '2026-10-20T10:00:00-03:00',
            'data_fim': '2026-10-21T10:00:00-03:00',
        }

        resposta = self.client.post('/tarefas/', payload, format='json')

        # 1. a API respondeu 201 Created
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)

        # 2. o registro foi gravado no banco (consultamos o banco direto, sem usar a API)
        self.assertEqual(Tarefas.objects.count(), 1)
        tarefa = Tarefas.objects.get(id=resposta.data['id'])
        self.assertEqual(tarefa.titulo, 'Ler capítulo 3')
        self.assertEqual(tarefa.status, 'aberta')
        self.assertEqual(tarefa.prioridade, 4)

    # ------------------------------------------------------------------
    # 2) ENDPOINT DE CONCLUSÃO: marcar_concluida
    # ------------------------------------------------------------------
    def test_marcar_concluida_muda_status_e_preenche_data_fim(self):
        """marcar_concluida deve mudar o status para 'concluida' e registrar a data_fim (POST e PATCH)."""
        for metodo in ('post', 'patch'):
            # subTest: se um método falhar, o relatório diz qual foi, e o outro continua rodando
            with self.subTest(metodo=metodo):
                tarefa = self.criar_tarefa()
                self.assertIsNone(tarefa.data_fim)  # ponto de partida: sem data de fim

                chamar = getattr(self.client, metodo)  # self.client.post ou self.client.patch
                resposta = chamar(f'/tarefas/{tarefa.id}/marcar_concluida/', format='json')

                self.assertEqual(resposta.status_code, status.HTTP_200_OK)

                # a resposta do endpoint é só uma mensagem; por isso conferimos o banco
                tarefa.refresh_from_db()
                self.assertEqual(tarefa.status, 'concluida')
                self.assertIsNotNone(tarefa.data_fim)

    def test_marcar_concluida_em_tarefa_ja_concluida_retorna_400(self):
        """Concluir duas vezes a mesma tarefa deve ser recusado (regra atual da view: 400)."""
        tarefa = self.criar_tarefa()
        url = f'/tarefas/{tarefa.id}/marcar_concluida/'

        primeira = self.client.patch(url, format='json')
        segunda = self.client.patch(url, format='json')

        self.assertEqual(primeira.status_code, status.HTTP_200_OK)
        self.assertEqual(segunda.status_code, status.HTTP_400_BAD_REQUEST)

    def test_marcar_concluida_em_tarefa_inexistente_retorna_404(self):
        """Tarefa que não existe deve dar 404 Not Found."""
        resposta = self.client.patch('/tarefas/9999/marcar_concluida/', format='json')
        self.assertEqual(resposta.status_code, status.HTTP_404_NOT_FOUND)

    # ------------------------------------------------------------------
    # 3) ATUALIZAÇÃO PARCIAL (PATCH) e REABERTURA da tarefa
    # ------------------------------------------------------------------
    def test_reabrir_tarefa_limpa_data_fim(self):
        """
        Reabrir uma tarefa concluída (status volta para 'aberta') deve deixar a data_fim nula.
        É o mesmo PATCH que o checkbox do front faz ao ser desmarcado.
        """
        tarefa = self.criar_tarefa(status='concluida', data_fim=timezone.now() + timedelta(days=1))
        self.assertIsNotNone(tarefa.data_fim)  # ponto de partida: concluída, com data de fim

        resposta = self.client.patch(
            f'/tarefas/{tarefa.id}/',
            {'status': 'aberta', 'data_fim': None},
            format='json',
        )

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        tarefa.refresh_from_db()
        self.assertEqual(tarefa.status, 'aberta')
        self.assertIsNone(tarefa.data_fim)  # voltou a ser nula

    def test_patch_altera_so_o_campo_enviado(self):
        """PATCH é parcial: muda apenas o que foi enviado e preserva o resto."""
        tarefa = self.criar_tarefa()

        resposta = self.client.patch(f'/tarefas/{tarefa.id}/', {'titulo': 'Título novo'}, format='json')

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        tarefa.refresh_from_db()
        self.assertEqual(tarefa.titulo, 'Título novo')  # mudou
        self.assertEqual(tarefa.descricao, 'Revisar ViewSets e serializers')  # não mudou
        self.assertEqual(tarefa.prioridade, 3)  # não mudou

    # ------------------------------------------------------------------
    # 4) EXCLUSÃO (DELETE)
    # ------------------------------------------------------------------
    def test_deletar_tarefa_retorna_204_e_remove_do_banco(self):
        """DELETE em tarefa existente deve devolver 204 No Content e o registro deve sumir do banco."""
        tarefa = self.criar_tarefa()

        resposta = self.client.delete(f'/tarefas/{tarefa.id}/')

        self.assertEqual(resposta.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Tarefas.objects.filter(id=tarefa.id).exists())  # sumiu de verdade

    def test_deletar_tarefa_inexistente_retorna_404(self):
        """Apagar uma tarefa que já não existe deve dar 404."""
        tarefa = self.criar_tarefa()
        self.client.delete(f'/tarefas/{tarefa.id}/')  # apaga uma vez

        resposta = self.client.delete(f'/tarefas/{tarefa.id}/')  # tenta apagar de novo

        self.assertEqual(resposta.status_code, status.HTTP_404_NOT_FOUND)