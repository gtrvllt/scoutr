import { defineStore } from 'pinia'

export const useCountryListStore = defineStore('countryList', {
  state: () => ({
    isCountryListOpen: false as boolean,
  }),
  actions: {
    setIsCountryListOpen(v: boolean) {
      this.isCountryListOpen = v
    },
  },
})
