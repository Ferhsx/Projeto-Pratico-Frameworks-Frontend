// src/componentes/admin/GerenciarSolicitacoes.tsx
import { useEffect, useState } from 'react';
import { adminRequestService } from '../../services/adminService';
import { toast } from 'react-toastify';

interface SolicitacaoAdmin {
  _id: string;
  usuarioId: string;
  email: string;
  nome: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  dataSolicitacao: string;
}

export default function GerenciarSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoAdmin[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarSolicitacoes = async () => {
    try {
      const dados = await adminRequestService.listarSolicitacoes();
      setSolicitacoes(dados);
    } catch (erro) {
      toast.error('Erro ao carregar solicitações');
    } finally {
      setCarregando(false);
    }
  };

  const handleAprovar = async (usuarioId: string) => {
    try {
      await adminRequestService.aprovarSolicitacao(usuarioId);
      toast.success('Solicitação aprovada com sucesso!');
      carregarSolicitacoes();
    } catch (erro) {
      toast.error('Erro ao aprovar solicitação');
    }
  };

  const handleRejeitar = async (usuarioId: string) => {
    try {
      await adminRequestService.rejeitarSolicitacao(usuarioId);
      toast.success('Solicitação rejeitada com sucesso!');
      carregarSolicitacoes();
    } catch (erro) {
      toast.error('Erro ao rejeitar solicitação');
    }
  };

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  if (carregando) return <div>Carregando...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Solicitações de Acesso de Administrador</h2>
      
      {solicitacoes.length === 0 ? (
        <p>Não há solicitações pendentes.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Nome</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Data</th>
                <th className="py-2 px-4 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {solicitacoes.map((solicitacao) => (
                <tr key={solicitacao._id}>
                  <td className="py-2 px-4 border">{solicitacao.nome}</td>
                  <td className="py-2 px-4 border">{solicitacao.email}</td>
                  <td className="py-2 px-4 border">
                    {new Date(solicitacao.dataSolicitacao).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border space-x-2">
                    <button
                      onClick={() => handleAprovar(solicitacao.usuarioId)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleRejeitar(solicitacao.usuarioId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Rejeitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}