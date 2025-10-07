import { instructionData } from "../../constants/instructionData";
import useEmblaCarousel from "embla-carousel-react";
import InstructionItem from "./InstructionItem";
import styles from "./InstructionPage.module.css";
import { useState, useEffect, useCallback } from "react";
import CarouselDots from "./CarouselDots";
import { Pages } from "../../constants/constants";
import { useNavigationContext } from "../../contexts/NavigationContext";

export default function InstructionPage() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { handleNavigate } = useNavigationContext();

    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi, setSelectedIndex]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    const handleBackToHomeClick = () => {
        handleNavigate(Pages.HOME, true);
    };

    return (
        <div className={styles.outerContainer}>
            <div className={styles.embla} ref={emblaRef}>
                <div className={styles.embla__container}>
                    {instructionData.map((data, index) => (
                        <div className={styles.embla__slide} key={index}>
                            <InstructionItem
                                instructionHeader={data.instructionHeader}
                                instructionImage={data.instructionImage}
                                instructions={data.instructions}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.footer}>
                <CarouselDots count={3} selectedIndex={selectedIndex} onDotClick={scrollTo} />
                <button
                    className={`${styles.backButton} ${selectedIndex === 2 ? styles.glow : ""}`}
                    onClick={handleBackToHomeClick}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
