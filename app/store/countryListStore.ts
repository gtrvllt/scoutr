import { create } from 'zustand';

interface CountryListState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
}

export const useCountryListStore = create<CountryListState>((set) => ({
  isOpen: true,
  setIsOpen: (open) => set({ isOpen: open }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
