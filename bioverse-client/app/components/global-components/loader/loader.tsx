import styles from "./loader.module.css";

export default function Loader() {
    const renderLoader = () => {
        let loader = [];

        for(let i=0; i<28; i++) {
            const style = { "--i": i } as React.CSSProperties;
            loader.push(<span style={style}></span>)
        }
        return loader;
    }

    return (
        <div className={styles["loader"]}>
            { renderLoader() }
        </div>
    );
}
