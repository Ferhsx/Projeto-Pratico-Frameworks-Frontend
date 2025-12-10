import { useNavigate } from "react-router-dom";

type NavigateFunction = ReturnType<typeof useNavigate>;

export function handleLogout(navigate: NavigateFunction) {
    // Remove todos os dados do usuário
    localStorage.removeItem("token");
    localStorage.removeItem("tipoUsuario");
    localStorage.removeItem("nomeUsuario");
    localStorage.removeItem("usuarioId");

    // 🚨 Avisa o Header que deslogou
    window.dispatchEvent(new Event("storage"));

    // Redireciona para login
    navigate("/login");
    
    // Opcional: Forçar recarregamento
    window.location.reload();
}