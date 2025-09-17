import React, { useState, useEffect } from 'react';
import { z } from 'zod';

const tarefaSchema = z.object({
    descricao: z.string().min(1, 'A descrição é obrigatória'),
    setor: z.string().min(1, 'O setor é obrigatório'),
    usuario: z.string().min(1, 'O usuário é obrigatório'),
    prioridade: z.enum(['Alta', 'Média', 'Baixa'], 'Prioridade inválida'),
    status: z.enum(['fazer', 'fazendo', 'concluido'], 'Status inválido')
});

export function CardTarefas() {
    const [descricao, setDescricao] = useState('');
    const [setor, setSetor] = useState('');
    const [usuario, setUsuario] = useState('');
    const [prioridade, setPrioridade] = useState('');
    const [status, setStatus] = useState('fazer');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [usuarios, setUsuarios] = useState([]);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/pessoas/');
            if (response.ok) {
                const data = await response.json();
                setUsuarios(data); 
            } else {
                setErro('Erro ao carregar usuários');
            }
        } catch (error) {
            setErro('Erro de rede ou servidor');
        }
    };

    useEffect(() => {
        fetchUsuarios();  
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErro('');
        setSucesso('');

        const validation = tarefaSchema.safeParse({ descricao, setor, usuario, prioridade, status });

        if (!validation.success) {
            setErro(validation.error.errors.map(err => err.message).join(', '));
            return;
        }

        const usuarioId = parseInt(usuario, 10);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/tarefas/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ descricao, setor, usuario: usuarioId, prioridade, status }),  // Passando 'usuario' como inteiro
            });

            if (response.ok) {
                setSucesso('Tarefa cadastrada com sucesso!');
            } else {
                const errorData = await response.json();
                setErro(errorData.detail || 'Erro ao cadastrar tarefa');
            }
        } catch (error) {
            setErro('Erro de rede ou servidor');
        }
    };

    return (
        <form className="formulario" onSubmit={handleSubmit}>
            <h2 className="titulo">Cadastro da Tarefa</h2>

            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}

            <label>Descrição:</label>
            <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
            />

            <label>Setor:</label>
            <input
                type="text"
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                required
            />

            <label>Usuário:</label>
            <select
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
            >
                <option value="">Selecione um usuário</option>
                {usuarios.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.nome}
                    </option>
                ))}
            </select>

            <label>Prioridade:</label>
            <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                required
            >
                <option value="">Selecione a prioridade</option>
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
            </select>

            <label>Status:</label>
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
            >
                <option value="fazer">A Fazer</option>
                <option value="fazendo">Fazendo</option>
                <option value="concluido">Concluído</option>
            </select>

            <a href="/"><h1>Home</h1></a>

            <button type="submit">Cadastrar</button>
        </form>
    );
}
