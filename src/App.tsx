import './App.css'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom' 
import Header from './componentes/Header/Header'
import Login from './componentes/login/login'
import Cadastrar from './componentes/login/cadastro'
import Error from './componentes/erro/erro'
import Secreto from './componentes/secret/elitinho'
import Carrinho from './componentes/Carrinho/Carrinho'
import ListarCarrinhos from './componentes/admin/listarCarrinhos'
import DashboardAdmin from './componentes/admin/drashAdmin'
import ProdutosLista from './pages/GerenciadorProdutos'
import HomePage from './pages/HomePage';
import { useEffect } from 'react'
import DetalheProdutoPage from './componentes/ProdutosLista/Produto'


// Componente para redirecionar com mensagem de erro
function ErrorRedirect({ message }: { message: string }) {
  const location = useLocation();
  
  useEffect(() => {
    // Se não estiver autenticado, redireciona para login com a mensagem de erro
    if (!localStorage.getItem('token')) {
      window.location.href = `/error?mensagem=${encodeURIComponent(message)}`;
    }
  }, [location, message]);

  return null;
}

// Componente de rota protegida
function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const isAuthenticated = !!localStorage.getItem('token');
  const isAdmin = localStorage.getItem('tipoUsuario') === 'admin';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && !isAdmin) {
    return <ErrorRedirect message="Acesso não autorizado" />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastrar />} />
            <Route path="/carrinho" element={<Carrinho />} />

            
            {/* Rota protegida para área secreta */}
            <Route 
              path="/elitinho" 
              element={
                <ProtectedRoute>
                  <Secreto />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas de administração */}
            <Route 
              path="/admin/carrinhos" 
              element={
                <ProtectedRoute adminOnly>
                  <ListarCarrinhos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute adminOnly>
                  <DashboardAdmin />
                </ProtectedRoute>
              } 
            />
            <Route path="/admin/produtos" element={<ProdutosLista />} />
            
            {/* Rota de erro genérica */}
            <Route path="/error" element={<Error />} />

            <Route path="/produto/:id" element={<DetalheProdutoPage />} />
            
            {/* Rota 404 - Redireciona para a página de erro com a mensagem */}
            <Route path="*" element={
              <Navigate to={
                {
                  pathname: "/error",
                  search: `?mensagem=${encodeURIComponent('Página não encontrada')}`
                }
              } replace />
            } />
          </Routes>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t-2 border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Sobre</h3>
              <p className="text-gray-300">Soluções inovadoras para o seu negócio.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/" className="hover:text-white transition">Início</a></li>
                <li><a href="/carrinho" className="hover:text-white transition">Carrinho</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contato</h3>
              <p className="text-gray-300">contato@epicogomes.com</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-300">
            <p>© {new Date().getFullYear()} Epico Gomes. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App