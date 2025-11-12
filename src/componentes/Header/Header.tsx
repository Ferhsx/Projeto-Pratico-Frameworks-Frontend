import { useNavigate, Link } from 'react-router-dom';
// Importa a função de logout que já existe
import { handleLogout } from '../login/auth';

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
        <header className="bg-epic-gray-dark p-4 flex justify-between items-center border-b border-gray-700">
            {/* Lado Esquerdo */}
            <div className="flex items-center gap-8">
                <Link to="/" className="text-2xl font-bold text-white uppercase">
                    Epico Gomes
                </Link>
                <nav className="hidden md:flex gap-6">
                    <a href="#" className="text-gray-300 hover:text-white">Loja</a>
                    <a href="#" className="text-gray-300 hover:text-white">Distribuir</a>
                </nav>
            </div>

            {/* Lado Direito */}
            <div className="flex items-center gap-4">
                {nome ? (
                    <>
                        <span className="text-gray-300">Olá, {nome}</span>
                        <button 
                            onClick={() => handleLogout(navigate)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Sair
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Entrar
                    </button>
                )}

                {tipo === 'admin' && (
                    <Link 
                        to="/admin/dashboard"
                        className="text-gray-300 hover:text-gray-400"
                    >
                        <span>Painel Admin</span>
                    </Link>
                )}

                {usuarioId && (
                    <Link 
                        to={`/carrinho/${usuarioId}`}
                        className="cart-link"
                        title="Ver Carrinho"
                    >
                        <span className="cart-text">Carrinho</span>
                    </Link>
                )}
            </div>
        </header>
    );
}

export default Header;