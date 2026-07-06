import Link from "next/link";
import Sidebar from "../components/sidebar";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams?: Promise<{
    search?: string;
    tipo?: string;
    dataInicial?: string;
    dataFinal?: string;
    qtdMin?: string;
    qtdMax?: string;
    ordenar?: string;
    ordem?: string;
  }>;
};

export default async function PaginaMovimentacoes({
  searchParams,
}: Props) {
const params = await searchParams;

const search = params?.search || "";
const tipo = params?.tipo || "";
const dataInicial = params?.dataInicial || "";
const dataFinal = params?.dataFinal || "";
const qtdMin = params?.qtdMin || "";
const qtdMax = params?.qtdMax || "";
const ordenar = params?.ordenar || "createdAt";
const ordem = params?.ordem || "desc";

const movimentacoes = await prisma.movimentacao.findMany({
  where: {
    ...(tipo && {
      tipo: tipo as any,
    }),

    ...(search && {
      ...(search && {
  OR: [
    {
      produto: {
        nome: {
          contains: search,
          mode: "insensitive",
        },
      },
    },
    {
      observacao: {
        contains: search,
        mode: "insensitive",
      },
    },
  ],
}),
    }),

    ...((dataInicial || dataFinal) && {
      createdAt: {
        ...(dataInicial && {
          gte: new Date(dataInicial),
        }),

        ...(dataFinal && {
          lte: new Date(dataFinal + "T23:59:59"),
        }),
      },
    }),

    ...((qtdMin || qtdMax) && {
      quantidade: {
        ...(qtdMin && {
          gte: Number(qtdMin),
        }),

        ...(qtdMax && {
          lte: Number(qtdMax),
        }),
      },
    }),
  },

  include: {
    produto: true,
  },

  orderBy: {
    [ordenar]: ordem === "asc" ? "asc" : "desc",
  } as any,
});

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />

      <main className="flex-1 p-4 pt-20 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold lg:text-4xl">
            Histórico de Movimentações
          </h1>

          <Link
            href="/movimentacoes/novo"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-white transition hover:bg-blue-700 sm:w-auto"
          >
            Nova Movimentação
          </Link>
        </div>
        <form
          method="GET"
          className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5"
        >
          <input
            name="search"
            defaultValue={search}
            placeholder="Pesquisar produto..."
            className="rounded-lg border p-3"
          />

          <select
            name="tipo"
            defaultValue={tipo}
            className="rounded-lg border p-3"
          >
            <option value="">Todos</option>
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
            <option value="AJUSTE">Ajuste</option>
          </select>

          <input
            type="date"
            name="dataInicial"
            defaultValue={dataInicial}
            className="rounded-lg border p-3"
          />

          <input
            type="date"
            name="dataFinal"
            defaultValue={dataFinal}
            className="rounded-lg border p-3"
          />

          <input
            type="number"
            name="qtdMin"
            placeholder="Qtd. mínima"
            defaultValue={qtdMin}
            className="rounded-lg border p-3"
          />

          <input
            type="number"
            name="qtdMax"
            placeholder="Qtd. máxima"
            defaultValue={qtdMax}
            className="rounded-lg border p-3"
          />

          <select
            name="ordenar"
            defaultValue={ordenar}
            className="rounded-lg border p-3"
          >
            <option value="createdAt">Data/Hora</option>
            <option value="quantidade">Quantidade</option>
            <option value="tipo">Tipo</option>
          </select>

          <select
            name="ordem"
            defaultValue={ordem}
            className="rounded-lg border p-3"
          >
            <option value="desc">Decrescente</option>
            <option value="asc">Crescente</option>
          </select>

          <div className="flex gap-2">
          <button className="flex-1 rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700">
            Filtrar
          </button>

          <Link
            href="/movimentacoes"
            className="flex-1 rounded-lg bg-zinc-300 p-3 text-center hover:bg-zinc-400"
          >
            Limpar
          </Link>
        </div>
        </form>
        <div className="space-y-4">
          {movimentacoes.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow">
              <p className="text-zinc-500">
                Nenhuma movimentação encontrada.
              </p>
            </div>
          ) : (
            movimentacoes.map((mov) => {
              const cor =
                mov.tipo === "ENTRADA"
                  ? "bg-green-50 border-green-500"
                  : mov.tipo === "SAIDA"
                  ? "bg-red-50 border-red-500"
                  : "bg-yellow-50 border-yellow-500";

              const titulo =
                mov.tipo === "ENTRADA"
                  ? "Entrada"
                  : mov.tipo === "SAIDA"
                  ? "Saída"
                  : "Ajuste";

              return (
                <div
                  key={mov.id}
                  className={`rounded-xl border-l-4 p-5 shadow bg-white ${cor}`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-bold text-lg">{titulo}</h2>

                      <p className="text-zinc-600">
                        {mov.produto.nome}
                      </p>

                      <p className="text-sm text-zinc-500">
                        Quantidade: {mov.quantidade}
                      </p>

                      {mov.observacao && (
                        <p className="mt-2 text-sm text-zinc-500 wrap-break-word">
                          {mov.observacao}
                        </p>
                      )}
                    </div>

                    <span className="text-sm text-zinc-400 sm:text-right">
                      <p className="text-sm text-zinc-400">
                        {new Date(mov.createdAt).toLocaleDateString("pt-BR")}
                      </p>

                      <p className="text-sm text-zinc-400">
                        {new Date(mov.createdAt).toLocaleTimeString("pt-BR")}
                      </p>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}