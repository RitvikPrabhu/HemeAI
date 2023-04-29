import styles from "@/styles/About.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import Image from "next/image";
export default function About() {
  const router = useRouter();
  function handleButtonClick(event) {
    console.log(typeof images);
    
    router.push({
      pathname: "/AutoCBC",
    });
  }
  return (
    <div className={styles.background}>
      <Header />
      <div className={styles.main}>
        <h2 className={styles.subtitle}> Abstract: </h2>
        <h2 className={styles.text}>
          This project's goal is to automate the complete blood count tests (CBC tests) and peripheral blood smears.
          CBCs and peripheral blood smears are used to determine the cellular components of the blood in order to
          detect abnormalities and determine diseases in case there are any.  The process of counting the cells
          and reviewing them after an abnormal CBC can have a long wait time and is prone to human error.
          We are using YOLO (You Only Look Once), a computer vision model, to speed this process up by both
          performing the CBC and classifying each cell.  This project was split into two where one YOLO model
          was used to identify and count white blood cells, red blood cells, and platelets, for the CBC portion
          and another YOLO model detects specific white blood cells and abnormal red blood cells.  The specific
          white blood cells being detected for the second YOLO model were eosinophils, basophils, myelocytes,
          neutrophils, monocytes, lymphocytes, erythroblasts, and abnormal red blood cells.  These different types
          of specific white blood cells and abnormal red blood cells are used to diagnose five diseases which are
          anemia, thrombocytopenia, basophilia, eosinophilia, and leukemia.  The first YOLO model (CBC portion)
          yielded an F1 score of 0.85.  The second YOLO model (specific white blood cells and abnormal red blood
          cells) yielded an F1 score of 0.75.
        </h2>
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

        <img src="https://github.com/RitvikPrabhu/HemeAI/blob/master/Milestone1_AutoCBC/runs/detect/train15/confusion_matrix.png?raw=true" alt="Blood Count" className={styles.center}></img>
        <h2 className={styles.text}>
          The first image is a confusion matrix with WBC, RBC, and Platelets.
          The F1 score gotten from the 1st model was 0.85.
          The first model have true positive values for red blood cells (RBCs),
          white blood cells (WBCs), and platelets being 0.82, 0.98, and 0.84
          respectively.  The RBCs show false positives of 0.98 which indicates that 
          the background is picking up fake red blood cells. This could potentially
          be dealt with by including images other than blood smears.
        </h2>
        <img src="https://github.com/RitvikPrabhu/HemeAI/blob/master/Milestone2_DiseaseDetect/YOLOv8/runs/detect/train3/val/confusion_matrix.png?raw=true" alt="Abnormal WBC and RBC" className={styles.center}></img>
        <h2 className={styles.text}>
          The second image is a confusion matrix for specific WBCs and abnormal RBCs.
          The F1 score gotten from the 2nd model was 0.75.
          The second model have true positive values for abnormal red blood cells
          (abnormal RBCs), band neutrophil, basophil, eosinophil, erythroblast,
          lymphocyte, monocyte, myelocyte, neutrophil, and segmented neutrophil being
          0.48, 0.71, 0.96, 0.96, 0.86, 0.90, 0.97, 0.92, 0.33, and 0.70 respectively.
          From the confusion matrix the segmented neutrophil, neutrophil, and band
          neutrophil were showing some correlation with each other.
        </h2>

        <h2 className={styles.subtitle}>
          {" "}
          Final Paper: <a href="https://github.com/RitvikPrabhu/HemeAI/blob/master/webpage/frontend/public/Final_Paper.pdf?raw=true" attributes-list download><img src="https://github.com/RitvikPrabhu/HemeAI/blob/master/webpage/frontend/public/microsoft-final-paper.jpg?raw=true" alt="Paper Logo" weight="100px" height="100px"></img></a>
        </h2>
        <h2 className={styles.subtitle}>
          {" "}
          Code: <a href="https://github.com/RitvikPrabhu/HemeAI"><img src="https://github.com/RitvikPrabhu/HemeAI/blob/master/webpage/frontend/public/GitHub-Logo.png?raw=true" alt="GitLogo" weight="100px" height="100px"></img></a>
        </h2>
        <h2 className={styles.subtitle}>
          {" "}
          Final Presentation: <a href="https://github.com/RitvikPrabhu/HemeAI/blob/master/webpage/frontend/public/Final%20Presentation.pdf?raw=true" attributes-list download><img src="https://github.com/RitvikPrabhu/HemeAI/blob/master/webpage/frontend/public/microsoft-powerpoint-logo.png?raw=true" alt="PresLogo" weight="100px" height="100px"></img></a>
        </h2>
        <Button
          variant="contained"
          component="label"
          className={styles.button}
          onClick={handleButtonClick}
        >
        Demo
        </Button>
      </div>
      
      <Footer />
    </div>
  );
}
