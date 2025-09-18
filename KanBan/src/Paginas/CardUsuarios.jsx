import React, { useState } from "react";
import { z } from "zod";

const userSchema = z.object({
  username: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("O formato do email é inválido"),
});

const API_REGISTER_URL = "http://127.0.0.1:8000/api/register/";

export function CardUsuario() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const [erros, setErros] = useState({});
  const [statusGeral, setStatusGeral] = useState({ erro: "", sucesso: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErros({});
    setStatusGeral({ erro: "", sucesso: "" });

    const validation = userSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach((err) => {
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      if (response.ok) {
        setStatusGeral({ sucesso: "Usuário cadastrado com sucesso!" });
        setFormData({ username: "", email: ""});
      } else {
        const errorData = await response.json();
        setStatusGeral({
          erro: errorData.detail || "Erro ao cadastrar usuário.",
        });
      }
    } catch (error) {
      console.error(error);
      setStatusGeral({ erro: "Erro de rede ou servidor. Tente novamente." });
    }
  };

  return (
    <div className="screenBody">
      <form
        className="formulario"
        onSubmit={handleSubmit}
        aria-labelledby="form-title-user"
      >
        <h2 id="form-title-user" className="titulo">
          Cadastro de Usuário
        </h2>

        {statusGeral.erro && (
          <p role="alert" style={{ color: "red" }}>
            {statusGeral.erro}
          </p>
        )}
        {statusGeral.sucesso && (
          <p role="status" style={{ color: "green" }}>
            {statusGeral.sucesso}
          </p>
        )}

        <div className="campoCadUsuario">
          <label htmlFor="username">Nome:</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={!!erros.username}
            aria-describedby={erros.username ? "nome-error" : undefined}
          />
          {erros.username && (
            <p
              id="nome-error"
              role="alert"
              style={{ color: "red", fontSize: "0.9em" }}
            >
              {erros.username}
            </p>
          )}
        </div>

        <div className="campoCadUsuario">
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
            aria-describedby={erros.email ? "email-error" : undefined}
          />
          {erros.email && (
            <p
              id="email-error"
              role="alert"
              style={{ color: "red", fontSize: "0.9em" }}
            >
              {erros.email}
            </p>
          )}
        </div>

        <a href="/">Voltar para a Home</a>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
