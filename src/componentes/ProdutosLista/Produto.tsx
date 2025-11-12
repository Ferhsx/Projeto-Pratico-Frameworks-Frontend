// Em src/pages/DetalheProdutoPage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';

// Defina o tipo de produto para garantir consistência
type ProdutoType = {
    _id: string;
    nome: string;
    preco: number;
    urlfoto: string;
    descricao: string;
};

export default function DetalheProdutoPage() {
    const { id } = useParams<{ id: string }>(); // Pega o 'id' da URL (ex: /produto/12345)
    const navigate = useNavigate();

    const [produto, setProduto] = useState<ProdutoType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Efeito para buscar os dados do produto quando o componente carrega ou o ID muda
    useEffect(() => {
        const fetchProduto = async () => {
            if (!id) {
                setError("ID do produto não fornecido");
                return;
            }

            try {
                setLoading(true);
                const response = await api.get<ProdutoType>(`/produtos/${id}`);
                setProduto(response.data);
                setError(null); // Clear any previous errors
            } catch (err) {
                if ((err as any).response?.status === 404) {
                    setError("Produto não encontrado.");
                } else {
                    setError("Erro ao carregar o produto. Tente novamente mais tarde.");
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduto();
    }, [id]); // Dependência: Roda o efeito novamente se o ID na URL mudar

    // Função para adicionar ao carrinho (reutilizada)
    const handleAdicionarCarrinho = (produtoId: string) => {
        api.post('/adicionarItem', { produtoId, quantidade: 1 })
            .then(() => alert("Produto adicionado ao carrinho!")) // Troque por uma notificação "toast" depois
            .catch((error) => {
                console.error('Erro ao adicionar ao carrinho:', error);
                alert('Erro ao adicionar o produto. Verifique se você está logado.');
            });
    };

    // --- Renderização Condicional ---

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !produto) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
                <div className="text-center max-w-md">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">Produto não encontrado</h1>
                    <p className="text-gray-300 mb-8">
                        O produto que você está procurando não existe ou foi removido.
                    </p>
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            Voltar para a Loja
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            Voltar à página anterior
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- Renderização de Sucesso ---

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            {/* Botão de Voltar */}
            <button onClick={() => navigate(-1)} className="mb-8 text-gray-400 hover:text-white">
                &larr; Voltar
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Coluna da Esquerda: Imagem */}
                <div>
                    <img
                        src={produto.urlfoto}
                        alt={produto.nome}
                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                    />
                </div>

                {/* Coluna da Direita: Informações e Ações */}
                <div className="flex flex-col">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                        {produto.nome}
                    </h1>
                    <p className="text-gray-300 text-lg mt-4">
                        {produto.descricao}
                    </p>

                    <div className="mt-8">
                        <span className="text-5xl font-extrabold text-white">
                            R$ {produto.preco.toFixed(2)}
                        </span>
                    </div>
                    

                    <div className="mt-auto pt-8">
                        <button
                            onClick={() => handleAdicionarCarrinho(produto._id)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-8 rounded-lg transition-transform duration-200 hover:scale-105"
                        >
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}