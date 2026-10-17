import { useState } from 'react'
import './FiltragemPorTitulo.css';
import CartaoTarefa from '../cartao/CartaoTarefa';

export default function FiltragemPorTitulo ({ tarefas, aoAlternarStatus, aoEditar, aoFiltrarAltaPrioridade, filtroAltaPrioridade }) {
    const [tituloTarefa, setTitulo] = useState(''); // estado que armazena o titulo da tarefa que o usuário deseja filtrar.

    const lidarComTexto = (e) => {
        setTitulo(e.target.value);
    }; // coleta o titulo do input e envia para o estado

    const tarefasFiltradas = tarefas.filter(tarefa => tarefa.titulo.toLowerCase().includes(tituloTarefa.toLowerCase()));
    // filtra, entre as tarefas que foram passadas como props do componente, a tarefa que possui titulo equivalente com o digitado no input
    // se o input estiver vazio, a filtragem retorna todas as tarefas, o que acaba retornando todos os cartões na tela
    
    return (
        <>
            <input type="text" name="titulo" className="input filter_by_title" placeholder="Filtrar por titulo..." required value={tituloTarefa} onChange={lidarComTexto}/>
            
            <div className="filtro-prioridade-wrapper">
                <button
                    type="button"
                    className={`btn-filtro-prioridade ${filtroAltaPrioridade ? 'btn-filtro-prioridade--ativo' : ''}`}
                    onClick={aoFiltrarAltaPrioridade}
                >
                    <span>{filtroAltaPrioridade ? 'Prioridade Alta • Ativo' : 'Filtrar Prioridade Alta'}</span>
                </button>
            </div>

            <section className="task-list" style={{ marginTop: '16px' }}>
                {tarefasFiltradas.length > 0 ? (
                    tarefasFiltradas.map(tarefa => (
                        <CartaoTarefa key={tarefa.id} tarefa={tarefa} onAlternarStatus={aoAlternarStatus} onEditar={aoEditar} />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-light)', fontSize: '14px', marginTop: '20px' }}>
                        Nenhuma tarefa encontrada.
                    </p>
                )}
            </section>
        </>
    );
}