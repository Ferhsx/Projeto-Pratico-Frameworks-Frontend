import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carrinhoService } from '../../services/carrinhoService';

type ItemCarrinho = {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  nome: string;
};

type Carrinho = {
  itens: ItemCarrinho[];
  total: number;
};

export default function Carrinho() {
  const { usuarioId } = useParams<{ usuarioId: string }>();
  const [carrinho, setCarrinho] = useState<Carrinho>({ itens: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (usuarioId) {
      carregarCarrinho();
    }
  }, [usuarioId]);

  const carregarCarrinho = async () => {
    try {
      setLoading(true);
      const response = await carrinhoService.listarCarrinho(usuarioId!);
      setCarrinho({
        itens: response.data.itens || [],
        total: response.data.total || 0
      });
    } catch (err) {
      console.error('Erro ao carregar carrinho:', err);
      setError('Erro ao carregar o carrinho');
    } finally {
      setLoading(false);
    }
  };

  const removerItem = async (produtoId: string) => {
    if (!usuarioId) return;
    
    try {
      await carrinhoService.removerItem(usuarioId, produtoId);
      // Atualiza o carrinho após remoção
      carregarCarrinho();
    } catch (err) {
      console.error('Erro ao remover item:', err);
      alert('Erro ao remover item do carrinho');
    }
  };

  if (loading) return <div>Carregando carrinho...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meu Carrinho</h1>
      
      {carrinho.itens.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Seu carrinho está vazio</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Continuar Comprando
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {carrinho.itens.map((item) => (
              <div 
                key={item.produtoId} 
                className="border p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{item.nome}</h3>
                  <p>Quantidade: {item.quantidade}</p>
                  <p>Preço unitário: R$ {item.precoUnitario.toFixed(2)}</p>
                  <p>Subtotal: R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removerItem(item.produtoId)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold">R$ {carrinho.total.toFixed(2)}</span>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Continuar Comprando
              </button>
              
              <button 
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                onClick={() => alert('Finalizar compra não implementado')}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
