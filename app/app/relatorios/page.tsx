import Sidebar from "../components/sidebar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Package,
  DollarSign,
  Tags,
  BadgeDollarSign,
  Download,
} from "lucide-react";

export default async function RelatoriosPage() {
  const produtos = await prisma.product.findMany({
    include: {
      categoria: true,
    },
    orderBy: {
      nome: "asc",
    },
  });

  const categorias = await prisma.categoria.findMany();

  const totalProdutos = produtos.length;

  const valorTotal = produtos.reduce(
    (acc, produto) =>
      acc + (produto.preco ?? 0) * produto.quantidade,
    0
  );

  const precoMedio =
    produtos.length > 0
      ? produtos.reduce(
          (acc, p) => acc + (p.preco ?? 0),
          0
        ) / produtos.length
      : 0;

  const categoriasRelatorio = categorias
    .map((categoria) => ({
      nome: categoria.nome,
      quantidade: produtos.filter(
        (p) => p.categoriaId === categoria.id
      ).length,
    }))
    .sort((a, b) => b.quantidade - a.quantidade);

  const maiorCategoria =
    categoriasRelatorio.length > 0
      ? categoriasRelatorio[0].quantidade
      : 1;

  const produtosCaros = [...produtos]
    .sort((a, b) => (b.preco ?? 0) - (a.preco ?? 0))
    .slice(0, 5);

  const maiorQuantidade = [...produtos]
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

  const hoje = new Date();

  const limite = new Date();

  limite.setDate(limite.getDate() + 30);

  const proximos = produtos
    .filter(
      (p) =>
        p.dataValidade &&
        p.dataValidade >= hoje &&
        p.dataValidade <= limite
    )
    .sort(
      (a, b) =>
        a.dataValidade!.getTime() -
        b.dataValidade!.getTime()
    );

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />

      <main className="flex-1 p-4 pt-20 lg:p-8 lg:pt-8">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold">
              Relatórios
            </h1>

            <p className="text-zinc-500 mt-1">
              Indicadores gerais do estoque.
            </p>

          </div>

          <div className="flex gap-3">
          <a
            href="/api/relatorios/exportar"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Exportar CSV
          </a>

          <a
            href="/api/relatorios/exportar/excel"
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg"
          >
            Exportar Excel
          </a>
        </div>

        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-zinc-500">
                  Valor do Estoque
                </p>

                <h2 className="text-3xl font-bold mt-2 text-green-600">
                  R$ {valorTotal.toFixed(2)}
                </h2>

              </div>

              <DollarSign
                size={42}
                className="text-green-600"
              />

            </div>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-zinc-500">
                  Produtos
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {totalProdutos}
                </h2>

              </div>

              <Package
                size={42}
                className="text-blue-600"
              />

            </div>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-zinc-500">
                  Categorias
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {categorias.length}
                </h2>

              </div>

              <Tags
                size={42}
                className="text-orange-500"
              />

            </div>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-zinc-500">
                  Preço Médio
                </p>

                <h2 className="text-3xl font-bold mt-2 text-purple-600">
                  R$ {precoMedio.toFixed(2)}
                </h2>

              </div>

              <BadgeDollarSign
                size={42}
                className="text-purple-600"
              />

            </div>

          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          <section className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-6">
              Produtos por Categoria
            </h2>

            <div className="space-y-5">
                            {categoriasRelatorio.length === 0 ? (
                <p className="text-zinc-500">
                  Nenhuma categoria cadastrada.
                </p>
              ) : (
                categoriasRelatorio.map((categoria) => (
                  <div key={categoria.nome}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>{categoria.nome}</span>

                      <span>
                        {categoria.quantidade} produto(s)
                      </span>
                    </div>

                    <div className="w-full bg-zinc-200 rounded-full h-4 overflow-hidden">

                      <div
                        className="bg-blue-600 h-4 rounded-full transition-all"
                        style={{
                          width: `${
                            maiorCategoria === 0
                              ? 0
                              : (categoria.quantidade /
                                  maiorCategoria) *
                                100
                          }%`,
                        }}
                      />

                    </div>
                  </div>
                ))
              )}
            </div>

          </section>

          <section className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-6">
              Produtos mais caros
            </h2>

            <table className="w-full">

              <thead className="border-b">

                <tr>

                  <th className="text-left pb-3">
                    Produto
                  </th>

                  <th className="text-left pb-3">
                    Categoria
                  </th>

                  <th className="text-right pb-3">
                    Preço
                  </th>

                </tr>

              </thead>

              <tbody>

                {produtosCaros.map((produto) => (

                  <tr
                    key={produto.id}
                    className="border-b"
                  >

                    <td className="py-3">
                      {produto.nome}
                    </td>

                    <td>
                      {produto.categoria?.nome ??
                        "Sem categoria"}
                    </td>

                    <td className="text-right font-semibold text-green-600">
                      R$ {(produto.preco ?? 0).toFixed(2)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </section>

        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-8">

          <section className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-6">
              Maiores Estoques
            </h2>

            <table className="w-full">

              <thead className="border-b">

                <tr>

                  <th className="text-left pb-3">
                    Produto
                  </th>

                  <th className="text-right pb-3">
                    Quantidade
                  </th>

                </tr>

              </thead>

              <tbody>

                {maiorQuantidade.map((produto) => (

                  <tr
                    key={produto.id}
                    className="border-b"
                  >

                    <td className="py-3">
                      {produto.nome}
                    </td>

                    <td className="text-right font-semibold text-blue-600">
                      {produto.quantidade}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </section>

          <section className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-6">
              Próximos do vencimento
            </h2>

            {proximos.length === 0 ? (

              <p className="text-zinc-500">
                Nenhum produto próximo da validade.
              </p>

            ) : (

              <table className="w-full">

                <thead className="border-b">

                  <tr>

                    <th className="text-left pb-3">
                      Produto
                    </th>

                    <th className="text-left pb-3">
                      Categoria
                    </th>

                    <th className="text-right pb-3">
                      Dias
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {proximos.slice(0, 5).map((produto) => {

                    const dias = Math.ceil(
                      (produto.dataValidade!.getTime() -
                        hoje.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );

                    return (

                      <tr
                        key={produto.id}
                        className="border-b"
                      >

                        <td className="py-3">
                          {produto.nome}
                        </td>

                        <td>
                          {produto.categoria?.nome ??
                            "Sem categoria"}
                        </td>

                        <td className="text-right">

                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">

                            {dias} dia{dias > 1 ? "s" : ""}

                          </span>

                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            )}

          </section>

        </div>

        <div className="mt-10 bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-6">
            Resumo Geral
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">

            <div>

              <h3 className="text-zinc-500">
                Valor Total
              </h3>

              <p className="text-2xl font-bold text-green-600 mt-2">
                R$ {valorTotal.toFixed(2)}
              </p>

            </div>

            <div>

              <h3 className="text-zinc-500">
                Produtos
              </h3>

              <p className="text-2xl font-bold mt-2">
                {totalProdutos}
              </p>

            </div>

            <div>

              <h3 className="text-zinc-500">
                Categorias
              </h3>

              <p className="text-2xl font-bold mt-2">
                {categorias.length}
              </p>

            </div>

            <div>

              <h3 className="text-zinc-500">
                Preço Médio
              </h3>

              <p className="text-2xl font-bold text-purple-600 mt-2">
                R$ {precoMedio.toFixed(2)}
              </p>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}