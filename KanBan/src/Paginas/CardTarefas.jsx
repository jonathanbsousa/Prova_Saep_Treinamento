import React, { useState, useEffect } from "react";
import { z } from "zod";

const tarefaSchema = z.object({
  descricao: z.string().min(1, "A descrição é obrigatória"),
  nome_setor: z.string().min(1, "O setor é obrigatório"),
  usuario: z.string().min(1, "O usuário é obrigatório"),
  prioridade: z.enum(["alta", "media", "baixa"], {
    errorMap: () => ({ message: "Selecione uma prioridade válida" }),
  }),
  status: z.enum(["a fazer", "fazendo", "concluido"], {
    errorMap: () => ({ message: "Selecione um status válido" }),
  }),
});

const API_URLS = {
  USUARIOS: "http://127.0.0.1:8000/api/pessoas/",
  TAREFAS: "http://127.0.0.1:8000/api/tarefas/",
};

export function CardTarefas() {
  const [formData, setFormData] = useState({
    descricao: "",
    nome_setor: "",
    usuario: "",
    prioridade: "",
    status: "a fazer",
  });

  const [erros, setErros] = useState({});
  const [statusGeral, setStatusGeral] = useState({ erro: "", sucesso: "" });

  const [usuarios, setUsuarios] = useState([]);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(API_URLS.USUARIOS);
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        setStatusGeral({ erro: "Falha ao carregar a lista de usuários." });
      }
    } catch (error) {
      setStatusGeral({
        erro: "Não foi possível conectar ao servidor para carregar usuários.",
      });
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

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

    const validation = tarefaSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = {};
      validation.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErros(fieldErrors);
      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
      return;
    }

    const { descricao, nome_setor, usuario, prioridade, status } =
      validation.data;
    const usuarioId = parseInt(usuario, 10);

    try {
      const response = await fetch(API_URLS.TAREFAS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descricao,
          nome_setor,
          usuario: usuarioId,
          prioridade,
          status,
        }),
      });

      if (response.ok) {
        setStatusGeral({ sucesso: "Tarefa cadastrada com sucesso!" });
        setFormData({
          descricao: "",
          nome_setor: "",
          usuario: "",
          prioridade: "",
          status: "a fazer",
        });
      } else {
        const errorData = await response.json();
        setStatusGeral({
          erro: errorData.detail || "Erro ao cadastrar a tarefa.",
        });
      }
    } catch (error) {
      setStatusGeral({
        erro: "Erro de rede ou servidor. Tente novamente mais tarde.",
      });
    }
  };

  return (
    <form
      className="formulario"
      onSubmit={handleSubmit}
      aria-labelledby="form-title"
    >
      <h2 id="form-title" className="titulo">
        Cadastro da Tarefa
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

      <div>
        <label htmlFor="descricao">Descrição:</label>
        <input
          id="descricao"
          name="descricao"
          type="text"
          value={formData.descricao}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!erros.descricao}
          aria-describedby={erros.descricao ? "descricao-error" : undefined}
        />
        {erros.descricao && (
          <p
            id="descricao-error"
            role="alert"
            style={{ color: "red", fontSize: "0.9em" }}
          >
            {erros.descricao}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="nome_setor">Setor:</label>
        <input
          id="nome_setor"
          name="nome_setor"
          type="text"
          value={formData.nome_setor}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!erros.nome_setor}
          aria-describedby={erros.nome_setor ? "setor-error" : undefined}
        />
        {erros.nome_setor && (
          <p
            id="setor-error"
            role="alert"
            style={{ color: "red", fontSize: "0.9em" }}
          >
            {erros.nome_setor}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="usuario">Usuário:</label>
        <select
          id="usuario"
          name="usuario"
          value={formData.usuario}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!erros.usuario}
          aria-describedby={erros.usuario ? "usuario-error" : undefined}
        >
          <option value="">Selecione um usuário</option>
          {usuarios.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        {erros.usuario && (
          <p
            id="usuario-error"
            role="alert"
            style={{ color: "red", fontSize: "0.9em" }}
          >
            {erros.usuario}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="prioridade">Prioridade:</label>
        <select
          id="prioridade"
          name="prioridade"
          value={formData.prioridade}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!erros.prioridade}
          aria-describedby={erros.prioridade ? "prioridade-error" : undefined}
        >
          <option value="">Selecione a prioridade</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
        {erros.prioridade && (
          <p
            id="prioridade-error"
            role="alert"
            style={{ color: "red", fontSize: "0.9em" }}
          >
            {erros.prioridade}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          aria-required="true"
        >
          <option value="a fazer">A Fazer</option>
          <option value="fazendo">Fazendo</option>
          <option value="concluido">Concluído</option>
        </select>
      </div>

      <a href="/">Voltar para a Home</a>

      <button type="submit">Cadastrar</button>
    </form>
  );
}
