import React from "react";
import styles from "./index.module.scss";
type ModalBtnProps = {
  height: string;
  bgColor: string;
  clickAction: Function;
  type?: string;
  children: React.ReactNode;
  disabled?: boolean;
};

function ModalBtn({
  height,
  bgColor,
  clickAction,
  type,
  children,
  disabled,
}: ModalBtnProps) {
  return (
    <>
      <div
        className={disabled ? styles.btn_disabled : styles.btn}
        onClick={() => {
          clickAction(type);
        }}
        style={{ height: height, background: bgColor }}
      >
        {children}
      </div>
    </>
  );
}

export default ModalBtn;
