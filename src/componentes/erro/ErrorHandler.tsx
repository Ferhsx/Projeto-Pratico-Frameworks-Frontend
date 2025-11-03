export interface ErrorMessage {
    titulo: string;
    mensagem: string;
    tipo: 'generico' | '404' | '500' | 'auth' | 'validacao';
    icone?: string;
    codigo?: number;
    detalhes?: any;
}

type ErrorType = 
    | 'NOT_FOUND'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'VALIDATION_ERROR'
    | 'SERVER_ERROR'
    | 'NETWORK_ERROR'
    | 'TIMEOUT'
    | 'UNKNOWN';

interface ErrorOptions {
    tipo?: ErrorType;
    codigo?: number;
    detalhes?: any;
    mostrarParaUsuario?: boolean;
    acao?: () => void;
}

export class AppError extends Error {
    tipo: ErrorType;
    codigo?: number;
    detalhes?: any;
    mostrarParaUsuario: boolean;
    acao?: () => void;

    constructor(mensagem: string, options: ErrorOptions = {}) {
        super(mensagem);
        this.name = 'AppError';
        this.tipo = options.tipo || 'UNKNOWN';
        this.codigo = options.codigo;
        this.detalhes = options.detalhes;
        this.mostrarParaUsuario = options.mostrarParaUsuario ?? true;
        this.acao = options.acao;
    }
}

export const handleError = (error: any): ErrorMessage => {
    console.error('Erro capturado:', error);

    // Se for um erro da aplicação
    if (error instanceof AppError) {
        if (!error.mostrarParaUsuario) {
            return {
                titulo: 'Erro',
                mensagem: 'Ocorreu um erro inesperado.',
                tipo: 'generico',
                icone: '❌'
            };
        }

        switch (error.tipo) {
            case 'NOT_FOUND':
                return {
                    titulo: 'Recurso não encontrado',
                    mensagem: error.message || 'O recurso solicitado não foi encontrado.',
                    tipo: '404',
                    icone: '🔍',
                    codigo: 404
                };
            case 'UNAUTHORIZED':
                return {
                    titulo: 'Não autorizado',
                    mensagem: error.message || 'Você não tem permissão para acessar este recurso.',
                    tipo: 'auth',
                    icone: '🔒',
                    codigo: 401
                };
            case 'VALIDATION_ERROR':
                return {
                    titulo: 'Erro de validação',
                    mensagem: error.message || 'Por favor, verifique os dados informados.',
                    tipo: 'validacao',
                    icone: '⚠️',
                    detalhes: error.detalhes,
                    codigo: 400
                };
            default:
                return {
                    titulo: 'Erro',
                    mensagem: error.message || 'Ocorreu um erro inesperado.',
                    tipo: 'generico',
                    icone: '❌',
                    codigo: error.codigo || 500
                };
        }
    }

    // Se for um erro de resposta da API
    if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
            case 400:
                return {
                    titulo: 'Dados inválidos',
                    mensagem: data?.message || 'Por favor, verifique os dados informados.',
                    tipo: 'validacao',
                    icone: '⚠️',
                    detalhes: data?.errors,
                    codigo: status
                };
            case 401:
                return {
                    titulo: 'Não autorizado',
                    mensagem: data?.message || 'Você precisa estar autenticado para acessar este recurso.',
                    tipo: 'auth',
                    icone: '🔒',
                    codigo: status
                };
            case 403:
                return {
                    titulo: 'Acesso negado',
                    mensagem: data?.message || 'Você não tem permissão para acessar este recurso.',
                    tipo: 'auth',
                    icone: '🚫',
                    codigo: status
                };
            case 404:
                return {
                    titulo: 'Recurso não encontrado',
                    mensagem: data?.message || 'O recurso solicitado não foi encontrado.',
                    tipo: '404',
                    icone: '🔍',
                    codigo: status
                };
            case 500:
                return {
                    titulo: 'Erro no servidor',
                    mensagem: 'Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.',
                    tipo: '500',
                    icone: '💥',
                    codigo: status
                };
            default:
                return {
                    titulo: `Erro ${status}`,
                    mensagem: data?.message || 'Ocorreu um erro inesperado.',
                    tipo: 'generico',
                    icone: '❌',
                    codigo: status
                };
        }
    }

    // Se for um erro de rede
    if (error.message === 'Network Error') {
        return {
            titulo: 'Erro de conexão',
            mensagem: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
            tipo: 'generico',
            icone: '🌐',
            codigo: 0
        };
    }

    // Erro genérico
    return {
        titulo: 'Erro',
        mensagem: error.message || 'Ocorreu um erro inesperado.',
        tipo: 'generico',
        icone: '❌'
    };
};

// Função para criar erros personalizados
export const createError = (tipo: ErrorType, mensagem: string, options: Omit<ErrorOptions, 'tipo'> = {}) => {
    return new AppError(mensagem, { tipo, ...options });
};

// Funções auxiliares para tipos comuns de erro
export const notFoundError = (mensagem: string, options?: Omit<ErrorOptions, 'tipo'>) => 
    createError('NOT_FOUND', mensagem, options);

export const unauthorizedError = (mensagem: string, options?: Omit<ErrorOptions, 'tipo'>) => 
    createError('UNAUTHORIZED', mensagem, options);

export const validationError = (mensagem: string, detalhes?: any, options?: Omit<ErrorOptions, 'tipo' | 'detalhes'>) => 
    createError('VALIDATION_ERROR', mensagem, { ...options, detalhes });

export const serverError = (mensagem: string, options?: Omit<ErrorOptions, 'tipo'>) => 
    createError('SERVER_ERROR', mensagem, options);

export const isAppError = (error: any): error is AppError => {
    return error instanceof AppError || error?.name === 'AppError';
};