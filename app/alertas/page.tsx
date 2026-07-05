import Sidebar from "../components/sidebar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  AlertTriangle,
  Package,
  Clock3,
  Pencil,
  Search,
  Eye,
} from "lucide-react";

type Props = {
  searchParams?: Promise<{
    tipo?: string;
    search?: string;
  }>;
};

export default async function AlertasPage({ searchParams }: Props) {
  const params = await searchParams;

  const filtro = params?.tipo ?? "todos";
  const pesquisa = params?.search ?? "";

  const hoje = new Date();

  const limite = new Date();
  limite.setDate(limite.getDate() + 30);

  const produtos = await prisma.product.findMany({
    include: {
      categoria: true,
    },
    orderBy: {
      nome: "asc",
    },
  });

  type Alerta = {
    id: number;
    nome: string;
    categoria: string;
    quantidade: number;
    quantidadeMinima: number;
    validade: Date | null;
    tipo: "Vencido" | "Próximo" | "Estoque baixo";
  };

  const alertas: Alerta[] = [];

  for (const produto of produtos) {
    if (produto.dataValidade && produto.dataValidade < hoje) {
      alertas.push({
        id: produto.id,
        nome: produto.nome,
        categoria: produto.categoria?.nome ?? "Sem categoria",
        quantidade: produto.quantidade,
        quantidadeMinima: produto.quantidademinima,
        validade: produto.dataValidade,
        tipo: "Vencido",
      });
    }

    if (
      produto.dataValidade &&
      produto.dataValidade >= hoje &&
      produto.dataValidade <= limite
    ) {
      alertas.push({
        id: produto.id,
        nome: produto.nome,
        categoria: produto.categoria?.nome ?? "Sem categoria",
        quantidade: produto.quantidade,
        quantidadeMinima: produto.quantidademinima,
        validade: produto.dataValidade,
        tipo: "Próximo",
      });
    }

    if (produto.quantidade <= produto.quantidademinima) {
      alertas.push({
        id: produto.id,
        nome: produto.nome,
        categoria: produto.categoria?.nome ?? "Sem categoria",
        quantidade: produto.quantidade,
        quantidadeMinima: produto.quantidademinima,
        validade: produto.dataValidade,
        tipo: "Estoque baixo",
      });
    }
  }

  let lista = alertas;

  if (pesquisa) {
    lista = lista.filter((a) =>
      a.nome.toLowerCase().includes(pesquisa.toLowerCase())
    );
  }

  if (filtro !== "todos") {
    lista = lista.filter((a) => {
      if (filtro === "vencidos") return a.tipo === "Vencido";
      if (filtro === "proximos") return a.tipo === "Próximo";
      if (filtro === "estoque") return a.tipo === "Estoque baixo";
      return true;
    });
  }

  lista.sort((a, b) => {
    const ordem = {
      Vencido: 0,
      Próximo: 1,
      "Estoque baixo": 2,
    };

    return ordem[a.tipo] - ordem[b.tipo];
  });

  const qtdVencidos = alertas.filter(
    (a) => a.tipo === "Vencido"
  ).length;

  const qtdProximos = alertas.filter(
    (a) => a.tipo === "Próximo"
  ).length;

  const qtdBaixo = alertas.filter(
    (a) => a.tipo === "Estoque baixo"
  ).length;

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />

      <main className="flex-1 p-4 pt-20 lg:p-8">

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-bold lg:text-4xl">
              Alertas
            </h1>

            <p className="mt-1 text-zinc-500">
              Produtos que precisam da sua atenção.
            </p>

          </div>

        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

          <Link
            href="/alertas?tipo=vencidos"
            className="rounded-xl bg-red-100 p-6 shadow transition hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="font-semibold text-red-700">
                  Produtos vencidos
                </p>

                <h2 className="mt-2 text-4xl font-bold text-red-700 lg:text-5xl">
                  {qtdVencidos}
                </h2>

              </div>

              <AlertTriangle size={42} className="text-red-700" />

            </div>

          </Link>

          <Link
            href="/alertas?tipo=proximos"
            className="rounded-xl bg-yellow-100 p-6 shadow transition hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="font-semibold text-yellow-700">
                  Próximos do vencimento
                </p>

                <h2 className="mt-2 text-4xl font-bold text-yellow-700 lg:text-5xl">
                  {qtdProximos}
                </h2>

              </div>

              <Clock3 size={42} className="text-yellow-700" />

            </div>

          </Link>

          <Link
            href="/alertas?tipo=estoque"
            className="rounded-xl bg-orange-100 p-6 shadow transition hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="font-semibold text-orange-700">
                  Estoque baixo
                </p>

                <h2 className="mt-2 text-4xl font-bold text-orange-700 lg:text-5xl">
                  {qtdBaixo}
                </h2>

              </div>

              <Package size={42} className="text-orange-700" />

            </div>

          </Link>

        </div>

        <form
          method="GET"
          className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow lg:flex-row lg:items-center"
        >

          <div className="relative w-full lg:flex-1">

            <Search
              className="absolute left-3 top-3 text-zinc-400"
              size={18}
            />

            <input
              name="search"
              defaultValue={pesquisa}
              placeholder="Pesquisar produto..."
              className="w-full rounded-lg border py-3 pl-10 pr-3"
            />

          </div>

          <select
            name="tipo"
            defaultValue={filtro}
            className="w-full rounded-lg border px-3 py-3 lg:w-auto"
          >
            <option value="todos">Todos os alertas</option>
            <option value="vencidos">Vencidos</option>
            <option value="proximos">Próximos do vencimento</option>
            <option value="estoque">Estoque baixo</option>
          </select>

          <button className="w-full rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700 lg:w-auto">
            Filtrar
          </button>

          <Link
            href="/alertas"
            className="w-full rounded-lg bg-zinc-300 px-5 py-3 text-center transition hover:bg-zinc-400 lg:w-auto"
          >
            Limpar
          </Link>

        </form>

        {/* ================= MOBILE ================= */}

        <div className="space-y-4 lg:hidden">
          {lista.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow">
              <p className="text-zinc-500">
                Nenhum alerta encontrado.
              </p>
            </div>
          ) : (
            lista.map((alerta) => {
              let badge = "bg-green-100 text-green-700";

              if (alerta.tipo === "Vencido") {
                badge = "bg-red-100 text-red-700";
              }

              if (alerta.tipo === "Próximo") {
                badge = "bg-yellow-100 text-yellow-700";
              }

              if (alerta.tipo === "Estoque baixo") {
                badge = "bg-orange-100 text-orange-700";
              }

              const dias = alerta.validade
                ? Math.ceil(
                    (alerta.validade.getTime() - hoje.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : null;

              return (
                <div
                  key={`${alerta.tipo}-${alerta.id}`}
                  className="rounded-xl bg-white p-5 shadow"
                >
                  <div className="flex items-start justify-between">

                    <div>

                      <h2 className="text-lg font-bold">
                        {alerta.nome}
                      </h2>

                      <p className="text-sm text-zinc-500">
                        {alerta.categoria}
                      </p>

                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${badge}`}
                    >
                      {alerta.tipo}
                    </span>

                  </div>

                  <div className="mt-4 space-y-2 text-sm">

                    <div className="flex justify-between">

                      <span className="text-zinc-500">
                        Quantidade
                      </span>

                      <span>
                        {alerta.quantidade}
                      </span>

                    </div>

                    {alerta.tipo === "Estoque baixo" && (
                      <div className="flex justify-between">

                        <span className="text-zinc-500">
                          Mínimo
                        </span>

                        <span>
                          {alerta.quantidadeMinima}
                        </span>

                      </div>
                    )}

                    <div className="flex justify-between">

                      <span className="text-zinc-500">
                        Validade
                      </span>

                      <span>

                        {alerta.validade
                          ? alerta.validade.toLocaleDateString("pt-BR")
                          : "-"}

                      </span>

                    </div>

                    {alerta.tipo === "Próximo" && (
                      <div className="text-yellow-600 text-sm">
                        Vence em {dias} dias
                      </div>
                    )}

                    {alerta.tipo === "Vencido" && (
                      <div className="text-red-600 text-sm">
                        Vencido há {Math.abs(dias!)} dias
                      </div>
                    )}

                  </div>

                  <div className="mt-5 flex justify-end gap-3">

                    <Link
                      href={`/estoque/${alerta.id}`}
                      className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-200"
                    >
                      <Eye size={20} />
                    </Link>

                    <Link
                      href={`/estoque/${alerta.id}/editar`}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-100"
                    >
                      <Pencil size={20} />
                    </Link>

                  </div>

                </div>
              );
            })
          )}
        </div>

              {/* ================= DESKTOP ================= */}

              <div className="hidden lg:block overflow-x-auto rounded-xl bg-white shadow">

              <table className="min-w-225 w-full">

              <thead className="bg-zinc-200">

              <tr>

              <th className="whitespace-nowrap p-3 text-left">
              Produto
              </th>

              <th className="whitespace-nowrap p-3 text-left">
              Categoria
              </th>

              <th className="whitespace-nowrap p-3 text-left">
              Tipo
              </th>

              <th className="whitespace-nowrap p-3 text-left">
              Quantidade
              </th>

              <th className="whitespace-nowrap p-3 text-left">
              Validade
              </th>

              <th className="whitespace-nowrap p-3 text-center">
              Ações
              </th>

              </tr>

              </thead>

              <tbody>
              {lista.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-zinc-500"
                  >
                    Nenhum alerta encontrado.
                  </td>
                </tr>
              ) : (
                lista.map((alerta) => {
                  let badge = "bg-green-100 text-green-700";

                  if (alerta.tipo === "Vencido") {
                    badge = "bg-red-100 text-red-700";
                  }

                  if (alerta.tipo === "Próximo") {
                    badge = "bg-yellow-100 text-yellow-700";
                  }

                  if (alerta.tipo === "Estoque baixo") {
                    badge = "bg-orange-100 text-orange-700";
                  }

                  const dias = alerta.validade
                    ? Math.ceil(
                        (alerta.validade.getTime() - hoje.getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    : null;

                  return (
                    <tr
                      key={`${alerta.tipo}-${alerta.id}`}
                      className="border-t transition hover:bg-zinc-50"
                    >
                      <td className="whitespace-nowrap p-3 font-medium">
                        {alerta.nome}
                      </td>

                      <td className="whitespace-nowrap p-3">
                        {alerta.categoria}
                      </td>

                      <td className="whitespace-nowrap p-3">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${badge}`}
                        >
                          {alerta.tipo}
                        </span>
                      </td>

                      <td className="whitespace-nowrap p-3">
                        {alerta.quantidade}

                        {alerta.tipo === "Estoque baixo" && (
                          <span className="ml-2 text-sm text-zinc-500">
                            (mínimo {alerta.quantidadeMinima})
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap p-3">
                        {alerta.validade ? (
                          <div className="flex flex-col">
                            <span>
                              {alerta.validade.toLocaleDateString("pt-BR")}
                            </span>

                            {alerta.tipo === "Próximo" && (
                              <span className="text-xs text-yellow-600">
                                Vence em {dias} dias
                              </span>
                            )}

                            {alerta.tipo === "Vencido" && (
                              <span className="text-xs text-red-600">
                                Vencido há {Math.abs(dias!)} dias
                              </span>
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="whitespace-nowrap p-3">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            href={`/estoque/${alerta.id}`}
                            title="Visualizar"
                            className="rounded-md p-1 text-zinc-600 transition hover:bg-zinc-200 hover:text-black"
                          >
                            <Eye size={20} />
                          </Link>

                          <Link
                            href={`/estoque/${alerta.id}/editar`}
                            title="Editar"
                            className="rounded-md p-1 text-blue-600 transition hover:bg-blue-100 hover:text-blue-800"
                          >
                            <Pencil size={20} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-sm text-zinc-500">
          Exibindo <strong>{lista.length}</strong> alerta(s).
        </div>
      </main>
    </div>
  );
}