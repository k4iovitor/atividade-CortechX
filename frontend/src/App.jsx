import { useState, useEffect } from 'react';
import './index.css';
import FormularioTarefa from './componentes/formulario/FormularioTarefa';
import CartaoTarefa from './componentes/CartaoTarefa';

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
  };

  return (
    <div className="app-container">
      <div id="main-view">
          <header className="header">
              <h1 className="header__title">Olá!</h1>
          </header>

          <main className="main-content">
              <section className="task-list" style={{ marginTop: '20px' }}>
                  {tarefas.map(tarefa => (
                      <CartaoTarefa key={tarefa.id} tarefa={tarefa} />
                  ))}
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
