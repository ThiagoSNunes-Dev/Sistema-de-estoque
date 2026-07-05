import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET() {
  const produtos = await prisma.product.findMany({
    include: {
      categoria: true,
    },
    orderBy: {
      nome: "asc",
    },
  });

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Sistema de Estoque";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Produtos");

  sheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Produto", key: "nome", width: 30 },
    { header: "Categoria", key: "categoria", width: 20 },
    { header: "Quantidade", key: "quantidade", width: 15 },
    { header: "Quantidade Mínima", key: "minimo", width: 20 },
    { header: "Preço", key: "preco", width: 15 },
    { header: "Validade", key: "validade", width: 18 },
  ];

  sheet.getRow(1).font = {
    bold: true,
  };

  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "2563EB",
    },
  };

  sheet.getRow(1).font = {
    bold: true,
    color: {
      argb: "FFFFFF",
    },
  };

  produtos.forEach((produto) => {
    sheet.addRow({
      id: produto.id,
      nome: produto.nome,
      categoria: produto.categoria?.nome ?? "Sem categoria",
      quantidade: produto.quantidade,
      minimo: produto.quantidademinima,
      preco: produto.preco ?? 0,
      validade: produto.dataValidade
        ? produto.dataValidade.toLocaleDateString("pt-BR")
        : "",
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "Content-Disposition":
        'attachment; filename="Relatorio_Estoque.xlsx"',
    },
  });
}