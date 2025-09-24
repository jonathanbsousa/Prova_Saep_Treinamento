import React, { useState, useEffect } from "react";
import Coluna from "./Coluna";
import "../styles/Quadro.scss";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { tarefaArraySchema } from "./schemas/tarefaSchema";

export default function Quadro() {
  const [tarefas, setTarefas] = useState([]);
  const [erro, setErro] = useState("");

  const fetchTarefas = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tarefas/");
      if (!response.ok) throw new Error("Erro na API");

      const data = await response.json();

      const parsed = tarefaArraySchema.safeParse(data);
      if (!parsed.success) {
        console.error("Dados inválidos da API:", parsed.error);
        throw new Error("Dados da API inválidos");
      }

      setTarefas(parsed.data);
    } catch (error) {
      setErro("Erro ao carregar tarefas");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTarefas();
  }, []);

  const atualizarStatusTarefa = async (id, novoStatus) => {
    setTarefas((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: novoStatus } : t
      )
    );

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tarefas/${id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: novoStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao atualizar");
      }
    } catch (error) {
      console.error("Rollback por erro:", error);
      fetchTarefas();
    }
  };

  const tarefasFazer = tarefas.filter((t) => t.status === "a fazer");
  const tarefasFazendo = tarefas.filter((t) => t.status === "fazendo");
  const tarefasConcluido = tarefas.filter((t) => t.status === "concluido");

  return (
    <DndProvider backend={HTML5Backend}>
      <main className="containerQuadro">
        <h1>Quadro de Tarefas</h1>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <div className="containerQuadros" style={{ display: "flex", gap: "16px" }}>
          <div className="quadro">
            <h2>A Fazer</h2>
            <Coluna
              status="a fazer"
              tarefas={tarefasFazer}
              atualizarStatus={atualizarStatusTarefa}
            />
          </div>
          <div className="quadro">
            <h2>Fazendo</h2>
            <Coluna
              status="fazendo"
              tarefas={tarefasFazendo}
              atualizarStatus={atualizarStatusTarefa}
            />
          </div>
          <div className="quadro">
            <h2>Concluído</h2>
            <Coluna
              status="concluido"
              tarefas={tarefasConcluido}
              atualizarStatus={atualizarStatusTarefa}
            />
          </div>
        </div>
      </main>
    </DndProvider>
  );
}
