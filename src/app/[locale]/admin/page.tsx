
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MenuItem } from "@/lib/api/types";
import { getMenuItems, saveMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/menuStore";
import { getSiteSettings, saveSiteSettings, SiteSettings } from "@/lib/siteStore";
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes, FaGlobe, FaImage, FaCalendarAlt, FaArrowLeft, FaCheck, FaBell, FaQrcode, FaPrint, FaCheckDouble, FaChartLine, FaCrown, FaHistory, FaStar } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { db, auth } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, Timestamp, getDoc, updateDoc, serverTimestamp, addDoc, getDocs, writeBatch } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

interface Reservation {
  id: string;
  name: string;
  email: string;
  date: string;
  guests: string;
  status: string;
  createdAt: Timestamp;
}
 
interface WaiterCall {
  id: string;
  tableNumber: string;
  type: 'waiter';
  status: 'pending' | 'completed';
  createdAt: Timestamp;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  image?: string;
  note?: string;
}

interface Review {
  id: string;
  rating: number;
  text: string;
  orderId: string;
  tableName: string;
  createdAt: any;
}

interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  items: OrderItem[];
  total: string;
  status: string;
  createdAt: Timestamp;
  paidAt?: Timestamp;
}

export default function AdminPage() {
  const t = useTranslations('admin');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: "",
    description: "",
    price: "",
    image: "",
    imageAlt: "",
    category: "food",
    stock: null,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<'food' | 'drink' | 'site' | 'reservations' | 'orders' | 'stats'>('food');
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [calls, setCalls] = useState<WaiterCall[]>([]);
  const [qrToDisplay, setQrToDisplay] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const parsePrice = (p: string | number) => {
    if (typeof p === 'number') return p;
    if (!p) return 0;
    return parseFloat(p.replace(/[^0-9.]/g, '')) || 0;
  };

  const bestSellers = React.useMemo(() => {
    const paidOrders = orders.filter(o => o.status === 'paid');
    const counts: Record<string, { count: number, rev: number }> = {};
    paidOrders.forEach(o => {
      o.items.forEach(it => {
        if (!counts[it.name]) counts[it.name] = { count: 0, rev: 0 };
        counts[it.name].count += it.quantity;
        counts[it.name].rev += parsePrice(it.price || "0");
      });
    });
    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0"; // Dependencies: orders

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check for admin role in Firestore
        try {
          const userDoc = await getDoc(doc(db, "user", currentUser.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            setAuthError(t('accessDenied'));
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [t]);

  useEffect(() => {
    if (!isAdmin) return;
    setItems(getMenuItems());
    setSiteSettings(getSiteSettings());

    // Real-time listener for reservations
    const qr = query(collection(db, "reservations"), orderBy("createdAt", "desc"));
    const unsubscribeRes = onSnapshot(qr, (querySnapshot) => {
      const res: Reservation[] = [];
      querySnapshot.forEach((doc) => {
        res.push({ id: doc.id, ...doc.data() } as Reservation);
      });
      setReservations(res);
    });

    // Real-time listener for orders
    const qo = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribeOrders = onSnapshot(qo, (querySnapshot) => {
      const ord: Order[] = [];
      querySnapshot.forEach((doc) => {
        ord.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ord);
    });

    // Real-time listener for waiter calls
    const qc = query(collection(db, "calls"), orderBy("createdAt", "desc"));
    const unsubscribeCalls = onSnapshot(qc, (querySnapshot) => {
      const c: WaiterCall[] = [];
      querySnapshot.forEach((doc) => {
        c.push({ id: doc.id, ...doc.data() } as WaiterCall);
      });
      setCalls(c);
    });

    // Real-time listener for reviews
    const qrv = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribeReviews = onSnapshot(qrv, (querySnapshot) => {
      const rev: Review[] = [];
      querySnapshot.forEach((doc) => {
        rev.push({ id: doc.id, ...doc.data() } as Review);
      });
      setReviews(rev);
    });

    // Real-time listener for menu items
    const qm = collection(db, "menu");
    const unsubscribeMenu = onSnapshot(qm, (snap) => {
      const menuArr: MenuItem[] = [];
      snap.forEach(doc => {
        menuArr.push({ id: doc.id, ...doc.data() } as MenuItem);
      });
      setItems(menuArr.length > 0 ? menuArr : getMenuItems());
    });

    return () => {
      unsubscribeRes();
      unsubscribeOrders();
      unsubscribeCalls();
      unsubscribeReviews();
      unsubscribeMenu();
    };
  }, [isAdmin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sanitizedData = {
        name: formData.name || "",
        description: formData.description || "",
        price: formData.price || "",
        image: formData.image || "",
        imageAlt: formData.imageAlt || "",
        category: formData.category || "food",
        stock: formData.stock ?? null
      };
      await addDoc(collection(db, "menu"), {
        ...sanitizedData,
        createdAt: serverTimestamp()
      });
      setFormData({ name: "", description: "", price: "", image: "", imageAlt: "", category: "food" });
      setShowAddForm(false);
      triggerSuccess(t('addSuccess'));
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    try {
      const sanitizedData = {
        name: formData.name || "",
        description: formData.description || "",
        price: formData.price || "",
        image: formData.image || "",
        imageAlt: formData.imageAlt || "",
        category: formData.category || "food",
        stock: formData.stock ?? null
      };
      await updateDoc(doc(db, "menu", isEditing), {
        ...sanitizedData,
        updatedAt: serverTimestamp()
      });
      setIsEditing(null);
      setFormData({ name: "", description: "", price: "", image: "", imageAlt: "", category: "food" });
      setShowAddForm(false);
      triggerSuccess(t('updateSuccess'));
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('deleteConfirm'))) {
      try {
        await deleteDoc(doc(db, "menu", id));
      } catch (error) {
        console.error("Error deleting menu item:", error);
      }
    }
  };


  const startEdit = (item: MenuItem) => {
    setIsEditing(item.id);
    setFormData({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      image: item.image || "",
      imageAlt: item.imageAlt || "",
      category: item.category || "food",
      stock: item.stock ?? null,
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({ name: "", description: "", price: "", image: "", imageAlt: "", category: "food" });
    setShowAddForm(false);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(t('loginError'));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveTab('food');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#c9a962]/20 border-t-[#c9a962] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#1a1a1a] border border-white/10 p-10 rounded-3xl shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-[family-name:var(--font-gilda)] text-[#c9a962] mb-2">{t('title')}</h1>
            <p className="text-white/40">{t('login')}</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-white/40 mb-2">{t('email')}</label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 focus:border-[#c9a962] outline-none transition-all"
                placeholder="admin@ustacadde.com"
              />
            </div>
            <div>
              <label className="block text-sm text-white/40 mb-2">{t('password')}</label>
              <input
                type="password"
                name="password"
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 focus:border-[#c9a962] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            {authError && (
              <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {authError}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-[#c9a962] hover:bg-[#b39352] text-black font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-[#c9a962]/20"
            >
              {t('login')}
            </button>
            {user && !isAdmin && (
              <button
                type="button"
                onClick={() => signOut(auth)}
                className="w-full text-white/40 hover:text-white text-sm mt-4"
              >
                {t('logout')}
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  // Robust filtering: default unknown categories to 'food'
  const filteredItems = items.filter(item => {
    const cat = (item.category?.toLowerCase() === 'drink') ? 'drink' : 'food';
    return cat === activeTab;
  });

  // Stats Calculations
  const paidOrders = orders.filter(o => o.status === 'paid');
  const dailyOrders = paidOrders.filter(o => {
    const today = new Date();
    const date = o.paidAt?.toDate() || o.createdAt?.toDate();
    return date && date.toDateString() === today.toDateString();
  });
  const monthlyOrders = paidOrders.filter(o => {
    const today = new Date();
    const date = o.paidAt?.toDate() || o.createdAt?.toDate();
    return date && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  });

  const dailyRevenue = dailyOrders.reduce((acc, o) => acc + parsePrice(o.total || "0"), 0);
  const monthlyRevenue = monthlyOrders.reduce((acc, o) => acc + parsePrice(o.total || "0"), 0);
  const totalRevenue = paidOrders.reduce((acc, o) => acc + parsePrice(o.total || "0"), 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 pt-24 md:p-12 md:pt-32 font-[family-name:var(--font-barlow)]">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-6 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-gilda)] text-[#c9a962]">{t('title')}</h1>
            <p className="text-white/60 mt-2">{t('subtitle')}</p>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-white transition-colors mr-4 text-sm"
            >
              {t('logout')}
            </button>
            {!showAddForm && (
              <div className="flex gap-4 items-center">
                {/* Global Waiter Call Indicator */}
                {calls.filter(c => c.status === 'pending').length > 0 && (
                  <div className="flex items-center gap-2 bg-red-500/20 text-red-500 border border-red-500/30 px-4 py-2 rounded-xl animate-pulse">
                    <FaBell className="animate-bounce" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {calls.filter(c => c.status === 'pending').length} {t('waiterCallTitle')}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-[#c9a962] hover:bg-[#b39352] text-black px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105"
                >
                  <FaPlus /> {t('addNew')}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Category Tabs in a separate row with high z-index and more spacing */}
        <div className="flex justify-center mb-10 mt-12">
          <div className="flex bg-[#1a1a1a] p-1.5 rounded-xl border border-white/10 shadow-2xl relative z-[100]">
            <button
              onClick={() => {
                setActiveTab('food');
              }}
              className={`px-10 py-3 rounded-lg transition-all ${activeTab === 'food' ? 'bg-[#c9a962] text-black font-bold shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {t('foods')}
            </button>
            <button
              onClick={() => {
                setActiveTab('drink');
              }}
              className={`px-10 py-3 rounded-lg transition-all ${activeTab === 'drink' ? 'bg-[#c9a962] text-black font-bold shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {t('drinks')}
            </button>
            <button
              onClick={() => {
                setActiveTab('site');
              }}
              className={`px-10 py-3 rounded-lg transition-all ${activeTab === 'site' ? 'bg-[#c9a962] text-black font-bold shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {t('siteSettings')}
            </button>
            <button
              onClick={() => {
                setActiveTab('reservations');
              }}
              className={`px-10 py-3 rounded-lg transition-all ${activeTab === 'reservations' ? 'bg-[#c9a962] text-black font-bold shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {t('reservations')}
            </button>
            <button
              onClick={() => {
                setActiveTab('stats');
                setShowAddForm(false);
              }}
              className={`px-10 py-3 rounded-lg transition-all ${activeTab === 'stats' ? 'bg-[#c9a962] text-black font-bold shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {t('stats')}
            </button>
            <button
              onClick={() => {
                setActiveTab('orders');
                setShowAddForm(false);
              }}
              className={`px-10 py-3 rounded-lg transition-all ${activeTab === 'orders' ? 'bg-[#c9a962] text-black font-bold shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {t('orders')}
            </button>
          </div>
        </div>

        {showAddForm && (
          <section className="mb-12 bg-[#1a1a1a] p-8 rounded-2xl border border-[#c9a962]/30 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-[family-name:var(--font-gilda)] text-[#c9a962]">
                {isEditing ? "Düzenle" : "Yeni Ekle"}
              </h2>
              <button onClick={cancelEdit} className="text-white/40 hover:text-white transition-colors">
                <FaTimes size={24} />
              </button>
            </div>
            <form onSubmit={isEditing ? handleUpdate : handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex bg-white/5 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'food' })}
                    className={`flex-1 py-2 px-4 rounded-md transition-all ${formData.category === 'food' ? 'bg-[#c9a962] text-black font-bold' : 'text-white/40'}`}
                  >
                    {t('food')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'drink' })}
                    className={`flex-1 py-2 px-4 rounded-md transition-all ${formData.category === 'drink' ? 'bg-[#c9a962] text-black font-bold' : 'text-white/40'}`}
                  >
                    {t('drink')}
                  </button>
                </div>
                <div>
                  <label className="block text-sm text-white/40 mb-1">{t('name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-[#c9a962] outline-none transition-colors"
                    placeholder={t('placeholderName')}
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/40 mb-1">{t('description')}</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-[#c9a962] outline-none transition-colors"
                    placeholder={t('placeholderDesc')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/40 mb-1">{t('price')}</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-[#c9a962] outline-none transition-colors"
                      placeholder="Örn: ₺64"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/40 mb-1">{t('imageAltLabel')}</label>
                    <input
                      type="text"
                      name="imageAlt"
                      value={formData.imageAlt}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-[#c9a962] outline-none transition-colors"
                      placeholder={t('imageAltPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/40 mb-1">{t('stock')} ({t('unlimited').toLowerCase()} için boş bırakın)</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock === null ? "" : formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value === "" ? null : parseInt(e.target.value)})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-[#c9a962] outline-none transition-colors"
                      placeholder="Örn: 50"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/40 mb-1">{t('imageUrlLabel')}</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-[#c9a962] outline-none transition-colors"
                    placeholder={t('imageUrlPlaceholder')}
                  />
                </div>
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
                  {formData.image ? (
                    <img src={formData.image} alt={t('imagePreview')} className="w-full h-full object-cover" onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x225?text=${t('imageLoadError')}`;
                    }} />
                  ) : (
                    <div className="text-center text-white/20 p-4">
                      <FaGlobe size={40} className="mx-auto mb-2" />
                      <p>{t('imagePreview')}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#c9a962] hover:bg-[#b39352] text-black px-10 py-3 rounded-full font-bold transition-all shadow-lg shadow-[#c9a962]/20"
                >
                  <FaSave /> {isEditing ? t('update') : t('save')}
                </button>
              </div>
            </form>
          </section>
        )}

        {activeTab === 'site' && siteSettings && (
          <div className="space-y-12 pb-20">

            {/* Hero Settings */}
            <section className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-[family-name:var(--font-gilda)] text-[#c9a962] mb-8 flex items-center gap-3">
                <FaImage /> {t('heroSettings')}
              </h2>
              <div className="space-y-12">
                {siteSettings.hero.slides.map((slide, idx) => (
                  <div key={idx} className="p-6 bg-black/30 rounded-xl border border-white/5 space-y-4">
                    <h3 className="text-lg font-bold text-white/80">{t('slide')} {idx + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('subheading')}</label>
                          <input 
                            value={slide.subheading}
                            onChange={(e) => {
                              const newSlides = [...siteSettings.hero.slides];
                              newSlides[idx].subheading = e.target.value;
                              setSiteSettings({...siteSettings, hero: {...siteSettings.hero, slides: newSlides}});
                            }}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-[#c9a962] outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('heading1')}</label>
                            <input 
                              value={slide.heading1}
                              onChange={(e) => {
                                const newSlides = [...siteSettings.hero.slides];
                                newSlides[idx].heading1 = e.target.value;
                                setSiteSettings({...siteSettings, hero: {...siteSettings.hero, slides: newSlides}});
                              }}
                              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-[#c9a962] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('heading2')}</label>
                            <input 
                              value={slide.heading2}
                              onChange={(e) => {
                                const newSlides = [...siteSettings.hero.slides];
                                newSlides[idx].heading2 = e.target.value;
                                setSiteSettings({...siteSettings, hero: {...siteSettings.hero, slides: newSlides}});
                              }}
                              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-[#c9a962] outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('description')}</label>
                          <textarea 
                            value={slide.description}
                            rows={2}
                            onChange={(e) => {
                              const newSlides = [...siteSettings.hero.slides];
                              newSlides[idx].description = e.target.value;
                              setSiteSettings({...siteSettings, hero: {...siteSettings.hero, slides: newSlides}});
                            }}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-[#c9a962] outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Resim URL</label>
                          <input 
                            value={slide.image}
                            onChange={(e) => {
                              const newSlides = [...siteSettings.hero.slides];
                              newSlides[idx].image = e.target.value;
                              setSiteSettings({...siteSettings, hero: {...siteSettings.hero, slides: newSlides}});
                            }}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-[#c9a962] outline-none"
                          />
                        </div>
                        <div className="aspect-[21/9] rounded-lg overflow-hidden border border-white/5">
                          <img src={slide.image} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Floating Save Button for Site Settings */}
            <div className="fixed bottom-8 right-8 z-[200]">
              <button
                onClick={() => {
                  saveSiteSettings(siteSettings);
                  triggerSuccess(t('siteSettingsSuccess'));
                }}
                className="flex items-center gap-3 bg-[#c9a962] hover:bg-[#b39352] text-black px-10 py-5 rounded-full font-bold text-lg transition-all shadow-2xl transform hover:scale-105 active:scale-95"
              >
                <FaSave size={24} /> {t('saveAll')}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <section className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/30 border-b border-white/10">
                    <th className="px-6 py-4 text-[#c9a962] font-[family-name:var(--font-gilda)] uppercase tracking-wider text-sm">{t('resName')}</th>
                    <th className="px-6 py-4 text-[#c9a962] font-[family-name:var(--font-gilda)] uppercase tracking-wider text-sm">{t('resEmail')}</th>
                    <th className="px-6 py-4 text-[#c9a962] font-[family-name:var(--font-gilda)] uppercase tracking-wider text-sm">{t('resDate')}</th>
                    <th className="px-6 py-4 text-[#c9a962] font-[family-name:var(--font-gilda)] uppercase tracking-wider text-sm">{t('resGuests')}</th>
                    <th className="px-6 py-4 text-[#c9a962] font-[family-name:var(--font-gilda)] uppercase tracking-wider text-sm text-right">{t('resDelete')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold">{res.name}</td>
                      <td className="px-6 py-4 text-white/60">{res.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-[#c9a962] text-xs" />
                          <span>{res.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-[#c9a962]/10 text-[#c9a962] px-3 py-1 rounded-full text-xs font-bold border border-[#c9a962]/20">
                          {res.guests}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={async () => {
                            if (confirm(t('resConfirmDelete'))) {
                              await deleteDoc(doc(db, "reservations", res.id));
                            }
                          }}
                          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-lg transition-all"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {reservations.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-white/20">
                        {t('resEmpty')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'orders' && !selectedTable && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-gilda text-[#c9a962] mb-8 text-center uppercase tracking-widest">{t('selectTable')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
                const tableNum = num.toString();
                const tableOrdersCount = orders.filter(o => o.tableNumber === tableNum && o.status !== 'paid').length;
                const hasCallingWaiter = calls.some(c => c.tableNumber === tableNum && c.status === 'pending');
                return (
                  <button
                    key={num}
                    onClick={() => setSelectedTable(tableNum)}
                    className={`relative bg-[#1a1a1a] border p-8 rounded-2xl group transition-all transform hover:scale-105 ${
                      hasCallingWaiter ? 'border-[#c9a962] ring-2 ring-[#c9a962] animate-pulse' : 'border-white/10 hover:border-[#c9a962]'
                    }`}
                  >
                    <span className="text-4xl font-gilda text-white block mb-2">{num}</span>
                    <span className="text-sm text-white/40 uppercase tracking-widest font-bold">{t('orderTable')}</span>
                    {tableOrdersCount > 0 && (
                      <span className="absolute top-4 right-4 bg-[#c9a962] text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {tableOrdersCount}
                      </span>
                    )}
                    {hasCallingWaiter && (
                      <div className="absolute -top-3 -left-3 bg-[#c9a962] text-black p-3 rounded-full shadow-2xl animate-bounce">
                        <FaBell size={16} />
                      </div>
                    )}
                    {hasCallingWaiter && (
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          const call = calls.find(c => c.tableNumber === tableNum && c.status === 'pending');
                          if (call) {
                            await updateDoc(doc(db, "calls", call.id), { status: 'completed' });
                          }
                        }}
                        className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
                      >
                        {t('clearCall')}
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQrToDisplay(tableNum);
                      }}
                      className="mt-4 w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-[#c9a962] hover:text-black text-white/40 py-2 rounded-lg transition-all text-xs font-bold"
                    >
                      <FaQrcode /> {t('generateQr')}
                    </button>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'orders' && selectedTable && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedTable(null)}
                  className="p-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-2xl transition-all"
                >
                  <FaArrowLeft />
                </button>
                <div>
                  <h2 className="text-2xl font-gilda text-[#c9a962] uppercase tracking-widest">{t('orderTable')} {selectedTable}</h2>
                  <p className="text-white/40 text-sm">{orders.filter(o => o.tableNumber === selectedTable && o.status !== 'paid').length} aktif sipariş</p>
                </div>
              </div>
              
              <div className="bg-[#c9a962]/10 border border-[#c9a962]/30 px-8 py-4 rounded-2xl flex flex-col items-end relative overflow-hidden">
                {/* Waiter Call within Table View */}
                {calls.some(c => c.tableNumber === selectedTable && c.status === 'pending') && (
                  <div className="absolute top-0 left-0 bottom-0 flex items-center px-4 bg-red-500/10 border-r border-red-500/20">
                    <button
                      onClick={async () => {
                        const call = calls.find(c => c.tableNumber === selectedTable && c.status === 'pending');
                        if (call) {
                          await updateDoc(doc(db, "calls", call.id), { status: 'completed' });
                        }
                      }}
                      className="flex items-center gap-2 text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                      <FaBell className="animate-bounce" /> {t('clearCall')}
                    </button>
                  </div>
                )}
                <span className="text-[#c9a962] text-[10px] uppercase tracking-widest font-bold mb-1">{t('tableTotal')}</span>
                <span className="text-2xl font-[family-name:var(--font-gilda)] text-white">
                  ₺{orders
                    .filter(o => o.tableNumber === selectedTable)
                    .reduce((acc, o) => acc + parseFloat(o.total || "0"), 0)
                    .toFixed(2)}
                </span>
              </div>
              
              <button
                onClick={async () => {
                  if (confirm(t('confirmCloseTable'))) {
                    const tableOrders = orders.filter(o => o.tableNumber === selectedTable && o.status !== 'paid');
                    for (const order of tableOrders) {
                      await updateDoc(doc(db, "orders", order.id), { status: 'paid', paidAt: serverTimestamp() });
                    }
                    setSelectedTable(null);
                  }
                }}
                className="bg-[#c9a962] hover:bg-[#b39352] text-black font-bold px-8 py-4 rounded-2xl transition-all shadow-lg flex items-center gap-3 group"
              >
                <FaCheckDouble className="group-hover:scale-110 transition-transform" />
                {t('paymentReceived')}
              </button>
            </div>
            
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {orders
                .filter(order => order.tableNumber === selectedTable && order.status !== 'paid')
                .map((order) => (
                <div key={order.id} className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden shadow-xl flex flex-col">
                  <div className="p-6 border-b border-white/5 flex justify-between items-start">
                    <div>
                      <h4 className="text-[#c9a962] font-gilda text-xl">{order.customerName}</h4>
                      <p className="text-white/40 text-sm mt-1">{t('orderTable')}: <span className="text-white font-bold">{order.tableNumber}</span></p>
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest ${
                          order.status === 'preparing' 
                            ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                            : order.status === 'delivered'
                              ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                              : 'bg-[#c9a962]/20 text-[#c9a962] border border-[#c9a962]/30'
                        }`}>
                          {order.status === 'preparing' ? t('statusPreparing') : order.status === 'delivered' ? t('statusDelivered') : t('statusWaiting')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {order.status !== 'preparing' && order.status !== 'delivered' && (
                        <button
                          onClick={async () => {
                            try {
                              const { updateDoc, doc } = await import("firebase/firestore");
                              await updateDoc(doc(db, "orders", order.id), { status: 'preparing' });
                            } catch (err) {
                              console.error("Error updating order status:", err);
                            }
                          }}
                          className="text-green-500/40 hover:text-green-500 transition-colors"
                          title={t('approveOrder')}
                        >
                          <FaCheck size={18} />
                        </button>
                      )}
                      {order.status !== 'delivered' && (
                        <button
                          onClick={async () => {
                            try {
                              const { updateDoc, doc } = await import("firebase/firestore");
                              await updateDoc(doc(db, "orders", order.id), { status: 'delivered' });
                            } catch (err) {
                              console.error("Error updating order status:", err);
                            }
                          }}
                          className="text-blue-500/40 hover:text-blue-500 transition-colors"
                          title={t('deliverOrder')}
                        >
                          <FaCheckDouble size={18} />
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          if (confirm(t('orderConfirmDelete'))) {
                            const { deleteDoc, doc } = await import("firebase/firestore");
                            await deleteDoc(doc(db, "orders", order.id));
                          }
                        }}
                        className="text-white/20 hover:text-red-500 transition-colors"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 flex-1 space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center text-sm group/item">
                        {item.image && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black/40 border border-white/5">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="text-white/80 truncate text-base">
                              <span className="text-[#c9a962] font-bold">{item.quantity}x</span> {item.name}
                            </span>
                            <div className="flex flex-col items-end">
                              <span className="text-[#c9a962] font-bold">₺{item.price}</span>
                              <span className="text-white/20 text-[10px] italic">birim: ₺{(parseFloat(item.price) / item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                          {item.note && (
                            <div className="mt-2 text-xs bg-[#c9a962]/10 p-2 rounded-lg border border-[#c9a962]/20 text-white/60">
                              <span className="text-[#c9a962] font-bold uppercase text-[9px] block mb-1">{t('customerNotes')}</span>
                              {item.note}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-black/20 border-t border-white/5 flex justify-between items-center">
                     <span className="text-white/40 uppercase tracking-widest text-xs font-bold">{t('orderTotal')}</span>
                     <span className="text-[#c9a962] font-bold text-xl">₺{order.total}</span>
                  </div>
                </div>
              ))}
              {orders.filter(order => order.tableNumber === selectedTable).length === 0 && (
                <div className="col-span-full py-20 text-center text-white/20">
                  {t('orderEmpty')}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center shadow-xl">
                <div className="w-16 h-16 bg-[#c9a962]/20 rounded-2xl flex items-center justify-center mb-6">
                  <FaChartLine className="text-[#c9a962] text-2xl" />
                </div>
                <span className="text-white/40 uppercase tracking-widest text-xs font-bold mb-2">{t('dailyRevenue')}</span>
                <span className="text-4xl font-gilda text-white">₺{dailyRevenue.toFixed(2)}</span>
                <span className="text-white/20 text-[10px] mt-2 italic font-barlow">{dailyOrders.length} {t('orderItems')}</span>
              </div>
              
              <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center shadow-xl">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <FaCalendarAlt className="text-blue-500 text-2xl" />
                </div>
                <span className="text-white/40 uppercase tracking-widest text-xs font-bold mb-2">{t('monthlyRevenue')}</span>
                <span className="text-4xl font-gilda text-white">₺{monthlyRevenue.toFixed(2)}</span>
                <span className="text-white/20 text-[10px] mt-2 italic font-barlow">{monthlyOrders.length} {t('orderItems')}</span>
              </div>

              <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center shadow-xl">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <FaSave className="text-green-500 text-2xl" />
                </div>
                <span className="text-white/40 uppercase tracking-widest text-xs font-bold mb-2">{t('totalRevenue')}</span>
                <span className="text-4xl font-gilda text-white">₺{totalRevenue.toFixed(2)}</span>
                <span className="text-white/20 text-[10px] mt-2 italic font-barlow">{paidOrders.length} {t('totalOrdersCount')}</span>
              </div>
            </div>

            {/* Average Rating Card */}
            <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-3xl flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-500 text-3xl">
                  ★
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">{t('averageRating')}</p>
                  <h3 className="text-4xl font-gilda text-white">{avgRating} / 5</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-sm italic">{reviews.length} {t('totalReviews')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Best Sellers */}
              <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                  <FaCrown className="text-[#c9a962]" />
                  <h3 className="text-xl font-gilda text-[#c9a962] uppercase tracking-widest">{t('bestSellers')}</h3>
                </div>
                <div className="p-6 space-y-4">
                  {bestSellers.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 flex items-center justify-center bg-black rounded-lg text-[#c9a962] font-bold text-xs ring-1 ring-[#c9a962]/30">{idx + 1}</span>
                        <div>
                          <p className="font-bold text-white group-hover:text-[#c9a962] transition-colors">{it.name}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-tight">{it.count} {t('itemsLabel')}</p>
                        </div>
                      </div>
                      <span className="text-[#c9a962] font-gilda text-lg">₺{it.rev.toFixed(0)}</span>
                    </div>
                  ))}
                  {bestSellers.length === 0 && <p className="text-center py-10 text-white/20">{t('noPaidOrders')}</p>}
                </div>
              </div>

              {/* Recent History */}
              <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                  <FaHistory className="text-[#c9a962]" />
                  <h3 className="text-xl font-gilda text-[#c9a962] uppercase tracking-widest">{t('recentPaidOrders')}</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {paidOrders.slice(0, 5).map((o, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0">
                        <div>
                          <p className="font-bold text-white/80">{o.customerName}</p>
                          <p className="text-[10px] text-white/40 uppercase">Masa {o.tableNumber} • {o.paidAt?.toDate().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) || '...'}</p>
                        </div>
                        <span className="text-[#c9a962] font-bold">₺{o.total}</span>
                      </div>
                    ))}
                    {paidOrders.length === 0 && <p className="text-center py-10 text-white/20">{t('noPaidOrders')}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 overflow-hidden shadow-2xl mt-8">
              <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <FaStar className="text-yellow-500" />
                <h3 className="text-xl font-gilda text-[#c9a962] uppercase tracking-widest">{t('review')}</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviews.slice(0, 6).map((r) => (
                    <div key={r.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex text-yellow-500 text-xs">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i}>{i < r.rating ? '★' : '☆'}</span>
                            ))}
                          </div>
                          <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">Masa {r.tableName}</span>
                        </div>
                        <p className="text-sm italic text-white/80 line-clamp-3">"{r.text}"</p>
                      </div>
                      <p className="text-[9px] text-white/20 mt-4 border-t border-white/5 pt-2">
                        {r.createdAt?.toDate().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                       <p className="text-white/20 uppercase text-xs tracking-widest">{t('noData')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {((activeTab as string) !== 'site') && ((activeTab as string) !== 'reservations') && ((activeTab as string) !== 'stats') && (
          <section key={activeTab} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-[#c9a962]/20 transition-all group shadow-lg">
                <div className="relative h-48 w-full bg-black">
                  <img src={item.image} alt={item.imageAlt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.category === 'drink' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-[#c9a962]/20 text-[#c9a962] border border-[#c9a962]/30'}`}>
                      {item.category === 'drink' ? t('drink') : t('food')}
                    </span>
                    {item.stock !== undefined && item.stock !== null && (
                      <span className={`ml-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.stock === 0 ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-green-500/20 text-green-500 border border-green-500/30'}`}>
                        {item.stock === 0 ? t('outOfStock') : `${t('stock')}: ${item.stock}`}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <span className="text-2xl font-[family-name:var(--font-gilda)] text-[#c9a962]">{item.price}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-[family-name:var(--font-gilda)] mb-2 group-hover:text-[#c9a962] transition-colors">{item.name}</h3>
                  <p className="text-white/60 text-sm mb-6 line-clamp-2 h-10">{item.description}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white py-2 rounded-lg transition-all"
                    >
                      <FaEdit size={14} /> {t('edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-12 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-2 rounded-lg transition-all"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
        {activeTab !== 'site' && activeTab !== 'reservations' && filteredItems.length === 0 && (
          <div className="text-center py-20 text-white/20">
            <p className="text-xl">{t('noItems')}</p>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSuccess(false)} />
          <div className="relative bg-[#1a1a1a] border border-[#c9a962]/50 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#c9a962]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSave className="text-[#c9a962] text-3xl" />
            </div>
            <h3 className="text-2xl font-[family-name:var(--font-gilda)] text-white mb-2">{t('successTitle')}</h3>
            <p className="text-white/60 mb-8">{successMessage}</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-[#c9a962] hover:bg-[#b39352] text-black font-bold py-3 rounded-full transition-all"
            >
              {t('ok')}
            </button>
          </div>
        </div>
      )}

      {/* QR Generation Modal */}
      {qrToDisplay && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 print:p-0 print:static print:block animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md print:hidden" onClick={() => setQrToDisplay(null)} />
          <div className="relative bg-[#1a1a1a] border border-white/10 p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center print:border-none print:shadow-none print:bg-white print:text-black print:max-w-none print:w-full print:h-full print:flex print:flex-col print:items-center print:justify-center">
            <h2 className="text-2xl font-gilda text-[#c9a962] mb-2 print:text-black print:text-4xl uppercase tracking-widest">{t('qrTitle')}</h2>
            <p className="text-white/40 mb-8 text-sm print:text-black print:text-xl print:mb-12">{t('qrForTable').replace('{num}', qrToDisplay)}</p>
            
            <div className="bg-white p-6 rounded-2xl inline-block mb-8 print:p-0 print:mb-12">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`https://${window.location.host}/tr/menu?table=${qrToDisplay}`)}`} 
                alt="QR Code"
                className="w-48 h-48 md:w-64 md:h-64 print:w-[400px] print:h-[400px]"
              />
            </div>

            <div className="flex gap-4 print:hidden">
              <button
                onClick={() => setQrToDisplay(null)}
                className="flex-1 px-6 py-4 rounded-xl border border-white/10 text-white/40 hover:text-white transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => window.print()}
                className="flex-[2] flex items-center justify-center gap-2 bg-[#c9a962] hover:bg-[#b39352] text-black font-bold py-4 rounded-xl transition-all"
              >
                <FaPrint /> {t('printQr')}
              </button>
            </div>
            
            <div className="hidden print:block mt-8 text-black font-gilda text-5xl">
              USTA CADDE LEFKOŞA
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\:block, .print\:block * {
            visibility: visible;
          }
          .print\:block {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: white !important;
          }
          .print\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
