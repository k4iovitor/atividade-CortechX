export default function CamposDeTexto() {
    return (
        <>
            <input type="text" name="titulo" className="input modal__input" placeholder="Título da Tarefa" required />
            <textarea name="descricao" className="input modal__textarea" placeholder="Descrição"></textarea>
        </>
    );
}

