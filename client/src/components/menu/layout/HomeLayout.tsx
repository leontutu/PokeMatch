import styles from "./HomeLayout.module.css";
import React from "react";
import logoHome from "../../../assets/graphics/logo/logo-home.png";

type HomeLayoutProps = {
    children: React.ReactNode;
};

/**
 * Provides a consistent layout for menu pages.
 * Displays a centered logo and a content area for child components.
 *
 * @example
 * <HomeLayout>
 *   <MyMenuContent />
 * </HomeLayout>
 */
export default function HomeLayout({ children }: HomeLayoutProps) {
    return (
        <div className={styles.homeLayout}>
            <img src={logoHome} alt="PokéMatch logo" className={styles.logo} />
            <div className={styles.contentArea}>{children}</div>
        </div>
    );
}
