'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import MenuSection from './MenuSection';
import CartDrawer from './CartDrawer';
import type { ProductWithSizes, PromotionData, LocationData, CartItem, SettingsMap } from '../lib/types';

interface HomeClientProps {
  products: ProductWithSizes[];
  featuredProducts: ProductWithSizes[];
  promotions: PromotionData[];
  locations: LocationData[];
  settings: SettingsMap;
}

export default function HomeClient({ products, featuredProducts, promotions, locations, settings }: HomeClientProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAllPremium, setShowAllPremium] = useState(false);
  const [showAllPromos, setShowAllPromos] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);

  const deliveryFee = parseFloat(settings['delivery_fee'] ?? '2');
  const casheaInstallments = parseInt(settings['cashea_installments'] ?? '4');
  const primaryLocation = locations[0];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.cartItemId === item.cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === item.cartItemId
            ? { ...i, quantity: i.quantity + item.quantity, subtotal: i.subtotal + item.subtotal }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId !== cartItemId) return item;
        const unitPrice = item.subtotal / item.quantity;
        return { ...item, quantity: newQuantity, subtotal: unitPrice * newQuantity };
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const visiblePremium = showAllPremium ? featuredProducts : featuredProducts.slice(0, 4);
  const visiblePromos = showAllPromos ? promotions : promotions.slice(0, 4);

  return (
    <div className="bg-[#1A1A1A] text-[#F5F5F0] min-h-screen font-['Plus_Jakarta_Sans']">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-[#1A1A1A]/95 backdrop-blur-md py-4 shadow-lg' : 'bg-gradient-to-b from-[#1A1A1A]/90 to-transparent py-6'}`}>
        <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center">
          <a href="#" className="flex items-center gap-3">
            <Image src="/images/logo_final_filled.png" alt="Tonino's Logo" width={80} height={80} style={{ height: '80px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 0px 2px rgba(255,255,255,0.9))' }} />
            <div className="font-['Sora'] text-2xl font-extrabold tracking-wide text-white">TONINO&apos;S<span className="text-[#C62828]">.</span></div>
          </a>
          <div className="hidden md:flex gap-8">
            <button onClick={() => setIsMenuOpen(true)} className="font-semibold text-sm uppercase tracking-wide hover:text-[#FFC107] transition-colors">Menú</button>
            <a href="#promos" className="font-semibold text-sm uppercase tracking-wide hover:text-[#FFC107] transition-colors">Nosotros</a>
            <a href="#contacto" className="font-semibold text-sm uppercase tracking-wide hover:text-[#FFC107] transition-colors">Contacto</a>
          </div>
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-[#FFC107] font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
            <span>Menú</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20" style={{ background: "linear-gradient(to bottom, rgba(26,26,26,0.6) 0%, rgba(26,26,26,1) 100%), url('/images/image copy.png') center center / cover no-repeat" }}>
        <div className="max-w-[800px] mx-auto text-center relative z-10 px-5">
          <div className="inline-block bg-[#C62828] text-white px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase mb-6 border border-white/20 animate-pulse">
            Paga en {casheaInstallments} cuotas sin interés con Cashea
          </div>
          <h1 className="text-5xl md:text-7xl font-['Sora'] font-bold mb-6 drop-shadow-2xl">
            {settings['hero_title'] || 'El verdadero'} <span className="font-normal italic text-white">sabor</span><br />que estabas buscando.
          </h1>
          <p className="text-lg text-[#d0d0d0] mb-10 max-w-2xl mx-auto drop-shadow-md">
            {settings['hero_subtitle'] || 'Ingredientes artesanales, masa madre de fermentación lenta y horneado a la perfección. Directo a tu puerta.'}
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <button onClick={() => setIsMenuOpen(true)} className="bg-[#C62828] hover:bg-[#b02323] text-white font-['Sora'] font-bold px-8 py-4 rounded transition-all shadow-[0_4px_15px_rgba(198,40,40,0.4)] hover:shadow-[0_6px_20px_rgba(198,40,40,0.6)] uppercase tracking-wide">Ordenar Ahora</button>
            <a href="#promos" className="bg-transparent border border-white text-white hover:bg-white/10 font-['Sora'] font-bold px-8 py-4 rounded transition-all uppercase tracking-wide">Ver Promos</a>
          </div>
        </div>
      </section>

      {/* Selección Premium */}
      {featuredProducts.length > 0 && (
        <section id="seleccion-premium" className="py-24 bg-[#1A1A1A]">
          <div className="max-w-[1200px] mx-auto px-5">
            <div className="text-center mb-12 flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-['Sora'] font-bold mb-3 text-[#F5F5F0]">
                Selección <span className="font-normal italic">Premium</span>
              </h2>
              <p className="text-[#A0A0A0] max-w-lg mb-4">Nuestras pizzas más solicitadas, elaboradas con ingredientes artesanales de primera calidad.</p>
              <button onClick={() => setIsMenuOpen(true)} className="text-[#F5F5F0] font-bold text-sm uppercase tracking-wide flex items-center gap-2 hover:text-[#FFC107] transition-colors">
                Ver menú completo <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-5">
              {visiblePremium.map((product) => {
                const xlPrice = product.sizes.find((s) => s.size === 'XL')?.price ?? product.sizes[0]?.price ?? 0;
                const casheaAmount = (xlPrice / casheaInstallments).toFixed(2);
                return (
                  <div key={product.id} className="bg-[#222222] rounded-xl overflow-hidden relative transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col">
                    {product.isFavorite && (
                      <span className="absolute top-4 left-4 bg-[#FFC107] text-[#1A1A1A] px-3 py-1 text-xs font-extrabold rounded uppercase tracking-wider z-10 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> Favorita
                      </span>
                    )}
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
                    ) : (
                      <div className="w-full h-[250px] bg-[#2a2a2a] border-b-2 border-[#FFC107] flex items-center justify-center text-[#444] text-4xl">🍕</div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">{product.name}</h3>
                      <p className="text-[#A0A0A0] text-sm leading-relaxed flex-grow">{product.description ?? ''}</p>
                      <div className="border-t border-white/10 pt-4 mt-4">
                        <p className="text-sm font-bold text-[#F5F5F0]">PRECIO: ${xlPrice.toFixed(2)}</p>
                        <p className="text-[#FFC107] font-bold">{casheaInstallments} cuotas de ${casheaAmount} <span className="text-[#A0A0A0] font-normal text-sm">con Cashea</span></p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {featuredProducts.length > 4 && (
              <div className="text-center mt-6">
                <button onClick={() => setShowAllPremium(!showAllPremium)} className="bg-transparent border border-white text-white hover:bg-white/10 font-['Sora'] font-bold px-8 py-3 rounded transition-all uppercase tracking-wide text-sm">
                  {showAllPremium ? 'Ver menos' : 'Ver más'}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Promos */}
      {promotions.length > 0 && (
        <section id="promos" className="py-24 bg-gradient-to-b from-[#1A1A1A] to-[#C62828]/5 border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-5">
            <div className="text-center mb-12 flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-['Sora'] font-bold mb-3 text-[#F5F5F0]">
                Promociones <span className="font-normal italic">Exclusivas</span>
              </h2>
              <p className="text-[#A0A0A0] max-w-lg mb-4">Aprovecha nuestras ofertas por tiempo limitado.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-5">
              {visiblePromos.map((promo) => {
                const casheaAmount = (promo.price / casheaInstallments).toFixed(2);
                return (
                  <div key={promo.id} className="bg-[#222222] rounded-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col">
                    {promo.imageUrl ? (
                      <img src={promo.imageUrl} alt={promo.name} className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
                    ) : (
                      <div className="w-full h-[250px] bg-[#2a2a2a] border-b-2 border-[#FFC107] flex items-center justify-center text-[#444] text-4xl">🏷️</div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      {promo.label && <span className="text-[#FFC107] text-xs font-bold uppercase tracking-widest mb-2 block">{promo.label}</span>}
                      <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">{promo.name}</h3>
                      <p className="text-[#A0A0A0] text-sm leading-relaxed flex-grow">{promo.description ?? ''}</p>
                      <div className="border-t border-white/10 pt-4 mt-4">
                        <p className="text-2xl font-['Sora'] font-bold text-[#F5F5F0]">${promo.price.toFixed(2)}</p>
                        <p className="text-[#FFC107] font-semibold text-sm">{casheaInstallments} cuotas de ${casheaAmount} con Cashea</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {promotions.length > 4 && (
              <div className="text-center mt-6 mb-10">
                <button onClick={() => setShowAllPromos(!showAllPromos)} className="bg-transparent border border-white text-white hover:bg-white/10 font-['Sora'] font-bold px-8 py-3 rounded transition-all uppercase tracking-wide text-sm">
                  {showAllPromos ? 'Ver menos' : 'Ver más'}
                </button>
              </div>
            )}
            <div className="text-center mt-10">
              <button onClick={() => setIsMenuOpen(true)} className="bg-transparent border border-white text-white hover:bg-white/10 font-['Sora'] font-bold px-8 py-4 rounded transition-all uppercase tracking-wide">
                Ver Menú Interactivo
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Contacto */}
      <section id="contacto" className="py-24 bg-gradient-to-r from-[#1A1A1A] to-[#C62828]/5">
        <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {primaryLocation?.mapsEmbedUrl && (
            <div className="rounded-xl overflow-hidden h-[400px] bg-[#2a2a2a]">
              <iframe src={primaryLocation.mapsEmbedUrl} width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          )}
          <div>
            <h2 className="text-4xl font-['Sora'] font-bold mb-6">¿Listo para <span className="font-normal italic">ordenar?</span></h2>
            <p className="text-[#A0A0A0] text-lg mb-10">Nuestro equipo está listo para preparar tu orden. Agrega tus productos al carrito y envíanos tu pedido por WhatsApp.</p>
            <div className="flex flex-col gap-5">
              {!showContactOptions ? (
                <button onClick={() => setShowContactOptions(true)} className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-['Sora'] font-bold text-lg px-8 py-4 rounded-xl transition-all flex items-center gap-3 shadow-[0_4px_15px_rgba(37,211,102,0.3)] w-fit">
                  <span className="text-2xl">📱</span> Escribir por WhatsApp
                </button>
              ) : (
                <div className="flex flex-col gap-4 w-full max-w-md">
                  <p className="text-white font-['Sora'] font-bold text-lg mb-1">¿A cuál sede deseas dirigirte?</p>
                  <div className="flex flex-col gap-3">
                    {locations.map((loc) => (
                      <a key={loc.id} href={`https://wa.me/${loc.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="bg-[#222222] border border-[#333] hover:border-[#25D366] hover:bg-[#2a2a2a] text-white font-['Sora'] font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <span className="text-[#25D366] text-2xl group-hover:scale-110 transition-transform">📍</span>
                          <span>{loc.name}</span>
                        </div>
                        <span className="text-[#A0A0A0] text-sm font-normal hidden sm:block">{loc.whatsappNumber}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111] pt-16 pb-8 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex flex-col items-center text-center gap-4 mb-12">
            <Image src="/images/logo_final_filled.png" alt="Tonino's Logo" width={125} height={125} style={{ height: '125px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 0px 2px rgba(255,255,255,0.9))' }} />
            <div className="font-['Sora'] text-2xl font-extrabold tracking-widest text-white">TONINO&apos;S</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12 border-t border-b border-white/10 py-12">
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#FFC107] text-2xl shrink-0">⏰</div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-white font-['Sora']">Horario</h4>
                <p className="text-[#A0A0A0] leading-relaxed">{settings['business_hours'] || '12:00 PM - 11:00 PM'}<br />Todos los días de la semana</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#FFC107] text-2xl shrink-0">🛵</div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-white font-['Sora']">Delivery Local</h4>
                <p className="text-[#A0A0A0] leading-relaxed">{settings['delivery_zone'] || 'Zonas céntricas garantizadas'}<br />{settings['delivery_time'] || 'Menos de 35 mins de espera'}</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#FFC107] text-2xl shrink-0">💳</div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-white font-['Sora']">Pagos Cashea</h4>
                <p className="text-[#A0A0A0] leading-relaxed">Disfruta tu pedido hoy,<br />paga después en {casheaInstallments} cuotas sin interés</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 mb-10 flex-wrap">
            <button onClick={() => setIsMenuOpen(true)} className="text-[#A0A0A0] hover:text-white font-semibold text-sm uppercase tracking-wide transition-colors">Menú</button>
            <a href="#contacto" className="text-[#A0A0A0] hover:text-white font-semibold text-sm uppercase tracking-wide transition-colors">Contacto</a>
          </div>
          <p className="text-[#666] text-sm text-center">&copy; 2026 Tonino&apos;s Pizza. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Modal de menú */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A] overflow-y-auto">
          <div className="sticky top-0 bg-[#1A1A1A]/95 backdrop-blur-md z-50 border-b border-white/10 px-5 py-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <Image src="/images/logo_final_filled.png" alt="Tonino's Logo" width={40} height={40} style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
              <span className="font-['Sora'] text-xl font-extrabold text-white">TONINO&apos;S</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="text-[#A0A0A0] hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center gap-2 font-bold">
              <span className="hidden sm:inline">CERRAR</span>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <MenuSection products={products} onAddToCart={handleAddToCart} />
          <CartDrawer cart={cart} locations={locations} deliveryFee={deliveryFee} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} />
        </div>
      )}
    </div>
  );
}
