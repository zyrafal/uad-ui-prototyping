import React from "react";
import styles from "./index.module.scss";
type SettingModalProps = {
  onClose: Function;
  children?: React.ReactNode;
  bgColor?: string;
};

function SettingModal({
  onClose,
  children,
  bgColor = "#424242",
}: SettingModalProps) {
  return (
    <>
      <div
        className={styles.mask}
        onClick={() => {
          onClose(false);
        }}
      ></div>
      <div className={styles.content} style={{ background: bgColor }}>
        {children}
      </div>
    </>
  );
}

export default SettingModal;
