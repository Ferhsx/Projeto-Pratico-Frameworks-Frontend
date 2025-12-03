import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import api from '../api/api';

export default function CheckoutPage() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handlePagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setLoading(true);
    setErro('');

    try {
      // 1. Chamar backend para criar Payment Intent
      const response = await api.post('/criar-pagamento-cartao');
      const { clientSecret } = response.data;

      // 2. Confirmar pagamento com Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: 'Cliente'
          }
        }
      });

      if (error) {
        setErro(error.message || 'Erro ao processar pagamento');
      } else if (paymentIntent?.status === 'succeeded') {
        alert('Pagamento realizado com sucesso!');
        // Limpar carrinho e redirecionar
      }
    } catch (error) {
      setErro((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <form onSubmit={handlePagamento}>
        <div className="mb-4">
          <CardElement />
        </div>
        
        {erro && <p className="text-red-500 mb-4">{erro}</p>}
        
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Pagar'}
        </button>
      </form>
    </div>
  );
}