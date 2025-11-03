import { useNavigate } from "react-router-dom";

// O tipo 'navigate' é importante para o TypeScript
type NavigateFunction = ReturnType<typeof useNavigate>;

export function handleLogout(navigate: NavigateFunction) {
    // 1. Remove o Token do localStorage
    localStorage.removeItem("token");
    
    // 2. Remove o Tipo de Usuário do localStorage
    localStorage.removeItem("tipoUsuario"); 

    // 3. Redireciona o usuário para a tela de login
    navigate("/login");
    
    // Opcional: Forçar um recarregamento para limpar estados da aplicação
   window.location.reload(); 
}