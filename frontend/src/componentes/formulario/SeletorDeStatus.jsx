export default function SeletorDeStatus() {
    return (
        <div className="select-wrapper">
            <select name="status" className="input modal__select" defaultValue="aberta">
                <option value="aberta">Aberta</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluida">Concluída</option>
            </select>
            <svg className="select-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </div>
    );
}

