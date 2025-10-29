import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ErrorMessage } from "./ErrorHandler";
import ErrorDisplay from "./ErrorDisplay";
import './erro.css';

export default function Erro() {
    const [searchParams] = useSearchParams();
    const mensagem = searchParams.get("mensagem");
    const [erro, setErro] = useState<ErrorMessage | null>(null);

    useEffect(() => {
        if (mensagem) {
            // Criar um erro genérico com a mensagem da URL
            setErro({
                titulo: '⚠️ Erro',
                mensagem: decodeURIComponent(mensagem),
                tipo: 'generico',
                icone: '❌'
            });
        }
    }, [mensagem]);

    return (
        <div className="erro-page">
            <div className="erro-container">
                <h1>Oops! Algo deu errado</h1>
                
                {erro ? (
                    <ErrorDisplay 
                        erro={erro} 
                        onClose={() => setErro(null)}
                        autoFechar={false}
                    />
                ) : (
                    <div className="erro-padrao">
                        <p>Desculpe, ocorreu um erro inesperado.</p>
                        <a href="/" className="link-home">Voltar para Home</a>
                    </div>
                )}
            </div>
        </div>
    );
}
