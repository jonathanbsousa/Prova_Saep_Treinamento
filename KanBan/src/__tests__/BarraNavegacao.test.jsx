import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BarraNavegacao } from "../components/BarraNavegacao";

describe("Componente BarraNavegacao", () => {
  test("deve renderizar todos os links corretamente", () => {
    render(<BarraNavegacao />);

    // Verifica se os textos dos links estão presentes
    expect(screen.getByText("Cadastro de Usuario")).toBeInTheDocument();
    expect(screen.getByText("Cadastro de Tarefas")).toBeInTheDocument();
    expect(screen.getByText("Gerenciamento de Tarefas")).toBeInTheDocument();
  });

  test("cada link deve ter o href correto", () => {
    render(<BarraNavegacao />);

    expect(
      screen.getByRole("link", { name: /Cadastro de Usuario/i })
    ).toHaveAttribute("href", "cadUsuario");
    expect(
      screen.getByRole("link", { name: /Cadastro de Tarefas/i })
    ).toHaveAttribute("href", "cadTarefa");
    expect(
      screen.getByRole("link", { name: /Gerenciamento de Tarefas/i })
    ).toHaveAttribute("href", "#");
  });

  test("simula clique em um link", () => {
    render(<BarraNavegacao />);

    const linkUsuario = screen.getByText("Cadastro de Usuario");
    fireEvent.click(linkUsuario);

    // Apenas garante que o clique é possível
    expect(linkUsuario).toBeInTheDocument();
  });
});
