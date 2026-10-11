import './CartaoTarefa.css';

export default function CartaoTarefa({ tarefa, onMarcarConcluida }) {
    const isConcluida = tarefa.status === 'concluida' || tarefa.status === 'concluída';

    const lidarComClique = (e) => {
        if (!isConcluida && onMarcarConcluida) {
            onMarcarConcluida(tarefa.id);
        }
    };

    return (
        <article 
            className={`task-card ${isConcluida ? 'task-card--concluida' : ''}`}
            onClick={lidarComClique}
        >
            <div className="task-card__header">
                <div className="task-card__title-group">
                    <h3 className="task-card__title">{tarefa.titulo}</h3>
                    <span className="task-card__separator">|</span>
                    <span className="task-card__status">
                        {isConcluida ? 'Concluída' : (tarefa.status === 'em_andamento' ? 'Em andamento' : 'Aberta')}
                    </span>
                </div>
                <input 
                    type="checkbox" 
                    className="task-card__checkbox" 
                    checked={isConcluida} 
                    onChange={lidarComClique}
                    onClick={(e) => e.stopPropagation()} 
                />
            </div>
            <p className="task-card__desc">{tarefa.descricao}</p>
        </article>
    );
}

