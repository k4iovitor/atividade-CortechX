import './SeletorDePrioridade.css';

export default function SeletorDePrioridade({ prioridade, setPrioridade }) {
  return (
    <div className="priority-group">
        <h3 className="priority-group__title">Prioridade (1 a 5)</h3>
        <div className="priority-group__options">
            {[1, 2, 3, 4, 5].map(p => (
                <label key={p} className="priority-option" onClick={() => setPrioridade(p)}>
                    <input type="radio" name="add_prio" value={p} style={{display: 'none'}} />
                    <span className={`circle ${prioridade === p ? 'circle--selected' : ''}`}></span>
                    <span className="number">{p}</span>
                </label>
            ))}
        </div>
    </div>
  );
}

