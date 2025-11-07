// Local: src/componentes/login/login.tsx

import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useState } from "react";

function Login() {
    const navigate = useNavigate();
    const [mensagemErro, setMensagemErro] = useState<string | null>(null);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMensagemErro(null); 

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const senha = formData.get("senha");

        api.post("/login", {
            email,
            senha
        }).then(resposta => {
            // Verifica se a resposta foi bem-sucedida e se os dados existem
            if (resposta.status === 200 && resposta.data) {

                // 👇 AQUI ESTÁ A CORREÇÃO CRÍTICA 👇
                // Salva TODOS os dados recebidos da API no localStorage
                localStorage.setItem("token", resposta.data.token);
                localStorage.setItem("tipoUsuario", resposta.data.tipoUsuario);
                localStorage.setItem("nomeUsuario", resposta.data.nome);
                localStorage.setItem("usuarioId", resposta.data.usuarioId);
                
                // Redireciona para a página principal
                navigate("/");

            } else {
                // Caso a resposta seja 200 mas não tenha dados, define um erro genérico
                setMensagemErro("Resposta inválida do servidor.");
            }
        }).catch((error: any) => {
            const msg = error?.response?.data?.mensagem ||
                error?.message ||
                "Erro Desconhecido!";
            
            setMensagemErro(msg); 
        });
    }

    return (
        <>
            <h1>Login</h1>
            
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