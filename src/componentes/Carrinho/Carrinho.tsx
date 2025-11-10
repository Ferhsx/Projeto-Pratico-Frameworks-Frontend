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
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    if (usuarioId) {
      carregarCarrinho();
    }
  }, [usuarioId]);

  const carregarCarrinho = async () => {
    try {
      setLoading(true);
      const response = await carrinhoService.listarCarrinho();
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

  const itensFiltrados = carrinho.itens.filter(item =>
    item.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  // Soma das quantidades: total de itens no carrinho (mostra a somatória dos itens, não o preço)
  const totalItens = carrinho.itens.reduce((acc, item) => acc + (item.quantidade || 0), 0);

  const handleAtualizarQuantidade = async (produtoId: string, novaQuantidade: number) => {
    // Validação simples para não permitir quantidades inválidas
    if (novaQuantidade < 1) {
      return;
    }

    try {
      // Chama a função do nosso serviço
      await carrinhoService.atualizarQuantidade(produtoId, novaQuantidade);
      // Após o sucesso, recarrega os dados do carrinho para garantir que tudo esteja atualizado
      carregarCarrinho();
    } catch (err) {
      console.error('Erro ao atualizar quantidade:', err);
      alert('Não foi possível atualizar a quantidade do item.');
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
          {/* Exibir o total atualizado do carrinho */}
          {carrinho.itens.length > 0 && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded flex justify-between items-center">
              <span className="font-semibold text-lg">Total atualizado do carrinho:</span>
              <span className="text-xl font-bold text-green-700">{totalItens}</span>
            </div>
          )}

          <div className="mb-4">
            <input
              type="text"
              placeholder="Filtrar itens no carrinho pelo nome..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="space-y-4">
            {itensFiltrados.length > 0 ? (
              itensFiltrados.map((item) => (
                <div
                  key={item.produtoId}
                  className="border p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{item.nome}</h3>
                    <p>Quantidade: {item.quantidade}</p>
                    <p>Preço unitário: R$ {item.precoUnitario.toFixed(2)}</p>
                    <button
                      onClick={() => carrinhoService.removerItem(item.produtoId)}
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Remover
                    </button>
                    <div className="flex items-center gap-2 mt-2">
                      <label>Quantidade:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => handleAtualizarQuantidade(item.produtoId, parseInt(e.target.value))}
                        className="w-16 p-1 border border-gray-300 rounded text-center"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-4">Nenhum item encontrado com o filtro "{filtro}".</p>
            )}
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
              <button
                onClick={() => carrinhoService.removerCarrinho()}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Remover Carrinho
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
