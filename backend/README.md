# Gerenciador de Tarefas

## Objetivo do Projeto
Este projeto é uma API REST desenvolvida com **Django REST Framework** para o gerenciamento de tarefas. Fornece funções para criar, listar, atualizar, deletar tarefas, buscar por títulos, filtrar tarefas por prioridade e gerenciar o status de conclusão das mesmas.

## Como executar o projeto

Navegue até a pasta do backend:

```bash
cd /caminho/para/seu-projeto/backend
```

Execute as migrações para criar as tabelas do projeto no banco de dados SQLite:
```bash
python manage.py makemigrations
python manage.py migrate
```

Inicie o servidor local de desenvolvimento:
```bash
python manage.py runserver
```

## Endpoints Disponíveis

### Rotas Padrões

- `GET /api/tarefas/` - Lista todas as tarefas cadastradas.
- `POST /api/tarefas/` - Cria uma nova tarefa.
- `GET /api/tarefas/{id}/` - Retorna os detalhes de uma tarefa específica.
- `PUT/PATCH /api/tarefas/{id}/` - Atualiza os dados de uma tarefa.
- `DELETE /api/tarefas/{id}/` - Exclui uma tarefa.

### Rotas Extras Customizadas

- `GET /api/tarefas/maior_prioridade/` - Retorna a lista de tarefas onde a prioridade seja maior ou igual a 4.
- `GET /api/tarefas/busca_por_titulo/?q=termo` - Busca tarefas que contenham uma palavra específica fornecida na URL.
- `POST /api/tarefas/{id}/marcar_concluida/` - Marca automaticamente o status da tarefa correspondente ao id para concluida e registra a data de fim.
- `GET /api/tarefas/estatisticas/` - Retorna um resumo com o total de tarefas, quantidade por status e a média de prioridade.
