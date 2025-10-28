import React, { useState, useEffect } from 'react';
import './WelcomeBanner.css';

const WelcomeBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Mostrar o banner após um pequeno atraso para melhor experiência
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Mostrar o conteúdo após a animação do banner
      setTimeout(() => setShowContent(true), 500);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`welcome-banner ${isVisible ? 'visible' : ''}`}>
      <div className="banner-content">
        <div className="logo-container">
          <svg className="logo" viewBox="0 0 128 128" width="80" height="80">
            <path d="M64,0l54.6,32v64L64,128L9.4,96V32L64,0z" fill="#41B883"/>
            <path d="M64,0l54.6,32v64L64,128L9.4,96V32L64,0z" fill="#41B883" transform="rotate(90,64,64)" opacity="0.8"/>
            <path d="M64,0l54.6,32v64L64,128L9.4,96V32L64,0z" fill="#41B883" transform="rotate(180,64,64)" opacity="0.6"/>
            <path d="M64,0l54.6,32v64L64,128L9.4,96V32L64,0z" fill="#41B883" transform="rotate(270,64,64)" opacity="0.4"/>
          </svg>
          <div className="logo-text">Vite + React</div>
        </div>
        
        {showContent && (
          <div className="welcome-message">
            <h1>Bem-vindo ao Sistema de Produtos</h1>
            <p>Desenvolvido com Vite, React e TypeScript</p>
            <div className="tech-stack">
              <span className="tech-badge">Vite</span>
              <span className="tech-badge">React</span>
              <span className="tech-badge">TypeScript</span>
              <span className="tech-badge">Axios</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeBanner;
