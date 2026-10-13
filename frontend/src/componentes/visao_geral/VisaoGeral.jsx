import './VisaoGeral.css';

// Tela "Visão Geral": resumo das tarefas.
export default function VisaoGeral() {
  return (
    <>
      <div className="modal__header modal__header--with-close">
        <button type="button" className="btn-icon" aria-label="Fechar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <h2 className="modal__title modal__title--centered">Visão Geral</h2>
      </div>

      <div className="modal__body">
        <div className="chart-group">
          <div className="chart-item">
            <div className="chart__circle"><span>3</span></div>
            <p className="chart__label">Quantidade<br />de Tarefas</p>
          </div>
          <div className="chart-item">
            <div className="chart__circle"><span>3.8</span></div>
            <p className="chart__label">Prioridade<br />Média</p>
          </div>
        </div>
      </div>
    </>
  );
}