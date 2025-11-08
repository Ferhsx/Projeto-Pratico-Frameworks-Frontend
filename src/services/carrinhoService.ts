import api from '../api/api';

export const carrinhoService = {
  async adicionarItem(produtoId: string, quantidade: number) {
    return api.post('/adicionarItem', { produtoId, quantidade });
  },
  async removerItem(produtoId: string) {
    return api.post('/removerItem', { produtoId });
  },
  async removerCarrinho(usuarioId: string) {
    return api.delete(`/carrinho/${usuarioId}`);
  },
  
  async removerCarrinhoPorId(carrinhoId: string) {
    return api.delete(`/carrinho/por-id/${carrinhoId}`);
  },
  async listarCarrinho() {
    return api.get(`/carrinho`);
  },
   async listarTodos() {
    return api.get(`/carrinhos`);
  },
};
