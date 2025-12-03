# Stripe (Frontend) - Quick Setup

- Instale as bibliotecas do Stripe no frontend:
  ```powershell
  npm install @stripe/stripe-js @stripe/react-stripe-js
  ```
- Crie um arquivo `.env` na raiz do projeto com a chave pública do Stripe:
  ```text
  VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_PUBLIC_KEY_HERE
  ```
- Reinicie o servidor de desenvolvimento se já estava rodando.

- O arquivo `src/main.tsx` foi atualizado para inicializar `loadStripe` usando `import.meta.env.VITE_STRIPE_PUBLIC_KEY` e envolver o app em `Elements`.
