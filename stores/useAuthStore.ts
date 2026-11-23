import type { UserDTO } from "@/types/user/user.type";
import { create } from "zustand";
import { combine, persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    combine(
      {
        user: null as UserDTO | null,
        isAuthenticated: false as boolean,
      },
      (set) => ({
        setIsAuthenticated: (status: boolean) =>
          set({ isAuthenticated: status }),
        setUser: (user: UserDTO | null) => set({ user: user }),
      }),
    ),
    {
      name: "auth-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
);

export default useAuthStore;
