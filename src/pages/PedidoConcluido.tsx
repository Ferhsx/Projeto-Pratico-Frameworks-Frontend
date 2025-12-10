import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

export default function PedidoConcluido() {
  const location = useLocation();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  
  // Tenta pegar o ID do pedido vindo do state (navegação interna) ou da URL (query param)
  const stateOrderId = location.state?.orderId;
  const searchParams = new URLSearchParams(location.search);
  const queryOrderId = searchParams.get('pedido_id') || searchParams.get('orderId');
  
  const orderId = stateOrderId || queryOrderId;

  useEffect(() => {
    // Se não tiver ID de pedido, volta pra home depois de 5s (opcional)
    if (!orderId) {
        // navigate('/'); 
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />
      
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamento Aprovado!</h1>
        <p className="text-gray-600 mb-6">
          Obrigado pela sua compra. Seu pedido foi processado com sucesso.
        </p>

        {orderId && (
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-500 mb-1">ID do Pedido</p>
            <p className="font-mono font-bold text-gray-800 break-all">{orderId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            to="/" 
            className="block w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar para a Loja
          </Link>
          <Link 
            to="/carrinho" 
            className="block w-full text-blue-600 font-semibold py-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Ver meus pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}