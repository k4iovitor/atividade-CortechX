import { useState } from 'react'
import './FiltragemPorTitulo.css';
import CartaoTarefa from '../cartao/CartaoTarefa';

export default function FiltragemPorTitulo ({ tarefas, aoAlternarStatus }) {
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
            <section className="task-list" style={{ marginTop: '20px' }}>
                {tarefasFiltradas.map(tarefa => (
                    <CartaoTarefa key={tarefa.id} tarefa={tarefa} onAlternarStatus={aoAlternarStatus} />
                ))}
            </section>
        </>
    );
}