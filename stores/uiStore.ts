import { create } from "zustand";
import { devtools } from "zustand/middleware";

type UiState = {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const uiStore = create<UiState>()(
  devtools(
    (set) => ({
      isSidebarOpen: true,
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    }),
    { name: "UiStore" }
  )
);

export const useUiStore = uiStore;
