import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useState } from "react";

function Cadastrar() {
    const navigate = useNavigate();
    const [mensagemErro, setMensagemErro] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMensagemErro(null);
        setEnviando(true);

        const formData = new FormData(event.currentTarget);
        const payload = {
            nome: String(formData.get("nome") ?? "").trim(),
            idade: Number(formData.get("idade") ?? 0),
            email: String(formData.get("email") ?? "").trim(),
            senha: String(formData.get("senha") ?? ""),
            tipoUsuario: String(formData.get("tipoUsuario") ?? "")
        };

        console.log("Enviando POST /cadastro payload:", payload);

        try {
            const resposta = await api.post("/cadastro", payload);
            console.log("Resposta /cadastro:", resposta.status, resposta.data);
            if (resposta.status === 201) {
                navigate("/login");
            } else {
                setMensagemErro(`Resposta inesperada: ${resposta.status}`);
            }
        } catch (error: any) {
            console.error("Erro POST /cadastro:", {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message
            });
            const msg = error?.response?.data?.mensagem
                     || error?.response?.data?.error
                     || error?.response?.data
                     || error?.message
                     || "Erro desconhecido";
            setMensagemErro(String(msg));
        } finally {
            setEnviando(false);
        }
    }

    return (
        <>
            <h1>Cadastro</h1>
            {mensagemErro && <p style={{ color: 'red' }}>{mensagemErro}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="nome" placeholder="Nome" required />
                <input type="number" name="idade" placeholder="Idade" required min={0} />
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="senha" placeholder="Senha" required />
                <select name="tipoUsuario" required>
                    <option value="">Selecione o tipo de usuário</option>
                    <option value="comum">Comum</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit" disabled={enviando}>{enviando ? 'Enviando...' : 'Cadastrar'}</button>
            </form>
        </>
    );
}

export default Cadastrar;