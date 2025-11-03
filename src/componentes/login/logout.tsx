/* quando tiver um cabeçalho ou algo semelhante, utilize este código para o logout

import { useNavigate } from "react-router-dom";
import { handleLogout } from "../login/auth"; // Importe a função

function Header() {
    const navigate = useNavigate();
    
    
    return (
        <nav>
            <button onClick={() => handleLogout(navigate)}>
                Sair
            </button>
        </nav>
    );
}
*/