import React from "react";
import { LinkBase } from "@aragon/ui";
import styles from "./index.module.scss";
type TradeCardProps = {
  href: string;
  bgColor: string;
  children: React.ReactNode;
};

function TradeCard({ href, bgColor, children }: TradeCardProps) {
  return (
    <LinkBase
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className={styles.card}
      style={{ background: bgColor }}
    >
      <div className={styles.cardContent}>
        {children}
        <img alt="" src="images/top-right_arrow.svg" />
      </div>
    </LinkBase>
  );
}

export default TradeCard;
