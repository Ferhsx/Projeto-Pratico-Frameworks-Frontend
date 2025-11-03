import React from 'react';

export interface ErrorMessage {
    titulo: string;
    mensagem: string;
    tipo: 'generico' | '404' | '500' | 'auth' | 'validacao';
    icone?: string;
}

interface ErrorDisplayProps {
    erro: ErrorMessage;
    onClose?: () => void;
    autoFechar?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ erro, onClose, autoFechar = false }) => {
    React.useEffect(() => {
        if (autoFechar && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000); // Fecha automaticamente após 5 segundos
            return () => clearTimeout(timer);
        }
    }, [autoFechar, onClose]);

    return (
        <div className="error-display">
            <div className="error-icon">
                {erro.icone || '⚠️'}
            </div>
            <h2>{erro.titulo}</h2>
            <p className="error-message">{erro.mensagem}</p>
            
            {erro.tipo === '404' && (
                <p className="error-suggestion">
                    A página que você está procurando pode ter sido removida ou não está disponível no momento.
                </p>
            )}
            
            <div className="error-actions">
                <button 
                    className="back-button" 
                    onClick={() => window.history.back()}
                >
                    Voltar
                </button>
                {onClose && (
                    <button 
                        className="close-button"
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorDisplay;