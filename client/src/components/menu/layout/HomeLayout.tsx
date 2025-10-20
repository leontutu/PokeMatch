import styles from "./HomeLayout.module.scss";
import React, { useState } from "react";
import { useAssetPreload } from "../../../hooks/useAssetPreload";
import { UI_TEXT } from "../../../constants/uiText";

type HomeLayoutProps = {
    children: React.ReactNode;
};

const PATH_TO_LOGO = "logo-home.png"; // note: can't be imported due to preloading strategy

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
                src={PATH_TO_LOGO}
                alt={UI_TEXT.ALT_TEXT.LOGO}
                className={styles.logo}
                onLoad={() => setIsLogoLoaded(true)}
            />
            <div className={styles.contentArea}>{children}</div>
        </div>
    );
}
