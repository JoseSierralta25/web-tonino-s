'use client';

import React, { useState } from 'react';
import { CartItem } from './MenuSection';

interface CartDrawerProps {
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ cart, onUpdateQuantity, onRemoveItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [method, setMethod] = useState<'Delivery' | 'Retiro en Sede'>('Delivery');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'location'>('cart');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const deliveryFee = method === 'Delivery' ? 2 : 0;
  const totalAmount = subtotalAmount + deliveryFee;

  const formatWhatsAppMessage = (sede: string) => {
    let message = `🍕 *¡Nuevo Pedido en Tonino's Pizza!* (${sede}) 🍕\n`;
    message += `-----------------------------------------\n\n`;
    message += `🛒 *Detalle de la compra:*\n`;
    
    cart.forEach(item => {
      const sizeText = item.size ? ` (Tamaño: ${item.size})` : '';
      message += `• ${item.quantity}x ${item.menuItem.name}${sizeText} - $${item.subtotal.toFixed(2)}\n`;
    });

    message += `\n-----------------------------------------\n`;
    if (deliveryFee > 0) {
      message += `🛵 *Costo de Envío:* $${deliveryFee.toFixed(2)}\n`;
    }
    message += `💰 *Total a Pagar:* $${totalAmount.toFixed(2)} Dólares\n`;
    message += `📦 *Método:* ${method}\n\n`;
    message += `¡Hola! Vengo de la página web y quiero confirmar este pedido.`;

    return encodeURIComponent(message);
  };

  const handleCheckout = (sede: 'Puerta Maraven' | 'Santa Irene') => {
    if (cart.length === 0) return;
    const phones = {
      'Puerta Maraven': '584222121555',
      'Santa Irene': '584223131888'
    };
    const phone = phones[sede];
    const text = formatWhatsAppMessage(sede);
    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => { setIsOpen(true); setCheckoutStep('cart'); }}
        className="fixed bottom-6 right-6 bg-[#C62828] hover:bg-[#b02323] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-40 border-2 border-white/10"
      >
        <div className="relative">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#FFC107] text-[#1A1A1A] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
              {totalItems}
            </span>
          )}
        </div>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#1A1A1A] border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#222222]">
          <h2 className="text-xl font-['Sora'] font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-[#FFC107]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Tu Pedido
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-[#A0A0A0] hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#A0A0A0]">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <p className="font-medium text-lg text-white mb-1">Tu carrito está vacío</p>
              <p className="text-sm">¡Agrega algunas pizzas para comenzar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.cartItemId} className="bg-[#222222] rounded-lg p-4 border border-white/5 relative group">
                  <button
                    onClick={() => onRemoveItem(item.cartItemId)}
                    className="absolute -top-2 -right-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                  <div className="flex justify-between items-start mb-2">
                    <div className="pr-4">
                      <h4 className="font-bold text-white text-sm leading-tight">{item.menuItem.name}</h4>
                      {item.size && <p className="text-[#A0A0A0] text-xs mt-1">Tamaño: <span className="text-white font-medium">{item.size}</span></p>}
                    </div>
                    <div className="font-bold text-[#FFC107] shrink-0">
                      ${item.subtotal.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center bg-[#1A1A1A] rounded border border-white/10 h-8">
                      <button 
                        onClick={() => onUpdateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                        className="w-7 h-full flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-white/5 rounded-l transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-7 h-full flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-white/5 rounded-r transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-[#A0A0A0]">
                      ${(item.subtotal / item.quantity).toFixed(2)} c/u
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div className="p-6 bg-[#222222] border-t border-white/10">
            {checkoutStep === 'cart' ? (
              <>
                <div className="mb-4">
                  <label className="block text-xs text-[#A0A0A0] mb-2 uppercase tracking-wider font-semibold">Método de entrega</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setMethod('Delivery')}
                      className={`py-2 px-3 rounded text-sm font-bold transition-colors ${
                        method === 'Delivery' ? 'bg-[#FFC107] text-[#1A1A1A]' : 'bg-[#1A1A1A] text-[#A0A0A0] border border-white/10 hover:border-white/30'
                      }`}
                    >
                      Delivery
                    </button>
                    <button
                      onClick={() => setMethod('Retiro en Sede')}
                      className={`py-2 px-3 rounded text-sm font-bold transition-colors ${
                        method === 'Retiro en Sede' ? 'bg-[#FFC107] text-[#1A1A1A]' : 'bg-[#1A1A1A] text-[#A0A0A0] border border-white/10 hover:border-white/30'
                      }`}
                    >
                      Retiro en Sede
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-5 border-t border-white/10 pt-3">
                  <div className="flex justify-between items-center text-[#A0A0A0] text-sm">
                    <span>Subtotal</span>
                    <span>${subtotalAmount.toFixed(2)}</span>
                  </div>
                  {method === 'Delivery' && (
                    <div className="flex justify-between items-center text-[#A0A0A0] text-sm animate-in fade-in slide-in-from-top-2">
                      <span className="text-[#FFC107]">Costo de Envío</span>
                      <span className="text-[#FFC107] font-bold">+$2.00</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end mt-2 pt-2 border-t border-white/5">
                    <span className="text-[#A0A0A0] uppercase tracking-wider text-sm font-bold">Total a pagar</span>
                    <span className="text-3xl font-['Sora'] font-bold text-white">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setCheckoutStep('location')}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-transform transform active:scale-95 shadow-lg shadow-green-900/20"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Confirmar Pedido
                </button>
              </>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-5">
                  <button onClick={() => setCheckoutStep('cart')} className="text-[#A0A0A0] hover:text-white transition-colors p-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <h3 className="text-white font-['Sora'] font-bold text-lg leading-tight">¿A cuál sede enviar el pedido?</h3>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleCheckout('Puerta Maraven')}
                    className="bg-[#1A1A1A] hover:bg-[#2a2a2a] border border-white/10 hover:border-[#25D366] group text-left px-5 py-4 rounded-xl transition-all flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#25D366] text-xl group-hover:scale-110 transition-transform">📍</span>
                      <span className="text-white font-['Sora'] font-bold text-lg">Puerta Maraven</span>
                    </div>
                    <p className="text-[#A0A0A0] text-sm pl-8">Enviar vía WhatsApp a Puerta Maraven</p>
                  </button>
                  
                  <button 
                    onClick={() => handleCheckout('Santa Irene')}
                    className="bg-[#1A1A1A] hover:bg-[#2a2a2a] border border-white/10 hover:border-[#25D366] group text-left px-5 py-4 rounded-xl transition-all flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#25D366] text-xl group-hover:scale-110 transition-transform">📍</span>
                      <span className="text-white font-['Sora'] font-bold text-lg">Santa Irene</span>
                    </div>
                    <p className="text-[#A0A0A0] text-sm pl-8">Enviar vía WhatsApp a Santa Irene</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
