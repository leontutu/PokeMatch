import styles from "./TypeCard.module.css";

export default function TypeCard({ typeName }) {
    const typeClass = typeName.toLowerCase();

    const cardClasses = `${styles.typeCard} ${styles[typeClass]}`;
    return <span className={cardClasses}>{typeName}</span>;
}
