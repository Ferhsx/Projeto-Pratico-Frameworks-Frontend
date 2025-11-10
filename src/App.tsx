import './App.css'
import api from './api/api'
import { useState, useEffect } from 'react'

// REMOVEMOS A IMPORTAÇÃO DO BrowserRouter, pois ele só é necessário no index.tsx!
import { Routes, Route } from 'react-router-dom' 
import Header from './componentes/Header/Header'
import Login from './componentes/login/login'
import Cadastrar from './componentes/login/cadastro'
import Error from './componentes/erro/erro'
import Secreto from './componentes/secret/elitinho'
import Carrinho from './componentes/Carrinho/Carrinho'
import ListarCarrinhos from './componentes/admin/listarCarrinhos'
import DashboardAdmin from './componentes/admin/drashAdmin'

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
    <div className="p-5 border border-gray-300 my-5 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Editando Produto: {produto.nome}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 max-w-[500px]">
        <input 
          type="text" 
          name="nome" 
          value={dados.nome} 
          onChange={handleChange} 
          placeholder="Nome" 
          className="p-2 border border-gray-300 rounded" 
        />
        <input 
          type="number" 
          name="preco" 
          value={dados.preco} 
          onChange={handleChange} 
          placeholder="Preço" 
          className="p-2 border border-gray-300 rounded" 
        />
        <input 
          type="text" 
          name="urlfoto" 
          value={dados.urlfoto} 
          onChange={handleChange} 
          placeholder="URL da Foto" 
          className="p-2 border border-gray-300 rounded" 
        />
        <input 
          type="text" 
          name="descricao" 
          value={dados.descricao} 
          onChange={handleChange} 
          placeholder="Descrição" 
          className="p-2 border border-gray-300 rounded" 
        />
        <div className="flex gap-2.5 mt-2.5">
          <button 
            type="submit" 
            className="px-4 py-2 bg-green-500 text-white border-none rounded hover:bg-green-600 transition-colors"
          >
            Salvar Alterações
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-4 py-2 bg-red-500 text-white border-none rounded hover:bg-red-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

function PaginaProdutos() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<ProdutoType | null>(null);
  const tipoUsuario = localStorage.getItem("tipoUsuario"); 

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await api.get("/produtos")
        console.log('GET /produtos response.data:', response.data)
        // Normaliza para array: aceita resposta direta ([]) ou { produtos: [...] }
        const lista = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.produtos)
            ? response.data.produtos
            : []
        setProdutos(lista)
      } catch (error: any) {
        console.error('Error fetching data:', {
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message
        })
        setProdutos([]) // evitar undefined
      }
    }
    fetchProdutos()
   }, [])

  function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const data = {
      nome: formData.get('nome') as string,
      preco: Number(formData.get('preco')),
      urlfoto: formData.get('urlfoto') as string,
      descricao: formData.get('descricao') as string
    }
    api.post("/produtos", data)
      .then((response) => {
        const novo = Array.isArray(response.data) ? response.data[0] : response.data
        if (novo && typeof novo === 'object') setProdutos(prev => [...prev, novo])
      })
      .catch((error) => {
       console.error('Error posting data:', {
         status: error?.response?.status,
         data: error?.response?.data,
         message: error?.message
       })
       alert('Error posting data: veja console')
      })
    form.reset()
  }

  function adicionarCarrinho(produtoId: string) {
    api.post('/adicionarItem', { produtoId, quantidade: 1 })
     .then(() => alert("Produto adicionando no carrinho!"))
     .catch((error) => {
       console.error('Error posting data:', error)
       alert('Error posting data:' + error?.mensagem)
     })
  }

  const handleSaveEdit = (produtoAtualizado: ProdutoType) => {
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
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {produtoEmEdicao && (
        <FormularioEdicao
          produto={produtoEmEdicao}
          onSave={handleSaveEdit}
          onCancel={() => setProdutoEmEdicao(null)}
        />
      )}

      {/* Condição para mostrar o formulário APENAS se for admin */}
      {tipoUsuario === 'admin' && !produtoEmEdicao && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cadastro de Produtos</h2>
          <form onSubmit={handleForm} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input 
                type="text" 
                name="nome" 
                placeholder="Nome" 
                className="p-2 border border-gray-300 rounded w-full" 
                required 
              />
              <input 
                type="number" 
                name="preco" 
                placeholder="Preço" 
                step="0.01" 
                className="p-2 border border-gray-300 rounded w-full" 
                required 
              />
              <input 
                type="text" 
                name="urlfoto" 
                placeholder="URL da Foto" 
                className="p-2 border border-gray-300 rounded w-full" 
                required 
              />
              <input 
                type="text" 
                name="descricao" 
                placeholder="Descrição" 
                className="p-2 border border-gray-300 rounded w-full" 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Cadastrar
            </button>
          </form>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Lista de Produtos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.isArray(produtos) && produtos.length > 0 ? (
          produtos.map((produto) => (
            <div key={produto._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{produto.nome}</h3>
                <p className="text-lg font-bold text-blue-700 my-2">R$ {produto.preco?.toFixed?.(2) ?? produto.preco}</p>
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
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Adicionar ao carrinho
                  </button>
                  
                  {tipoUsuario === 'admin' && !produtoEmEdicao && (
                    <button 
                      onClick={() => setProdutoEmEdicao(produto)}
                      className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors flex items-center justify-center"
                      title="Editar produto"
                    >
                      ✏️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-8">Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  )
}


// O App() CORRIGIDO (Sem o BrowserRouter)
function App() {
  const tipoUsuario = localStorage.getItem("tipoUsuario"); 
  return (
    <> 
      <Header /> {/* Mostra o Header em TODAS as páginas */}
      
      <main>
        {/* Usamos as Routes para definir a lógica de qual componente mostrar */}
        <Routes> 
          
          {/* Rota para a página inicial, que mostra os produtos */}
          <Route path="/" element={<PaginaProdutos />} />
          
          {/* Rota para a página de login */}
          <Route path="/login" element={<Login />} />

          {/* Rota para a página de cadastro */}
          <Route path="/cadastro" element={<Cadastrar />} />

          <Route path="/error" element={<Error />} />

          {/* Rota para o carrinho */}
          <Route path="/carrinho/:usuarioId" element={<Carrinho />} />

          {/* Rota para página secreta */}
          <Route path="*" element={<Secreto />} />

          {/* Rota para listar carrinhos */}
          {tipoUsuario === 'admin' && (
            <>
            <Route path="/admin/carrinhos" element={<ListarCarrinhos />} />
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
            </>
          )}
          
          
        </Routes>
      </main>
      
    </> // O componente <App> agora é apenas um fragmento (ou uma div, se quiser)
  )
}

export default App