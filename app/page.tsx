'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import MenuSection, { CartItem } from './components/MenuSection';
import CartDrawer from './components/CartDrawer';

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAllPremium, setShowAllPremium] = useState(false);
  const [showAllPromos, setShowAllPromos] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleAddToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.cartItemId === item.cartItemId);
      if (existing) {
        return prev.map(i => 
          i.cartItemId === item.cartItemId 
            ? { ...i, quantity: i.quantity + item.quantity, subtotal: i.subtotal + item.subtotal }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const unitPrice = item.subtotal / item.quantity;
        return { ...item, quantity: newQuantity, subtotal: unitPrice * newQuantity };
      }
      return item;
    }));
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  return (
    <div className="bg-[#1A1A1A] text-[#F5F5F0] min-h-screen font-['Plus_Jakarta_Sans']">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-[#1A1A1A]/95 backdrop-blur-md py-4 shadow-lg' : 'bg-gradient-to-b from-[#1A1A1A]/90 to-transparent py-6'}`}>
        <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center">
          <a href="#" className="flex items-center gap-3">
            <img 
              src="/images/logo_final_filled.png" 
              alt="Tonino's Logo" 
              style={{ height: '80px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.9))' }} 
            />
            <div className="font-['Sora'] text-2xl font-extrabold tracking-wide text-white">TONINO'S<span className="text-[#C62828]">.</span></div>
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20" style={{
        background: "linear-gradient(to bottom, rgba(26, 26, 26, 0.6) 0%, rgba(26, 26, 26, 1) 100%), url('/images/image copy.png') center center / cover no-repeat"
      }}>
        <div className="max-w-[800px] mx-auto text-center relative z-10 px-5">
          <div className="inline-block bg-[#C62828] text-white px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase mb-6 border border-white/20 animate-pulse">
            Paga en 0 cuotas sin interés con Cashea
          </div>
          <h1 className="text-5xl md:text-7xl font-['Sora'] font-bold mb-6 drop-shadow-2xl">
            El verdadero <span className="font-normal italic text-white">sabor</span><br/>que estabas buscando.
          </h1>
          <p className="text-lg text-[#d0d0d0] mb-10 max-w-2xl mx-auto drop-shadow-md">
            Ingredientes artesanales, masa madre de fermentación lenta y horneado a la perfección. Directo a tu puerta.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <button onClick={() => setIsMenuOpen(true)} className="bg-[#C62828] hover:bg-[#b02323] text-white font-['Sora'] font-bold px-8 py-4 rounded transition-all shadow-[0_4px_15px_rgba(198,40,40,0.4)] hover:shadow-[0_6px_20px_rgba(198,40,40,0.6)] uppercase tracking-wide">
              Ordenar Ahora
            </button>
            <a href="#promos" className="bg-transparent border border-white text-white hover:bg-white/10 font-['Sora'] font-bold px-8 py-4 rounded transition-all uppercase tracking-wide">
              Ver Promos
            </a>
          </div>
        </div>
      </section>



      {/* Selección Premium (Static Carousel) */}
      <section id="seleccion-premium" className="py-24 bg-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-['Sora'] font-bold mb-3 text-[#F5F5F0]">
              Selección <span className="font-normal italic">Premium</span>
            </h2>
            <p className="text-[#A0A0A0] max-w-lg mb-4">
              Nuestras pizzas más solicitadas, elaboradas con ingredientes artesanales de primera calidad.
            </p>
            <button onClick={() => setIsMenuOpen(true)} className="text-[#F5F5F0] font-bold text-sm uppercase tracking-wide flex items-center gap-2 hover:text-[#FFC107] transition-colors">
              Ver menú completo <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-5">
            {/* Product 1 */}
            <div className="bg-[#222222] rounded-xl overflow-hidden relative transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <span className="absolute top-4 left-4 bg-[#FFC107] text-[#1A1A1A] px-3 py-1 text-xs font-extrabold rounded uppercase tracking-wider z-10 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> Favorita
              </span>
              <img src="/images/WhatsApp Image 2026-05-19 at 11.24.16 AM (4).jpeg" alt="Dorangel" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
              <div className="p-6">
                <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Dorangel</h3>
                <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">Jugosos trozos de carne y pollo seleccionados a la parrilla, bañados en nuestra salsa secreta sobre una cama de mozzarella derretida.</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm font-bold text-[#F5F5F0]">PRECIO: $31.00</p>
                  <p className="text-[#FFC107] font-bold">4 cuotas de $7.75 <span className="text-[#A0A0A0] font-normal text-sm">con Cashea</span></p>
                </div>
              </div>
            </div>
            {/* Product 2 */}
            <div className="bg-[#222222] rounded-xl overflow-hidden relative transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <img src="/images/WhatsApp Image 2026-05-19 at 11.24.16 AM (3).jpeg" alt="Tradicional XL" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
              <div className="p-6">
                <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Tradicional XL</h3>
                <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">Una explosión de texturas. Nuestra base clásica coronada con el toque crujiente e inconfundible de Doritos.</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm font-bold text-[#F5F5F0]">PRECIO: $28.00</p>
                  <p className="text-[#FFC107] font-bold">4 cuotas de $7.00 <span className="text-[#A0A0A0] font-normal text-sm">con Cashea</span></p>
                </div>
              </div>
            </div>
            {/* Product 3 */}
            <div className="bg-[#222222] rounded-xl overflow-hidden relative transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <img src="/images/WhatsApp Image 2026-05-19 at 11.24.16 AM (1).jpeg" alt="Cuatro Quesos" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
              <div className="p-6">
                <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Cuatro Quesos</h3>
                <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">Deliciosa combinación de quesos madurados sobre nuestra salsa especial. Un clásico imperdible para los amantes del buen queso.</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm font-bold text-[#F5F5F0]">PRECIO: $25.00</p>
                  <p className="text-[#FFC107] font-bold">4 cuotas de $6.25 <span className="text-[#A0A0A0] font-normal text-sm">con Cashea</span></p>
                </div>
              </div>
            </div>
            {/* Product 4 */}
            <div className="bg-[#222222] rounded-xl overflow-hidden relative transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <img src="/images/WhatsApp Image 2026-05-19 at 11.24.16 AM (2).jpeg" alt="Tonino's Clásica" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
              <div className="p-6">
                <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Tonino's Clásica</h3>
                <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">Toques de albahaca fresca, pepperoni premium y vegetales. El auténtico sabor de Italia directo en tu mesa y listo para disfrutar.</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm font-bold text-[#F5F5F0]">PRECIO: $26.00</p>
                  <p className="text-[#FFC107] font-bold">4 cuotas de $6.50 <span className="text-[#A0A0A0] font-normal text-sm">con Cashea</span></p>
                </div>
              </div>
            </div>
            {showAllPremium && (
              <>
                {/* Product 5 (Duplicated 1) */}
                <div className="bg-[#222222] rounded-xl overflow-hidden relative transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <span className="absolute top-4 left-4 bg-[#FFC107] text-[#1A1A1A] px-3 py-1 text-xs font-extrabold rounded uppercase tracking-wider z-10 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> Nueva
                  </span>
                  <img src="/images/WhatsApp Image 2026-05-19 at 11.24.16 AM (4).jpeg" alt="Dorangel" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
                  <div className="p-6">
                    <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Dorangel Especial</h3>
                    <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">Jugosos trozos de carne y pollo seleccionados a la parrilla, bañados en nuestra salsa secreta sobre una cama de mozzarella derretida.</p>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm font-bold text-[#F5F5F0]">PRECIO: $31.00</p>
                      <p className="text-[#FFC107] font-bold">4 cuotas de $7.75 <span className="text-[#A0A0A0] font-normal text-sm">con Cashea</span></p>
                    </div>
                  </div>
                </div>
                {/* Product 6 (Duplicated 2) */}
                <div className="bg-[#222222] rounded-xl overflow-hidden relative transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <img src="/images/WhatsApp Image 2026-05-19 at 11.24.16 AM (3).jpeg" alt="Tradicional XL" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
                  <div className="p-6">
                    <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Suprema XL</h3>
                    <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">Una explosión de texturas. Nuestra base clásica coronada con el toque crujiente e inconfundible de vegetales frescos y embutidos.</p>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm font-bold text-[#F5F5F0]">PRECIO: $29.00</p>
                      <p className="text-[#FFC107] font-bold">4 cuotas de $7.25 <span className="text-[#A0A0A0] font-normal text-sm">con Cashea</span></p>
                    </div>
                  </div>
                </div>
                {/* Product 7 (Duplicated 3) */}
                <div className="bg-[#222222] rounded-xl overflow-hidden relative transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <img src="/images/WhatsApp Image 2026-05-19 at 11.24.16 AM (1).jpeg" alt="Cuatro Quesos" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
                  <div className="p-6">
                    <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Cinco Quesos</h3>
                    <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">Deliciosa combinación de quesos madurados, ahora con un toque de queso azul sobre nuestra salsa especial.</p>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm font-bold text-[#F5F5F0]">PRECIO: $27.00</p>
                      <p className="text-[#FFC107] font-bold">4 cuotas de $6.75 <span className="text-[#A0A0A0] font-normal text-sm">con Cashea</span></p>
                    </div>
                  </div>
                </div>
                {/* Product 8 (Duplicated 4) */}
                <div className="bg-[#222222] rounded-xl overflow-hidden relative transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <img src="/images/WhatsApp Image 2026-05-19 at 11.24.16 AM (2).jpeg" alt="Tonino's Clásica" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
                  <div className="p-6">
                    <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Margarita Extra</h3>
                    <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">Extra mozzarella y tomates frescos con albahaca recién cortada. Simple, clásica y sencillamente deliciosa.</p>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm font-bold text-[#F5F5F0]">PRECIO: $24.00</p>
                      <p className="text-[#FFC107] font-bold">4 cuotas de $6.00 <span className="text-[#A0A0A0] font-normal text-sm">con Cashea</span></p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="text-center mt-6">
            <button 
              onClick={() => setShowAllPremium(!showAllPremium)} 
              className="bg-transparent border border-white text-white hover:bg-white/10 font-['Sora'] font-bold px-8 py-3 rounded transition-all uppercase tracking-wide text-sm"
            >
              {showAllPremium ? 'Ver menos' : 'Ver más'}
            </button>
          </div>
        </div>
      </section>

      {/* Promos Section */}
      <section id="promos" className="py-24 bg-gradient-to-b from-[#1A1A1A] to-[#C62828]/5 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-['Sora'] font-bold mb-3 text-[#F5F5F0]">
              Promociones <span className="font-normal italic">Exclusivas</span>
            </h2>
            <p className="text-[#A0A0A0] max-w-lg mb-4">
              Aprovecha nuestras ofertas por tiempo limitado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-5">
            {/* Promo 1 */}
            <div className="bg-[#222222] rounded-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <img src="/images/WhatsApp Image 2026-05-19 at 11.24.16 AM (3).jpeg" alt="Combo Familiar" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
              <div className="p-6">
                <span className="text-[#FFC107] text-xs font-bold uppercase tracking-widest mb-2 block">Para Compartir</span>
                <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Combo Familiar</h3>
                <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">2 Pizzas Grandes + Refresco de 2L. Ideal para compartir en familia con el mejor sabor.</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-2xl font-['Sora'] font-bold text-[#F5F5F0]">$25.00</p>
                  <p className="text-[#FFC107] font-semibold text-sm">4 cuotas de $6.25 con Cashea</p>
                </div>
              </div>
            </div>
            {/* Promo 2 */}
            <div className="bg-[#222222] rounded-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <img src="/images/WhatsApp Image 2026-05-19 at 11.24.17 AM (1).jpeg" alt="Combo Dúo" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
              <div className="p-6">
                <span className="text-[#FFC107] text-xs font-bold uppercase tracking-widest mb-2 block">Promo del Día</span>
                <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Combo Dúo</h3>
                <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">1 Pizza Mediana de cualquier ingrediente + 2 bebidas para disfrutar en pareja.</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-2xl font-['Sora'] font-bold text-[#F5F5F0]">$15.00</p>
                  <p className="text-[#FFC107] font-semibold text-sm">4 cuotas de $3.75 con Cashea</p>
                </div>
              </div>
            </div>
            {/* Promo 3 */}
            <div className="bg-[#222222] rounded-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <img src="/images/WhatsApp Image 2026-05-19 at 11.24.17 AM.jpeg" alt="Fiesta Tonino's" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
              <div className="p-6">
                <span className="text-[#FFC107] text-xs font-bold uppercase tracking-widest mb-2 block">Fin de Semana</span>
                <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Fiesta Tonino's</h3>
                <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">3 Pizzas Medianas clásicas para armar la fiesta perfecta sin salir de casa.</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-2xl font-['Sora'] font-bold text-[#F5F5F0]">$30.00</p>
                  <p className="text-[#FFC107] font-semibold text-sm">4 cuotas de $7.50 con Cashea</p>
                </div>
              </div>
            </div>
            {/* Promo 4 */}
            <div className="bg-[#222222] rounded-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <img src="/images/WhatsApp Image 2026-05-19 at 11.24.15 AM.jpeg" alt="Maxi Pizza" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
              <div className="p-6">
                <span className="text-[#FFC107] text-xs font-bold uppercase tracking-widest mb-2 block">Mega Ahorro</span>
                <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Maxi Pizza</h3>
                <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">Nuestra pizza extra grande de 16 porciones con extra queso y borde relleno.</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-2xl font-['Sora'] font-bold text-[#F5F5F0]">$22.00</p>
                  <p className="text-[#FFC107] font-semibold text-sm">4 cuotas de $5.50 con Cashea</p>
                </div>
              </div>
            </div>
            {showAllPromos && (
              <>
                {/* Promo 5 (Duplicated 1) */}
                <div className="bg-[#222222] rounded-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <img src="/images/WhatsApp Image 2026-05-19 at 11.24.16 AM (3).jpeg" alt="Combo Familiar" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
                  <div className="p-6">
                    <span className="text-[#FFC107] text-xs font-bold uppercase tracking-widest mb-2 block">Cena Completa</span>
                    <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Combo Premium</h3>
                    <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">2 Pizzas Especiales + Refresco de 2L + Ración de pan de ajo. La cena perfecta.</p>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-2xl font-['Sora'] font-bold text-[#F5F5F0]">$28.00</p>
                      <p className="text-[#FFC107] font-semibold text-sm">4 cuotas de $7.00 con Cashea</p>
                    </div>
                  </div>
                </div>
                {/* Promo 6 (Duplicated 2) */}
                <div className="bg-[#222222] rounded-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <img src="/images/WhatsApp Image 2026-05-19 at 11.24.17 AM (1).jpeg" alt="Combo Dúo" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
                  <div className="p-6">
                    <span className="text-[#FFC107] text-xs font-bold uppercase tracking-widest mb-2 block">Solo para ti</span>
                    <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Combo Personal</h3>
                    <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">1 Pizza Pequeña + Bebida. Exactamente lo que necesitas para tu antojo.</p>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-2xl font-['Sora'] font-bold text-[#F5F5F0]">$9.00</p>
                      <p className="text-[#FFC107] font-semibold text-sm">4 cuotas de $2.25 con Cashea</p>
                    </div>
                  </div>
                </div>
                {/* Promo 7 (Duplicated 3) */}
                <div className="bg-[#222222] rounded-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <img src="/images/WhatsApp Image 2026-05-19 at 11.24.17 AM.jpeg" alt="Fiesta Tonino's" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
                  <div className="p-6">
                    <span className="text-[#FFC107] text-xs font-bold uppercase tracking-widest mb-2 block">Cumpleaños</span>
                    <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Pack Celebración</h3>
                    <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">4 Pizzas Medianas + 2 Refrescos. Ideal para que todos coman a gusto en tu reunión.</p>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-2xl font-['Sora'] font-bold text-[#F5F5F0]">$42.00</p>
                      <p className="text-[#FFC107] font-semibold text-sm">4 cuotas de $10.50 con Cashea</p>
                    </div>
                  </div>
                </div>
                {/* Promo 8 (Duplicated 4) */}
                <div className="bg-[#222222] rounded-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <img src="/images/WhatsApp Image 2026-05-19 at 11.24.15 AM.jpeg" alt="Maxi Pizza" className="w-full h-[250px] object-cover border-b-2 border-[#FFC107]" />
                  <div className="p-6">
                    <span className="text-[#FFC107] text-xs font-bold uppercase tracking-widest mb-2 block">Mitad y Mitad</span>
                    <h3 className="text-xl font-['Sora'] font-bold text-[#F5F5F0] mb-2">Maxi Dúo</h3>
                    <p className="text-[#A0A0A0] text-sm mb-5 leading-relaxed">Elige 2 sabores diferentes en nuestra pizza extra grande de 16 porciones.</p>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-2xl font-['Sora'] font-bold text-[#F5F5F0]">$24.00</p>
                      <p className="text-[#FFC107] font-semibold text-sm">4 cuotas de $6.00 con Cashea</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="text-center mt-6 mb-10">
            <button 
              onClick={() => setShowAllPromos(!showAllPromos)} 
              className="bg-transparent border border-white text-white hover:bg-white/10 font-['Sora'] font-bold px-8 py-3 rounded transition-all uppercase tracking-wide text-sm"
            >
              {showAllPromos ? 'Ver menos' : 'Ver más'}
            </button>
          </div>
          
          <div className="text-center mt-10">
            <button onClick={() => setIsMenuOpen(true)} className="bg-transparent border border-white text-white hover:bg-white/10 font-['Sora'] font-bold px-8 py-4 rounded transition-all uppercase tracking-wide">
              Ver Menú Interactivo
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 bg-gradient-to-r from-[#1A1A1A] to-[#C62828]/5">
        <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="rounded-xl overflow-hidden h-[400px] bg-[#2a2a2a]">
             <iframe src="https://maps.google.com/maps?q=Puerta%20Maraven,%20Punto%20Fijo,%20Falcon&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(100%)" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
          <div>
            <h2 className="text-4xl font-['Sora'] font-bold mb-6">¿Listo para <span className="font-normal italic">ordenar?</span></h2>
            <p className="text-[#A0A0A0] text-lg mb-10">Nuestro equipo está listo para preparar tu orden. Agrega tus productos al carrito y envíanos tu pedido por WhatsApp.</p>
            
            <div className="flex flex-col gap-5">
              {!showContactOptions ? (
                <button 
                  onClick={() => setShowContactOptions(true)} 
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-['Sora'] font-bold text-lg px-8 py-4 rounded-xl transition-all flex items-center gap-3 shadow-[0_4px_15px_rgba(37,211,102,0.3)] w-fit"
                >
                  <span className="text-2xl">📱</span> Escribir por WhatsApp
                </button>
              ) : (
                <div className="flex flex-col gap-4 w-full max-w-md">
                  <p className="text-white font-['Sora'] font-bold text-lg mb-1">¿A cuál sede deseas dirigirte?</p>
                  <div className="flex flex-col gap-3">
                    <a href="https://wa.me/584222121555" target="_blank" rel="noopener noreferrer" className="bg-[#222222] border border-[#333] hover:border-[#25D366] hover:bg-[#2a2a2a] text-white font-['Sora'] font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <span className="text-[#25D366] text-2xl group-hover:scale-110 transition-transform">📍</span> 
                        <span>Puerta Maraven</span>
                      </div>
                      <span className="text-[#A0A0A0] text-sm font-normal hidden sm:block">0422-2121555</span>
                    </a>
                    <a href="https://wa.me/584223131888" target="_blank" rel="noopener noreferrer" className="bg-[#222222] border border-[#333] hover:border-[#25D366] hover:bg-[#2a2a2a] text-white font-['Sora'] font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <span className="text-[#25D366] text-2xl group-hover:scale-110 transition-transform">📍</span> 
                        <span>Santa Irene</span>
                      </div>
                      <span className="text-[#A0A0A0] text-sm font-normal hidden sm:block">0422-3131888</span>
                    </a>
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
          
          {/* Logo */}
          <div className="flex flex-col items-center text-center gap-4 mb-12">
            <img 
              src="/images/logo_final_filled.png" 
              alt="Tonino's Logo" 
              style={{ height: '125px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.9))' }} 
            />
            <div className="font-['Sora'] text-2xl font-extrabold tracking-widest text-white">TONINO'S</div>
          </div>

          {/* Info Integrada (Trust Bar) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12 border-t border-b border-white/10 py-12">
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#FFC107] text-2xl shrink-0 shadow-lg">⏰</div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-white font-['Sora']">Horario</h4>
                <p className="text-[#A0A0A0] leading-relaxed">12:00 PM - 11:00 PM<br/>Todos los días de la semana</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#FFC107] text-2xl shrink-0 shadow-lg">🛵</div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-white font-['Sora']">Delivery Local</h4>
                <p className="text-[#A0A0A0] leading-relaxed">Zonas céntricas garantizadas<br/>Menos de 35 mins de espera</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#FFC107] text-2xl shrink-0 shadow-lg">💳</div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-white font-['Sora']">Pagos Cashea</h4>
                <p className="text-[#A0A0A0] leading-relaxed">Disfruta tu pedido hoy,<br/>paga después en cuotas sin interés</p>
              </div>
            </div>
          </div>

          {/* Enlaces */}
          <div className="flex justify-center gap-8 mb-10 flex-wrap">
            <button onClick={() => setIsMenuOpen(true)} className="text-[#A0A0A0] hover:text-white font-semibold text-sm uppercase tracking-wide transition-colors">Menú</button>
            <a href="#" className="text-[#A0A0A0] hover:text-white font-semibold text-sm uppercase tracking-wide transition-colors">Ubicaciones</a>
            <a href="#" className="text-[#A0A0A0] hover:text-white font-semibold text-sm uppercase tracking-wide transition-colors">Cashea Info</a>
            <a href="#contacto" className="text-[#A0A0A0] hover:text-white font-semibold text-sm uppercase tracking-wide transition-colors">Contacto</a>
          </div>
          <p className="text-[#666] text-sm">&copy; 2026 Tonino's Pizza. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Full Screen Menu Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-[#1A1A1A]/95 backdrop-blur-md z-50 border-b border-white/10 px-5 py-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo_final_filled.png" 
                alt="Tonino's Logo" 
                style={{ height: '40px', width: 'auto', objectFit: 'contain' }} 
              />
              <span className="font-['Sora'] text-xl font-extrabold text-white">TONINO'S</span>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="text-[#A0A0A0] hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center gap-2 font-bold"
            >
              <span className="hidden sm:inline">CERRAR</span>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <MenuSection onAddToCart={handleAddToCart} />
          
          {/* Shopping Cart Drawer - Only rendered inside the modal to keep landing clean */}
          <CartDrawer 
            cart={cart} 
            onUpdateQuantity={handleUpdateQuantity} 
            onRemoveItem={handleRemoveItem} 
          />
        </div>
      )}
    </div>
  );
}
