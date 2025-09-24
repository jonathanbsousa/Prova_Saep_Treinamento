import React, { useState } from "react";
import axios from "axios";
import { z } from "zod";

const userSchema = z.object({
  username: z
    .string()
    .min(3, "Nome de usuário muito curto")
    .max(20, "Nome de usuário muito longo")
    .regex(/^[a-zA-Z0-9_]+$/, "Apenas letras, números e _"),
  email: z
    .string()
    .email("Email inválido")
    .regex(/^[^\s@]+@[a-z0-9.-]+\.[a-z]{2,}$/i, "Email inválido"),
});

const API_REGISTER_URL = "http://127.0.0.1:8000/api/register/";

export function CardUsuario() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const result = userSchema.safeParse(formData);
    if (!result.success) {
      setErro(result.error.errors.map((err) => err.message).join(", "));
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/register/", formData, {
        timeout: 5000,
      });
      setSucesso("Usuário cadastrado com sucesso!");
      setFormData({ username: "", email: "" });
    } catch {
      setErro("Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screenBody">
      <h2>Cadastrar Usuário</h2>
      {erro && <p className="erro">{erro}</p>}
      {sucesso && <p className="sucesso">{sucesso}</p>}
      <form onSubmit={handleSubmit} className="cadastro-form">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Nome de usuário"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
