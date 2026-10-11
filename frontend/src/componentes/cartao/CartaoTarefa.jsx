import './CartaoTarefa.css';

export default function CartaoTarefa({ tarefa, onAlternarStatus }) {

    const isConcluida = tarefa.status === 'concluida' || tarefa.status === 'concluída';
    // true se for concluída, false se for aberta ou em_andamento
    // se for true, a amostragem do cartão é modificada para um estilo de cartão marcado. Se false, só deixar como tá
    // o checked sendo true, a caixa de marcação é preenchida. Independentemente de estar marcada ou não, se atualiza o status da atividade via onAlternarStatus
    
    return (
        <article className={`task-card ${isConcluida ? 'task-card--concluida' : ''}`}>
            <div className="task-card__header">
                <div className="task-card__title-group">
                    <h3 className="task-card__title">{tarefa.titulo}</h3>
                    <span className="task-card__separator">|</span>
                    <span className="task-card__status">
                        {isConcluida ? 'Concluída' : (tarefa.status === 'em_andamento' ? 'Em andamento' : 'Aberta')}
                    </span>
                </div>
                <label className="task-card__checkbox-container">
                    <input 
                        type="checkbox" 
                        className="task-card__checkbox" 
                        checked={isConcluida} 
                        onChange={() => {
                            if (onAlternarStatus) {
                                onAlternarStatus(tarefa.id, tarefa.status);
                            }
                        }}
                    />
                </label>
            </div>
            <p className="task-card__desc">{tarefa.descricao}</p>
        </article>
    );
}

