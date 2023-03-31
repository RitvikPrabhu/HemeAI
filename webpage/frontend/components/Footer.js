import React from "react";
import styles from "@/styles/Footer.module.css";
import { useRouter } from "next/router";

function Footer() {
  const router = useRouter();
  return (
    <div className={styles.main}>
      Team 3: Ritvik Prabhu, Amrita Ballurkar, Bhargav Iyer
    </div>
  );
}

export default Footer;
