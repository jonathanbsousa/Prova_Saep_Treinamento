import React, { useState } from 'react';
import { z } from 'zod';

const userSchema = z.object({
    nome: z.string().min(1, 'O nome é obrigatório'),
    email: z.string().email('Email inválido'),
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres') 
});

export function CardUsuario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErro('');
        setSucesso('');

        const validation = userSchema.safeParse({ nome, email, senha });

        if (!validation.success && validation.error && validation.error.errors) {
            setErro(validation.error.errors.map(err => err.message).join(', '));
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, senha, email }),
            });

            if (response.ok) {
                setSucesso('Usuário cadastrado com sucesso!');
            } else {
                const errorData = await response.json();
                setErro(errorData.detail || 'Erro ao cadastrar usuário');
            }
        } catch (error) {
            console.log(error)
            setErro('Erro de rede ou servidor');
        }
    };

    return (
        <form className="formulario" onSubmit={handleSubmit}>
            <h2 className="titulo">Cadastro de usuário</h2>

            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}

            <label>Nome:</label>
            <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
            />

            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <label>Senha:</label>
            <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
            />

            <a href="/"><h1>Home</h1></a>

            <button type="submit">Cadastrar</button>
        </form>
    );
}
