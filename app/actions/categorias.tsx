'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCategoria(formData: FormData) {
  try {
    const nome = String(formData.get("nome") || "").trim()

    if (!nome) {
      throw new Error("Nome da categoria é obrigatório.")
    }

    const categoriaExistente = await prisma.categoria.findFirst({
      where: { nome: { equals: nome, mode: "insensitive" } },
    })

    if (categoriaExistente) {
      throw new Error("Já existe uma categoria com esse nome.")
    }

    await prisma.categoria.create({ data: { nome } })

    revalidatePath('/categorias')
    return { success: true } as const
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : "Erro ao criar categoria." 
    } as const
  }
}

export async function deleteCategoria(formData: FormData) {
  try {
    const id = Number(formData.get('id'))

    if (!id) {
      throw new Error("ID inválido.")
    }

    const produtosVinculados = await prisma.product.count({
      where: { categoriaId: id },
    })

    if (produtosVinculados > 0) {
      throw new Error("Existem produtos vinculados a essa categoria.")
    }

    await prisma.categoria.delete({ where: { id } })

    revalidatePath('/categorias')
    return { success: true } as const
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : "Erro ao deletar categoria." 
    } as const
  }
}