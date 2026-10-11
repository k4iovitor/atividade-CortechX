import { useState, useEffect } from 'react';
import './App.css';
import FormularioTarefa from './componentes/formulario/FormularioTarefa';
import FiltragemPorTitulo from './componentes/filtragem/FiltragemPorTitulo';

function App() {
  const [tarefas, setTarefas] = useState([]); // estado que armazena as tarefas criadas pelo usuário
  const [modalAberto, setModalAberto] = useState(false); // estado que armazena a informação de se o modal está aberto ou não

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
      } else {
          console.error(await resposta.json());
      }
    } catch (erro) { console.error(erro); }
  }; // função genérica do js que faz um POST na API para adicionar os dados coletados do formulário que cria a tarefa

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
