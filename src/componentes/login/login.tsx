import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useState } from "react"; // <-- 1. Importar o useState

function Login() {
    const navigate = useNavigate();
    
    // Removemos o useSearchParams, não é mais necessário para esta lógica
    // const [searchParams] = useSearchParams() 
    // const mensagem = searchParams.get("mensagem") 

    // <-- 2. Criamos um estado para armazenar a mensagem de erro
    const [mensagemErro, setMensagemErro] = useState<string | null>(null);

    //Função chamada quando clicamos no botão do formulário
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        // <-- 3. Limpa erros antigos antes de uma nova tentativa
        setMensagemErro(null); 

        //Vamos pegar o que a pessoa digitou no formulário
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const senha = formData.get("senha");

        //chamar a API.post para mandar o login e senha
        api.post("/login", {
            email,
            senha
        }).then(resposta => {
            // 1. Verifica se a resposta foi 200 e se o token existe nos dados
            if (resposta.status === 200 && resposta?.data?.token) {

                // 2. Armazena o Token
                localStorage.setItem("token", resposta.data.token);
                
                // 3. Armazena o Tipo de Usuário
                localStorage.setItem("tipoUsuario", resposta.data.tipoUsuario);
                // 4. Armazena o Nome do Usuário (NOVA LINHA)
                localStorage.setItem("nomeUsuario", resposta.data.nome);
                navigate("/");
            }
        }).catch((error: any) => {
            const msg = error?.response?.data?.mensagem ||
                error?.message || // Corrigido de 'mensagem' para 'message'
                "Erro Desconhecido!";
            
            // <-- 5. Em vez de navegar, apenas atualizamos o estado com o erro
            setMensagemErro(msg); 
        });
    }


    return (
        <>
            <h1>Login</h1>
            
            {/* 6. Exibe a mensagem de erro vinda do estado */}
            {/* Usamos o 'mensagemErro' do estado em vez da 'mensagem' da URL */}
            {mensagemErro && <p style={{ color: 'red' }}>{mensagemErro}</p>} 
            
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="text" name="email" id="email" />
                <br />
                <label htmlFor="senha">Senha:</label>
                <input type="password" name="senha" id="senha" />
                <br />
                <button type="submit">Entrar</button>
            </form>
        </>
    )
}
export default Login;