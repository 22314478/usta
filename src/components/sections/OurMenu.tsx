"use client";

import React, { useRef, useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { getMenuItems } from "@/lib/menuStore";
import { MenuItem as MenuItemType } from "@/lib/api/types";
import { useCartStore, getCartTotal } from "@/lib/cartStore";
import { FaPlus, FaMinus, FaShoppingBasket, FaTrash, FaTimes, FaBell } from "react-icons/fa";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, doc, getDoc, updateDoc, increment } from "firebase/firestore";

function ForkKnifeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
    </svg>
  );
}

const transitionClasses =
  "transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]";
const visibleClasses = "translate-y-0 opacity-100";
const hiddenClasses = "translate-y-12 opacity-0";

export function OurMenu() {
  const t = useTranslations('menu');
  const ct = useTranslations('cart');
  const tAdmin = useTranslations('admin');
  const searchParams = useSearchParams();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>(getMenuItems());
  const { items, removeItem, updateQuantity, updateNote, clearCart } = useCartStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [detectedTable, setDetectedTable] = useState<string | null>(null);
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);
  const [showWaiterPrompt, setShowWaiterPrompt] = useState(false);
  const [waiterSuccess, setWaiterSuccess] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const cartTotal = getCartTotal(items);

  useEffect(() => {
    // Sync menu items from Firestore for real-time stock
    const qm = collection(db, "menu");
    const unsubscribeMenu = onSnapshot(qm, (snap) => {
      const itemsArr: MenuItemType[] = [];
      snap.forEach(doc => {
        const data = doc.data();
        itemsArr.push({ 
          id: doc.id, 
          ...data,
          category: (data.category?.toLowerCase() === 'drink') ? 'drink' : 'food'
        } as MenuItemType);
      });
      
      if (itemsArr.length > 0) {
        setMenuItems(itemsArr);
      } else {
        setMenuItems(getMenuItems());
      }
    }, (error) => {
      console.error("Firestore menu listener error:", error);
      setMenuItems(getMenuItems());
    });

    return () => unsubscribeMenu();
  }, []);

  const foodItems = menuItems.filter(item => item.category === 'food');
  const drinkItems = menuItems.filter(item => item.category === 'drink');



  const foodLeft = foodItems.slice(0, Math.ceil(foodItems.length / 2));
  const foodRight = foodItems.slice(Math.ceil(foodItems.length / 2));


  const drinkLeft = drinkItems.slice(0, Math.ceil(drinkItems.length / 2));
  const drinkRight = drinkItems.slice(Math.ceil(drinkItems.length / 2));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Check for table in URL search params first
    const tableFromUrl = searchParams.get('table');
    if (tableFromUrl) {
      localStorage.setItem('tableNumber', tableFromUrl);
      setDetectedTable(tableFromUrl);
    } else {
      // Check for existing table in localStorage
      const savedTable = localStorage.getItem('tableNumber');
      if (savedTable) {
        setDetectedTable(savedTable);
      }
    }

    // Check for existing order in localStorage
    const savedOrderId = localStorage.getItem('activeOrderId');
    if (savedOrderId) {
      setActiveOrderId(savedOrderId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!activeOrderId) {
      setLiveStatus(null);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "orders", activeOrderId), (doc) => {
      if (doc.exists()) {
        setLiveStatus(doc.data().status);
      } else {
        // Order might have been deleted/completed
        setActiveOrderId(null);
        localStorage.removeItem('activeOrderId');
      }
    });

    return () => unsubscribe();
  }, [activeOrderId]);

  const handleCallWaiter = async (tableNum: string) => {
    if (isCallingWaiter) return;
    setIsCallingWaiter(true);

    try {
      await addDoc(collection(db, "calls"), {
        tableNumber: tableNum,
        type: 'waiter',
        status: 'pending',
        createdAt: serverTimestamp()
      });
      localStorage.setItem('tableNumber', tableNum);
      setWaiterSuccess(true);
      setShowWaiterPrompt(false);
      setTimeout(() => setWaiterSuccess(false), 3000);
    } catch (error) {
      console.error("Waiter call error:", error);
    } finally {
      setIsCallingWaiter(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (orderStatus === 'loading') return;
    setOrderStatus('loading');

    const formData = new FormData(e.currentTarget);
    const orderData = {
      customerName: String(formData.get('name') || ""),
      tableNumber: String(formData.get('table') || ""),
      items: items.map(i => ({
        id: String(i.id || ""),
        name: String(i.name || ""),
        quantity: Number(i.quantity || 1),
        price: String(i.price || ""),
        image: String(i.image || ""),
        note: String(i.note || "")
      })),
      total: cartTotal.toFixed(2),
      status: 'new',
      createdAt: serverTimestamp()
    };

    try {
      for (const item of items) {
        const itemRef = doc(db, "menu", item.id);
        const itemSnap = await getDoc(itemRef);
        if (itemSnap.exists()) {
          const currentStock = itemSnap.data().stock;
          if (currentStock !== undefined && currentStock !== null) {
            await updateDoc(itemRef, { stock: increment(-item.quantity) });
          }
        }
      }

      const docRef = await addDoc(collection(db, "orders"), orderData);
      const newOrderId = docRef.id;
      localStorage.setItem('activeOrderId', newOrderId);
      setActiveOrderId(newOrderId);
      
      setOrderStatus('success');
      setTimeout(() => {
        clearCart();
        setIsCartOpen(false);
        setShowCheckout(false);
        setOrderStatus('idle');
      }, 3000);
    } catch (error) {
      console.error("Order error:", error);
      setOrderStatus('error');
      setTimeout(() => setOrderStatus('idle'), 5000);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-24 relative"
      style={{ backgroundColor: "#111" }}
      aria-labelledby="our-menu-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 md:mb-16 text-center">
          <h2
            id="our-menu-heading"
            className={`font-[family-name:var(--font-gilda)] text-4xl md:text-5xl lg:text-6xl text-white tracking-wide ${transitionClasses} ${
              isVisible ? visibleClasses : hiddenClasses
            }`}
            style={{ transitionDelay: isVisible ? "400ms" : "0ms" }}
          >
            {t('heading')}
          </h2>
          <div
            className={`mt-4 flex items-center justify-center gap-4 ${transitionClasses} ${
              isVisible ? visibleClasses : hiddenClasses
            }`}
            style={{ transitionDelay: isVisible ? "450ms" : "0ms" }}
          >
            <span className="h-px flex-1 max-w-[80px] md:max-w-[120px] bg-[#c9a962]" />
            <span className="flex flex-col items-center text-[#c9a962]">
              <ForkKnifeIcon className="h-5 w-5 md:h-6 md:w-6" />
              <span className="font-[family-name:var(--font-barlow-c)] text-xs md:text-sm uppercase tracking-widest mt-1">
                {t('subtitle')}
              </span>
            </span>
            <span className="h-px flex-1 max-w-[80px] md:max-w-[120px] bg-[#c9a962]" />
          </div>

          {/* Real-time Order Status Bar */}
          {activeOrderId && liveStatus && (
            <div className={`mt-8 max-w-md mx-auto p-4 rounded-2xl border ${
              liveStatus === 'preparing' 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : liveStatus === 'delivered'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : 'bg-[#c9a962]/10 border-[#c9a962]/30 text-[#c9a962]'
            } animate-in fade-in slide-in-from-top-4 duration-500 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  liveStatus === 'preparing' ? 'bg-green-500' : liveStatus === 'delivered' ? 'bg-blue-500' : 'bg-[#c9a962]'
                }`} />
                <span className="font-bold tracking-wide uppercase text-xs">
                  {liveStatus === 'preparing' ? ct('orderPreparing') : liveStatus === 'delivered' ? ct('orderDelivered') : ct('orderWaiting')}
                </span>
              </div>
              {liveStatus !== 'preparing' && (
                <button 
                  onClick={() => {
                    localStorage.removeItem('activeOrderId');
                    setActiveOrderId(null);
                  }}
                  className="text-[10px] opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest font-bold"
                >
                  {t('close')}
                </button>
              )}
            </div>
          )}

          {/* Review Trigger - Shows when order is delivered and hasn't been closed/rated */}
          {liveStatus === 'delivered' && !reviewSubmitted && (
             <div className="mt-4 bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-500">
                <p className="text-white text-sm mb-3">{tAdmin('reviewDesc')}</p>
                <button 
                  onClick={() => setShowReviewModal(true)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest transition-colors"
                >
                  {tAdmin('submitReview')}
                </button>
             </div>
          )}
        </header>

        {/* Food Section */}
        <div className="mb-20">
          <div className={`mb-10 text-center ${transitionClasses} ${isVisible ? visibleClasses : hiddenClasses}`} style={{ transitionDelay: "450ms" }}>
             <h3 className="text-[#c9a962] font-[family-name:var(--font-gilda)] text-2xl md:text-3xl uppercase tracking-widest">{t('foods')}</h3>
             <div className="h-0.5 w-12 bg-[#c9a962]/30 mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-10 md:gap-y-12">
            <div
              className={`space-y-10 md:space-y-12 ${transitionClasses} ${
                isVisible ? visibleClasses : hiddenClasses
              }`}
              style={{ transitionDelay: isVisible ? "500ms" : "0ms" }}
            >
              {foodLeft.map((item) => (
                <MenuItem key={item.id} item={item} tAdmin={tAdmin} />
              ))}
            </div>
            <div
              className={`space-y-10 md:space-y-12 ${transitionClasses} ${
                isVisible ? visibleClasses : hiddenClasses
              }`}
              style={{ transitionDelay: isVisible ? "550ms" : "0ms" }}
            >
              {foodRight.map((item) => (
                <MenuItem key={item.id} item={item} tAdmin={tAdmin} />
              ))}
            </div>
          </div>
        </div>

        {/* Drinks Section */}
        {drinkItems.length > 0 && (
          <div>
            <div className={`mb-10 text-center ${transitionClasses} ${isVisible ? visibleClasses : hiddenClasses}`} style={{ transitionDelay: "600ms" }}>
               <h3 className="text-[#c9a962] font-[family-name:var(--font-gilda)] text-2xl md:text-3xl uppercase tracking-widest">{t('drinks')}</h3>
               <div className="h-0.5 w-12 bg-[#c9a962]/30 mx-auto mt-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-10 md:gap-y-12">
              <div
                className={`space-y-10 md:space-y-12 ${transitionClasses} ${
                  isVisible ? visibleClasses : hiddenClasses
                }`}
                style={{ transitionDelay: isVisible ? "650ms" : "0ms" }}
              >
                {drinkLeft.map((item) => (
                  <MenuItem key={item.id} item={item} tAdmin={tAdmin} />
                ))}
              </div>
              <div
                className={`space-y-10 md:space-y-12 ${transitionClasses} ${
                  isVisible ? visibleClasses : hiddenClasses
                }`}
                style={{ transitionDelay: isVisible ? "700ms" : "0ms" }}
              >
                {drinkRight.map((item) => (
                  <MenuItem key={item.id} item={item} tAdmin={tAdmin} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Item Rendering Logic Correction */}

      {/* Floating Cart Button */}
      {items.length > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-[60] bg-[#c9a962] text-black p-5 rounded-full shadow-2xl hover:scale-110 transition-transform animate-in fade-in zoom-in duration-300 flex items-center gap-3 font-bold"
        >
          <div className="relative">
            <FaShoppingBasket size={24} />
            <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#c9a962]">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <span className="font-barlow-c">₺{cartTotal.toFixed(2)}</span>
        </button>
      )}

      {/* Floating Call Waiter Button */}
      {!isCartOpen && (
        <button
          onClick={() => {
            if (detectedTable) {
              handleCallWaiter(detectedTable);
            } else {
              setShowWaiterPrompt(true);
            }
          }}
          className={`fixed bottom-8 left-8 z-[60] p-5 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center ${
            waiterSuccess ? 'bg-green-500 text-white' : 'bg-[#c9a962] text-black'
          }`}
          title={ct('callWaiter')}
        >
          {isCallingWaiter ? (
            <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : waiterSuccess ? (
            <FaBell className="animate-bounce" />
          ) : (
            <FaBell size={24} />
          )}
        </button>
      )}

      {/* Waiter Success Message */}
      {waiterSuccess && (
        <div className="fixed bottom-24 left-8 z-[60] bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-300 shadow-xl">
          {ct('waiterCalled')}
        </div>
      )}

      {/* Waiter Prompt Modal */}
      {showWaiterPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowWaiterPrompt(false)} />
          <div className="relative bg-[#1a1a1a] border border-[#c9a962]/30 p-8 rounded-3xl shadow-2xl max-w-sm w-full animate-in zoom-in duration-300">
            <h3 className="text-xl font-gilda text-[#c9a962] mb-4 uppercase tracking-widest">{ct('callWaiter')}</h3>
            <p className="text-white/60 mb-6 text-sm">{ct('enterTable')}</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const table = new FormData(e.currentTarget).get('table') as string;
              if (table) handleCallWaiter(table);
            }} className="space-y-4">
              <input
                name="table"
                required
                autoFocus
                placeholder={ct('tableNumber')}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-[#c9a962]"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowWaiterPrompt(false)}
                  className="flex-1 px-4 py-4 rounded-xl border border-white/10 text-white/40 hover:text-white transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-[#c9a962] hover:bg-[#b39352] text-black font-bold py-4 rounded-xl transition-all"
                >
                  {ct('callWaiter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <aside className="relative w-full max-w-md bg-[#1a1a1a] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-2xl font-gilda text-[#c9a962] uppercase tracking-widest">{ct('title')}</h3>
              <button onClick={() => setIsCartOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <FaTimes size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center animate-in fade-in slide-in-from-right-4">
                  <img src={item.image} className="w-16 h-16 rounded object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-gilda text-white truncate">{t.has(`items.${item.id}.name`) ? t(`items.${item.id}.name`) : item.name}</h4>
                    <p className="text-[#c9a962] font-bold mt-1">{item.price}</p>
                    <div className="mt-2">
                       <input 
                         type="text"
                         placeholder={tAdmin('notePlaceholder')}
                         value={item.note || ""}
                         onChange={(e) => updateNote(item.id, e.target.value)}
                         className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white/60 focus:border-[#c9a962] outline-none transition-all"
                       />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-black/30 p-2 rounded-lg border border-white/5">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-white/40 hover:text-[#c9a962]">
                      <FaMinus size={12} />
                    </button>
                    <span className="text-white font-bold min-w-[20px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white/40 hover:text-[#c9a962]">
                      <FaPlus size={12} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500/40 hover:text-red-500">
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-white/20 pt-20">
                  <FaShoppingBasket size={64} className="mb-4 opacity-10" />
                  <p className="text-xl italic">{ct('empty')}</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-black/30 border-t border-white/10 space-y-4">
              <div className="flex justify-between items-center text-2xl">
                <span className="font-barlow-c uppercase tracking-widest text-white/60">{ct('total')}</span>
                <span className="font-gilda text-[#c9a962]">₺{cartTotal.toFixed(2)}</span>
              </div>
              {!showCheckout ? (
                <button
                  disabled={items.length === 0}
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-[#EBAA54] hover:bg-[#d4a04a] text-black py-4 rounded-xl font-bold uppercase tracking-widest transition-all disabled:opacity-20 disabled:grayscale"
                >
                  {ct('checkout')}
                </button>
              ) : (
                <form onSubmit={handlePlaceOrder} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="table"
                      required
                      defaultValue={detectedTable || ""}
                      placeholder={ct('tableNumber')}
                      className={`bg-header-bg border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962] ${detectedTable ? 'opacity-50 cursor-not-allowed' : ''}`}
                      readOnly={!!detectedTable}
                    />
                    <input
                      name="name"
                      required
                      placeholder={ct('customerName')}
                      className="bg-header-bg border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]"
                    />
                  </div>
                  {orderStatus === 'success' && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-lg text-center text-sm">
                      {ct('success')}
                    </div>
                  )}
                  {orderStatus === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-center text-sm">
                      {ct('error')}
                    </div>
                  )}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 border border-white/10 text-white/60 py-4 rounded-xl font-bold transition-all hover:bg-white/5"
                    >
                      ←
                    </button>
                    <button
                      type="submit"
                      disabled={orderStatus === 'loading'}
                      className="flex-[3] bg-[#c9a962] hover:bg-[#b39352] text-black py-4 rounded-xl font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                      {orderStatus === 'loading' ? '...' : ct('placeOrder')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowReviewModal(false)} />
          <div className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-gilda text-[#c9a962] mb-2">{tAdmin('reviewTitle')}</h2>
            <p className="text-white/60 text-sm mb-6">{tAdmin('reviewDesc')}</p>
            
            <div className="flex justify-center gap-4 mb-8">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className={`text-3xl transition-all ${rating >= s ? 'text-[#c9a962] scale-110' : 'text-white/10 scale-100'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:border-[#c9a962] outline-none transition-colors mb-6 text-sm min-h-[100px]"
              placeholder={tAdmin('notePlaceholder')}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <button
              onClick={async () => {
                try {
                  await addDoc(collection(db, "reviews"), {
                    rating,
                    text: reviewText,
                    orderId: activeOrderId,
                    tableName: detectedTable,
                    createdAt: serverTimestamp()
                  });
                  setReviewSubmitted(true);
                  setShowReviewModal(false);
                } catch (e) {
                  console.error(e);
                }
              }}
              className="w-full bg-[#c9a962] hover:bg-[#b39352] text-black font-bold py-4 rounded-xl uppercase tracking-widest transition-all"
            >
              {tAdmin('submitReview')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function MenuItem({
  item,
  tAdmin,
}: {
  item: MenuItemType;
  tAdmin: any;
}) {
  const t = useTranslations('menu');
  const ct = useTranslations('cart');
  const addItem = useCartStore((state) => state.addItem);
  const cartItem = useCartStore((state) => state.items.find(i => i.id === item.id));
  
  const isOutOfStock = item.stock !== undefined && item.stock !== null && item.stock <= 0;

  return (
    <article className="flex gap-4 group/item">
      <div className="relative shrink-0 w-20 h-20 md:w-24 md:h-24 group">
        {/* Enlarged image on hover */}
        <div
          className="absolute bottom-full left-0 z-20 mb-2 origin-bottom-left scale-95 opacity-0 shadow-2xl ring-1 ring-white/10 transition-[transform,opacity] duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 pointer-events-none"
          aria-hidden
        >
          <div className="relative h-52 w-52 overflow-hidden rounded-lg sm:h-64 sm:w-64 bg-black">
            <img
              src={item.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {/* Thumbnail */}
        <div className="relative h-full w-full overflow-hidden rounded transition-transform duration-300 ease-out group-hover:scale-105 cursor-pointer bg-black">
          <img
            src={item.image}
            alt={item.imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-[family-name:var(--font-gilda)] text-xl md:text-2xl text-white shrink-0 group-hover/item:text-[#c9a962] transition-colors">
            {t.has(`items.${item.id}.name`) ? t(`items.${item.id}.name`) : item.name}
          </h3>
          <span className="flex-1 min-w-[20px] border-b border-dotted border-white/40 self-end mb-1.5" />
          <span className="font-[family-name:var(--font-gilda)] text-lg md:text-xl text-white shrink-0">
            {item.price}
          </span>
        </div>
        {isOutOfStock && (
          <div className="mt-1">
             <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
               {tAdmin('outOfStock')}
             </span>
          </div>
        )}
        <div className="mt-2 flex items-start justify-between gap-4">
          <p className="font-[family-name:var(--font-barlow)] text-sm md:text-base text-white/60 leading-relaxed line-clamp-2">
            {t.has(`items.${item.id}.description`) ? t(`items.${item.id}.description`) : item.description}
          </p>
          <button
            onClick={() => !isOutOfStock && addItem(item)}
            disabled={isOutOfStock}
            className={`shrink-0 flex items-center justify-center p-2 rounded-lg border transition-all ${
              isOutOfStock ? 'opacity-20 grayscale cursor-not-allowed border-white/5' :
              cartItem ? 'bg-[#c9a962]/10 border-[#c9a962] text-[#c9a962]' : 'border-white/10 text-white/40 hover:border-[#c9a962] hover:text-[#c9a962]'
            }`}
          >
            <FaPlus size={14} />
            {cartItem && <span className="ml-2 font-bold text-xs">{cartItem.quantity}</span>}
          </button>
        </div>
      </div>
    </article>
  );
}
