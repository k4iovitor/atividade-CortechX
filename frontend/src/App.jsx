import { useState, useEffect, useRef } from 'react';
import './App.css';
import FormularioTarefa from './componentes/formulario/FormularioTarefa';
import FiltragemPorTitulo from './componentes/filtragem/FiltragemPorTitulo';
import FormularioAtualizar from './componentes/formulario/FormularioAtualizar';
import Notificacao from './componentes/mensagens/Notificacao';

function App() {
  const [tarefas, setTarefas] = useState([]); // estado que armazena as tarefas criadas pelo usuário
  const [modalAberto, setModalAberto] = useState(false); // estado que armazena a informação de se o modal está aberto ou não
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState(null); // tarefa que está sendo editada (null = modal de atualizar fechado)
  const [notificacao, setNotificacao] = useState(null); // estado que armazena os dados da notificação ativa (null = nenhuma notificação na tela)
  
  const timeoutRef = useRef(null); // guarda a referência do temporizador na memória para não perdê-lo entre as renderizações

  const buscarTarefas = async () => {
    try {
      const resposta = await fetch('/tarefas/');
      if (resposta.ok) {
        const dados = await resposta.json();
        setTarefas(dados);
      }
    } catch (erro) { console.error(erro); }
  }; // função genérica do JS que coleta os dados dentro do endpoint de tarefas

  useEffect(() => {
    buscarTarefas();
  }, []);

  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const dispararNotificacao = (tipo, mensagem) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    } // se já houver um temporizador rodando, cancela para reiniciar a contagem dos 5 segundos do novo temporizador

    setNotificacao({ tipo, mensagem }); // atualiza o estado com o tipo e a mensagem para exibir o cartão na tela

    timeoutRef.current = setTimeout(() => {
      setNotificacao(null);
    }, 5000); // agenda o fechamento automático da notificação após 5 segundos

  };

  const fecharNotificacao = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    } // cancela o temporizador ativo caso o usuário feche manualmente antes dos 5 segundos

    setNotificacao(null); // limpa o estado, removendo o cartão da tela imediatamente

  };

  const criarTarefa = async (novaTarefa) => {
    try {
      const resposta = await fetch('/tarefas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaTarefa)
      });
      if (resposta.ok) {
        buscarTarefas();
        fecharModal();
        dispararNotificacao('sucesso', 'Tarefa criada com sucesso!');
      } else {
        console.error(await resposta.json());
        dispararNotificacao('erro', 'Não foi possível criar a tarefa.');
      }
    } catch (erro) {
      console.error(erro);
      dispararNotificacao('erro', 'Erro ao conectar ao servidor.');
    }
  }; // função genérica do js que faz um POST na API para adicionar os dados coletados do formulário que cria a tarefa. 
  // dispara notificações no momento da criação e dos erros que possam surgir no processo

  const abrirEdicao = (tarefa) => setTarefaEmEdicao(tarefa); // abre o modal de atualizar com a tarefa clicada
  const fecharEdicao = () => setTarefaEmEdicao(null);

  // faz um PUT na API com os dados novos. Devolve null se deu certo, ou o texto do erro se o backend recusou (400)
  const atualizarTarefa = async (id, dadosAtualizados) => {
    try {
      const resposta = await fetch(`/tarefas/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      });
      if (resposta.ok) {
        buscarTarefas(); // recarrega a lista
        fecharEdicao();
        dispararNotificacao('atualizacao', 'Tarefa atualizada com sucesso!');
        return null;
      }
      const erros = await resposta.json(); // ex: { data_fim: ["..."] }
      const msg = Object.entries(erros).map(([campo, m]) => `${campo}: ${[].concat(m).join(' ')}`).join(' | ');
      dispararNotificacao('erro', msg || 'Erro ao atualizar tarefa.');
      return msg;
    } catch (erro) {
      console.error(erro);
      dispararNotificacao('erro', 'Não consegui falar com a API.');
      return 'Não consegui falar com a API.';
    }
  };

  // faz um DELETE na API depois de confirmar com o usuário; o backend responde 204 se apagou
  const excluirTarefa = async (id) => {
    if (!window.confirm('Excluir esta tarefa? Isso não pode ser desfeito.')) return;
    try {
      const resposta = await fetch(`/tarefas/${id}/`, { method: 'DELETE' });
      if (resposta.status === 204) {
        buscarTarefas();
        fecharEdicao();
        dispararNotificacao('atualizacao', 'Tarefa excluída com sucesso!');
      }
    } catch (erro) {
      console.error(erro);
      dispararNotificacao('erro', 'Erro ao excluir tarefa.');
    }
  };

  const alternarStatusTarefa = async (id, statusAtual) => {

    const isConcluida = statusAtual === 'concluida' || statusAtual === 'concluída'; // verifica se o status da tarefa é concluida, e armazena o booleano dentro de isConluida
    const novoStatus = isConcluida ? 'aberta' : 'concluida'; // se já estava concluída, desmarca para aberta. Caso contrário, marca como concluida

    try {
      if (novoStatus === 'concluida') {
        const resposta = await fetch(`/tarefas/${id}/marcar_concluida/`, {
          method: 'PATCH',
        }); // se o status foi marcado para concluido, faz-se uma requisição PATCH no endpoint de marcar_concluida para modificar o status da tarefa para concluída
        if (!resposta.ok) {
          await fetch(`/tarefas/${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'concluida' })
          }); // se der erro pelo endpoint, forço o PATCH via JS
        }
      } else {
        await fetch(`/tarefas/${id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'aberta', data_fim: null })
        }); // se o status foi desmarcado, forço o PATCH via JS para modificar o status da tarefa para aberta novamente
      }

      buscarTarefas();

    } catch (erro) {
      console.error(erro);
      buscarTarefas();
    }
  };

  return (
    <div className="app-container">
      {notificacao && (
        <Notificacao
          tipo={notificacao.tipo}
          mensagem={notificacao.mensagem}
          aoFechar={fecharNotificacao}
        />
      )}

      <div id="main-view">
          <header className="header">
              <h1 className="header__title">Olá!</h1>
          </header>

          <main className="main-content">
              <section className="filter-by-title" style={{ marginTop: '20px' }}>
                <FiltragemPorTitulo tarefas={tarefas} aoAlternarStatus={alternarStatusTarefa}/>
              </section>
          </main>

          <button className="fab" id="btn-add" onClick={abrirModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
      </div>

      <div className="modal-overlay" id="overlay" style={{display: modalAberto ? 'block' : 'none'}} onClick={fecharModal}></div>

      {modalAberto && (
      <div className="modal-wrapper" style={{display: 'block'}}>
          <div className="modal">
              <FormularioTarefa aoCriarTarefa={criarTarefa} aoCancelar={fecharModal} />
          </div>
      </div>
      )}

    </div>
  );
}

export default App;
