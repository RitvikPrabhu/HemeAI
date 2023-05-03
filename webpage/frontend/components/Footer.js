import React from "react";
import styles from "@/styles/Footer.module.css";
import { useRouter } from "next/router";

// All code in this file was written by Amrita Ballurkar
// Creates the Footer with our team number and names
function Footer() {
  const router = useRouter();
  return (
    <div className={styles.main}>
      Team 3: Ritvik Prabhu, Amrita Ballurkar, Bhargav Iyer
    </div>
  );
}

export default Footer;
