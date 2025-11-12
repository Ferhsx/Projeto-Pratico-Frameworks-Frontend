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
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Coluna Principal (Hero + Grid de Produtos) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Componente Hero */}
          {produtoHeroi && <HeroBanner produto={produtoHeroi} />}
          
          {/* Grid de Produtos Normais */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Mais Jogos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {produtosNormais.map(produto => (
                <ProdutoCard key={produto._id} produto={produto} />
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar (Lista de Destaques - Máximo 5 itens) */}
        <aside className="lg:col-span-1 flex flex-col">
          <div className="sticky top-4">
            <SidebarDestaques produtos={produtosDestaqueSidebar} />
          </div>
        </aside>
      </div>
    </div>
  );
}

// Componente para o Banner Principal (Pode ficar no mesmo arquivo ou ser separado)
function HeroBanner({ produto }: { produto: ProdutoType }) {
  const navigate = useNavigate();
  return (
    <div className="relative rounded-lg overflow-hidden h-[28rem]">
      <img src={produto.urlfoto} alt={produto.nome} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">{produto.nome}</h1>
        <p className="text-lg mb-4 max-w-lg">{produto.descricao}</p>
        <button onClick={() => navigate(`/produto/${produto._id}`)} className="bg-white text-black font-bold py-3 px-6 rounded hover:bg-gray-200 transition-colors">
          Saiba mais
        </button>
      </div>
    </div>
  );
}

// Componente para a Sidebar (Pode ficar no mesmo arquivo ou ser separado)
function SidebarDestaques({ produtos }: { produtos: ProdutoType[] }) {
  const navigate = useNavigate();

  const handleProductClick = (id: string) => {
    navigate(`/produto/${id}`);
  };

  return (
    <div className="bg-epic-gray-dark p-4 rounded-lg h-full">
      <h3 className="font-bold mb-4 text-xl">Em Destaque</h3>
      <div className="space-y-4">
        {produtos.map(produto => (
          <div 
            key={produto._id} 
            className="flex items-center gap-4 p-2 rounded hover:bg-epic-gray-light cursor-pointer transition-colors"
            onClick={() => handleProductClick(produto._id)}
          >
            <img 
              src={produto.urlfoto} 
              alt={produto.nome} 
              className="w-16 h-16 object-cover rounded" 
            />
            <div>
              <p className="font-semibold text-white">{produto.nome}</p>
              <p className="text-sm text-gray-400">R$ {produto.preco.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}