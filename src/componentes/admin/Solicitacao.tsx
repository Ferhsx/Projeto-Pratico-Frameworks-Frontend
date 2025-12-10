import { useState } from 'react';
import { adminRequestService } from '../../services/adminService';
import { toast } from 'react-toastify';

export default function SolicitarAcessoAdmin() {
  const [enviando, setEnviando] = useState(false);
  const [solicitacaoEnviada, setSolicitacaoEnviada] = useState(false);

  const handleSolicitarAcesso = async () => {
    try {
      setEnviando(true);
      await adminRequestService.solicitarAcessoAdmin();
      setSolicitacaoEnviada(true);
      toast.success('Solicitação enviada com sucesso! Aguarde a aprovação.');
    } catch (erro) {
      toast.error('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-10 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Solicitar Acesso de Administrador</h2>
      <p className="mb-4">
        Deseja se tornar um administrador? Envie uma solicitação e aguarde a aprovação.
      </p>
      <button
        onClick={handleSolicitarAcesso}
        disabled={enviando || solicitacaoEnviada}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {enviando
          ? 'Enviando...'
          : solicitacaoEnviada
          ? 'Solicitação Enviada'
          : 'Solicitar Acesso de Admin'}
      </button>
    </div>
  );
}