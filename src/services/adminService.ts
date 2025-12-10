import api from '../api/api';

export const adminService = {
    async getDashboardStats() {
        return api.get('/admin/dashboard');
    }
};

export const adminRequestService = {
  async solicitarAcessoAdmin() {
    const response = await api.post('/admin/solicitar-acesso');
    return response.data;
  },

  async listarSolicitacoes() {
    const response = await api.get('/admin/solicitacoes');
    return response.data;
  },

  async aprovarSolicitacao(usuarioId: string) {
    const response = await api.patch(`/admin/solicitacoes/${usuarioId}/aprovar`);
    return response.data;
  },

  async rejeitarSolicitacao(usuarioId: string) {
    const response = await api.delete(`/admin/solicitacoes/${usuarioId}`);
    return response.data;
  }
};