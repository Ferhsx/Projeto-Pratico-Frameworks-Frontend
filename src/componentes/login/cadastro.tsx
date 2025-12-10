import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useState } from "react";

function Cadastrar() {
    const navigate = useNavigate();
    const [mensagemErro, setMensagemErro] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMensagemErro(null);
        setEnviando(true);

        const formData = new FormData(event.currentTarget);
        const payload = {
            nome: String(formData.get("nome") ?? "").trim(),
            idade: Number(formData.get("idade") ?? 0),
            email: String(formData.get("email") ?? "").trim(),
            senha: String(formData.get("senha") ?? ""),
        };

        console.log("Enviando POST /cadastro payload:", payload);

        try {
            const resposta = await api.post("/cadastro", payload);
            console.log("Resposta /cadastro:", resposta.status, resposta.data);
            if (resposta.status === 201) {
                navigate("/login");
            } else {
                setMensagemErro(`Resposta inesperada: ${resposta.status}`);
            }
        } catch (error: any) {
            console.error("Erro POST /cadastro:", {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message
            });
            const msg = error?.response?.data?.mensagem
                     || error?.response?.data?.error
                     || error?.response?.data
                     || error?.message
                     || "Erro desconhecido";
            setMensagemErro(String(msg));
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                
                <h1 className="text-3xl font-bold text-center text-white">
                    Criar Conta
                </h1>
                
                {mensagemErro && (
                    <div className="p-3 bg-red-800 border border-red-600 text-red-200 rounded-md text-center">
                        {mensagemErro}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Nome
                        </label>
                        <input 
                            type="text" 
                            name="nome" 
                            placeholder="Seu nome" 
                            required 
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Idade
                        </label>
                        <input 
                            type="number" 
                            name="idade" 
                            placeholder="Sua idade" 
                            required 
                            min={0}
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Email
                        </label>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="seu@email.com" 
                            required 
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Senha
                        </label>
                        <input 
                            type="password" 
                            name="senha" 
                            placeholder="Crie uma senha" 
                            required 
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={enviando}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {enviando ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>
                
                <div className="text-center text-gray-400">
                    Já tem uma conta?{' '}
                    <a href="/login" className="font-medium text-blue-500 hover:underline">
                        Faça login
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Cadastrar;