import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const formData = await req.formData();

  const nome = String(formData.get("nome") || "");
  const descricao = String(formData.get("descricao") || "");
  const quantidade = Number(formData.get("quantidade") || 0);
  const quantidadeMinima = Number(formData.get("quantidadeMinima") || 5);
  const preco = Number(formData.get("preco") || 0);
  const novaCategoria = String(formData.get("novaCategoria") || "").trim();

  let categoriaId = formData.get("categoriaId")
    ? Number(formData.get("categoriaId"))
    : null;

  if (novaCategoria) {
    const categoriaExistente = await prisma.categoria.findFirst({
      where: {
        nome: {
          equals: novaCategoria,
          mode: "insensitive",
        },
      },
    });

    if (categoriaExistente) {
      categoriaId = categoriaExistente.id;
    } else {
      const categoria = await prisma.categoria.create({
        data: { nome: novaCategoria },
      });

      categoriaId = categoria.id;
    }
  }

  await prisma.product.create({
    data: {
      nome,
      descricao,
      quantidade,
      quantidademinima: quantidadeMinima,
      preco,
      categoriaId,
    },
  });

  revalidatePath("/estoque");

  return NextResponse.json({ success: true });
}