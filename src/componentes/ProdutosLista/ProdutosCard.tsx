// Em src/componentes/Produtos/ProdutoCard.tsx
import { Link } from 'react-router-dom';

type Produto = {
    _id: string;
    nome: string;
    preco: number;
    urlfoto: string;
};

export default function ProdutoCard({ produto }: { produto: Produto }) {
    return (
        <Link to={`/produto/${produto._id}`}>
            <div className="bg-white rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl border border-gray-200 hover:border-gray-300">
                {/* Imagem com efeito de zoom no hover */}
                <div className="overflow-hidden rounded-t-xl bg-gray-100">
                    <img
                        src={produto.urlfoto}
                        alt={produto.nome}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                </div>

                {/* Informações */}
                <div className="p-4 flex flex-col gap-3">
                    <h3 className="poster-subtitle text-gray-900 font-bold text-base truncate group-hover:text-black">{produto.nome}</h3>
                    <div className="flex items-baseline justify-between">
                        <p className="text-green-600 font-bold text-lg">R$ {produto.preco.toFixed(2)}</p>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Ver +</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}