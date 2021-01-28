import React from "react";

import styles from "./index.module.scss";

type CardProps = {
  type: string;
  bgColor: string;
};

function Card({ type, bgColor }: CardProps) {
  return (
    <>
      <div className={styles.CardItem} style={{ backgroundColor: bgColor }}>
        <p>{type}</p>
      </div>
    </>
  );
}

export default Card;
