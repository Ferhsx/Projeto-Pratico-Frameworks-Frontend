import { useNavigate, Link } from 'react-router-dom';
import { handleLogout } from '../login/auth';
import { useState, useEffect } from 'react';

function Header() {
    const navigate = useNavigate();
    const [nome, setNome] = useState<string | null>(null);
    const [tipo, setTipo] = useState<string | null>(null);

    // 🔧 Usar useEffect para sincronizar com localStorage
    useEffect(() => {
        // Lê os dados do localStorage
        const nomeArmazenado = localStorage.getItem("nomeUsuario");
        const tipoArmazenado = localStorage.getItem("tipoUsuario");
        
        setNome(nomeArmazenado);
        setTipo(tipoArmazenado);

        // Ouve mudanças no localStorage (quando outro tab muda)
        const handleStorageChange = () => {
            setNome(localStorage.getItem("nomeUsuario"));
            setTipo(localStorage.getItem("tipoUsuario"));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Se o usuário não estiver logado
    if (!nome || !tipo) {
        return (
            <header className="bg-white dark:bg-gray-900 border-b-2 border-gray-300 dark:border-gray-700 shadow-md px-8 py-3">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        Epico Gomes
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-colors border-b-2 border-transparent hover:border-gray-900 dark:hover:border-gray-500">
                            Login
                        </Link>
                        <Link to="/cadastro" className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all transform hover:scale-105 shadow-md">
                            Cadastre-se
                        </Link>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white dark:bg-gray-900 border-b-2 border-gray-300 dark:border-gray-700 shadow-md px-8 py-3 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Lado Esquerdo */}
                <div className="flex items-center gap-12">
                    <Link to="/" className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        Epico Gomes
                    </Link>
                    <nav className="hidden md:flex gap-8">
                        <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-colors border-b-2 border-transparent hover:border-gray-900 dark:hover:border-gray-500">
                            Loja
                        </a>
                        <a href="/distribuir" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-colors border-b-2 border-transparent hover:border-gray-900 dark:hover:border-gray-500">
                            Distribuir
                        </a>
                    </nav>
                </div>

                {/* Lado Direito */}
                <div className="flex items-center gap-6">
                    {nome ? (
                        <>
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="text-purple-600 font-semibold">Olá,</span>
                                <span className="text-purple-600 font-bold">{nome}</span>
                            </div>
                            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                            <button
                                onClick={() => handleLogout(navigate)}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-all transform hover:scale-105 shadow-md"
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 transition-all transform hover:scale-105 shadow-md"
                        >
                            Entrar
                        </button>
                    )}

                    {tipo === 'admin' && (
                        <>
                            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                            <Link
                                to="/admin/dashboard"
                                className="text-purple-600 hover:text-purple-500 transition-colors font-semibold px-3 py-2 rounded-md"
                                title="Painel Admin"
                            >
                                <span>⚙️ Admin</span>
                            </Link>
                        </>
                    )}

                    <div className="w-px h-6 bg-gray-300"></div>
                    <Link
                        to="/carrinho"
                        className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold"
                        title="Ver Carrinho"
                    >
                        🛒 Carrinho
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;