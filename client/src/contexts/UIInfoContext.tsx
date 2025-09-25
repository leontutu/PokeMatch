import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * @file This file contains the UIInfoProvider and its related context and hook.
 *
 * It manages global UI-related state such as page transitions status.
 */

type UIInfoContextType = {
    isWipingIn: boolean;
    isWipingOut: boolean;
    setIsWipingIn: React.Dispatch<React.SetStateAction<boolean>>;
    setIsWipingOut: React.Dispatch<React.SetStateAction<boolean>>;
};

const UIInfoContext = createContext<UIInfoContextType | null>(null);

export const useUIInfoContext = () => {
    const context = useContext(UIInfoContext);
    if (!context) {
        throw new Error("useUIInfoProvider must be used within a TransitionProvider");
    }
    return context;
};

type UIInfoContextProps = {
    children: ReactNode;
};

export const UIInfoProvider = ({ children }: UIInfoContextProps) => {
    const [isWipingIn, setIsWipingIn] = useState(false);
    const [isWipingOut, setIsWipingOut] = useState(false);

    const value = { isWipingIn, isWipingOut, setIsWipingIn, setIsWipingOut };

    return <UIInfoContext.Provider value={value}>{children}</UIInfoContext.Provider>;
};
