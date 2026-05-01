import React, { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { ShoppingBag } from "lucide-react";

const ProductCard = ({ product }) => {
  const [size, setSize] = useState(product.sizes?.[1] || "M");
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(product, size, 1);
    toast.success(`${product.name} (${size}) added to cart`, {
      description: `$${product.price.toFixed(2)} · Ready to ship`,
    });
  };

  return (
    <div className="group flex flex-col" data-testid={`product-card-${product.id}`}>
      <div className="relative overflow-hidden bg-[#111]">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full aspect-[4/5] object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
        />
        <span
          className="absolute top-3 left-3 bg-[#c8102e] text-white text-[10px] uppercase tracking-[0.18em] font-bold px-2.5 py-1"
          data-testid={`product-category-${product.id}`}
        >
          {product.category}
        </span>
      </div>

      <div className="pt-5 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold leading-tight" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>
          <span className="font-bold text-lg whitespace-nowrap" data-testid={`product-price-${product.id}`}>
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex gap-1.5 mt-4 flex-wrap" data-testid={`product-sizes-${product.id}`}>
          {(product.sizes || ["S", "M", "L", "XL", "XXL"]).map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`w-10 h-10 border-2 text-xs font-bold transition-colors ${
                size === s
                  ? "border-[#c8102e] bg-[#c8102e] text-white"
                  : "border-gray-300 text-[#0a0a0a] hover:border-[#0a0a0a]"
              }`}
              data-testid={`product-size-${product.id}-${s}`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="btn-black mt-4 w-full"
          data-testid={`add-to-cart-btn-${product.id}`}
        >
          <ShoppingBag className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
