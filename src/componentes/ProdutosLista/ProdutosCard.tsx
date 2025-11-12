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
            <div className="bg-transparent rounded-lg overflow-hidden cursor-pointer group">
                {/* Imagem com efeito de zoom no hover */}
                <div className="overflow-hidden rounded-lg">
                    <img
                        src={produto.urlfoto}
                        alt={produto.nome}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                </div>

                {/* Informações */}
                <div className="pt-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold text-base truncate">{produto.nome}</h3>
                        <p className="text-gray-400 text-sm mt-1">R$ {produto.preco.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}