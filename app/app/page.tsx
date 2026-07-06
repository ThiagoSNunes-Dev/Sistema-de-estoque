import Sidebar from "./components/sidebar";
import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";

export default async function Page() {
  const produtos: Product[] = await prisma.product.findMany({
    orderBy: {
      id: "desc",
    },
  });

  const hoje = new Date();

  const estoqueBaixo = produtos.filter(
    (produto) =>
      produto.quantidademinima != null &&
      produto.quantidade <= produto.quantidademinima
  );

  const vencidos = produtos.filter(
    (produto) => produto.dataValidade && produto.dataValidade < hoje
  );

  const proximosDaValidade = produtos.filter((produto) => {
    if (!produto.dataValidade) return false;

    const limite = new Date();
    limite.setDate(limite.getDate() + 30);

    return (
      produto.dataValidade >= hoje &&
      produto.dataValidade <= limite
    );
  });

  return (
    <div className="min-h-screen bg-zinc-100 lg:flex">
      <Sidebar />

      <main className="flex-1 p-4 pt-20 lg:p-8">
        <h1 className="mb-8 text-3xl font-bold lg:text-4xl">
          Dashboard
        </h1>

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <Card
            titulo="Total Produtos"
            valor={produtos.length}
          />

          <Card
            titulo="Estoque Baixo"
            valor={estoqueBaixo.length}
            cor="text-orange-500"
          />

          <Card
            titulo="Próximos da Validade"
            valor={proximosDaValidade.length}
            cor="text-yellow-500"
          />

          <Card
            titulo="Vencidos"
            valor={vencidos.length}
            cor="text-red-500"
          />

        </div>

        <div className="rounded-xl bg-white p-5 shadow lg:p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Últimos Produtos
          </h2>

          {produtos.length === 0 ? (
            <p className="text-zinc-500">
              Nenhum produto cadastrado.
            </p>
          ) : (
            <ul className="space-y-3">
              {produtos.slice(0, 5).map((produto) => (
                <li
                  key={produto.id}
                  className="flex flex-col gap-1 border-b pb-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <strong>{produto.nome}</strong>

                  <span className="text-zinc-600">
                    {produto.quantidade} unidades
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

function Card({
  titulo,
  valor,
  cor = "",
}: {
  titulo: string;
  valor: number;
  cor?: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow transition hover:shadow-lg">
      <h2 className="text-sm text-zinc-500">
        {titulo}
      </h2>

      <p className={`mt-2 text-3xl font-bold ${cor}`}>
        {valor}
      </p>
    </div>
  );
}