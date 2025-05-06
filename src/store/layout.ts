import { create } from "zustand";

export const useMobileMenuStore = create((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open: boolean) => set({ mobileMenuOpen: open }),
}));
