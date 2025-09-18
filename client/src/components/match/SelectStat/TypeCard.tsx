import styles from "./TypeCard.module.css";

type TypeCardProps = {
    typeName: string;
};

export default function TypeCard({ typeName }: TypeCardProps) {
    const typeClass = typeName.toLowerCase();

    const cardClasses = `${styles.typeCard} ${styles[typeClass]}`;
    return <span className={cardClasses}>{typeName}</span>;
}
