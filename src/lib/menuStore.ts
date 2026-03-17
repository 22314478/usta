
import { MenuItem } from './api/types';

const STORAGE_KEY = 'restaurant_menu_items';

export const HAMUR_EVI_MENU: MenuItem[] = [
  {
    id: "nohutlu-pilav-tavuk",
    name: "Nohutlu Pilav Üstü Tavuk Menü",
    description: "Taze nohutlu pilav üstü tavuk eti ve Ayran (30 cl.)",
    price: "₺350",
    image: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Nohutlu Pilav Üstü Tavuk",
    category: 'food'
  },
  {
    id: "hellimli-borek",
    name: "Hellimli Börek",
    description: "Taze Kıbrıs hellimi ile hazırlanan el açması börek.",
    price: "₺300",
    image: "https://images.pexels.com/photos/12301140/pexels-photo-12301140.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Hellimli Börek",
    category: 'food'
  },
  {
    id: "kiymali-borek",
    name: "Kıymalı Börek",
    description: "Özel baharatlı kıyma harcı ile hazırlanan el açması börek.",
    price: "₺350",
    image: "https://images.pexels.com/photos/12301140/pexels-photo-12301140.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Kıymalı Börek",
    category: 'food'
  },
  {
    id: "hellimli-gozleme",
    name: "Hellimli Gözleme",
    description: "Sac üzerinde pişen, bol hellimli el açması gözleme.",
    price: "₺300",
    image: "https://images.pexels.com/photos/13444454/pexels-photo-13444454.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Hellimli Gözleme",
    category: 'food'
  },
  {
    id: "patatesli-gozleme",
    name: "Patatesli Gözleme",
    description: "Sac üzerinde pişen, baharatlı patatesli el açması gözleme.",
    price: "₺300",
    image: "https://images.pexels.com/photos/10491024/pexels-photo-10491024.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Patatesli Gözleme",
    category: 'food'
  },
  {
    id: "kiymali-gozleme",
    name: "Kıymalı Gözleme",
    description: "Sac üzerinde pişen, özel kıyma harçlı el açması gözleme.",
    price: "₺350",
    image: "https://images.pexels.com/photos/13444454/pexels-photo-13444454.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Kıymalı Gözleme",
    category: 'food'
  },
  {
    id: "karisik-gozleme",
    name: "Karışık Gözleme",
    description: "Hellim, kıyma ve patatesin muhteşem buluşması.",
    price: "₺400",
    image: "https://images.pexels.com/photos/13444454/pexels-photo-13444454.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Karışık Gözleme",
    category: 'food'
  },
  {
    id: "el-mantisi",
    name: "El Mantısı",
    description: "Ev yapımı taze el mantısı, yoğurt ve özel sos ile.",
    price: "₺350",
    image: "https://images.pexels.com/photos/10360696/pexels-photo-10360696.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "El Mantısı",
    category: 'food'
  },
  {
    id: "citir-manti",
    name: "Çıtır Mantı",
    description: "Kızarmış çıtır mantı taneleri, yoğurt ve sos eşliğinde.",
    price: "₺350",
    image: "https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Çıtır Mantı",
    category: 'food'
  },
  {
    id: "bulgur-koftesi",
    name: "Bulgur Köftesi",
    description: "Kıbrıs usulü lezzetli bulgur köftesi (adet).",
    price: "₺100",
    image: "https://images.pexels.com/photos/12737661/pexels-photo-12737661.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Bulgur Köftesi",
    category: 'food'
  },
  {
    id: "bidda-chicken-wrap",
    name: "Bidda Chicken Wrap",
    description: "Izgara tavuk, hellim, patates ve özel soslu dürüm.",
    price: "₺350",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Bidda Chicken",
    category: 'food'
  },
  {
    id: "badades",
    name: "Kıbrıs Badades",
    description: "Yerli Kıbrıs patatesinden taze kızartma.",
    price: "₺200",
    image: "https://images.pexels.com/photos/1893557/pexels-photo-1893557.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Patates",
    category: 'food'
  },
  {
    id: "hellimli-salata",
    name: "Izgara Hellimli Salata",
    description: "Yeşillik yatağında ızgara hellim dilimleri.",
    price: "₺300",
    image: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Hellimli Salata",
    category: 'food'
  },
  {
    id: "katmer",
    name: "Ballı Kaymaklı Katmer",
    description: "Çıtır çıtır el yapımı ballı kaymaklı katmer.",
    price: "₺250",
    image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Katmer",
    category: 'food'
  },
  {
    id: "coca-cola",
    name: "Coca-Cola",
    description: "Kutu içecek (33 cl.)",
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
    id: "cay",
    name: "Demleme Çay",
    description: "Taze demlenmiş Rize çayı.",
    price: "₺30",
    image: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Çay",
    category: 'drink'
  },
  {
    id: "turk-kahvesi",
    name: "Türk Kahvesi",
    description: "Közde pişmiş, lokum ile servis edilir.",
    price: "₺80",
    image: "https://images.pexels.com/photos/1516641/pexels-photo-1516641.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Türk Kahvesi",
    category: 'drink'
  },
  {
    id: "su",
    name: "Su",
    description: "Doğal kaynak suyu (50 cl.)",
    price: "₺30",
    image: "https://images.pexels.com/photos/4040645/pexels-photo-4040645.jpeg?auto=compress&cs=tinysrgb&w=1000",
    imageAlt: "Su",
    category: 'drink'
  }
];

const DEFAULT_MENU_ITEMS: MenuItem[] = HAMUR_EVI_MENU;

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
