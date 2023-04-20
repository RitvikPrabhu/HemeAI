import styles from "@/styles/About.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
export default function About() {
  return (
    <div className={styles.background}>
      <Header />
      <div className={styles.main}>
        <h1 className={styles.title}>About HemeAI</h1>
        <h2 className={styles.subtitle}>
          Complete blood counts (CBCs) are one of the most commonly ordered lab
          tests. They are critical in narrowing down possible diagnoses. When
          the results of a CBC are abnormal, a peripheral blood smear is usually
          conducted. Peripheral blood smears are manually conducted and are
          subject to human error. In addition to this, it can take several days
          to receive the results and even longer in rural and developing areas.
          In order to find an alternative, in this project we aim to:
        </h2>
        <ul className={styles.subtitle}>
          <li>Automate a Complete Blood Count</li>
        </ul>
        <ul className={styles.subtitle}>
          <li>Automate a peripheral blood smear</li>
        </ul>
        <ul className={styles.subtitle}>
          <li>Make a preliminary diagnosis based on the results</li>
        </ul>

        <h2 className={styles.subtitle}> Final Paper: </h2>
        <h2 className={styles.subtitle}>
          {" "}
          Code: <a href="https://github.com/RitvikPrabhu/HemeAI">GitHub Link</a>
        </h2>
        <h2 className={styles.subtitle}> Final Presentation: </h2>
      </div>
      <Footer />
    </div>
  );
}
