'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const ProductSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional(),
  novaCategoria: z.string().optional(),
  quantidade: z.number().min(0),
  quantidadeMinima: z.number().min(0).default(5),
  preco: z.number().optional(),
  dataValidade: z.string().optional(),
  categoriaId: z.number().optional(),
})

export async function createProduct(formData: FormData) { 
  const validated = ProductSchema.parse({
    nome: formData.get("nome"),
    descricao: formData.get("descricao")?.toString(),
    novaCategoria: formData.get("novaCategoria")?.toString(),

    quantidade: Number(formData.get("quantidade")),
    quantidadeMinima: Number(formData.get("quantidadeMinima")) || 5,

    categoriaId: formData.get("categoriaId")
      ? Number(formData.get("categoriaId"))
      : undefined,

    preco: formData.get("preco")
      ? Number(formData.get("preco"))
      : undefined,

    dataValidade: formData.get("dataValidade")?.toString(),
  })

  let categoriaId = validated.categoriaId

  if (validated.novaCategoria?.trim()) {
    const categoriaExistente = await prisma.categoria.findFirst({
      where: {
        nome: validated.novaCategoria.trim(),
      },
    })

    if (categoriaExistente) {
      categoriaId = categoriaExistente.id
    } else {
      const novaCategoria = await prisma.categoria.create({
        data: {
          nome: validated.novaCategoria.trim(),
        },
      })

      categoriaId = novaCategoria.id
    }
  }

  await prisma.product.create({
    data: {
      nome: validated.nome,
      descricao: validated.descricao ?? "",
      quantidade: validated.quantidade,
      quantidademinima: validated.quantidadeMinima,
      categoriaId,
      preco: validated.preco ?? 0,
      dataValidade: validated.dataValidade
        ? new Date(validated.dataValidade)
        : null,
    },
  })

  revalidatePath('/estoque')
  redirect('/estoque')
}

export async function updateProduct(id: number, formData: FormData) {

  // Produto antes da alteração
  const produtoAntigo = await prisma.product.findUnique({
    where: { id }
  });

  if (!produtoAntigo) {
    throw new Error("Produto não encontrado.");
  }

  const quantidadeNova = Number(formData.get("quantidade"));

  const produtoAtualizado = await prisma.product.update({
    where: {
      id,
    },
    data: {
      nome: formData.get("nome")?.toString() || "",
      descricao: formData.get("descricao")?.toString() || "",
      preco: Number(formData.get("preco")),
      quantidade: quantidadeNova,

      categoriaId: formData.get("categoriaId")
        ? Number(formData.get("categoriaId"))
        : null,

      dataValidade: formData.get("dataValidade")
        ? new Date(formData.get("dataValidade")!.toString())
        : null,
    },
  });

  // Se mudou a quantidade, registra ajuste
  if (produtoAntigo.quantidade !== quantidadeNova) {
    await prisma.movimentacao.create({
      data: {
        produtoId: produtoAtualizado.id,
        tipo: "AJUSTE",
        quantidade: quantidadeNova,
        observacao: `Quantidade alterada de ${produtoAntigo.quantidade} para ${quantidadeNova}`,
      },
    });
  }

  revalidatePath("/estoque");
  revalidatePath("/movimentacoes");

  redirect("/estoque");
}

export async function deleteProduct(id: number) {
  await prisma.product.delete({
    where: {
      id,
    },
  });

  revalidatePath("/estoque");
  revalidatePath("/movimentacoes");
}

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: {
      id: "desc",
    },
  });
}