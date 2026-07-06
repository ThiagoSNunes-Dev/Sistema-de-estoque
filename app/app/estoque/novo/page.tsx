import Sidebar from "@/app/components/sidebar";
import ProductForm from "@/app/components/productForm";
import { prisma } from "@/lib/prisma";

export default async function NovoProdutoPage() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: "asc" },
  });

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">
          Novo Produto
        </h1>

        <ProductForm categorias={categorias} />
      </main>
    </div>
  );
}