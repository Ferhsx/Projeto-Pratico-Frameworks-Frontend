import { useSearchParams } from "react-router-dom";
function Erro() {
    const [searchParams] = useSearchParams()
    const mensagem = searchParams.get("mensagem")
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-black text-red-500 mb-4">Erro</h1>
                <p className="text-gray-600 text-lg mb-8">
                    {mensagem || "Algo deu errado. Tente novamente mais tarde."}
                </p>
                <a 
                    href="/" 
                    className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Voltar para a Página Inicial
                </a>
            </div>
        </div>
    )
}
export default Erro;