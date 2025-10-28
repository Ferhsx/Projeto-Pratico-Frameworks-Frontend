//Criar uma página que consome a rota /produtos e lista os produtos cadastrados com axios.


import { useEffect, useState } from 'react';
import api from '../../api/api';
import './ListaProdutos.css';

type ProdutoType = {
  _id: string;
  nome: string;
  preco: number;
  urlfoto: string;
  descricao: string;
};

const ListaProdutos = () => {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);


//Efeito de Carregamento de Dados

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await api.get('/produtos');
        setProdutos(response.data);
      } catch (error) {
        setErro('Erro ao carregar produtos. Tente novamente mais tarde.');
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, []);

  if (carregando) {
    return <div>Carregando produtos...</div>;
  }

  if (erro) {
    return <div className="erro">{erro}</div>;
  }

  if (produtos.length === 0) {
    return <div>Nenhum produto cadastrado.</div>;
  }

  return (
    <div className="lista-produtos">
      <h2>Lista de Produtos</h2>
      <div className="produtos-grid">
        {produtos.map((produto) => (
          <div key={produto._id} className="produto-card">
            <img 
              src={produto.urlfoto || 'https://via.placeholder.com/150'} 
              alt={produto.nome} 
              className="produto-imagem"
            />
            <div className="produto-info">
              <h3>{produto.nome}</h3>
              <p className="preco">R$ {produto.preco.toFixed(2)}</p>
              <p className="descricao">{produto.descricao}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaProdutos;
