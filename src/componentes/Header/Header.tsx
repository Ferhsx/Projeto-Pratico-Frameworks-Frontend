import { useNavigate } from 'react-router-dom';
// Importa a função de logout que já existe
import { handleLogout } from '../login/auth'; 
import './Header.css'; // Vamos criar este arquivo para o estilo

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
    return (
        <header className="app-header">
            <div className="user-info">
                <span>Olá, <strong>{nome}</strong> ({tipo})</span>
                <button onClick={() => handleLogout(navigate)}>Sair</button>
            </div>
        </header>
    );
}

export default Header;