import Sidebar from "../components/sidebar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "../components/deleteProductButton";
import { Eye, Pencil } from "lucide-react";

type Props = {
  searchParams?: Promise<{
    search?: string;
    categoriaId?: string;
    quantidade?: string;
    validade?: string;
    ordenar?: string;
    ordem?: string;
  }>;
};

export default async function EstoquePage({ searchParams }: Props) {
  const params = await searchParams;

  const search = params?.search || "";
  const categoria = params?.categoriaId || "";
  const quantidade = params?.quantidade || "";
  const validade = params?.validade || "";
  const ordenar = params?.ordenar || "id";
  const ordem = params?.ordem || "desc";

  const hoje = new Date();
  const limite = new Date();
  limite.setDate(limite.getDate() + 30);

  const categorias = await prisma.categoria.findMany({
    orderBy: {
      nome: "asc",
    },
  });

  const produtosDB = await prisma.product.findMany({
    where: {
      ...(search && {
        nome: {
          contains: search,
          mode: "insensitive",
        },
      }),

      ...(categoria && {
        categoriaId: Number(categoria),
      }),

      ...(quantidade === "zero" && {
        quantidade: 0,
      }),

      ...(validade === "vencido" && {
        dataValidade: {
          lt: hoje,
        },
      }),

      ...(validade === "proximo" && {
        dataValidade: {
          gte: hoje,
          lte: limite,
        },
      }),
    },

    include: {
      categoria: true,
    },

    orderBy: {
      [ordenar]: ordem === "asc" ? "asc" : "desc",
    } as any,
  });
  
  const produtos =
    quantidade === "baixo"
      ? produtosDB.filter(
          (produto) =>
            produto.quantidademinima != null &&
            produto.quantidade <= produto.quantidademinima
        )
      : produtosDB;

  return (
  <div className="flex min-h-screen bg-zinc-100">
    <Sidebar />

    <main className="flex-1 p-4 pt-20 lg:p-8">

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <h1 className="text-3xl font-bold lg:text-4xl">
          Produtos
        </h1>

        <Link
          href="/estoque/novo"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-white transition hover:bg-blue-700 sm:w-auto"
        >
          Novo Produto
        </Link>

      </div>

      <form
        method="GET"
        className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-7"
      >

        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Pesquisar produto..."
          className="w-full rounded-lg border p-3"
        />

        <select
          name="categoriaId"
          defaultValue={categoria}
          className="w-full rounded-lg border p-3"
        >
          <option value="">Sem categoria</option>

          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome}
            </option>
          ))}
        </select>

        <select
          name="quantidade"
          defaultValue={quantidade}
          className="w-full rounded-lg border p-3"
        >
          <option value="">Quantidade</option>
          <option value="baixo">Estoque baixo</option>
          <option value="zero">Sem estoque</option>
        </select>

        <select
          name="validade"
          defaultValue={validade}
          className="w-full rounded-lg border p-3"
        >
          <option value="">Validade</option>
          <option value="vencido">Vencidos</option>
          <option value="proximo">Próximos 30 dias</option>
        </select>

        <select
          name="ordenar"
          defaultValue={ordenar}
          className="w-full rounded-lg border p-3"
        >
          <option value="id">Data de cadastro</option>
          <option value="nome">Nome</option>
          <option value="quantidade">Quantidade</option>
          <option value="preco">Preço</option>
          <option value="dataValidade">Validade</option>
        </select>

        <select
          name="ordem"
          defaultValue={ordem}
          className="w-full rounded-lg border p-3"
        >
          <option value="asc">Crescente</option>
          <option value="desc">Decrescente</option>
        </select>

        <div className="flex flex-col gap-2 sm:flex-row">

          <button className="rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700">
            Filtrar
          </button>

          <Link
            href="/estoque"
            className="rounded-lg bg-zinc-300 px-4 py-3 text-center hover:bg-zinc-400"
          >
            Limpar
          </Link>

        </div>

      </form>

      {/* ================= MOBILE ================= */}

      <div className="space-y-4 lg:hidden">
       {produtos.length === 0 ? (
  <div className="rounded-xl bg-white p-8 text-center shadow">
    <p className="text-zinc-500">
      Nenhum produto encontrado.
    </p>
  </div>
) : (
  produtos.map((produto) => {
    let status = "OK";
    let statusClass = "bg-green-100 text-green-700";

    if (produto.dataValidade) {
      if (produto.dataValidade < hoje) {
        status = "Vencido";
        statusClass = "bg-red-100 text-red-700";
      } else if (produto.dataValidade <= limite) {
        status = "Próximo";
        statusClass = "bg-yellow-100 text-yellow-700";
      }
    }

    return (
      <div
        key={produto.id}
        className="rounded-xl bg-white p-5 shadow"
      >
        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <h2 className="truncate text-lg font-bold">
              {produto.nome}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {produto.categoria?.nome ?? "Sem categoria"}
            </p>

          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
          >
            {status}
          </span>

        </div>

        <div className="mt-5 space-y-3">

          <div className="flex justify-between">
            <span className="text-zinc-500">
              Quantidade
            </span>

            <span className="font-medium">
              {produto.quantidade}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">
              Preço
            </span>

            <span className="font-medium">
              R$ {produto.preco?.toFixed(2) ?? "0.00"}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-zinc-500">
              Validade
            </span>

            <span className="text-right font-medium">
              {produto.dataValidade
                ? new Date(produto.dataValidade).toLocaleDateString("pt-BR")
                : "Sem validade"}
            </span>
          </div>

        </div>

        <div className="mt-6 flex justify-end gap-2 border-t pt-4">

          <Link
            href={`/estoque/${produto.id}`}
            title="Visualizar"
            className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-200"
          >
            <Eye size={20} />
          </Link>

          <Link
            href={`/estoque/${produto.id}/editar`}
            title="Editar"
            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-100"
          >
            <Pencil size={20} />
          </Link>

          <DeleteProductButton id={produto.id} />

        </div>

      </div>
    );
  })
)}

</div>

{/* ================= DESKTOP ================= */}

<div className="hidden lg:block overflow-x-auto rounded-xl bg-white shadow">

  <table className="min-w-full">
    <thead className="bg-zinc-200">
      <tr>
        <th className="p-3 text-left">Nome</th>
        <th className="p-3 text-left">Categoria</th>
        <th className="p-3 text-left">Quantidade</th>
        <th className="p-3 text-left">Preço</th>
        <th className="p-3 text-left">Validade</th>
        <th className="p-3 text-left">Status</th>
        <th className="p-3 text-center">Ações</th>
      </tr>
    </thead>

    <tbody>
  {produtos.length === 0 ? (
    <tr>
      <td
        colSpan={7}
        className="p-6 text-center text-zinc-500"
      >
        Nenhum produto encontrado.
      </td>
    </tr>
  ) : (
    produtos.map((produto) => {
      let status = "OK";
      let statusClass = "text-green-600";

      if (produto.dataValidade) {
        if (produto.dataValidade < hoje) {
          status = "Vencido";
          statusClass = "text-red-600";
        } else if (produto.dataValidade <= limite) {
          status = "Próximo";
          statusClass = "text-yellow-500";
        }
      }

      return (
        <tr
          key={produto.id}
          className="border-t transition hover:bg-zinc-50"
        >
          <td className="whitespace-nowrap p-3">
            {produto.nome}
          </td>

          <td className="whitespace-nowrap p-3">
            {produto.categoria?.nome ?? "Sem categoria"}
          </td>

          <td className="whitespace-nowrap p-3">
            {produto.quantidade}
          </td>

          <td className="whitespace-nowrap p-3">
            R$ {produto.preco?.toFixed(2) ?? "0.00"}
          </td>

          <td className="whitespace-nowrap p-3">
            {produto.dataValidade
              ? new Date(produto.dataValidade).toLocaleDateString("pt-BR")
              : "Sem validade"}
          </td>

          <td className="whitespace-nowrap p-3">
            <span className={`font-semibold ${statusClass}`}>
              {status}
            </span>
          </td>

          <td className="whitespace-nowrap p-3">
            <div className="flex items-center justify-center gap-3">

              <Link
                href={`/estoque/${produto.id}`}
                title="Visualizar"
                className="rounded-md p-1 text-zinc-600 transition hover:bg-zinc-200 hover:text-black"
              >
                <Eye size={20} />
              </Link>

              <Link
                href={`/estoque/${produto.id}/editar`}
                title="Editar"
                className="rounded-md p-1 text-blue-600 transition hover:bg-blue-100 hover:text-blue-800"
              >
                <Pencil size={20} />
              </Link>

              <DeleteProductButton id={produto.id} />

            </div>
          </td>
        </tr>
      );
    })
  )}
</tbody>

  </table>
</div>

    </main>
  </div>
);
}