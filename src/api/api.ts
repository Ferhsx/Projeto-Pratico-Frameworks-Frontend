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
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
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

//Redirecionar para o LOGIN quando o usuário não tiver permissão.
api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error?.code==="ERR_NETWORK"){
            window.location.href=`/error?mensagem=${encodeURIComponent("Ligue o Servidor-> NPM RUN DEV")}`
        }
        const status = error?.response?.status;
        if(status===401&&!(error?.response?.config?.url.endsWith("/login"))){
            localStorage.removeItem("token")
            window.location.href=`/login?mensagem=${encodeURIComponent("Token inválido")}`
        }
        return Promise.reject(error)
    }
)



export default api