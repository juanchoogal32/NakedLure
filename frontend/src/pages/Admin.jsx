import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../lib/api";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const emptyForm = {
  id: null,
  name: "",
  description: "",
  category: "Fishing Shirts",
  price: 34.99,
  image_url: "",
  sizes: ["S", "M", "L", "XL", "XXL"],
  featured: false,
};

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [p, c] = await Promise.all([fetchProducts(), fetchCategories()]);
    setProducts(p);
    setCategories(c.categories);
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setForm(emptyForm);
    setShowForm(true);
  };

  const startEdit = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description || "",
      category: p.category,
      price: p.price,
      image_url: p.image_url,
      sizes: p.sizes || ["S", "M", "L", "XL", "XXL"],
      featured: !!p.featured,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: parseFloat(form.price),
        image_url: form.image_url,
        sizes: form.sizes,
        featured: form.featured,
      };
      if (form.id) {
        await updateProduct(form.id, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product added");
      }
      setShowForm(false);
      await load();
    } catch (err) {
      toast.error("Save failed", { description: err?.response?.data?.detail || "" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await deleteProduct(p.id);
      toast.success("Product deleted");
      await load();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-16" data-testid="admin-page">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#c8102e] font-bold mb-3">Admin</p>
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight">
            Product <span className="text-[#c8102e]">Manager</span>
          </h1>
        </div>
        <button className="btn-red" onClick={startNew} data-testid="admin-new-product-btn">
          <Plus className="w-4 h-4" /> New Product
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200" data-testid="admin-products-table">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0a0a0a] text-white uppercase text-[11px] tracking-[0.2em]">
            <tr>
              <th className="px-4 py-4">Image</th>
              <th className="px-4 py-4">Name</th>
              <th className="px-4 py-4">Category</th>
              <th className="px-4 py-4">Price</th>
              <th className="px-4 py-4">Featured</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-gray-100" data-testid={`admin-row-${p.id}`}>
                <td className="px-4 py-3">
                  <div className="w-14 h-16 bg-[#111] overflow-hidden">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3 font-bold">{p.name}</td>
                <td className="px-4 py-3 text-[#555]">{p.category}</td>
                <td className="px-4 py-3 font-bold">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  {p.featured ? (
                    <span className="bg-[#c8102e] text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1">
                      Yes
                    </span>
                  ) : (
                    <span className="text-[#555]">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => startEdit(p)}
                    className="p-2 hover:text-[#c8102e]"
                    data-testid={`admin-edit-${p.id}`}
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="p-2 hover:text-[#c8102e]"
                    data-testid={`admin-delete-${p.id}`}
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[#555]">
                  No products yet. Click "New Product".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="admin-form-modal">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowForm(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative bg-white max-w-xl w-full max-h-[90vh] overflow-y-auto p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl font-black">
                {form.id ? "Edit" : "New"} <span className="text-[#c8102e]">Product</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                data-testid="admin-form-close"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <AdminField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required tid="admin-field-name" />
              <AdminField label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea tid="admin-field-description" />
              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#555] mb-2 block">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border-2 border-gray-200 focus:border-[#c8102e] px-4 py-3 outline-none"
                  data-testid="admin-field-category"
                >
                  {(categories.length ? categories : ["Fishing Shirts", "Patriotic Graphics", "Outdoor Lifestyle"]).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <AdminField label="Price (USD)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} type="number" step="0.01" required tid="admin-field-price" />
              <AdminField label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} required tid="admin-field-image" />
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-5 h-5 accent-[#c8102e]"
                  data-testid="admin-field-featured"
                />
                <span className="text-sm font-bold uppercase tracking-wider">Featured on homepage</span>
              </label>
            </div>
            <div className="flex gap-3 mt-8">
              <button type="submit" disabled={loading} className="btn-red flex-1" data-testid="admin-save-btn">
                {loading ? "Saving..." : form.id ? "Save Changes" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-outline"
                data-testid="admin-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

const AdminField = ({ label, value, onChange, type = "text", step, required, tid, textarea }) => (
  <div>
    <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#555] mb-2 block">
      {label}
    </label>
    {textarea ? (
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 border-gray-200 focus:border-[#c8102e] px-4 py-3 outline-none resize-none"
        data-testid={tid}
      />
    ) : (
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border-2 border-gray-200 focus:border-[#c8102e] px-4 py-3 outline-none"
        data-testid={tid}
      />
    )}
  </div>
);

export default Admin;
