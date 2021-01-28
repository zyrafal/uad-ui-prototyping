import React, { useState, useEffect } from "react";
import Card from "./Card";
import styles from "./index.module.scss";
import { IconClose } from "@aragon/ui";
import UseWindowSize from "../../components/UseWindowSize";

type ContactsProps = { setContacts: Function };

function Contacts({ setContacts }: ContactsProps) {
  const windowSize = UseWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (windowSize < 781) setIsMobile(true);
    else setIsMobile(false);
  }, [windowSize]);
  return (
    <div className={styles.contactsContainer}>
      <span
        style={{
          position: "fixed",
          top: "32px",
          right: "32px",
          zIndex: 20,
          color: "black",
        }}
        onClick={() => {
          setContacts(false);
        }}
      >
        <IconClose size="medium" />
      </span>
      <div
        className={styles.mask}
        onClick={() => {
          if (!isMobile) setContacts(false);
        }}
      ></div>
      <div className={styles.container}>
        <div className={styles.contacts}>
          <p>Social</p>
        </div>
      </div>
      <div className={styles.contactItemContainer}>
        <a
          href="https://github.com/8quad"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Card type="Github" bgColor="rgba(0,0,0,0.1)" />
        </a>

        <a
          href="https://twitter.com/u_8_d"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Card type="Twitter" bgColor="rgba(0,0,0,0.15)" />
        </a>

        <a
          href="https://8quad.medium.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Card type="Medium" bgColor="rgba(0,0,0,0.2)" />
        </a>

        <a
          href="https://t.me/UniversalDollar"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Card type="Telegram" bgColor="rgba(0,0,0,0.25)" />
        </a>

        <a
          href="https://discord.gg/3uTPBqkyvc"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Card type="Discord" bgColor="rgba(0,0,0,0.3)" />
        </a>
      </div>
      <style>{`span:hover{
        color: rgba(0,0,0,0.5) !important;
        cursor: pointer;
      }`}</style>
    </div>
  );
}

export default Contacts;
