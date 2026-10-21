// Único lugar que monta URLs e chama fetch. Cada função devolve a Response.
// Em desenvolvimento, API_URL fica vazio e o proxy do Vite encaminha /tarefas para o backend.
const API_URL = import.meta.env.VITE_API_URL ?? '';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const listarTarefas = (apenasAltaPrioridade = false) =>
  fetch(`${API_URL}/tarefas/${apenasAltaPrioridade ? 'maior_prioridade/' : ''}`);

export const criarTarefa = (tarefa) =>
  fetch(`${API_URL}/tarefas/`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(tarefa),
  });

export const atualizarTarefa = (id, dados) =>
  fetch(`${API_URL}/tarefas/${id}/`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(dados),
  });

export const alterarParcialmenteTarefa = (id, dados) =>
  fetch(`${API_URL}/tarefas/${id}/`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify(dados),
  });

export const excluirTarefa = (id) =>
  fetch(`${API_URL}/tarefas/${id}/`, { method: 'DELETE' });

export const marcarConcluida = (id) =>
  fetch(`${API_URL}/tarefas/${id}/marcar_concluida/`, { method: 'PATCH' });

export const buscarEstatisticas = () => fetch(`${API_URL}/tarefas/estatisticas/`);