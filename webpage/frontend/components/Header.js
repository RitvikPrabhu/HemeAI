import React from "react";
import styles from "@/styles/Header.module.css";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

function Header() {
  const router = useRouter();
  return (
    <div className={styles.main}>
      <Button
        variant="text"
        onClick={() => router.push("/")}
        className={styles.button}
        // style={{ color: "white" }}
      >
        Home
      </Button>
      <Button
        variant="text"
        href="#outlined-buttons"
        onClick={() => router.push("/About")}
        className={styles.button}
      >
        About
      </Button>
      <Button
        variant="text"
        href="#outlined-buttons"
        onClick={() => router.push("/AutoCBC")}
        className={styles.button}
      >
        AutoCBC
      </Button>
      <Button
        variant="text"
        href="#outlined-buttons"
        onClick={() => router.push("/DiseaseDetection")}
        className={styles.button}
      >
        Disease Detection
      </Button>
    </div>
  );
}

export default Header;
