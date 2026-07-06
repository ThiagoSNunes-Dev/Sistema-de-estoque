import { prisma } from "@/lib/prisma";

export async function GET() {
  const produtos = await prisma.product.findMany({
    include: {
      categoria: true,
    },
    orderBy: {
      nome: "asc",
    },
  });

  const linhas = [
    [
      "Nome",
      "Categoria",
      "Quantidade",
      "Preço",
      "Validade",
    ].join(","),
  ];

  produtos.forEach((p) => {
    linhas.push([
      `"${p.nome}"`,
      `"${p.categoria?.nome ?? "Sem categoria"}"`,
      p.quantidade,
      p.preco ?? 0,
      p.dataValidade
        ? p.dataValidade.toLocaleDateString("pt-BR")
        : "",
    ].join(","));
  });

  return new Response(linhas.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition":
        'attachment; filename="relatorio-estoque.csv"',
    },
  });
}