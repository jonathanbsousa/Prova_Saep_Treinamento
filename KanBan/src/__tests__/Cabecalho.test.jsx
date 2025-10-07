import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Cabecalho from "../components/Cabecalho";

describe("Componente Cabecalho", () => {
  test("deve renderizar o título corretamente", () => {
  render(<Cabecalho />);
  expect(screen.getByRole("heading", { level: 1, name: "Gerenciamento de Tarefas" })).toBeInTheDocument();
});


  test("deve renderizar todos os links da barra de navegação", () => {
    render(<Cabecalho />);
    expect(screen.getByRole("link", { name: /Cadastro de Usuario/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Cadastro de Tarefas/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Gerenciamento de Tarefas/i })).toBeInTheDocument();
  });

  test("cada link deve ter o href correto", () => {
    render(<Cabecalho />);
    expect(screen.getByRole("link", { name: /Cadastro de Usuario/i })).toHaveAttribute("href", "cadUsuario");
    expect(screen.getByRole("link", { name: /Cadastro de Tarefas/i })).toHaveAttribute("href", "cadTarefa");
    expect(screen.getByRole("link", { name: /Gerenciamento de Tarefas/i })).toHaveAttribute("href", "#");
  });

  test("simula clique em um link", () => {
    render(<Cabecalho />);
    const link = screen.getByRole("link", { name: /Cadastro de Usuario/i });
    fireEvent.click(link);
    expect(link).toBeInTheDocument();
  });
});
