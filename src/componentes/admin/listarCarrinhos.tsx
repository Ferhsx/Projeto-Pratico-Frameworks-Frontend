import { useEffect, useState } from 'react';
import { carrinhoService } from '../../services/carrinhoService';

// Tipo para os dados que esperamos receber da nossa nova API
type CarrinhoAdmin = {
    _id: string;
    total: number;
    dataAtualizacao: string;
    nomeUsuario: string;
    emailUsuario: string;
    itens: any[];
}

export default function ListaCarrinhos() {
    const [carrinhos, setCarrinhos] = useState<CarrinhoAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function carregarCarrinhos() {
            try {
                const response = await carrinhoService.listarTodos();
                setCarrinhos(response.data);
            } catch (err) {
                setError("Falha ao carregar os carrinhos. Verifique se você tem permissão de administrador.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        carregarCarrinhos();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg font-medium">Carregando painel de carrinhos...</div>
        </div>
    );
    
    if (error) return (
        <div className="p-4 text-red-600">{error}</div>
    );

    return (
        <div className="p-5 font-sans max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Painel de Administrador - Carrinhos Ativos</h1>
            
            {carrinhos.length === 0 ? (
                <p className="text-gray-600">Nenhum carrinho ativo encontrado no sistema.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nº de Itens</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total do Carrinho</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Atualização</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {carrinhos.map((carrinho) => (
                                <tr key={carrinho._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {carrinho.nomeUsuario || 'Usuário Não Encontrado'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {carrinho.emailUsuario}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                                        {carrinho.itens.length}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                        R$ {carrinho.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {new Date(carrinho.dataAtualizacao).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                if (window.confirm('Tem certeza que deseja remover este carrinho?')) {
                                                    try {
                                                        await carrinhoService.removerCarrinhoPorId(carrinho._id);
                                                        // Atualiza a lista após a remoção
                                                        const response = await carrinhoService.listarTodos();
                                                        setCarrinhos(response.data);
                                                    } catch (error) {
                                                        console.error('Erro ao remover carrinho:', error);
                                                        alert('Erro ao remover carrinho. Tente novamente.');
                                                    }
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-900 hover:underline"
                                        >
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}