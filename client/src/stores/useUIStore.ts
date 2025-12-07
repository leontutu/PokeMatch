import { create } from "zustand";

type UIStoreState = {
  isWipingIn: boolean;
  isWipingOut: boolean;
  setIsWipingIn: (status: boolean) => void;
  setIsWipingOut: (status: boolean) => void;
};

export const useUIStore = create<UIStoreState>((set) => ({
  isWipingIn: false,
  isWipingOut: false,

  setIsWipingIn: (status) => set({ isWipingIn: status }),
  setIsWipingOut: (status) => set({ isWipingOut: status }),
}));
