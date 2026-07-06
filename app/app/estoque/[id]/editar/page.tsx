import Sidebar from "../../../components/sidebar";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/app/actions/products";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarProdutoPage({ params }: Props) {
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

  const categorias = await prisma.categoria.findMany({
    orderBy: {
      nome: "asc",
    },
  });

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Editar Produto
          </h1>

          <Link
            href="/estoque"
            className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded"
          >
            Voltar
          </Link>
        </div>

        <form
          action={updateProduct.bind(null, Number(produto.id)) as any}
          className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl"
        >
          <div>
            <label className="block mb-1 font-medium">
              Nome
            </label>

            <input
              name="nome"
              defaultValue={produto.nome}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
          <label className="mb-2 block font-medium">
            Preço
          </label>

          <input
            type="number"
            step="0.01"
            name="preco"
            defaultValue={produto.preco ?? ""}
            className="w-full rounded-lg border p-3"
          />
        </div>

          <div>
            <label className="block mb-1 font-medium">
              Descrição
            </label>

            <input
              name="descricao"
              defaultValue={produto.descricao ?? ""}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Quantidade
            </label>

            <input
              type="number"
              name="quantidade"
              defaultValue={produto.quantidade}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Categoria
            </label>

            <select
              name="categoriaId"
              defaultValue={String(produto.categoriaId ?? "")}
              className="w-full border p-2 rounded"
            >
              <option value="">Sem categoria</option>

              {categorias.map((categoria) => (
                <option
                  key={categoria.id}
                  value={categoria.id}
                >
                  {categoria.nome}
                </option>
              ))}
            </select>
            <div>
            <label className="block mb-1 font-medium">
              Data de Validade
            </label>

            <input
              type="date"
              name="dataValidade"
              defaultValue={
                produto.dataValidade
                  ? produto.dataValidade.toISOString().split("T")[0]
                  : ""
              }
              className="w-full border p-2 rounded"
            />
          </div>
          </div>

          <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Salvar Alterações
        </button>

        <Link
          href="/estoque"
          className="bg-zinc-500 hover:bg-zinc-600 text-white px-4 py-2 rounded"
        >
          Cancelar
        </Link>
      </div>
        </form>
      </main>
    </div>
  );
}