import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useState } from "react";

function Cadastrar() {
    const navigate = useNavigate();
    const [mensagemErro, setMensagemErro] = useState<string | null>(null);
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMensagemErro(null);
        const formData = new FormData(event.currentTarget);
        const nome = formData.get("nome");
        const email = formData.get("email");
        const senha = formData.get("senha");
        const tipoUsuario = formData.get("tipoUsuario");

        api.post("/cadastro", {
            nome,
            email, 
            senha,
            tipoUsuario
        }).then(resposta => {
            if (resposta.status === 201) {
                navigate("/login");
            }
        }).catch((error: any) => {
            const msg = error?.response?.data?.mensagem ||
                error?.message ||
                "Erro Desconhecido!";
            setMensagemErro(msg);
        }
        );
    }
    return (
        <>
            <h1>Cadastro</h1>
            {mensagemErro && <p style={{ color: 'red' }}>{mensagemErro}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="nome" placeholder="Nome" required />
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="senha" placeholder="Senha" required />
                <select name="tipoUsuario" required>
                    <option value="">Selecione o tipo de usuário</option>
                    <option value="comum">Comum</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Cadastrar</button>
            </form>
        </>
    );
}

export default Cadastrar;