import api from '../api/api'
import { useState, useEffect } from 'react'

type ProdutoType = {
  _id: string,
  nome: string,
  preco: number,
  urlfoto: string,
  descricao: string
}

type FormularioEdicaoProps = {
  produto: ProdutoType;
  onSave: (produtoAtualizado: ProdutoType) => void;
  onCancel: () => void;
};

function FormularioEdicao({ produto, onSave, onCancel }: FormularioEdicaoProps) {
  const [dados, setDados] = useState(produto);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDados(prev => ({
      ...prev,
      [name]: name === 'preco' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(dados);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 my-5 rounded-2xl shadow-sm">
      <h2 className="poster-title text-lg mb-4">Editando Produto: {produto.nome}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-[640px]">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Nome</label>
        <input
          type="text"
          name="nome"
          value={dados.nome}
          onChange={handleChange}
          placeholder="Nome do produto"
          className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#8b1838] focus:border-transparent"
        />

        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Preço (R$)</label>
        <input
          type="number"
          name="preco"
          value={dados.preco}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#8b1838] focus:border-transparent"
        />

        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">URL da Imagem</label>
        <input
          type="text"
          name="urlfoto"
          value={dados.urlfoto}
          onChange={handleChange}
          placeholder="https://exemplo.com/imagem.jpg"
          className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#8b1838] focus:border-transparent"
        />

        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Descrição</label>
        <textarea
          name="descricao"
          value={dados.descricao}
          onChange={handleChange}
          placeholder="Descrição do produto"
          className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#8b1838] focus:border-transparent h-28"
        />

        <div className="flex gap-3 mt-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#8b1838] hover:bg-[#6a0f2a] text-white rounded-md shadow-sm transition-colors"
          >
            Salvar Alterações
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProdutosLista() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<ProdutoType | null>(null);
  const tipoUsuario = localStorage.getItem("tipoUsuario");

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await api.get("/produtos");
        const lista = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.produtos)
            ? response.data.produtos
            : [];
        setProdutos(lista);
      } catch (error: any) {
        console.error('Error fetching data:', {
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message
        });
        alert('Erro ao carregar produtos. Tente novamente mais tarde.');
      }
    }
    
    fetchProdutos();
  }, []);

  async function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const data = {
      nome: formData.get('nome') as string,
      preco: Number(formData.get('preco')),
      urlfoto: formData.get('urlfoto') as string,
      descricao: formData.get('descricao') as string
    };

    try {
      const response = await api.post("/produtos", data);
      const novo = Array.isArray(response.data) ? response.data[0] : response.data;
      if (novo && typeof novo === 'object') {
        setProdutos(prev => [...prev, novo]);
        form.reset();
      }
    } catch (error: any) {
      console.error('Error posting data:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message
      });
      alert('Erro ao cadastrar produto. Verifique os dados e tente novamente.');
    }
  }

  function handleDelete(produtoId: string) {
    api.delete(`/produtos/${produtoId}`)
      .then(() => {
        setProdutos(produtos.filter(p => p._id !== produtoId));
        alert('Produto excluído com sucesso!');
      })
      .catch(error => {
        console.error("Erro ao excluir produto:", error);
        alert("Falha ao excluir o produto.");
      });
  }

  function handleSaveEdit(produtoAtualizado: ProdutoType) {
    api.put(`/produtos/${produtoAtualizado._id}`, produtoAtualizado)
      .then(() => {
        setProdutos(produtos.map(p =>
          p._id === produtoAtualizado._id ? produtoAtualizado : p
        ));
        setProdutoEmEdicao(null);
        alert('Produto atualizado com sucesso!');
      })
      .catch(error => {
        console.error("Erro ao atualizar produto:", error);
        alert("Falha ao atualizar o produto.");
      });
  }

  function adicionarCarrinho(produtoId: string) {
    api.post('/adicionarItem', { produtoId, quantidade: 1 })
      .then(() => alert("Produto adicionado ao carrinho!"))
      .catch((error) => {
        console.error('Error adding to cart:', error);
        alert('Erro ao adicionar ao carrinho: ' + (error.response?.data?.message || 'Tente novamente mais tarde.'));
      });
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {produtoEmEdicao && (
        <FormularioEdicao
          produto={produtoEmEdicao}
          onSave={handleSaveEdit}
          onCancel={() => setProdutoEmEdicao(null)}
        />
      )}

      {/* Formulário de cadastro para admin */}
      {tipoUsuario === 'admin' && !produtoEmEdicao && (
        <div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="poster-title text-2xl font-bold text-gray-900 dark:text-white mb-4">Cadastro de Produtos</h2>
          <form onSubmit={handleForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Produto
                </label>
                <input
                  id="nome"
                  type="text"
                  name="nome"
                  placeholder="Nome do produto"
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#8b1838] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="preco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preço (R$)
                </label>
                <input
                  id="preco"
                  type="number"
                  name="preco"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#8b1838] focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="urlfoto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL da Imagem
                </label>
                <input
                  id="urlfoto"
                  type="url"
                  name="urlfoto"
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#8b1838] focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  rows={3}
                  placeholder="Descreva o produto aqui..."
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#8b1838] focus:border-transparent"
                  required
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-[#8b1838] text-white rounded-md hover:bg-[#6a0f2a] focus:outline-none focus:ring-2 focus:ring-[#8b1838] focus:ring-offset-2 transition-colors"
              >
                Adicionar Produto
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Produtos */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Nossos Produtos</h1>
        
        {produtos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div key={produto._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">{produto.nome}</h3>
                  <p className="text-lg font-bold text-green-600 my-2">R$ {produto.preco?.toFixed?.(2) ?? produto.preco}</p>
                  {produto.urlfoto && (
                    <img 
                      src={produto.urlfoto} 
                      alt={produto.nome} 
                      className="w-full h-48 object-cover rounded-md my-3" 
                    />
                  )}
                  <p className="text-gray-600 mb-4">{produto.descricao}</p>
                  
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => adicionarCarrinho(produto._id)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Adicionar ao carrinho
                    </button>
                    
                    {tipoUsuario === 'admin' && !produtoEmEdicao && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setProdutoEmEdicao(produto)}
                          className="p-2 bg-gray-300 text-white rounded hover:bg-gray-400 transition-colors flex items-center justify-center"
                          title="Editar produto"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(produto._id)}
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                          title="Excluir produto"
                        >
                          Excluir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
