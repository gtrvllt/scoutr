import { create } from 'zustand';

interface CountryListState {
    isCountryListOpen: boolean;
    setIsCountryListOpen: (open: boolean) => void;
    toggle: () => void;
}

export const useCountryListStore = create<CountryListState>((set) => ({
    isCountryListOpen: true,
    setIsCountryListOpen: (open) => {
        console.log('isCountryListOpen set to:', open);
        set({ isCountryListOpen: open });
    },
    toggle: () => {
        set((state) => {
            const newState = { isCountryListOpen: !state.isCountryListOpen };
            console.log('isCountryListOpen toggled to:', newState.isCountryListOpen);
            return newState;
        });
    },
}));
