import React, { useEffect, useState } from 'react'
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { carrinhoService } from '../services/carrinhoService'
import api from '../api/api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type ItemCarrinho = {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  nome: string;
  urlfoto?: string;
  subtotal: number;
};

type Carrinho = {
  itens: ItemCarrinho[];
  total: number;
};

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#a0aec0',
      },
      padding: '10px 12px',
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
}

export default function FinalizarCompra() {
  const stripe = useStripe()
  const elements = useElements()
  const [searchParams] = useSearchParams()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'succeeded' | 'failed'>('idle')
  const [cardComplete, setCardComplete] = useState({
    number: false,
    expiry: false,
    cvc: false,
  })
  const [carrinho, setCarrinho] = useState<Carrinho>({ itens: [], total: 0 })
  const [loadingCart, setLoadingCart] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const [cartItems, setCartItems] = useState<ItemCarrinho[]>([])
  const [cartTotal, setCartTotal] = useState(0)

  // amount em centavos vindo da query ?amount=1000 ou do carrinho (fallback 1000 => R$10,00)
  const queryAmount = Number(searchParams.get('amount')) || 0
  const [amount, setAmount] = useState<number>(queryAmount || 1000)

  // Carrega os itens do carrinho
  const carregarCarrinho = async () => {
    try {
      setLoadingCart(true)
      // Se já tivermos os itens do estado de navegação, usamos eles
      if (location.state?.cartItems) {
        const { cartItems, total } = location.state
        setCartItems(cartItems)
        setCartTotal(total)
        setAmount(Math.round(total * 100))
      } else {
        // Se não, buscamos do servidor
        const response = await carrinhoService.listarCarrinho()
        
        if (response?.data) {
          const carrinhoData = {
            itens: Array.isArray(response.data.itens) ? response.data.itens.map((item: any) => ({
              ...item,
              subtotal: item.quantidade * item.precoUnitario
            })) : [],
            total: Number(response.data.total) || 0
          }
          setCarrinho(carrinhoData)
          setCartItems(carrinhoData.itens)
          setCartTotal(carrinhoData.total)
          
          // Atualiza o amount se não veio pela query
          if (!queryAmount && carrinhoData.total > 0) {
            const centavos = Math.round(carrinhoData.total * 100)
            setAmount(centavos)
          }
        }
      }
    } catch (err: any) {
      console.error('Erro ao carregar carrinho:', err)
      if (err?.response?.status === 401) {
        navigate('/login')
      } else {
        setError('Erro ao carregar o carrinho. Tente novamente mais tarde.')
      }
    } finally {
      setLoadingCart(false)
    }
  }

  useEffect(() => {
    async function prepare() {
      try {
        // Carrega os itens do carrinho
        await carregarCarrinho()

        // Se não veio amount pela query, usa o total do carrinho
        if (!queryAmount && carrinho.total > 0) {
          const centavos = Math.round(carrinho.total * 100)
          setAmount(centavos)
        }

        // Cria o PaymentIntent apenas se tiver itens no carrinho
        if (carrinho.itens.length > 0) {
          const result = await api.post('/create-payment-intent', { 
            amount: amount || Math.round(carrinho.total * 100), 
            currency: 'brl' 
          })
          
          if (result?.data?.clientSecret) {
            setClientSecret(result.data.clientSecret)
          } else {
            setError('Erro ao preparar o pagamento')
          }
        }
      } catch (err: any) {
        console.error('Erro ao preparar pagamento:', err)
        setError(err?.response?.data?.error || err.message || 'Erro ao preparar o pagamento')
      }
    }

    prepare()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCardChange = (event: any, field: 'number' | 'expiry' | 'cvc') => {
    setCardComplete(prev => ({
      ...prev,
      [field]: event.complete
    }))
  }

  const isFormComplete = cardComplete.number && cardComplete.expiry && cardComplete.cvc

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPaymentStatus('processing')
    
    if (!stripe || !elements) {
      setError('Erro ao processar o pagamento. Tente novamente.')
      setPaymentStatus('failed')
      return
    }

    try {
      const cardNumber = elements.getElement(CardNumberElement)
      if (!cardNumber) {
        throw new Error('Elemento de cartão não encontrado')
      }

      // Criar método de pagamento
      const { paymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumber,
      })

      if (paymentMethodError || !paymentMethod) {
        throw paymentMethodError || new Error('Erro ao processar o cartão')
      }

      // Enviar para o backend
      const response = await api.post('/criar-pagamento-cartao', {
        paymentMethodId: paymentMethod.id,
        amount: amount, // em centavos
        currency: 'brl',
      })

      const { clientSecret, requiresAction } = response.data

      if (requiresAction) {
        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret)
        if (confirmError) throw confirmError
      }

      // Pagamento bem-sucedido
      setPaymentStatus('succeeded')
      
      // Limpar carrinho após pagamento bem-sucedido
      try {
        await carrinhoService.removerCarrinho()
      } catch (cartError) {
        console.error('Erro ao limpar carrinho:', cartError)
      }

      // Redirecionar após sucesso
      setTimeout(() => {
        navigate('/pedido-concluido', { state: { orderId: response.data.orderId } })
      }, 2000)

    } catch (err: any) {
      console.error('Erro no pagamento:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao processar pagamento'
      setError(errorMessage)
      setPaymentStatus('failed')
      toast.error(errorMessage, { position: 'top-right' })
    } finally {
      setProcessing(false)
    }
  }

  if (loadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando seu carrinho...</p>
        </div>
      </div>
    )
  }

  if (carrinho.itens.length === 0) {
    return (
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-semibold mb-4">Carrinho Vazio</h1>
        <p className="mb-6">Seu carrinho está vazio. Adicione itens para continuar com a compra.</p>
        <Link 
          to="/" 
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 inline-block"
        >
          Continuar Comprando
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Resumo do Pedido */}
          <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
            
            {cartItems.length > 0 ? (
              <>
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <div key={index} className="py-4 flex justify-between items-center">
                      <div className="flex items-center">
                        {item.urlfoto && (
                          <img 
                            src={item.urlfoto} 
                            alt={item.nome}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-800">{item.nome}</h3>
                          <p className="text-sm text-gray-500">Quantidade: {item.quantidade}</p>
                          <p className="text-sm text-gray-500">
                            R$ {item.precoUnitario.toFixed(2)} un.
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-blue-600">
                      R$ {cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Seu carrinho está vazio</p>
                <Link 
                  to="/" 
                  className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Continuar Comprando
                </Link>
              </div>
            )}
          </div>

          {/* Seção de Pagamento */}
          <div className="w-full md:w-1/2">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Pagamento</h2>
              
              {!clientSecret && !error && (
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                  <p className="text-sm text-gray-600 text-center">Preparando o ambiente de pagamento...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                  <p className="font-bold">Erro no pagamento</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {paymentStatus === 'succeeded' ? (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                  <p className="font-bold">Pagamento realizado com sucesso!</p>
                  <p className="text-sm">Redirecionando para a página de confirmação...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Dados do cartão</label>
            <div className="space-y-4">
              <div className="border border-gray-300 p-3 rounded-lg transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <label className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
                <div className="relative">
                  <CardNumberElement
                    options={{
                      ...CARD_ELEMENT_OPTIONS,
                      showIcon: true,
                    }}
                    className="w-full p-2 border-0 focus:ring-0"
                    onChange={(e) => handleCardChange(e, 'number')}
                  />
                  {cardComplete.number && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500">
                      ✓
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-300 p-3 rounded-lg transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                  <div className="relative">
                    <CardExpiryElement
                      options={CARD_ELEMENT_OPTIONS}
                      className="w-full p-2 border-0 focus:ring-0"
                      onChange={(e) => handleCardChange(e, 'expiry')}
                    />
                    {cardComplete.expiry && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500">
                        ✓
                      </div>
                    )}
                  </div>
                </div>

                <div className="border border-gray-300 p-3 rounded-lg transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código de Segurança (CVC)</label>
                    <span className="text-xs text-gray-500">3 ou 4 dígitos</span>
                  </div>
                  <div className="relative">
                    <CardCvcElement
                      options={CARD_ELEMENT_OPTIONS}
                      className="w-full p-2 border-0 focus:ring-0"
                      onChange={(e) => handleCardChange(e, 'cvc')}
                    />
                    {cardComplete.cvc && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500">
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total a pagar:</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {(amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Pagamento seguro com criptografia
                  </span>
                </p>
              </div>

              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <p className="flex items-start">
                  <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Seus dados de pagamento são criptografados e processados com segurança.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={!stripe || processing || !isFormComplete || paymentStatus === 'processing'}
              className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors shadow-md ${
                !stripe || processing || !isFormComplete || paymentStatus === 'processing'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02] transition-transform'
              }`}
            >
              {paymentStatus === 'processing' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando pagamento...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Confirmar Pagamento de {(amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              )}
            </button>

            <div className="mt-4 text-center">
              <Link 
                to="/carrinho" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Voltar para o carrinho
              </Link>
            </div>
          </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
