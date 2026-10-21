import './RodapeFormulario.css';

export default function RodapeFormulario({ aoCancelar }) {
    return (
        <div className="modal__footer">
            <button type="button" className="btn btn--outline" onClick={aoCancelar}>Cancelar</button>
            <button type="submit" className="btn btn--primary">Criar Tarefa</button>
        </div>
    );
}

