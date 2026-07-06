"use client";

import { useState } from "react";
import { createProduct } from "@/app/actions/products";

type Categoria = {
  id: number;
  nome: string;
};

export default function ProductForm({
  categorias,
}: {
  categorias: Categoria[];
}) {
  const [novaCategoria, setNovaCategoria] = useState(false);

  return (
    <form
      action={createProduct}   // ← Usando Server Action diretamente
      className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl"
    >
      <input
        name="nome"
        placeholder="Nome"
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="descricao"
        placeholder="Descrição"
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        name="quantidade"
        placeholder="Quantidade"
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="number"
        name="quantidadeMinima"
        placeholder="Quantidade mínima"
        defaultValue={5}
        className="w-full border p-2 rounded"
      />

      {!novaCategoria ? (
        <>
          <select name="categoriaId" className="w-full border p-2 rounded">
            <option value="">Selecione uma categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setNovaCategoria(true)}
            className="text-blue-600 hover:underline"
          >
            + Nova categoria
          </button>
        </>
      ) : (
        <>
          <input
            name="novaCategoria"
            placeholder="Digite a nova categoria"
            className="w-full border p-2 rounded"
          />

          <button
            type="button"
            onClick={() => setNovaCategoria(false)}
            className="text-zinc-600 hover:underline"
          >
            Cancelar
          </button>
        </>
      )}

      <input
        type="number"
        step="0.01"
        name="preco"
        placeholder="Preço"
        className="w-full border p-2 rounded"
      />

      <input
        type="date"
        name="dataValidade"
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Salvar Produto
      </button>
    </form>
  );
}