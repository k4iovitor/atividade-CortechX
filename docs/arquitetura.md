# Arquitetura

Navegador (React + Vite) --HTTP/JSON--> API (Django REST Framework) --ORM--> SQLite

## Backend (backend/)
- core/: configuração do projeto Django (settings.py, urls.py).
- api/: entidade Tarefas (models.py), validação (serializers.py) e endpoints (views.py, um ModelViewSet com @action para os extras).
- Rotas geradas por um DefaultRouter em core/urls.py, na raiz (/tarefas/).
- Acesso ao banco sempre pelo Django ORM.
- db.sqlite3: banco SQLite versionado no repositório, com dados de exemplo.
- tests/: testes da API.

## Frontend (frontend/src/)
- services/tarefasService.js: único ponto que chama fetch. A base da URL pode ser definida pela variável VITE_API_URL (opcional).
- components/: componentes reutilizáveis.
- pages/: telas principais (Visão Geral).
- styles/: estilos globais.
- App.jsx: estado da lista e orquestração das ações.

## Comunicação em desenvolvimento
O Vite encaminha /tarefas para http://127.0.0.1:8000 (proxy em vite.config.js), então o navegador vê a API como mesma origem e não depende de CORS.

## Decisões
- Django + DRF e SQLite: simples e suficiente para uma única entidade.
- Sem autenticação.
- Camada de serviços no frontend para separar interface de comunicação HTTP.