export default function GrupoDeDatas() {
    return (
        <div className="date-group" style={{ flexDirection: 'column' }}>
            <div className="input date-input">
                <input type="datetime-local" name="data_inicio" style={{border: 'none', background: 'transparent', width: '100%', outline: 'none'}} />
            </div>
            <div className="input date-input">
                <input type="datetime-local" name="data_fim" style={{border: 'none', background: 'transparent', width: '100%', outline: 'none'}} />
            </div>
        </div>
    );
}

