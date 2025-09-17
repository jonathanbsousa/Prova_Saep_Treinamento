import React, { useState, useEffect } from 'react';
import '../styles/Tarefa.scss';

export default function Tarefa() {
    const [tarefas, setTarefas] = useState([]);
    const [erro, setErro] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('fazer'); 

    const fetchTarefas = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tarefas/?status=${statusFiltro}`);
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
    }, [statusFiltro]);

    return (
        <div className="tarefa-container">
            {erro && <p style={{ color: 'red' }}>{erro}</p>}

            <div className="filtro">
                <select
                    value={statusFiltro}
                    onChange={(e) => setStatusFiltro(e.target.value)}
                >
                    <option value="fazer">A Fazer</option>
                    <option value="fazendo">Fazendo</option>
                    <option value="concluido">Concluído</option>
                </select>
            </div>

            <div className="tarefas-lista">
                {tarefas.length > 0 ? (
                    tarefas.map((tarefa) => (
                        <>
                            <div key={tarefa.id} className="tarefa-item">
                                <p><strong>Id:</strong> {tarefa.id}</p>
                                <p><strong>Descrição:</strong> {tarefa.descricao}</p>
                                <p><strong>Setor:</strong> {tarefa.setor}</p>
                                <p><strong>Prioridade:</strong> {tarefa.prioridade}</p>
                                <p><strong>Status:</strong> {tarefa.status}</p>
                            </div>
                            
                        </>
                    ))
                ) : (
                    <p>Não há tarefas para exibir.</p>
                )}
            </div>
        </div>
    );
}
