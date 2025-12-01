import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import ProdutoCard from '../componentes/ProdutosLista/ProdutosCard';

// Reutilize o tipo de produto
type ProdutoType = {
  _id: string;
  nome: string;
  preco: number;
  urlfoto: string;
  descricao: string;
  isFeatured?: boolean; // Campo opcional para destaque
};

export default function HomePage() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await api.get("/produtos");
        // Normaliza a resposta da API (código que você já tinha)
        const lista = Array.isArray(response.data) ? response.data : response.data.produtos || [];
        setProdutos(lista);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProdutos();
  }, []);

  // Separa os produtos em destaque dos demais
  const produtosEmDestaque = produtos.filter(p => p.isFeatured);
  const produtosNormais = produtos.filter(p => !p.isFeatured);
  
  // Limita a 5 produtos em destaque na sidebar
  const produtosDestaqueSidebar = produtosEmDestaque.slice(0, 5);

  // Pega o primeiro produto em destaque para ser o "Herói"
  const produtoHeroi = produtosEmDestaque.length > 0 ? produtosEmDestaque[0] : null;

  if (loading) {
    return <div className="text-center p-10">Carregando produtos...</div>;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Coluna Principal (Hero + Grid de Produtos) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Componente Hero */}
          {produtoHeroi && <HeroBanner produto={produtoHeroi} />}
          
          {/* Grid de Produtos Normais */}
          <section>
            <div className="mb-8">
              <h2 className="poster-title text-4xl font-black text-gray-900 mb-2">Catálogo</h2>
              <div className="h-1 w-16 bg-black rounded-full"></div>
            </div>
            {produtosNormais.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {produtosNormais.map(produto => (
                  <ProdutoCard key={produto._id} produto={produto} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-600 text-lg font-semibold">Nenhum produto disponível</p>
              </div>
            )}
          </section>
        </div>
        
        {/* Sidebar (Lista de Destaques - Máximo 5 itens) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            {produtosDestaqueSidebar.length > 0 ? (
              <SidebarDestaques produtos={produtosDestaqueSidebar} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-gray-500">Nenhum produto em destaque</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

// Componente para o Banner Principal
function HeroBanner({ produto }: { produto: ProdutoType }) {
  const navigate = useNavigate();
  
  return (
    <div className="relative rounded-2xl overflow-hidden h-96 shadow-2xl group hero">
      <img 
        src={produto.urlfoto} 
        alt={produto.nome} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-3">
        <span className="inline-block bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full w-fit poster-subtitle">DESTAQUE</span>
        <button 
          onClick={() => navigate(`/produto/${produto._id}`)} 
          className="bg-white text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2 w-fit"
        >
          Ver Detalhes
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

// Componente para a Sidebar
function SidebarDestaques({ produtos }: { produtos: ProdutoType[] }) {
  const navigate = useNavigate();

  const handleProductClick = (id: string) => {
    navigate(`/produto/${id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-epic-gray-light overflow-hidden">
      <div className="bg-gradient-to-r from-epic-dark to-epic-gray-dark px-6 py-5 border-b border-epic-gray-light">
        <h3 className="font-black text-lg text-white">⭐ Em Destaque</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {produtos.map((produto, index) => (
          <div 
            key={produto._id} 
            className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
            onClick={() => handleProductClick(produto._id)}
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-blue text-white flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>
            <img 
              src={produto.urlfoto} 
              alt={produto.nome} 
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform" 
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{produto.nome}</p>
              <p className="text-sm text-accent-green font-bold mt-1">R$ {produto.preco.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}