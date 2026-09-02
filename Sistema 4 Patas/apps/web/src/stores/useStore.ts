import { create } from 'zustand';

export type CartItem = {
  type: 'product' | 'service' | 'combo' | 'exam' | 'material';
  id: string | number;
  name: string;
  price?: number;
  value?: number;
  quantity: number;
  vet?: string;
  commission?: number;
  stockDeduct?: number;
};

interface AppState {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  changeQuantity: (index: number, delta: number) => void;
  clearCart: () => void;
  
  clinicalQueue: CartItem[];
  addToClinicalQueue: (items: CartItem[]) => void;
  clearClinicalQueue: () => void;
}

export const useStore = create<AppState>((set) => ({
  cartItems: [],
  addItem: (item) => set((state) => {
    const existingIndex = state.cartItems.findIndex(x => x.id === item.id && x.type === item.type);
    if (existingIndex >= 0) {
      const newCart = [...state.cartItems];
      newCart[existingIndex].quantity += 1;
      return { cartItems: newCart };
    }
    return { cartItems: [...state.cartItems, { ...item, quantity: item.quantity || 1 }] };
  }),
  removeItem: (index) => set((state) => ({
    cartItems: state.cartItems.filter((_, i) => i !== index)
  })),
  changeQuantity: (index, delta) => set((state) => {
    const newCart = [...state.cartItems];
    const newQ = newCart[index].quantity + delta;
    newCart[index].quantity = newQ > 0 ? newQ : 1;
    return { cartItems: newCart };
  }),
  clearCart: () => set({ cartItems: [] }),

  clinicalQueue: [],
  addToClinicalQueue: (items) => set((state) => ({
    clinicalQueue: [...state.clinicalQueue, ...items]
  })),
  clearClinicalQueue: () => set({ clinicalQueue: [] }),
}));
