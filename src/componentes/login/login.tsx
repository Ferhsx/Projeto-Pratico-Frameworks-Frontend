import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/api";
import { useState } from "react";
import "./login.css";

interface LoginProps {
  onLoginSuccess?: () => void;
}

function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mensagem = searchParams.get("mensagem");
  const from = searchParams.get("from") || "/";

  //Função chamada quando clicamos no botão do formulário
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Limpa estados
    setError(null);
    setIsLoading(true);
    
    // Obtém os dados do formulário
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const senha = formData.get("senha") as string;
    
    console.log('Tentando fazer login com:', { email });
    
    try {
      console.log('Enviando requisição para /login...');
      const resposta = await api.post("/login", {
        email,
        senha
      });
      
      console.log('Resposta recebida:', resposta);
      
      // Verifica se o login foi bem-sucedido
      if (resposta.status >= 200 && resposta.status < 300) {
        // Tenta obter o token de diferentes formatos de resposta
        const token = resposta.data?.token || 
                     resposta.data?.access_token || 
                     resposta.data?.data?.token;
        
        console.log('Token recebido:', token ? '***' : 'Nenhum token encontrado');
        
        if (token) {
          // Salva o token no localStorage
          localStorage.setItem("token", token);
          console.log('Token salvo no localStorage');
          
          // Dispara o callback de sucesso, se existir
          onLoginSuccess?.();
          
          // Redireciona para a página de origem ou para a página inicial
          navigate(from, { replace: true });
          return;
        } else {
          throw new Error('O servidor não retornou um token de autenticação');
        }
      } else {
        throw new Error(`Erro inesperado: ${resposta.status} - ${resposta.statusText}`);
      }
    } catch (error: any) {
      console.error('Erro durante o login:', error);
      
      let mensagemErro = "Erro ao fazer login. Verifique suas credenciais.";
      
      // Trata diferentes tipos de erros
      if (error.response) {
        // O servidor respondeu com um status de erro
        console.error('Detalhes do erro:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Mensagens de erro específicas com base no status da resposta
        if (error.response.status === 401) {
          mensagemErro = "E-mail ou senha incorretos. Por favor, tente novamente.";
        } else if (error.response.data?.message) {
          mensagemErro = error.response.data.message;
        } else if (error.response.data?.error) {
          mensagemErro = error.response.data.error;
        } else if (error.response.status >= 500) {
          mensagemErro = "Erro no servidor. Por favor, tente novamente mais tarde.";
        }
      } else if (error.request) {
        // A requisição foi feita, mas não houve resposta
        console.error('Sem resposta do servidor:', error.request);
        mensagemErro = "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
      } else {
        // Outros erros
        console.error('Erro ao configurar a requisição:', error.message);
        mensagemErro = `Erro: ${error.message}`;
      }
      
      setError(mensagemErro);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-background"></div>
      <div className="login-container">
        <h1>Bem-vindo de volta</h1>
        {mensagem && <p>{mensagem}</p>}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Digite seu e-mail" 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input 
              type="password" 
              id="senha" 
              name="senha" 
              placeholder="Digite sua senha" 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn-login" 
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
          <a href="#" className="link-forgot">Esqueceu sua senha?</a>
        </form>
      </div>
    </div>
  );
}

export default Login;