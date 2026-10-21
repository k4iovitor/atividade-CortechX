import { useState, useEffect } from 'react';
import './VisaoGeral.css';

// Tela "Visão Geral": resumo das tarefas.
export default function VisaoGeral({ aoFechar }) {
  const [resumo, setResumo] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const buscarResumo = async () => {
      try {
        const resposta = await fetch('/tarefas/estatisticas/');
        if (resposta.ok) {
          setResumo(await resposta.json());
        } else {
          setErro(true);
        }
      } catch (e) {
        console.error(e);
        setErro(true);
      }
    };
    buscarResumo();
  }, []);

  const total = resumo ? resumo.total : '-';
  const media = resumo ? Number(resumo.prioridade_media).toFixed(1) : '-'; // uma casa decimal
  const concluidas = resumo ? (resumo.por_status.concluida || 0) : '-'; // status sem tarefas não vem na resposta, então o padrão é 0
  const emAndamento = resumo ? (resumo.por_status.em_andamento || 0) : '-';
  const abertas = resumo ? (resumo.por_status.aberta || 0) : '-';

  return (
    <>
      <div className="modal__header modal__header--with-close">
        <button type="button" className="btn-icon" aria-label="Fechar" onClick={aoFechar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <h2 className="modal__title modal__title--centered">Visão Geral</h2>
      </div>

      <div className="modal__body">
        {erro && (
          <p style={{ textAlign: 'center' }}>Não foi possível carregar o resumo.</p>
        )}

        <div className="chart-group">
          <div className="chart-item">
            <div className="chart__circle"><span>{total}</span></div>
            <p className="chart__label">Quantidade<br />de Tarefas</p>
          </div>
          <div className="chart-item">
            <div className="chart__circle"><span>{media}</span></div>
            <p className="chart__label">Prioridade<br />Média</p>
          </div>
        </div>

        <h3 className="status-list__title">Detalhamento por Status</h3>
        <ul className="status-list">
          <li className="status-item">
            <span className="status-item__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="status-item__label">Concluídas</span>
            <span className="status-item__count">{concluidas}</span>
          </li>
          <li className="status-item">
            <span className="status-item__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </span>
            <span className="status-item__label">Em Andamento</span>
            <span className="status-item__count">{emAndamento}</span>
          </li>
          <li className="status-item">
            <span className="status-item__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              </svg>
            </span>
            <span className="status-item__label">Abertas</span>
            <span className="status-item__count">{abertas}</span>
          </li>
        </ul>
      </div>
    </>
  );
}