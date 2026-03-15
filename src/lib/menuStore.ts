
import { MenuItem } from './api/types';

const STORAGE_KEY = 'restaurant_menu_items';

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: "meze-tabagi",
    name: "Usta Cadde Özel Meze Tabağı",
    description: "Günlük hazırlanan taze meze çeşitleri: Humus, Mutabbel, Atom ve Köpoğlu.",
    price: "₺180",
    image: "https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Meze tabağı",
    category: 'food'
  },
  {
    id: "kuzu-sis",
    name: "Kuzu Şiş",
    description: "Özel marine edilmiş yumuşak kuzu eti, közlenmiş biber ve pilav ile.",
    price: "₺450",
    image: "https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Kuzu Şiş",
    category: 'food'
  },
  {
    id: "izgara-kofte",
    name: "Izgara Köfte",
    description: "Usta Cadde usulü baharatlı ızgara köfte, çıtır patates ve özel sosuyla.",
    price: "₺350",
    image: "https://images.pexels.com/photos/3120807/pexels-photo-3120807.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Izgara Köfte",
    category: 'food'
  },
  {
    id: "findik-lahmacun",
    name: "Fındık Lahmacun",
    description: "Taş fırında çıtır fındık lahmacun (4 adet).",
    price: "₺120",
    image: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Fındık Lahmacun",
    category: 'food'
  },
  {
    id: "tavuk-sarma",
    name: "Tavuk Sarma",
    description: "Özel soslu tavuk sarma, Akdeniz yeşillikleri ve garnitür ile.",
    price: "₺320",
    image: "https://images.pexels.com/photos/54332/pexels-photo-54332.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Tavuk Sarma",
    category: 'food'
  },
  {
    id: "maza-salata",
    name: "Usta Cadde Mevsim Salata",
    description: "Taze mevsim yeşillikleri, nar ekşisi ve sızma zeytinyağı dokunuşuyla.",
    price: "₺150",
    image: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Maza Salata",
    category: 'food'
  },
  {
    id: "deniz-borulcesi",
    name: "Deniz Börülcesi",
    description: "Sarımsaklı ve zeytinyağlı taze deniz börülcesi mezesi.",
    price: "₺140",
    image: "https://images.pexels.com/photos/12301140/pexels-photo-12301140.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Deniz Börülcesi",
    category: 'food'
  },
  {
    id: "atom-meze",
    name: "Atom",
    description: "Süzme yoğurt, acı Arnavut biberi ve kızgın tereyağı dokunuşuyla.",
    price: "₺130",
    image: "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Atom meze",
    category: 'food'
  },
  {
    id: "coca-cola",
    name: "Coca-Cola",
    description: "Soğuk ve ferahlatıcı klasik lezzet.",
    price: "₺45",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Coca Cola",
    category: 'drink'
  },
  {
    id: "fanta",
    name: "Fanta",
    description: "Portakal aromalı gazlı içecek.",
    price: "₺45",
    image: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Fanta",
    category: 'drink'
  },
  {
    id: "sprite",
    name: "Sprite",
    description: "Limon ve misket limonu aromalı ferahlatıcı gazlı içecek.",
    price: "₺45",
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Sprite",
    category: 'drink'
  },
  {
    id: "ayran",
    name: "Ayran",
    description: "Tam yağlı yoğurttan geleneksel buz gibi ayran.",
    price: "₺35",
    image: "https://images.pexels.com/photos/248421/pexels-photo-248421.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Ayran",
    category: 'drink'
  },
  {
    id: "salgam",
    name: "Şalgam Suyu",
    description: "Adana usulü acılı veya acısız şalgam suyu.",
    price: "₺40",
    image: "https://images.pexels.com/photos/2363345/pexels-photo-2363345.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Şalgam Suyu",
    category: 'drink'
  },
  {
    id: "limonata",
    name: "Ev Yapımı Limonata",
    description: "Taze sıkılmış limon ve nane yaprakları ile.",
    price: "₺55",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Limonata",
    category: 'drink'
  },
  {
    id: "portakal-suyu",
    name: "Taze Portakal Suyu",
    description: "Günlük sıkılmış %100 doğal portakal suyu.",
    price: "₺65",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Portakal Suyu",
    category: 'drink'
  },
  {
    id: "su",
    name: "Kaynak Suyu",
    description: "Doğal mineralli cam şişe su (330ml).",
    price: "₺25",
    image: "https://images.pexels.com/photos/4040645/pexels-photo-4040645.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Su",
    category: 'drink'
  },
  {
    id: "turk-kahvesi",
    name: "Türk Kahvesi",
    description: "Közde pişmiş, lokum eşliğinde servis edilir.",
    price: "₺50",
    image: "https://images.pexels.com/photos/2638026/pexels-photo-2638026.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Türk Kahvesi",
    category: 'drink'
  },
  {
    id: "cay",
    name: "Demleme Çay",
    description: "Taze demlenmiş Rize çayı.",
    price: "₺20",
    image: "https://images.pexels.com/photos/2446342/pexels-photo-2446342.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Çay",
    category: 'drink'
  }
];

export const getMenuItems = (): MenuItem[] => {
  if (typeof window === 'undefined') return DEFAULT_MENU_ITEMS;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with defaults if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MENU_ITEMS));
    return DEFAULT_MENU_ITEMS;
  }
  
  try {
    const items = JSON.parse(stored);
    
    // Migration: Ensure category exists for all items
    let migrated = false;
    const migratedItems = items.map((item: any) => {
      if (!item.category) {
        migrated = true;
        return { ...item, category: 'food' };
      }
      return item;
    });

    if (migrated) {
      saveMenuItems(migratedItems);
    }

    return migratedItems;
  } catch (e) {
    console.error('Failed to parse menu items from localStorage', e);
    return DEFAULT_MENU_ITEMS;
  }
};

export const saveMenuItems = (items: MenuItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
  const items = getMenuItems();
  const newItem = { ...item, id: Date.now().toString() };
  items.push(newItem);
  saveMenuItems(items);
  return newItem;
};

export const updateMenuItem = (id: string, updatedItem: Partial<MenuItem>) => {
  const items = getMenuItems();
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updatedItem };
    saveMenuItems(items);
  }
};

export const deleteMenuItem = (id: string) => {
  const items = getMenuItems();
  const filtered = items.filter(item => item.id !== id);
  saveMenuItems(filtered);
};

export const resetMenu = () => {
  if (typeof window === 'undefined') return DEFAULT_MENU_ITEMS;
  localStorage.removeItem(STORAGE_KEY);
  return getMenuItems();
};
