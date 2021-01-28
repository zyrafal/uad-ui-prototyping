import React from "react";

import styles from "./index.module.scss";

type CardProps = {
  number: string;
  title: string;
  content: string;
  bgColor: string;
};

function Card({ number, title, content, bgColor }: CardProps) {
  return (
    <>
      <div className={styles.CardItem} style={{ backgroundColor: bgColor }}>
        <div className={styles.number}>
          <p>{number}</p>
          <div className={styles.title}>
            <p>{title}</p>
          </div>
          <div className={styles.content}>
            <p>{content}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
