import { useEffect, useState } from 'react';
import api from '../../api/api'; // Seu axios configurado
import { toast } from 'react-toastify';

interface Usuario {
    _id: string;
    nome: string;
    email: string;
    tipoUsuario: 'admin' | 'comum';
}

export default function GerenciarUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Buscar a lista de usuários ao carregar a página
    useEffect(() => {
        carregarUsuarios();
    }, []);

    const carregarUsuarios = async () => {
        try {
            const response = await api.get('/admin/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            toast.error("Erro ao carregar usuários");
        } finally {
            setLoading(false);
        }
    };

    // 2. A Mágica: Função que recebe o ID do clique e chama a API
    const handleAlterarCargo = async (id: string, novoTipo: 'admin' | 'comum') => {
        // Confirmação para evitar cliques acidentais
        if (!window.confirm(`Tem certeza que deseja mudar este usuário para ${novoTipo}?`)) return;

        try {
            // Chama a rota PUT passando o ID na URL automaticamente
            await api.put(`/admin/usuarios/${id}/tipo`, {
                tipoUsuario: novoTipo
            });

            toast.success("Usuário atualizado com sucesso!");
            
            // Recarrega a lista para mostrar o novo status
            carregarUsuarios();
            
        } catch (error) {
            toast.error("Erro ao atualizar usuário.");
            console.error(error);
        }
    };

    if (loading) return <div className="p-8 text-center">Carregando...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Gerenciar Usuários</h1>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo Atual</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {usuarios.map((usuario) => (
                            <tr key={usuario._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{usuario.nome}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {usuario.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {/* Badge colorido dependendo do cargo */}
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        usuario.tipoUsuario === 'admin' 
                                        ? 'bg-purple-100 text-purple-800' 
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                        {usuario.tipoUsuario.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {/* Lógica condicional dos botões */}
                                    {usuario.tipoUsuario === 'comum' ? (
                                        <button 
                                            // AQUI O ID É USADO 👇
                                            onClick={() => handleAlterarCargo(usuario._id, 'admin')}
                                            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
                                        >
                                            Promover a Admin ⬆️
                                        </button>
                                    ) : (
                                        <button 
                                            // AQUI O ID É USADO 👇
                                            onClick={() => handleAlterarCargo(usuario._id, 'comum')}
                                            className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
                                        >
                                            Rebaixar a Comum ⬇️
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}