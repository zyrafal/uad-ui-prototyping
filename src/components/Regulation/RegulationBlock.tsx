import React from "react";
import styles from "./index.module.scss";
type RegulationBlockProps = {
  height: string;
  bgColor: string;
  children: React.ReactNode;
};

const RegulationBlock = ({
  height,
  bgColor,
  children,
}: RegulationBlockProps) => {
  return (
    <div
      className={styles.blockItem}
      style={{ flex: height, background: bgColor }}
    >
      {children}
    </div>
  );
};

export default RegulationBlock;
