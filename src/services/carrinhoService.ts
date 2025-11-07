import api from '../api/api';

export const carrinhoService = {
  async adicionarItem(produtoId: string, quantidade: number) {
    return api.post('/adicionarItem', { produtoId, quantidade });
  },

  async listarCarrinho() {
    return api.get(`/carrinho`);
  }
};
