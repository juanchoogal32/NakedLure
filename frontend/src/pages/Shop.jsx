import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../lib/api";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const active = searchParams.get("category") || "All";

  useEffect(() => {
    fetchCategories().then((d) => setCategories(["All", ...d.categories])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = active && active !== "All" ? { category: active } : {};
    fetchProducts(params)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [active]);

  const handleFilter = (cat) => {
    if (cat === "All") setSearchParams({});
    else setSearchParams({ category: cat });
  };

  const count = useMemo(() => products.length, [products]);

  return (
    <div>
      {/* Header */}
      <section className="bg-[#0a0a0a] text-white" data-testid="shop-header">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <p className="text-xs uppercase tracking-[0.28em] text-[#c8102e] font-bold mb-4">
            Shop the Collection
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight">
            Every tee. One <span className="text-[#c8102e]">mission</span>.
          </h1>
          <p className="text-white/70 mt-6 max-w-xl">
            Heavyweight graphic shirts designed in the Sierra and printed for the American angler.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-100 sticky top-20 bg-white/95 backdrop-blur-md z-30" data-testid="shop-filters">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-4 flex items-center gap-4 overflow-x-auto">
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#555] shrink-0">
            Filter:
          </span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => handleFilter(c)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.15em] font-bold border-2 transition-colors whitespace-nowrap ${
                active === c
                  ? "border-[#c8102e] bg-[#c8102e] text-white"
                  : "border-gray-200 text-[#0a0a0a] hover:border-[#0a0a0a]"
              }`}
              data-testid={`filter-${c.replace(/\s+/g, "-").toLowerCase()}`}
            >
              {c}
            </button>
          ))}
          <span className="ml-auto text-xs text-[#555] shrink-0" data-testid="shop-count">
            {count} {count === 1 ? "product" : "products"}
          </span>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24" data-testid="shop-grid-section">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-gray-100 mb-4" />
                <div className="h-4 bg-gray-100 w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 w-1/4" />
              </div>
            ))}
          </div>
        ) : count === 0 ? (
          <div className="text-center py-24" data-testid="shop-empty">
            <p className="font-display text-3xl font-bold mb-2">Nothing here yet</p>
            <p className="text-[#555]">Try another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12" data-testid="shop-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Shop;
