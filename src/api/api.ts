import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

// Forçar HTTPS em produção
const isProduction = import.meta.env.PROD;
let apiUrl = import.meta.env.VITE_API_URL || '';

// Se estiver em produção e a URL não começar com https, substitua http por https
if (isProduction && apiUrl.startsWith('http://')) {
  apiUrl = apiUrl.replace('http://', 'https://');
}

console.log('URL da API:', apiUrl);

// Configuração do axios com opções de segurança
const axiosConfig: AxiosRequestConfig = {
  baseURL: apiUrl,
  timeout: 10000, // Aumentado para 10 segundos
  withCredentials: true, // Importante para enviar cookies de autenticação
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Se estiver em desenvolvimento e usando HTTPS autoassinado, desabilite a verificação SSL
if (!isProduction && apiUrl.startsWith('https://')) {
  axiosConfig.httpsAgent = new (require('https').Agent)({  
    rejectUnauthorized: false // Apenas para desenvolvimento com certificados autoassinados
  });
}

const api = axios.create(axiosConfig);

//Nós vamos criar um middleware para adicionar o token na requisição

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    console.log('Request to:', config.url)
    console.log('Base URL:', config.baseURL)
    if (token) {
        console.log('Adding token to request')
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Interceptor de resposta atualizado
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // O erro de rede agora será tratado pelo componente chamador (ex: HomePage.tsx)

        const status = error?.response?.status;
        
        // Redirecionar para o login em caso de 401, exceto na própria página de login
        if (status === 401 && !(error?.response?.config?.url.endsWith("/login"))) {
            localStorage.removeItem("token")
            window.location.href=`/login?mensagem=${encodeURIComponent("Token de acesso inválido ou expirado.")}` 
        }

        // Se for um erro 404, 500 ou qualquer outro, o componente chamador deve lidar com ele
        return Promise.reject(error)
    }
)



export default api