import React, { useEffect, useState } from 'react'
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js'
import {useSearchParams} from 'react-router-dom'
import { carrinhoService } from '../services/carrinhoService'
import api from '../api/api'

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
  const [succeeded, setSucceeded] = useState(false)

  // amount em centavos vindo da query ?amount=1000 ou do carrinho (fallback 1000 => R$10,00)
  const queryAmount = Number(searchParams.get('amount')) || 0
  const [amount, setAmount] = useState<number>(queryAmount || 1000)

  useEffect(() => {
    async function prepare() {
      try {
        // Se não veio amount pela query, tentar obter do carrinho no backend
        if (!queryAmount) {
          const resp = await carrinhoService.listarCarrinho()
          if (resp && resp.data && typeof resp.data.total !== 'undefined') {
            // total vindo em reais (ex: 10.5) -> converter para centavos
            const totalReais = Number(resp.data.total) || 0
            const centavos = Math.round(totalReais * 100)
            setAmount(centavos || 1000)
          }
        }

        // Criar PaymentIntent usando a API do projeto (usa VITE_API_URL via src/api/api.ts)
        const result = await api.post('/create-payment-intent', { amount, currency: 'brl' })
        if (result && result.data && result.data.clientSecret) {
          setClientSecret(result.data.clientSecret)
        } else {
          setError('Erro ao criar PaymentIntent')
        }
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message || 'Erro ao criar PaymentIntent')
      }
    }

    prepare()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!stripe || !elements || !clientSecret) return
    setProcessing(true)

    const card = elements.getElement(CardElement)
    if (!card) {
      setError('Card element não encontrado')
      setProcessing(false)
      return
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    })

    if (result.error) {
      setError(result.error.message || 'Erro no pagamento')
      setProcessing(false)
    } else {
      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setSucceeded(true)
      }
      setProcessing(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Finalizar Compra</h1>
      <p className="mb-4">Valor: {(amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>

      {!clientSecret && !error && <p>Preparando pagamento...</p>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {succeeded ? (
        <div className="text-green-600">Pagamento realizado com sucesso. Obrigado!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Dados do cartão</label>
            <div className="border p-3 rounded">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || processing || !clientSecret}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {processing ? 'Processando...' : 'Pagar'}
          </button>
        </form>
      )}
    </div>
  )
}
