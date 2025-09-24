import React from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = { TAREFA: "tarefa" };

function TarefaCard({ tarefa, onDrop }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TAREFA,
    item: { id: tarefa.id, status: tarefa.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="tarefa-item"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        border: "1px solid #ccc",
        padding: "8px",
        marginBottom: "6px",
        borderRadius: "8px",
        background: "#fff",
      }}
    >
      <p><strong>Id:</strong> {tarefa.id}</p>
      <p><strong>Descrição:</strong> {tarefa.descricao}</p>
      <p><strong>Setor:</strong> {tarefa.nome_setor}</p>
      <p><strong>Usuário:</strong> {tarefa.usuario_nome}</p>
      <p><strong>Prioridade:</strong> {tarefa.prioridade}</p>
      <p><strong>Status:</strong> {tarefa.status}</p>
    </div>
  );
}

export default function Coluna({ status, tarefas, atualizarStatus }) {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.TAREFA,
    drop: (item) => {
      if (item.status !== status) {
        atualizarStatus(item.id, status);
      }
    },
  }));

  return (
    <div
      ref={drop}
      className="coluna"
      style={{
        minHeight: "300px",
        flex: 1,
        padding: "10px",
        background: "#f5f5f5",
        borderRadius: "10px",
      }}
    >
      {tarefas.length > 0 ? (
        tarefas.map((t) => (
          <TarefaCard key={t.id} tarefa={t} />
        ))
      ) : (
        <p>Nenhuma tarefa aqui.</p>
      )}
    </div>
  );
}