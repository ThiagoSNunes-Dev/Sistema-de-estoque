"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/products";
import { useTransition } from "react";

type Props = {
  id: number;
};

export default function DeleteProductButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    startTransition(async () => {
      await deleteProduct(id);
      window.location.reload();
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
    >
      <Trash2 size={20} />
    </button>
  );
}