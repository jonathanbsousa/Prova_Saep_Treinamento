import React, { useState, useEffect } from 'react';
import Coluna from './Coluna';
import '../styles/Quadro.scss';

export default function Quadro() {
    const [tarefas, setTarefas] = useState([]);
    const [erro, setErro] = useState('');

    const fetchTarefas = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/tarefas/');
            if (response.ok) {
                const data = await response.json();
                setTarefas(data); 
            } else {
                setErro('Erro ao carregar as tarefas');
            }
        } catch (error) {
            setErro('Erro de rede ou servidor');
        }
    };
    useEffect(() => {
        fetchTarefas();
    }, []);

    const atualizarStatusTarefa = async (id, novoStatus) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tarefas/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: novoStatus }),
            });

            if (response.ok) {
                const dadosAtualizados = await response.json();
                setTarefas((prevTarefas) =>
                    prevTarefas.map((tarefa) =>
                        tarefa.id === id ? { ...tarefa, status: novoStatus } : tarefa
                    )
                );
            } else {
                console.error('Erro ao atualizar a tarefa');
            }
        } catch (error) {
            console.error('Erro de rede ou servidor', error);
        }
    };

    const tarefasFazer = tarefas.filter(tarefa => tarefa.status === 'fazer');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'fazendo');
    const tarefasConcluido = tarefas.filter(tarefa => tarefa.status === 'concluido');

    return (
        <main className="containerQuadro">
            <p>Tarefas</p>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}

            <div className="containerQuadros">
                <div className="quadro">
                    <h2 className="titulo">A Fazer</h2>
                    <Coluna tarefas={tarefasFazer} atualizarStatus={atualizarStatusTarefa} />
                </div>

                <div className="quadro">
                    <h2 className="titulo">Fazendo</h2>
                    <Coluna tarefas={tarefasFazendo} atualizarStatus={atualizarStatusTarefa} /> 
                </div>

                <div className="quadro">
                    <h2 className="titulo">Pronto</h2>
                    <Coluna tarefas={tarefasConcluido} atualizarStatus={atualizarStatusTarefa} /> 
                </div>
            </div>
        </main>
    );
}
