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
import ProdutosLista from './componentes/ProdutosLista/ProdutosLista'
import HomePage from './pages/HomePage';
import { useEffect } from 'react'


function PaginaProdutos() {
  return <ProdutosLista />
}


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
    <div className="min-h-screen bg-epic-dark">
      <Header />
      <main className="container mx-auto px-4 py-6">
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
          
          {/* Rota de erro genérica */}
          <Route path="/error" element={<Error />} />
          
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
      </main>
      
      {/* Footer */}
      <footer className="bg-epic-gray-dark text-gray-400 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Epico Gomes. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App