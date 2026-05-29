'use client';

import React, { useState } from 'react';
import type { ProductWithSizes, CartItem } from '../lib/types';

interface MenuSectionProps {
  products: ProductWithSizes[];
  onAddToCart: (item: CartItem) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ products, onAddToCart }) => {
  const grouped = products.reduce<Record<string, ProductWithSizes[]>>((acc, p) => {
    const cat = p.category.name;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <section id="menu" className="py-24 bg-[#1A1A1A]">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-['Sora'] font-bold mb-3 text-[#F5F5F0]">
            Nuestro <span className="font-normal italic">Menú</span>
          </h2>
          <p className="text-[#A0A0A0] max-w-lg">
            Elige tus favoritas. Agrega al carrito y confirma tu pedido vía WhatsApp.
          </p>
        </div>

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-16">
            <h3 className="text-2xl font-['Sora'] font-bold text-[#FFC107] mb-8 border-b border-white/10 pb-2">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <ProductCard key={item.id} item={item} onAddToCart={onAddToCart} />
              ))}
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-center text-[#666] py-16">No hay productos disponibles en este momento.</p>
        )}
      </div>
    </section>
  );
};

interface ProductCardProps {
  item: ProductWithSizes;
  onAddToCart: (item: CartItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onAddToCart }) => {
  const sizes = item.sizes;
  const isMultiSize = sizes.some((s) => s.size !== 'UNICO');
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0]?.size ?? '');
  const [quantity, setQuantity] = useState(1);

  const currentSize = sizes.find((s) => s.size === selectedSize);
  const price = currentSize?.price ?? 0;

  const handleAddToCart = () => {
    if (!price) return;
    onAddToCart({
      cartItemId: isMultiSize ? `${item.id}-${selectedSize}` : item.id,
      product: item,
      size: isMultiSize ? selectedSize : undefined,
      quantity,
      subtotal: price * quantity,
    });
    setQuantity(1);
  };

  return (
    <div className="bg-[#222222] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col relative border border-white/5">
      {item.isFavorite && (
        <span className="absolute top-4 left-4 bg-[#FFC107] text-[#1A1A1A] px-3 py-1 text-xs font-extrabold rounded uppercase tracking-wider z-10 flex items-center gap-1 shadow-md">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          Favorita
        </span>
      )}
      <div className="h-1 w-full bg-gradient-to-r from-[#C62828] via-[#FFC107] to-[#C62828]"></div>

      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-[#F5F5F0] font-['Sora'] leading-tight mb-2">{item.name}</h3>
        {item.description && (
          <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed flex-grow">{item.description}</p>
        )}

        <div className="mt-auto">
          {isMultiSize && sizes.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-[#A0A0A0] mb-2 uppercase tracking-wider font-semibold">Tamaño</p>
              <div className="flex gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      selectedSize === s.size
                        ? 'bg-[#C62828] text-white shadow-lg shadow-red-900/50'
                        : 'bg-[#1A1A1A] text-[#A0A0A0] border border-white/10 hover:border-white/30'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-white/10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-xs text-[#A0A0A0] mb-1 uppercase tracking-wider font-semibold">Precio</p>
                <p className="text-2xl font-bold text-[#FFC107] font-['Sora']">${price.toFixed(2)}</p>
              </div>
              <div className="flex items-center bg-[#1A1A1A] rounded-lg border border-white/10 h-10">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-full flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-white/5 rounded-l-lg transition-colors">-</button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-full flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-white/5 rounded-r-lg transition-colors">+</button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#C62828] hover:bg-[#b02323] text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 uppercase text-sm tracking-wider shadow-lg shadow-red-900/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSection;
