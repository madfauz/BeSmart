import React from "react";
import { TfiLinkedin, TfiTwitterAlt, TfiYoutube } from "react-icons/tfi";
import styles from "../styles/footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div>&#169; Copyright 2023 Be Smart</div>
      <div className={styles.icons}>
        <TfiLinkedin />
        <TfiTwitterAlt />
        <TfiYoutube />
      </div>
    </div>
  );
};

export default Footer;
