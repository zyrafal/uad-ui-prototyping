import React from "react";
import { IconArrowLeft } from "@aragon/ui";
import styles from "./index.module.scss";
type SettingModalMobileProps = {
  onClose: Function;
  text?: string;
  children?: React.ReactNode;
  bgColor?: string;
};

function SettingModalMobile({
  onClose,
  text,
  children,
  bgColor = "#424242",
}: SettingModalMobileProps) {
  return (
    <>
      <div className={styles.content} style={{ background: bgColor }}>
        <div className={styles.nav}>
          <span
            onClick={() => {
              onClose(false);
            }}
          >
            <IconArrowLeft size="large" />
          </span>
          <p>{text}</p>
        </div>
        {children}
      </div>
    </>
  );
}

export default SettingModalMobile;
