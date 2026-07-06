import Sidebar from "@/app/components/sidebar";
import { prisma } from "@/lib/prisma";
import { movimentarProduto } from "@/app/actions/movimentacoes";

export default async function NovaMovimentacaoPage() {
  const produtos = await prisma.product.findMany({
    orderBy: {
      nome: "asc",
    },
  });

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />

      <main className="flex-1 p-4 pt-20 lg:p-8">
        <div className="mx-auto w-full max-w-2xl">
          <h1 className="mb-6 text-3xl font-bold lg:text-4xl">
            Nova Movimentação
          </h1>
          
          <form
            action={movimentarProduto}
            className="space-y-5 rounded-xl bg-white p-6 shadow"
          >
            <div>
              <label className="mb-2 block font-medium">
                Produto
              </label>

              <select
                name="produtoId"
                className="w-full rounded-lg border p-3"
              >
                <option value="">Selecione o produto</option>

                {produtos.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Tipo
              </label>

              <select
                name="tipo"
                className="w-full rounded-lg border p-3"
              >
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saída</option>
                <option value="AJUSTE">Ajuste</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Quantidade
              </label>

              <input
                type="number"
                name="quantidade"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Observação
              </label>

              <input
                name="observacao"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <button
              className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
            >
              Salvar Movimentação
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}