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
        ("acima_limite_titulo", "titulo", 'aB3dE6gH9jK2mN5pQ8sT1vW4yskjaZ7bC0eF3hI6kL9nO2qR5uU8xX1zY4aD7fG0iJ3lM6oP9rS2tV5wY8zB1cE4fH7iK0lN3oQ6rT9uW2xZ5aC8dF1gI4jM7mP0pR3sV6vY9yB2eE5hH8kK1nN4qQ7tT0wW3zZ6aD9fG2iJ5lL8oO1rR4uU7xX0yY3bC6eF9hI2kL5nO8qR1tV4wY7zB0cE3fH6iK9lN2oQ5rT8uW1xZ4aC7dF0gI3jM6mP9pR2sV5vY8yB1eE4hH7kK0nN3qQ6tT'),
        ("acima_limite_status", "status", 'ksjkaB3dE6gH9jK2mN5pQ8sT1vW4yZ7bC0eF3hI6kL9nO2qR5uU8xX'),
        ("acima_limite_prioridade", "prioridade", 6),
        ("prioridade_negativa", "prioridade", -1),
        ("prioridade_zero", "prioridade", 0),
    ])
    def test_fora_do_escopo(self, atributo_teste, atributo, valor_invalido):
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

