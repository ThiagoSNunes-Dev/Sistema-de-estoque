import Sidebar from "../../../components/sidebar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function movimentarProduto(id: number, formData: FormData) {
  "use server";

  const tipo = formData.get("tipo");
  const quantidadeValue = formData.get("quantidade");

  if (
    typeof tipo !== "string" ||
    !["ENTRADA", "SAIDA", "AJUSTE"].includes(tipo) ||
    !quantidadeValue
  ) {
    return;
  }

  const quantidade = Number(quantidadeValue);
  if (Number.isNaN(quantidade) || quantidade < 0) {
    return;
  }

  const produto = await prisma.product.findUnique({
    where: { id },
  });

  if (!produto) {
    return;
  }

  let novaQuantidade = produto.quantidade;

  if (tipo === "ENTRADA") {
    novaQuantidade += quantidade;
  } else if (tipo === "SAIDA") {
    novaQuantidade -= quantidade;
  } else {
    novaQuantidade = quantidade;
  }

  await prisma.product.update({
    where: { id },
    data: { quantidade: novaQuantidade },
  });

  redirect(`/estoque/${id}`);
}

export default async function MovimentarProdutoPage({
  params,
}: Props) {
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
    notFound();
  }

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />

      <main className="flex-1 p-8">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              Movimentar Estoque
            </h1>

            <p className="text-zinc-500 mt-1">
              Entrada, saída ou ajuste de estoque
            </p>
          </div>

          <Link
            href="/estoque"
            className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg"
          >
            Voltar
          </Link>

        </div>

        <div className="bg-white rounded-xl shadow p-6 max-w-2xl">

          <div className="mb-8 border-b pb-6">

            <h2 className="text-2xl font-semibold">
              {produto.nome}
            </h2>

            <p className="text-zinc-500">
              Categoria: {produto.categoria?.nome ?? "Sem categoria"}
            </p>

            <div className="mt-5 flex gap-10">

              <div>
                <span className="text-zinc-500">
                  Estoque Atual
                </span>

                <p className="text-4xl font-bold text-blue-600">
                  {produto.quantidade}
                </p>
              </div>

              <div>
                <span className="text-zinc-500">
                  Estoque Mínimo
                </span>

                <p className="text-4xl font-bold text-orange-500">
                  {produto.quantidademinima}
                </p>
              </div>

            </div>

          </div>

          <form
            action={movimentarProduto.bind(null, produto.id)}
            className="space-y-5"
          >

            <div>

              <label className="block font-medium mb-2">
                Tipo de Movimentação
              </label>

              <select
                name="tipo"
                required
                className="w-full border rounded-lg p-3"
              >
                <option value="">
                  Selecione...
                </option>

                <option value="ENTRADA">
                  📥 Entrada
                </option>

                <option value="SAIDA">
                  📤 Saída
                </option>

                <option value="AJUSTE">
                  ⚖ Ajuste
                </option>

              </select>

            </div>

            <div>

              <label className="block font-medium mb-2">
                Quantidade
              </label>

              <input
                type="number"
                min="1"
                required
                name="quantidade"
                className="w-full border rounded-lg p-3"
              />

            </div>

            <div>

              <label className="block font-medium mb-2">
                Observação
              </label>

              <textarea
                rows={4}
                name="observacao"
                placeholder="Ex.: Compra fornecedor, venda, perda, inventário..."
                className="w-full border rounded-lg p-3"
              />

            </div>

            <div className="flex gap-3">

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Confirmar Movimentação
              </button>

              <Link
                href={`/estoque/${produto.id}`}
                className="bg-zinc-300 hover:bg-zinc-400 px-6 py-3 rounded-lg"
              >
                Cancelar
              </Link>

            </div>

          </form>

        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-8 max-w-2xl">

          <h3 className="font-semibold mb-3">
            Como funciona?
          </h3>

          <ul className="space-y-2 text-sm text-zinc-700">

            <li>
              📥 <strong>Entrada:</strong> soma a quantidade ao estoque.
            </li>

            <li>
              📤 <strong>Saída:</strong> reduz a quantidade do estoque.
            </li>

            <li>
              ⚖ <strong>Ajuste:</strong> define uma nova quantidade após inventário.
            </li>

          </ul>

        </div>

      </main>
    </div>
  );
}