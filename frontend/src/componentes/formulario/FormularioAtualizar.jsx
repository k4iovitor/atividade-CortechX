import { useState } from 'react';
import './FormularioTarefa.css';
import './CamposDeTexto.css';
import './GrupoDeDatas.css';
import './RodapeFormulario.css';
import './SeletorDeStatus.css';
import SeletorDePrioridade from './SeletorDePrioridade';

const STATUS_VALIDOS = ['aberta', 'em_andamento', 'concluida'];

const paraCampoData = (valor) => (valor ? valor.slice(0, 16) : '');

export default function FormularioAtualizar({ tarefa, aoAtualizar, aoExcluir, aoFechar }) {

  const [titulo, setTitulo] = useState(tarefa.titulo);
  const [descricao, setDescricao] = useState(tarefa.descricao || '');
  const [status, setStatus] = useState(
    tarefa.status === 'concluída' ? 'concluida'
      : STATUS_VALIDOS.includes(tarefa.status) ? tarefa.status : 'aberta'
  );
  const [dataInicio, setDataInicio] = useState(paraCampoData(tarefa.data_inicio));
  const [dataFim, setDataFim] = useState(paraCampoData(tarefa.data_fim));
  const [prioridade, setPrioridade] = useState(tarefa.prioridade);
  const [erro, setErro] = useState(''); 
  const [enviando, setEnviando] = useState(false); 

  const lidarComEnvio = async (e) => {
    e.preventDefault();
    setErro('');
    setEnviando(true);

    const dadosAtualizados = {
      titulo: titulo.trim(),
      descricao,
      status,
      prioridade: parseInt(prioridade),
      data_inicio: dataInicio ? new Date(dataInicio).toISOString() : null,
      data_fim: dataFim ? new Date(dataFim).toISOString() : null,
    };

    const mensagemErro = await aoAtualizar(tarefa.id, dadosAtualizados);
    if (mensagemErro) setErro(mensagemErro);
    setEnviando(false);
  };

  return (
    <form onSubmit={lidarComEnvio} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="modal__header modal__header--center">
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar"
          style={{ position: 'absolute', left: 20, background: 'none', border: 0, fontSize: 24, cursor: 'pointer' }}
        >
          ×
        </button>
        <h2 className="modal__title">Atualizar Tarefa</h2>
      </div>

      <div className="modal__body">
        {}
        {erro && <p role="alert" style={{ color: 'var(--color-danger)', fontSize: 14, margin: '0 0 10px' }}>{erro}</p>}

        <input
          type="text"
          className="input modal__input"
          placeholder="Título da Tarefa"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          className="input modal__textarea"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <div className="select-wrapper">
          <select className="input modal__select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="aberta">Aberta</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluida">Concluída</option>
          </select>
          <svg className="select-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        <div className="date-group">
          <div className="input date-input">
            <input type="datetime-local" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} />
          </div>
          <div className="input date-input">
            <input type="datetime-local" value={dataFim} onChange={(e) => setDataFim(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} />
          </div>
        </div>

        {}
        <SeletorDePrioridade prioridade={prioridade} setPrioridade={setPrioridade} />
      </div>

      <div className="modal__footer">
        <button type="button" className="btn btn--danger" onClick={() => aoExcluir(tarefa.id)}>Excluir</button>
        <button type="submit" className="btn btn--primary" disabled={enviando}>Atualizar</button>
      </div>
    </form>
  );
}