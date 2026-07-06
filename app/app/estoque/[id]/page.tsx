import Sidebar from "@/app/components/sidebar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProdutoDetalhes({ params }: Props) {
  const { id } = await params;

  const produto = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      categoria: true,
    },
  });

  if (!produto) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Detalhes do Produto</h1>

          <Link
            href="/estoque"
            className="bg-zinc-600 text-white px-4 py-2 rounded"
          >
            Voltar
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <p><strong>Nome:</strong> {produto.nome}</p>
          <p><strong>Descrição:</strong> {produto.descricao || "Sem descrição"}</p>
          <p><strong>Categoria:</strong> {produto.categoria?.nome || "Sem categoria"}</p>
          <p><strong>Quantidade:</strong> {produto.quantidade}</p>
          <p><strong>Quantidade mínima:</strong> {produto.quantidademinima}</p>
          <p><strong>Preço:</strong> R$ {produto.preco?.toFixed(2) ?? "0.00"}</p>
          <p>
            <strong>Validade:</strong>{" "}
            {produto.dataValidade
              ? new Date(produto.dataValidade).toLocaleDateString("pt-BR")
              : "Sem validade"}
          </p>
        </div>
      </main>
    </div>
  );
}