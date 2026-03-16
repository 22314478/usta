
import { MenuItem } from './api/types';

const STORAGE_KEY = 'restaurant_menu_items';

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: "nohutlu-pilav-tavuk",
    name: "Nohutlu Pilav Üstü Tavuk Menü",
    description: "Nohutlu Pilav Üstü Tavuk + Ayran (30 cl.)",
    price: "₺350",
    image: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Nohutlu Pilav Üstü Tavuk",
    category: 'food'
  },
  {
    id: "kibris-badades",
    name: "Kıbrıs Badades Patates Kızartması",
    description: "Parmak dilim yerli Kıbrıs patatesi.",
    price: "₺250",
    image: "https://images.pexels.com/photos/1893557/pexels-photo-1893557.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Patates Kızartması",
    category: 'food'
  },
  {
    id: "bulgur-koftesi",
    name: "Bulgur Köftesi",
    description: "2 adet geleneksel usul bulgur köftesi.",
    price: "₺200",
    image: "https://images.pexels.com/photos/10360696/pexels-photo-10360696.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Bulgur Köftesi",
    category: 'food'
  },
  {
    id: "hellimli-borek",
    name: "Hellimli Börek",
    description: "Taze hellim peyniri ile hazırlanan Kıbrıs böreği.",
    price: "₺300",
    image: "https://images.pexels.com/photos/10184407/pexels-photo-10184407.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Hellimli Börek",
    category: 'food'
  },
  {
    id: "hellimli-gozleme",
    name: "Hellimli Gözleme",
    description: "El açması yufka içerisinde taze hellim peyniri.",
    price: "₺300",
    image: "https://images.pexels.com/photos/13444454/pexels-photo-13444454.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Hellimli Gözleme",
    category: 'food'
  },
  {
    id: "patatesli-gozleme",
    name: "Patatesli Gözleme",
    description: "El açması yufka içerisinde baharatlı patates dolgusu.",
    price: "₺300",
    image: "https://images.pexels.com/photos/13444454/pexels-photo-13444454.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Patatesli Gözleme",
    category: 'food'
  },
  {
    id: "citir-manti",
    name: "Çıtır Mantı",
    description: "Özel sos ve yoğurt eşliğinde servis edilen çıtır mantı.",
    price: "₺350",
    image: "https://images.pexels.com/photos/10360696/pexels-photo-10360696.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Çıtır Mantı",
    category: 'food'
  },
  {
    id: "bidda-chicken-wrap",
    name: "Bidda Chicken Wrap",
    description: "Izgara tavuk, hellim peyniri, patates kızartması ve domates ile.",
    price: "₺350",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Chicken Wrap",
    category: 'food'
  },
  {
    id: "kayseri-mantisi",
    name: "Kayseri Mantısı",
    description: "Geleneksel Kayseri usulü el mantısı.",
    price: "₺350",
    image: "https://images.pexels.com/photos/10360696/pexels-photo-10360696.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Kayseri Mantısı",
    category: 'food'
  },
  {
    id: "hellimli-salata",
    name: "Izgara Hellimli Salata",
    description: "Taze Akdeniz yeşillikleri ve ızgara hellim peyniri.",
    price: "₺300",
    image: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Hellimli Salata",
    category: 'food'
  },
  {
    id: "balli-katmer",
    name: "Ballı Kaymaklı Katmer",
    description: "Ballı ve kaymaklı çıtır el yapımı katmer.",
    price: "₺250",
    image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Ballı Kaymaklı Katmer",
    category: 'food'
  },
  {
    id: "coca-cola",
    name: "Coca-Cola",
    description: "Soğuk ve ferahlatıcı (33 cl.)",
    price: "₺70",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Coca-Cola",
    category: 'drink'
  },
  {
    id: "ayran",
    name: "Ayran",
    description: "Büyük boy soğuk ayran (30 cl.)",
    price: "₺60",
    image: "https://images.pexels.com/photos/248421/pexels-photo-248421.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Ayran",
    category: 'drink'
  },
  {
    id: "su",
    name: "Su",
    description: "Kaynak suyu (50 cl.)",
    price: "₺30",
    image: "https://images.pexels.com/photos/4040645/pexels-photo-4040645.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Su",
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
