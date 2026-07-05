import Sidebar from "@/app/components/sidebar"
import { prisma } from "@/lib/prisma"
import { createCategoria, deleteCategoria } from "@/app/actions/categorias"

export default async function CategoriasPage() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: "asc" },
    include: { produtos: true },
  })

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />
      <main className="flex-1 p-4 pt-20 lg:p-8 lg:pt-8">
        <h1 className="text-3xl font-bold mb-8">Categorias</h1>

        {/* Formulário de Criar */}
        <form
          action={createCategoria as any}   
          className="bg-white p-6 rounded-xl shadow mb-8 max-w-lg"
        >
          <input
            name="nome"
            placeholder="Nome da categoria"
            className="w-full border p-2 rounded mb-4"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Adicionar Categoria
          </button>
        </form>

        {/* Lista */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Lista</h2>

          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="border-b py-3 flex justify-between items-center"
            >
              <div>
                <span className="font-medium">{categoria.nome}</span>
                {categoria.produtos.length > 0 && (
                  <p className="text-sm text-red-500">
                    Possui {categoria.produtos.length} produto(s) vinculado(s)
                  </p>
                )}
              </div>

              <form action={deleteCategoria as any}>   
                <input type="hidden" name="id" value={categoria.id} />
                <button
                  type="submit"
                  disabled={categoria.produtos.length > 0}
                  className={`px-3 py-1 rounded text-white text-sm ${
                    categoria.produtos.length > 0
                      ? "bg-zinc-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Deletar
                </button>
              </form>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}