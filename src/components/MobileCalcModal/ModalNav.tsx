import React from "react";
import { IconArrowLeft } from "@aragon/ui";
import styles from "./index.module.scss";
type ModalNavProps = {
  onClose: Function;
  text: string;
};
function ModalNav({ onClose, text }: ModalNavProps) {
  return (
    <div className={styles.modalNav}>
      <span
        onClick={() => {
          onClose(false);
        }}
      >
        <IconArrowLeft size="large" />
      </span>
      <p style={{ marginTop: "-5px" }}>{text}</p>
    </div>
  );
}
export default ModalNav;
