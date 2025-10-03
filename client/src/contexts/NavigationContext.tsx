import { createContext, useContext, ReactNode } from "react";
import { useNavigate } from "../hooks/useNavigate.js";

/**
 * @file This file contains the NavigationProvider and its related context and hook.
 *
 * It manages global navigation-related state such as current page and transition handlers.
 */

type NavigationContextType = ReturnType<typeof useNavigate>;

const NavigationContext = createContext<NavigationContextType | null>(null);

export const useNavigationContext = () => {
    const context = useContext(NavigationContext);
    if (!context) throw new Error("useNavigationContext must be used within a NavigationProvider");
    return context;
};

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
    const { currentPage, handleNavigate } = useNavigate();
    const value = { currentPage, handleNavigate };

    return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};
