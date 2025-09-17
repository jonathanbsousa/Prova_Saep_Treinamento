import React, { useState } from 'react';
import { z } from 'zod';

const userSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().email('O formato do email é inválido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
});

const API_REGISTER_URL = 'http://127.0.0.1:8000/api/register/';

export function CardUsuario() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });

  const [erros, setErros] = useState({});
  const [statusGeral, setStatusGeral] = useState({ erro: '', sucesso: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErros({});
    setStatusGeral({ erro: '', sucesso: '' });

    const validation = userSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErros(fieldErrors);
      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
      return;
    }

    try {
      const response = await fetch(API_REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validation.data),
      });

      if (response.ok) {
        setStatusGeral({ sucesso: 'Usuário cadastrado com sucesso!' });
        setFormData({ nome: '', email: '', senha: '' });
      } else {
        const errorData = await response.json();
        setStatusGeral({ erro: errorData.detail || 'Erro ao cadastrar usuário.' });
      }
    } catch (error) {
      console.error(error);
      setStatusGeral({ erro: 'Erro de rede ou servidor. Tente novamente.' });
    }
  };

  return (
    <form className="formulario" onSubmit={handleSubmit} aria-labelledby="form-title-user">
      <h2 id="form-title-user" className="titulo">Cadastro de Usuário</h2>

      {statusGeral.erro && <p role="alert" style={{ color: 'red' }}>{statusGeral.erro}</p>}
      {statusGeral.sucesso && <p role="status" style={{ color: 'green' }}>{statusGeral.sucesso}</p>}

      <div>
        <label htmlFor="nome">Nome:</label>
        <input
          id="nome"
          name="nome"
          type="text"
          value={formData.nome}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!erros.nome}
          aria-describedby={erros.nome ? 'nome-error' : undefined}
        />
        {erros.nome && <p id="nome-error" role="alert" style={{ color: 'red', fontSize: '0.9em' }}>{erros.nome}</p>}
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!erros.email}
          aria-describedby={erros.email ? 'email-error' : undefined}
        />
        {erros.email && <p id="email-error" role="alert" style={{ color: 'red', fontSize: '0.9em' }}>{erros.email}</p>}
      </div>

      <div>
        <label htmlFor="senha">Senha:</label>
        <input
          id="senha"
          name="senha"
          type="password"
          autoComplete="new-password" 
          value={formData.senha}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!erros.senha}
          aria-describedby={erros.senha ? 'senha-error' : undefined}
        />
        {erros.senha && <p id="senha-error" role="alert" style={{ color: 'red', fontSize: '0.9em' }}>{erros.senha}</p>}
      </div>

      <a href="/">Voltar para a Home</a>

      <button type="submit">Cadastrar</button>
    </form>
  );
}