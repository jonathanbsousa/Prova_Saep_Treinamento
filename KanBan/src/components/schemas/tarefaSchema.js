import { z } from "zod";

export const tarefaSchema = z.object({
  id: z.number().int().positive(),
  descricao: z
    .string()
    .min(1, "Descrição obrigatória")
    .regex(/^\S.*$/, "Não pode começar com espaço em branco"),
  nome_setor: z
    .string()
    .min(1, "Setor obrigatório")
    .regex(/^[\p{L}\p{N} ]+$/u, "Use apenas letras, números e espaços"),
  usuario_nome: z.string().min(1, "Usuário inválido"),
  prioridade: z.enum(["alta", "media", "baixa"]),
  status: z.enum(["a fazer", "fazendo", "concluido"]),
});

export const tarefaArraySchema = z.array(tarefaSchema);