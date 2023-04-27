import styles from "@/styles/About.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
export default function About() {
  return (
    <div className={styles.background}>
      <Header />
      <div className={styles.main}>
        <h1 className={styles.title}> About HemeAI </h1>
        <h2 className={styles.subtitle}> Introduction: </h2>
        <h2 className={styles.text}>
          Complete blood counts (CBCs) are one of the most commonly ordered lab
          tests. They are critical in narrowing down possible diagnoses. When
          the results of a CBC are abnormal, a peripheral blood smear is usually
          conducted. Peripheral blood smears are manually conducted and are
          subject to human error. In addition to this, it can take several days
          to receive the results and even longer in rural and developing areas.
          In order to find an alternative, in this project we aim to:
        </h2>
        <ul className={styles.text}>
          <li>Automate a Complete Blood Count</li>
        </ul>
        <ul className={styles.text}>
          <li>Automate a peripheral blood smear</li>
        </ul>
        <ul className={styles.text}>
          <li>Make a preliminary diagnosis based on the results</li>
        </ul>

        <h2 className={styles.subtitle}>
          Results:
        </h2>

        <img src="https://github.com/RitvikPrabhu/HemeAI/blob/master/Milestone1_AutoCBC/runs/detect/train15/confusion_matrix.png?raw=true" alt="Blood Count" width="200" height="300" className={styles.center}></img>
        <img src="https://github.com/RitvikPrabhu/HemeAI/blob/master/Milestone2_DiseaseDetect/YOLOv8/runs/detect/train3/val/confusion_matrix.png?raw=true" alt="Abnormal WBC and RBC" width="200" height="300" className={styles.center}></img>

        <h2 className={styles.text}>
          The first image is a confusion matrix with WBC, RBC, and Platelets.
          The F1 score gotten from the 1st model was 0.85.
          The second image is a confusion matrix for specific WBCs and abnormal RBCs.
          The F1 score gotten from the 2nd model was 0.75.
        </h2>

        <h2 className={styles.subtitle}>
          {" "}
          Final Paper: <a href="https://github.com/RitvikPrabhu/HemeAI/blob/master/webpage/frontend/pages/Final_Paper.pdf?raw=true" attributes-list download>Final Paper Link</a>
        </h2>
        <h2 className={styles.subtitle}>
          {" "}
          Code: <a href="https://github.com/RitvikPrabhu/HemeAI">GitHub Link</a>
        </h2>
        <h2 className={styles.subtitle}>
          {" "}
          Final Presentation: <a href="https://github.com/RitvikPrabhu/HemeAI/blob/master/webpage/frontend/pages/Final%20Presentation.pdf?raw=true" attributes-list download>Final Presentation Link</a>
        </h2>
      </div>
      <Footer />
    </div>
  );
}
