import chatBubbleImg from "../assets/graphics/game/chat-bubble.png";
import pokeballImg from "../assets/graphics/game/pokeball.png";
import round1Img from "../assets/graphics/game/round-1.png";
import round2Img from "../assets/graphics/game/round-2.png";
import round3Img from "../assets/graphics/game/round-3.png";

import { useState, useEffect } from "react";

/**
 * Asset preloader, warms images into the browser cache.
 * This should be called AFTER the menu logo has rendered, so that the menu
 * renders fine and all other assets can be preloaded in the background.
 * note: The assetsLoaded state variable is not currently used, but could be useful
 * in the future
 * @param enabled boolean to enable the preload
 * @returns assetsLoaded state variable indicating if all assets are loaded.
 */
export const useAssetPreload = (enabled: boolean) => {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    if (!enabled || hasPreloadBeenTriggered) return;
    hasPreloadBeenTriggered = true;
    let isCancelled = false;
    const preloadAssets = async () => {
      const imagePromises = images.map((src) => preloadImage(src));

      try {
        await Promise.all([...imagePromises]);
        if (!isCancelled) {
          setAssetsLoaded(true);
        }
      } catch (error) {
        console.error("Failed to preload assets", error);
      }
    };

    preloadAssets();

    return () => {
      isCancelled = true;
    };
  }, [enabled]);

  return assetsLoaded;
};

const images = [chatBubbleImg, pokeballImg, round1Img, round2Img, round3Img];

let hasPreloadBeenTriggered = false;

const preloadImage = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = img.onabort = () => reject(src);
    img.src = src;
  });
};
