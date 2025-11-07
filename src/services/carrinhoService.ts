import api from '../api/api';

export const carrinhoService = {
  async adicionarItem(produtoId: string, quantidade: number) {
    return api.post('/adicionarItem', { produtoId, quantidade });
  },

  async removerItem(usuarioId: string, produtoId: string) {
    return api.post('/removerItem', { usuarioId, produtoId });
  },

  async listarCarrinho(usuarioId: string) {
    return api.get(`/carrinho/${usuarioId}`);
  }
};
