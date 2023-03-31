import styles from "@/styles/Home.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
export default function Home() {
  return (
    <div className={styles.background}>
      <Header />
      <div className={styles.main}>
        <h1 className={styles.title}>HemeAI</h1>
        <h2 className={styles.subtitle}>
          a machine learning approach to hematological analysis
        </h2>
      </div>
      <Footer />
    </div>
  );
}
