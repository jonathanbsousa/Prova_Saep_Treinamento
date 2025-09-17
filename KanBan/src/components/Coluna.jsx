import React, { useState, useEffect } from 'react';

export default function Coluna({ tarefas }) {
    const [tarefasAtualizadas, setTarefasAtualizadas] = useState(tarefas);

    useEffect(() => {
        console.log("Tarefas recebidas:", tarefas);
        setTarefasAtualizadas(tarefas);
    }, [tarefas]);

    const atualizarStatus = async (id, novoStatus) => {
        try {
            console.log(`Atualizando tarefa ${id} para status ${novoStatus}`);
            const response = await fetch(`http://127.0.0.1:8000/api/tarefas/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: novoStatus }), 
            });

            if (response.ok) {
                const dadosAtualizados = await response.json();
                console.log("Tarefa atualizada:", dadosAtualizados); 
                setTarefasAtualizadas((prevTarefas) =>
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

    return (
        <div className="coluna">
            {tarefasAtualizadas.length > 0 ? (
                tarefasAtualizadas.map((tarefa) => (
                    <div key={tarefa.id} className="tarefa-item">
                        <p><strong>Id:</strong> {tarefa.id}</p>
                        <p><strong>Descrição:</strong> {tarefa.descricao}</p>
                        <p><strong>Setor:</strong> {tarefa.setor}</p>
                        <p><strong>Prioridade:</strong> {tarefa.prioridade}</p>
                        <p><strong>Status:</strong> {tarefa.status}</p>

                        <select
                            value={tarefa.status}
                            onChange={(e) => atualizarStatus(tarefa.id, e.target.value)}
                        >
                            <option value="fazer">A Fazer</option>
                            <option value="fazendo">Fazendo</option>
                            <option value="concluido">Concluído</option>
                        </select>
                    </div>
                ))
            ) : (
                <p>Não há tarefas nesta coluna.</p>
            )}
        </div>
    );
}
