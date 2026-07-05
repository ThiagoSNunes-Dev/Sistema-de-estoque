'use server'

import { prisma } from '@/lib/prisma'
import { type TipoMovimentacao } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


export async function movimentarProduto(formData: FormData) {
  const produtoId = Number(formData.get("produtoId"))
  const tipo = String(formData.get("tipo") || "") as TipoMovimentacao
  const quantidade = Number(formData.get("quantidade"))
  const observacao = String(formData.get("observacao") || "")

  if (!produtoId || !tipo || !quantidade || quantidade <= 0) {
    return
  }

  const produto = await prisma.product.findUnique({
    where: { id: produtoId },
  })

  if (!produto) {
    return
  }

  if (tipo === "SAIDA" && produto.quantidade < quantidade) {
    return
  }

  let novaQuantidade = produto.quantidade

  if (tipo === "ENTRADA") {
    novaQuantidade += quantidade
  }

  if (tipo === "SAIDA") {
    novaQuantidade -= quantidade
  }

  if (tipo === "AJUSTE") {
    novaQuantidade = quantidade
  }

  await prisma.movimentacao.create({
    data: {
      produtoId,
      tipo,
      quantidade,
      observacao,
    },
  })

  await prisma.product.update({
    where: { id: produtoId },
    data: {
      quantidade: novaQuantidade,
    },
  })

  revalidatePath('/movimentacoes')
  revalidatePath('/estoque')
  revalidatePath('/alertas')
  revalidatePath('/relatorios')

  redirect('/movimentacoes')
}