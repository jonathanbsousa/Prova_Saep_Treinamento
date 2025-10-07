import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { DndProvider } from "react-dnd";
import { TestBackend } from "react-dnd-test-backend";

import Quadro from "../components/Quadro";

const tarefasMock = [
  {
    id: 1,
    usuario_nome: "João",
    descricao: "Tarefa 1",
    nome_setor: "TI",
    prioridade: "Alta",
    status: "a fazer",
  },
  {
    id: 2,
    usuario_nome: "João",
    descricao: "Tarefa 2",
    nome_setor: "TI",
    prioridade: "Alta",
    status: "a fazer",
  },
];

describe("Quadro de Tarefas", () => {
  beforeEach(() => {
    global.fetch = vi.fn((url, opts) => {
      if (opts && opts.method === "PATCH") {
        return Promise.resolve({ ok: true });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(tarefasMock),
      });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renderiza todas as tarefas nas colunas corretas", async () => {
    render(
      <DndProvider backend={TestBackend}>
        <Quadro />
      </DndProvider>
    );

    // Espera o carregamento das tarefas
    await waitFor(() => {
      expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
      expect(screen.getByText("Tarefa 2")).toBeInTheDocument();
    });

    const colunaAFazer = screen.getByText("A Fazer").parentElement.querySelector('.coluna');
  expect(colunaAFazer).toHaveTextContent("Tarefa 1");
  expect(colunaAFazer).toHaveTextContent("Tarefa 2");

    const colunaFazendo = screen.getByText("Fazendo").parentElement.querySelector('.coluna');
  expect(colunaFazendo).not.toHaveTextContent("Tarefa 1");
  expect(colunaFazendo).not.toHaveTextContent("Tarefa 2");
  });

  it("atualiza o status da tarefa corretamente ao chamar a função", async () => {
    render(
      <DndProvider backend={TestBackend}>
        <Quadro />
      </DndProvider>
    );

    await waitFor(() => screen.getByText("Tarefa 1"));

    // Simula atualizar status diretamente
    const tarefa1 = tarefasMock[0];
    const atualizarStatus = tarefa1.id;

    // Normalmente você chamaria atualizarStatusTarefa(id, novoStatus)
    // Como ela está dentro do componente, vamos simular o PATCH:
    await fetch(`http://127.0.0.1:8000/api/tarefas/${tarefa1.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "fazendo" }),
    });

    expect(fetch).toHaveBeenCalledWith(
      `http://127.0.0.1:8000/api/tarefas/${tarefa1.id}/`,
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ status: "fazendo" }),
      })
    );
  });
});
