import { create } from "zustand";
import type { Route } from "../types";

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  isCreateRouteModalOpen: boolean;
  openCreateRouteModal: () => void;
  closeCreateRouteModal: () => void;

  isRouteDetailsModalOpen: boolean;
  selectedRoute: Route | null;
  openRouteDetailsModal: (route: Route) => void;
  closeRouteDetailsModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  isCreateRouteModalOpen: false,
  openCreateRouteModal: () => set({ isCreateRouteModalOpen: true }),
  closeCreateRouteModal: () => set({ isCreateRouteModalOpen: false }),

  isRouteDetailsModalOpen: false,
  selectedRoute: null,
  openRouteDetailsModal: (route) =>
    set({ isRouteDetailsModalOpen: true, selectedRoute: route }),
  closeRouteDetailsModal: () =>
    set({ isRouteDetailsModalOpen: false, selectedRoute: null }),
}));
