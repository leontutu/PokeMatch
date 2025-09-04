/**
 * HomeLayout Component
 *
 * Provides a consistent layout for menu pages, including a centered logo and a content area.
 * Applies styling from HomeLayout.module.css for alignment, spacing, and background.
 *
 * Props:
 * - children (ReactNode): The content to render inside the layout.
 *
 * Usage:
 * <HomeLayout>
 *   {content}
 * </HomeLayout>
 */

import React from "react";
import styles from "./HomeLayout.module.css";

/**
 * HomeLayout functional component.
 * @param {Object} props
 * @param {ReactNode} props.children - The content to render inside the layout.
 */
function HomeLayout({ children }) {
    return (
        <div className={styles.homeLayout}>
            <img
                src="/logo_erase_bg_cropped.png"
                alt="PokéMatch logo"
                className={styles.logo}
            />
            <div className={styles.contentArea}>{children}</div>
        </div>
    );
}

export default HomeLayout;
