import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Link } from 'react-router-dom';
import GerenciarSolicitacoes from './GerenciarSolicitacao';

// Tipos para os dados que esperamos da API

interface DashboardStats {
    carrinhosAtivos: number;
    somaTotalCarrinhos: number;
    rankingItens: {
        produtoId: string;
        nome: string;
        totalVendido: number;
        emQuantosCarrinhos: number;
    }[];
}

export default function DashboardAdmin() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function carregarStats() {
            try {
                const response = await adminService.getDashboardStats();
                // A resposta da API é um objeto com as chaves do $facet
                setStats(response.data);
            } catch (err) {
                setError("Falha ao carregar estatísticas.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        carregarStats();
    }, []);

    if (loading) return <div>Carregando estatísticas do dashboard...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Dashboard Administrativo</h1>
            <div style={{ margin: '30px 0' }}>
                <GerenciarSolicitacoes />
            </div>

            <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                    <h2>Carrinhos Ativos</h2>
                    <p style={{ fontSize: '2.5em', margin: 0 }}>{stats?.carrinhosAtivos ?? 0}</p>
                    <p>usuários com compras em andamento</p>
                </div>
                <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                    <h2>Valor Total nos Carrinhos</h2>
                    <p style={{ fontSize: '2.5em', margin: 0 }}>R$ {stats?.somaTotalCarrinhos?.toFixed(2) ?? '0.00'}</p>
                    <p>soma de todos os carrinhos</p>
                </div>
            </div>

            <hr style={{ margin: '30px 0' }} />

            <h2>Ranking de Itens Mais Populares (Top 5)</h2>
            {stats?.rankingItens && stats?.rankingItens.length > 0 ? (
                <ol style={{ paddingLeft: '20px' }}>
                    {stats?.rankingItens.map((item) => (
                        <li key={item.produtoId} style={{ marginBottom: '10px', fontSize: '1.2em' }}>
                            <strong>{item.nome}</strong>
                            <br />
                            <small>Vendido {item.totalVendido} vezes, presente em {item.emQuantosCarrinhos} carrinhos.</small>
                        </li>
                    ))}
                </ol>
            ) : (
                <p>Não há itens nos carrinhos para gerar um ranking.</p>
            )}

            <hr style={{ margin: '30px 0' }} />
            <Link to="/admin/carrinhos" className="text-blue-400 hover:underline">
                <p className="font-bold text-lg">Ver a lista detalhada de todos os carrinhos</p>
            </Link>
            <Link to="/admin/produtos" className="text-blue-400 hover:underline">
                <p className="font-bold text-lg">Gerenciar Produtos (Cadastrar/Editar)</p>
            </Link>
        </div>
    );
}