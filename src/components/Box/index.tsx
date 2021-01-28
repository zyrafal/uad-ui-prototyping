import React from "react";
import styles from "./index.module.scss";
type BoxProps = {
  bgcolor: string;
  height: string;
  children: React.ReactNode;
};

function Box({ bgcolor, height, children }: BoxProps) {
  return (
    <div
      style={{ background: bgcolor, height: height }}
      className={styles.BoxContainer}
    >
      {children}
    </div>
  );
}
export default Box;
