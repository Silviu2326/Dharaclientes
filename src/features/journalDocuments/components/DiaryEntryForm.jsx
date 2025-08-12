import React, { useState } from "react";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

/*
  Formulario reutilizable para crear o editar entradas de diario.
  Recibe:
    - initialData: { title, content }
    - onSubmit: callback({ title, content })
    - loading: bool
*/
const DiaryEntryForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") {
      onSubmit({ title, content });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título de la entrada" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent min-h-[150px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu reflexión aquí..."
          required
        ></textarea>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" loading={loading} disabled={loading || !title || !content}>
          Guardar
        </Button>
      </div>
    </form>
  );
};

export default DiaryEntryForm;