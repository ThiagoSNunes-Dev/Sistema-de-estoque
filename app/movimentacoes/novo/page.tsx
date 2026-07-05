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

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Nova Movimentação</h1>

        <form
          action={movimentarProduto}
          className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl"
        >
          <select name="produtoId" className="w-full border p-2 rounded">
            <option value="">Selecione o produto</option>

            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>

          <select name="tipo" className="w-full border p-2 rounded">
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
            <option value="AJUSTE">Ajuste</option>
          </select>

          <input
            type="number"
            name="quantidade"
            placeholder="Quantidade"
            className="w-full border p-2 rounded"
          />

          <input
            name="observacao"
            placeholder="Observação"
            className="w-full border p-2 rounded"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Salvar Movimentação
          </button>
        </form>
      </main>
    </div>
  );
}