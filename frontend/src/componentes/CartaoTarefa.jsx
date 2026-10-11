import './CartaoTarefa.css';

export default function CartaoTarefa({ tarefa }) {
    return (
        <article className="task-card">
            <div className="task-card__header">
                <div className="task-card__title-group">
                    <h3 className="task-card__title">{tarefa.titulo}</h3>
                    <span className="task-card__separator">|</span>
                    <span className="task-card__status">
                        {tarefa.status === 'concluida' ? 'Concluída' : (tarefa.status === 'em_andamento' ? 'Em andamento' : 'Aberta')}
                    </span>
                </div>
                <input type="checkbox" className="task-card__checkbox" checked={tarefa.status === 'concluida'} readOnly />
            </div>
            <p className="task-card__desc">{tarefa.descricao}</p>
        </article>
    );
}

