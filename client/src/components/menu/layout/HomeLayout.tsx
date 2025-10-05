import styles from "./HomeLayout.module.css";
import React, { useState } from "react";
import { useAssetPreload } from "../../../hooks/useAssetPreload";

type HomeLayoutProps = {
    children: React.ReactNode;
};

/**
 * Provides a consistent layout for menu pages.
 * Displays a centered logo and a content area for child components.
 * Also kicks off asset preloading after the logo has loaded.
 *
 * @example
 * <HomeLayout>
 *   <MyMenuContent />
 * </HomeLayout>
 */
export default function HomeLayout({ children }: HomeLayoutProps) {
    const [isLogoLoaded, setIsLogoLoaded] = useState(false);

    useAssetPreload(isLogoLoaded);

    return (
        <div className={styles.homeLayout}>
            <img
                src={"logo-home.png"} // note: can't import as it's also referenced in index.html
                alt="PokéMatch logo"
                className={styles.logo}
                onLoad={() => setIsLogoLoaded(true)}
            />
            <div className={styles.contentArea}>{children}</div>
        </div>
    );
}
