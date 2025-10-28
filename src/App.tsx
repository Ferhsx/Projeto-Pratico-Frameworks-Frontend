import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import ListaProdutos from './componentes/produtos/ListaProdutos';
import WelcomeBanner from './componentes/WelcomeBanner';
import Login from './componentes/login/login';
import Erro from './componentes/erro/erro';

// Simula autenticação
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Componente de rota protegida
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    return <Navigate to={`/login?from=${encodeURIComponent(location.pathname)}`} state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="app-container">
      {isLoggedIn && (
        <nav className="navbar">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/produtos" className="nav-link">Lista de Produtos</Link>
          <Link to="/cadastro" className="nav-link">Cadastrar Produto</Link>
          <button onClick={handleLogout} className="nav-link">Sair</button>
        </nav>
      )}

      <div className="content">
        <Routes>
          <Route path="/login" element={
            isLoggedIn ? 
              <Navigate to="/" /> : 
              <Login onLoginSuccess={handleLogin} />
          } />
          
          <Route path="/" element={
            <PrivateRoute>
              <div className="home">
                <WelcomeBanner />
                <div className="features">
                  <div className="feature-card">
                    <h3>Lista de Produtos</h3>
                    <p>Visualize todos os produtos cadastrados no sistema.</p>
                    <Link to="/produtos" className="feature-link">Ver Produtos →</Link>
                  </div>
                  <div className="feature-card">
                    <h3>Cadastro</h3>
                    <p>Adicione novos produtos ao sistema de forma simples.</p>
                    <Link to="/cadastro" className="feature-link">Cadastrar Produto →</Link>
                  </div>
                </div>
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/produtos" element={
            <PrivateRoute>
              <ListaProdutos />
            </PrivateRoute>
          } />
          
          <Route path="/cadastro" element={
            <PrivateRoute>
              <CadastroProduto />
            </PrivateRoute>
          } />
          
          <Route path="/error" element={<Erro />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function CadastroProduto() {
  const handleForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      nome: formData.get('nome') as string,
      preco: Number(formData.get('preco')),
      urlfoto: formData.get('urlfoto') as string,
      descricao: formData.get('descricao') as string
    };
    
    // Aqui você pode adicionar a lógica para enviar os dados para a API
    console.log('Dados do produto:', data);
    alert('Produto cadastrado com sucesso!');
    form.reset();
  };

  return (
    <div className="cadastro-produto">
      <h2>Cadastro de Produtos</h2>
      <form onSubmit={handleForm} className="formulario">
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input 
            type="text" 
            id="nome" 
            name="nome" 
            placeholder="Nome do produto" 
            required 
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="preco">Preço:</label>
          <input 
            type="number" 
            id="preco" 
            name="preco" 
            placeholder="Preço" 
            step="0.01" 
            min="0" 
            required 
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="urlfoto">URL da Imagem:</label>
          <input 
            type="url" 
            id="urlfoto" 
            name="urlfoto" 
            placeholder="URL da imagem do produto" 
            required 
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="descricao">Descrição:</label>
          <textarea 
            id="descricao" 
            name="descricao" 
            placeholder="Descrição do produto" 
            required 
            className="form-textarea"
          ></textarea>
        </div>
        
        <button type="submit" className="submit-btn">Cadastrar Produto</button>
      </form>
    </div>
  );
}

export default App;
