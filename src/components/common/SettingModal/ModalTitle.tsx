import React from "react";
import styles from "./index.module.scss";
type ModalTitleProps = {
  children: React.ReactNode;
};

function ModalTitle({ children }: ModalTitleProps) {
  return (
    <>
      <div className={styles.title}>{children}</div>
    </>
  );
}

export default ModalTitle;
