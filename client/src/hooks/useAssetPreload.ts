import chatBubbleImg from "../assets/graphics/game/chat-bubble.png";
import pokeballImg from "../assets/graphics/game/pokeball.png";
import round1Img from "../assets/graphics/game/round-1.png";
import round2Img from "../assets/graphics/game/round-2.png";
import round3Img from "../assets/graphics/game/round-3.png";
import logoHomeImg from "../assets/graphics/logo/logo-home.png";

import pokeballWiggleAudio from "../assets/audio/sounds/pokeball-wiggle.mp3";
import pokeballPoofAudio from "../assets/audio/sounds/pokeball-poof.mp3";
import confirmAudio from "../assets/audio/sounds/confirm.mp3";
import selectAudio from "../assets/audio/sounds/select.mp3";
import pageTurn1Audio from "../assets/audio/sounds/page-turn1.mp3";
import pageTurn2Audio from "../assets/audio/sounds/page-turn2.mp3";
import normalEffectiveAudio from "../assets/audio/sounds/normal-effective.mp3";
import veryEffectiveAudio from "../assets/audio/sounds/very-effective.mp3";

import { useState, useEffect } from "react";

/**
 * Asset preloader, warms images and audio into the browser cache.
 * This should be called AFTER the menu logo has rendered, so that the menu
 * renders fine and all other assets can be preloaded in the background.
 * note: The assetsLoaded state variable is not currently used, but could be useful
 * in the future
 */

const preloadImage = (src: string) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = img.onabort = () => reject(src);
        img.src = src;
    });
};

const preloadAudio = (src: string) => {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.oncanplaythrough = () => resolve(src);
        audio.onerror = () => reject(src);
        audio.src = src;
    });
};

const images = [chatBubbleImg, pokeballImg, round1Img, round2Img, round3Img, logoHomeImg];

const sounds = [
    pokeballWiggleAudio,
    pokeballPoofAudio,
    confirmAudio,
    selectAudio,
    pageTurn1Audio,
    pageTurn2Audio,
    normalEffectiveAudio,
    veryEffectiveAudio,
];

/**
 * Custom hook to preload assets (images and audio).
 * @param enabled boolean to enable the preload
 * @returns assetsLoaded state variable indicating if all assets are loaded.
 */
export const useAssetPreload = (enabled: boolean) => {
    const [assetsLoaded, setAssetsLoaded] = useState(false);

    useEffect(() => {
        if (!enabled) return;
        let isCancelled = false;
        console.log("Preloading assets...");
        const preloadAssets = async () => {
            const imagePromises = images.map((src) => preloadImage(src));
            const audioPromises = sounds.map((src) => preloadAudio(src));

            try {
                await Promise.all([...imagePromises, ...audioPromises]);
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
