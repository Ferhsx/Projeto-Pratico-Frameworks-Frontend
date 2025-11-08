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

type ProdutoType = {
  _id: string,
  nome: string,
  preco: number,
  urlfoto: string,
  descricao: string
}

function PaginaProdutos() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])
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

  return (
    <>
      {/* Condição para mostrar o formulário APENAS se for admin */}
      {tipoUsuario === 'admin' && (
        <>
          <div>Cadastro de Produtos</div>
          <form onSubmit={handleForm}>
            <input type="text" name="nome" placeholder="Nome" />
            <input type="number" name="preco" placeholder="Preço" />
            <input type="text" name="urlfoto" placeholder="URL da Foto" />
            <input type="text" name="descricao" placeholder="Descrição" />
            <button type="submit">Cadastrar</button>
          </form>
        </>
      )}

      <div>Lista de Produtos</div>
      {
        Array.isArray(produtos) && produtos.length > 0 ? (
          produtos.map((produto) => (
            <div key={produto._id}>
              <h2>{produto.nome}</h2>
              <p>R$ {produto.preco?.toFixed?.(2) ?? produto.preco}</p>
              {produto.urlfoto && <img src={produto.urlfoto} alt={produto.nome} width="200" />}
              <p>{produto.descricao}</p>
              <button onClick={() => adicionarCarrinho(produto._id)}>Adicionar ao carrinho</button>
            </div>
          ))
        ) : (
          <p>Nenhum produto encontrado.</p>
        )
      }
    </>
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
            <Route path="/admin/carrinhos" element={<ListarCarrinhos />} />
          )}
          
        </Routes>
      </main>
      
    </> // O componente <App> agora é apenas um fragmento (ou uma div, se quiser)
  )
}

export default App