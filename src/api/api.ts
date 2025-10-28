import axios, { AxiosError } from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // Importante para enviar cookies, se necessário
});

// Interceptor para adicionar o token nas requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log('Token no interceptor:', token);
    
    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token adicionado ao cabeçalho');
    }
    
    console.log('Configuração da requisição:', {
        url: config.url,
        method: config.method,
        headers: config.headers
    });
    
    return config;
}, (error) => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
});

// Interceptor de resposta para tratamento de erros
api.interceptors.response.use(
    (response) => {
        console.log('Resposta recebida:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    (error: AxiosError) => {
        console.error('Erro na resposta:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers
            }
        });

        // Tratamento de erros de rede
        if (error.code === 'ERR_NETWORK') {
            console.error('Erro de conexão:', error.message);
            window.location.href = `/error?mensagem=${encodeURIComponent("Erro de conexão com o servidor. Verifique sua conexão ou se o servidor está rodando.")}`;
            return Promise.reject(error);
        }

        // Tratamento de erros de autenticação
        if (error.response?.status === 401) {
            const isLoginRequest = error.config?.url?.endsWith('/login');
            
            // Se não for uma requisição de login, redireciona para a página de login
            if (!isLoginRequest) {
                localStorage.removeItem("token");
                window.location.href = `/login?mensagem=${encodeURIComponent("Sessão expirada. Por favor, faça login novamente.")}`;
            }
            // Se for uma requisição de login, o erro será tratado no componente
        }

        // Para outros erros, rejeita a promessa com o erro original
        return Promise.reject(error);
    }
);



export default api