import React, { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";

const tarefaSchema = z.object({
  descricao: z
    .string()
    .min(3, "Descrição muito curta")
    .max(200, "Descrição muito longa")
    .regex(/^\S.*$/, "Não pode começar com espaço"),
  nome_setor: z
    .string()
    .min(2, "Setor inválido")
    .regex(/^[\p{L}\p{N} ]+$/u, "Apenas letras, números e espaços"),
  usuario: z.coerce.number().int().positive("Usuário inválido"),
  status: z.enum(["a fazer", "fazendo", "concluido"]),
});

export function CardTarefas() {
  const [formData, setFormData] = useState({
    descricao: "",
    nome_setor: "",
    usuario: "",
    status: "a fazer",
  });
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    let cancel = false;
    axios
      .get("http://127.0.0.1:8000/api/pessoas/")
      .then((res) => !cancel && setUsuarios(res.data))
      .catch(() => !cancel && setErro("Erro ao carregar usuários"));
    return () => {
      cancel = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const result = tarefaSchema.safeParse(formData);
    if (!result.success) {
      setErro(result.error.issues.map((err) => err.message).join(", "));
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/tarefas/", formData, {
        timeout: 5000,
      });
      setSucesso("Tarefa cadastrada com sucesso!");
      setFormData({
        descricao: "",
        nome_setor: "",
        usuario: "",
        status: "a fazer",
      });
    } catch {
      setErro("Erro ao cadastrar tarefa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screenBody">
      <h2>Cadastrar Tarefa</h2>
      {erro && <p className="erro">{erro}</p>}
      {sucesso && <p className="sucesso">{sucesso}</p>}
      <form onSubmit={handleSubmit} className="cadastro-form">
        <input
          type="text"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          placeholder="Descrição da tarefa"
          required
        />
        <input
          type="text"
          name="nome_setor"
          value={formData.nome_setor}
          onChange={handleChange}
          placeholder="Nome do setor"
          required
        />
        <select
          name="usuario"
          value={formData.usuario}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um usuário</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="a fazer">A Fazer</option>
          <option value="fazendo">Fazendo</option>
          <option value="concluido">Concluído</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
