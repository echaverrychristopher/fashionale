"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

const EMPTY_FORM = {
  name: "",
  price: "",
  category: "",
  description: "",
  image: "",
  available: true,
};

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (token) loadProducts();
  }, [token]);

  async function loadProducts() {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = await res.json();
    setProducts(data);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.ok) {
      sessionStorage.setItem("admin_token", data.token);
      setToken(data.token);
    } else {
      setLoginError("Contraseña incorrecta");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_token");
    setToken(null);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result as string }));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price || !form.image) {
      setMsg("Completa nombre, precio e imagen.");
      return;
    }
    setLoading(true);
    setMsg("");
    const payload = { ...form, price: Number(form.price) };
    const res = await fetch("/api/products", {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload),
    });
    setLoading(false);
    if (res.ok) {
      setForm(EMPTY_FORM);
      setEditingId(null);
      setMsg(editingId ? "Producto actualizado." : "Producto agregado.");
      loadProducts();
    } else {
      setMsg("Hubo un error. Intenta de nuevo.");
    }
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      category: p.category,
      description: p.description,
      image: p.image,
      available: p.available,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch("/api/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    loadProducts();
  }

  async function toggleAvailable(p: Product) {
    await fetch("/api/products", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: p.id, available: !p.available }),
    });
    loadProducts();
  }

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm border border-[var(--line)] p-8"
        >
          <h1 className="font-serif-brand text-2xl mb-1">Fashion Ale</h1>
          <p className="text-sm text-[var(--ink)]/60 mb-6">Panel de administrador</p>
          <label className="block text-sm mb-2">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[var(--line)] px-3 py-2 mb-3 outline-none focus:border-[var(--wine)]"
            autoFocus
          />
          {loginError && (
            <p className="text-sm text-red-600 mb-3">{loginError}</p>
          )}
          <button
            type="submit"
            className="w-full bg-[var(--wine)] text-[var(--cream)] py-2.5 hover:bg-[var(--wine-dark)] transition-colors"
          >
            Entrar
          </button>
          <a href="/" className="block text-center text-sm text-[var(--ink)]/50 mt-4 hover:text-[var(--ink)]">
            ← Volver a la tienda
          </a>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--line)]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="font-serif-brand text-xl">Panel · Fashion Ale</h1>
          <div className="flex items-center gap-4 text-sm">
            <a href="/" className="text-[var(--ink)]/60 hover:text-[var(--ink)]">
              Ver tienda
            </a>
            <button onClick={handleLogout} className="text-[var(--wine)]">
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-[380px_1fr] gap-10">
        {/* Formulario */}
        <div>
          <h2 className="font-serif-brand text-lg mb-4">
            {editingId ? "Editar producto" : "Agregar producto"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--wine)] text-sm"
                placeholder="Vestido floral midi"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Precio (C$)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--wine)] text-sm"
                  placeholder="850"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Categoría</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--wine)] text-sm"
                  placeholder="Vestidos"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--wine)] text-sm resize-none"
                rows={3}
                placeholder="Talla S-M, tela liviana"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Foto</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm w-full" />
              {form.image && (
                <img src={form.image} alt="preview" className="mt-2 h-32 object-cover border border-[var(--line)]" />
              )}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
              />
              Disponible
            </label>
            {msg && <p className="text-sm text-[var(--wine)]">{msg}</p>}
            <div className="flex gap-2 mt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[var(--wine)] text-[var(--cream)] py-2.5 text-sm hover:bg-[var(--wine-dark)] transition-colors disabled:opacity-50"
              >
                {loading ? "Guardando..." : editingId ? "Guardar cambios" : "Agregar producto"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 border border-[var(--line)] text-sm"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista */}
        <div>
          <h2 className="font-serif-brand text-lg mb-4">
            Productos ({products.length})
          </h2>
          <div className="flex flex-col gap-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 border border-[var(--line)] p-3"
              >
                <img src={p.image} alt={p.name} className="w-14 h-14 object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-[var(--ink)]/60">
                    {p.category} · C${p.price} ·{" "}
                    <span className={p.available ? "text-green-700" : "text-[var(--wine)]"}>
                      {p.available ? "Disponible" : "Reservado"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-1 text-xs flex-shrink-0">
                  <button
                    onClick={() => toggleAvailable(p)}
                    className="px-2 py-1 border border-[var(--line)] hover:bg-[var(--line)]/40"
                  >
                    {p.available ? "Marcar reservado" : "Marcar disponible"}
                  </button>
                  <button
                    onClick={() => startEdit(p)}
                    className="px-2 py-1 border border-[var(--line)] hover:bg-[var(--line)]/40"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-2 py-1 border border-[var(--line)] text-red-600 hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-sm text-[var(--ink)]/50">Todavía no hay productos.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
