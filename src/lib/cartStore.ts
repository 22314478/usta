
import { create } from 'zustand';
import { MenuItem } from './api/types';

export interface CartItem extends MenuItem {
  quantity: number;
  note?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNote: (id: string, note: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    const currentItems = get().items;
    const existingItem = currentItems.find((i) => i.id === item.id);

    if (existingItem) {
      set({
        items: currentItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({ items: [...currentItems, { ...item, quantity: 1 }] });
    }
  },
  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) });
  },
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set({
      items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    });
  },
  updateNote: (id, note) => {
    set({
      items: get().items.map((i) => (i.id === id ? { ...i, note } : i)),
    });
  },
  clearCart: () => set({ items: [] }),
}));

export const getCartTotal = (items: CartItem[]) => {
  return items.reduce((acc, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    return acc + price * item.quantity;
  }, 0);
};
