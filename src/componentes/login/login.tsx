// Local: src/componentes/login/login.tsx

import { useNavigate, Link } from "react-router-dom"; // Importe o Link
import api from "../../api/api";
import { useState } from "react";

function Login() {
    const navigate = useNavigate();
    const [mensagemErro, setMensagemErro] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // Bônus: Estado de carregamento

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMensagemErro(null);
        setLoading(true); // Ativa o estado de carregamento

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const senha = formData.get("senha");

        api.post("/login", {
            email,
            senha
        }).then(resposta => {
            if (resposta.status === 200 && resposta.data) {
                localStorage.setItem("token", resposta.data.token);
                localStorage.setItem("tipoUsuario", resposta.data.tipoUsuario);
                localStorage.setItem("nomeUsuario", resposta.data.nome);
                localStorage.setItem("usuarioId", resposta.data.usuarioId);
                navigate("/");
            } else {
                setMensagemErro("Resposta inválida do servidor.");
            }
        }).catch((error: any) => {
            const msg = error?.response?.data?.mensagem || error?.message || "Erro Desconhecido!";
            setMensagemErro(msg);
        }).finally(() => {
            setLoading(false); // Desativa o estado de carregamento, não importa o resultado
        });
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                
                <h1 className="text-3xl font-bold text-center text-white">
                    Entrar na sua Conta
                </h1>
                
                {/* Exibição da mensagem de erro */}
                {mensagemErro && (
                    <div className="p-3 bg-red-800 border border-red-600 text-red-200 rounded-md text-center">
                        {mensagemErro}
                    </div>
                )} 
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campo de Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                            Endereço de Email
                        </label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            required
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    {/* Campo de Senha */}
                    <div>
                        <label htmlFor="senha" className="block text-sm font-medium text-gray-300 mb-1">
                            Senha
                        </label>
                        <input 
                            type="password" 
                            name="senha" 
                            id="senha" 
                            required
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Botão de Envio */}
                    <div>
                        <button 
                            type="submit" 
                            disabled={loading} // Desativa o botão durante o carregamento
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>

                {/* Link para a página de Cadastro */}
                <div className="text-center text-gray-400">
                    Não tem uma conta?{' '}
                    <Link to="/cadastro" className="font-medium text-blue-500 hover:underline">
                        Cadastre-se
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Login;