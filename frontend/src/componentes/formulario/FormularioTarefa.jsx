import { useState } from 'react';
import './FormularioTarefa.css';
import CamposDeTexto from './CamposDeTexto';
import SeletorDeStatus from './SeletorDeStatus';
import GrupoDeDatas from './GrupoDeDatas';
import SeletorDePrioridade from './SeletorDePrioridade';
import RodapeFormulario from './RodapeFormulario';

export default function FormularioTarefa({ aoCriarTarefa, aoCancelar }) {

  const [prioridade, setPrioridade] = useState(1);
  const [erro, setErro] = useState('');

  const lidarComEnvio = async (e) => {
    e.preventDefault(); // impede o navegador de recarregar a página
    setErro('');

    const formData = new FormData(e.target); // extrai todos os dados dentro dos campos do formulário
    const dados = Object.fromEntries(formData); // transforma os dados extraidos do form em objeto JS

    const novaTarefa = {
      titulo: dados.titulo,
      descricao: dados.descricao,
      status: dados.status || 'aberta',
      prioridade: parseInt(prioridade),
    }; // dicionário com os dados extraídos do form

    if (dados.data_inicio) novaTarefa.data_inicio = new Date(dados.data_inicio).toISOString();
    if (dados.data_fim) novaTarefa.data_fim = new Date(dados.data_fim).toISOString();
    // verifica se uma data de início foi inserida. Se sim, converte para o formato de data e tempo

    const mensagemErro = await aoCriarTarefa(novaTarefa); // chama a função passada via prop pelo componente pai, entregando a ela o objeto construído em lidarComEnvio
    // se a nova tarefa for criada, a função que cria a tarefa em App.jsx retorna null, caso contrário, uma mensagem de erro
    if (mensagemErro) setErro(mensagemErro); // se mensagemErro for falso, o estado da mensagem de erro continua vazia. Se for true, preenche o estado com a informação de erro
    // com o estado preenchido, o modal que mostra o erro em tela aparece
    
  };

  return (
    <form onSubmit={lidarComEnvio} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div className="modal__header modal__header--center">
          <h2 className="modal__title">Adicionar Tarefa</h2>
      </div>
      <div className="modal__body">
          {erro && <p role="alert" style={{ color: 'var(--color-danger)', fontSize: 14, margin: '0 0 10px' }}>{erro}</p>}
          <CamposDeTexto />
          <SeletorDeStatus />
          <GrupoDeDatas />
          <SeletorDePrioridade prioridade={prioridade} setPrioridade={setPrioridade} />
      </div>
      <RodapeFormulario aoCancelar={aoCancelar} />
    </form>
  );
}

