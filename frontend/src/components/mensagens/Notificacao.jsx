import './Notificacao.css';

const CONFIGURACOES = {
  sucesso: {
    titulo: 'Sucesso!',
    mensagemPadrao: 'Tarefa criada com sucesso!',
    classe: 'cartao-alerta--sucesso',
    icone: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  criacao: {
    titulo: 'Sucesso!',
    mensagemPadrao: 'Tarefa criada com sucesso!',
    classe: 'cartao-alerta--sucesso',
    icone: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  atualizacao: {
    titulo: 'Atualizado!',
    mensagemPadrao: 'Tarefa atualizada com sucesso!',
    classe: 'cartao-alerta--atualizacao',
    icone: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  erro: {
    titulo: 'Erro!',
    mensagemPadrao: 'Ocorreu um erro ao processar a tarefa.',
    classe: 'cartao-alerta--erro',
    icone: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
}; // armazena as informações e o html de cada tipo de notificação existente no sistema

export default function Notificacao({ tipo = 'sucesso', mensagem, aoFechar }) {
  const config = CONFIGURACOES[tipo] || CONFIGURACOES.sucesso; // por padrão, manda a estrutura da notificação de sucesso pra config
  // se o tipo recebido no parâmetro tipo for outro, busca-se a estrutura desse tipo dentro da variável global de configurações e manda para config

  // a partir de config, os dados são descompactados e retorna-se o html com a formatação relativa ao tipo de notificação dentro dela
  return (
    <div className={`cartao-alerta ${config.classe}`} role="alert">
      <div className="cartao-alerta__icone">
        {config.icone}
      </div>

      <div className="cartao-alerta__conteudo">
        <strong className="cartao-alerta__titulo">{config.titulo}</strong>
        <p className="cartao-alerta__mensagem">{mensagem || config.mensagemPadrao}</p>
      </div>

      {aoFechar && (
        <button className="cartao-alerta__botao-fechar" onClick={aoFechar} aria-label="Fechar">
          &times;
        </button>
      )}

      <div className="cartao-alerta__barra-progresso" />
    </div>
  );
}

