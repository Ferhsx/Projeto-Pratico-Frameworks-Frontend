import { useNavigate, Link } from 'react-router-dom';
// Importa a função de logout que já existe
import { handleLogout } from '../login/auth';
import './Header.css';

function Header() {
    const navigate = useNavigate();
    
    // Lê os dados salvos no login
    const nome = localStorage.getItem("nomeUsuario");
    const tipo = localStorage.getItem("tipoUsuario");

    // Se o usuário não estiver logado (sem nome ou tipo),
    // o header não exibe nada.
    if (!nome || !tipo) {
        return null;
    }

    // Se estiver logado, exibe as informações
    const usuarioId = localStorage.getItem('usuarioId');
    
    return (
        <header className="app-header">
            <div className="user-info">
                <span>Olá, <strong>{nome}</strong> ({tipo})</span>
                
                {usuarioId && (
                    <Link 
                        to={`/carrinho/${usuarioId}`}
                        className="cart-link"
                        title="Ver Carrinho"
                    >
                        <span className="cart-icon">🛒</span>
                        <span className="cart-text">Carrinho</span>
                    </Link>
                )}
                
                <button onClick={() => handleLogout(navigate)}>Sair</button>
            </div>
        </header>
    );
}

export default Header;