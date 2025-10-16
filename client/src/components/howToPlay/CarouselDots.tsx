import styles from "./CarouselDots.module.scss";

type CarouselDotsProps = {
    count: number;
    selectedIndex: number;
    onDotClick: (index: number) => void;
};

export default function CarouselDots({ count, selectedIndex, onDotClick }: CarouselDotsProps) {
    const dots = Array.from(Array(count).keys());

    return (
        <div className={styles.dotsContainer}>
            {dots.map((index) => (
                <button
                    key={index}
                    onClick={() => onDotClick(index)}
                    className={`${styles.dot} ${index === selectedIndex ? styles.dotSelected : ""}`}
                />
            ))}
        </div>
    );
}
