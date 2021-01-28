import React from "react";
import styles from "./mobile.module.scss";
type HistoryCardMobileProps = {
  epoch: string;
  price: string;
  redeemable: string;
  dept: string;
  bonded: string;
};

const HistoryCardMobile = ({
  epoch,
  price,
  redeemable,
  dept,
  bonded,
}: HistoryCardMobileProps) => {
  return (
    <div className={styles.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <p className={styles.grey}>Epoch</p>
        <p className={styles.grey}>{epoch}</p>
      </div>
      <div>
        <div className={styles.divideTwo}>
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p className={styles.grey}>Price</p>
              <p>{price}</p>
            </div>
            <div>
              <p className={styles.grey}>Dept</p>
              <p>{dept}</p>
            </div>
          </div>
        </div>

        <div className={styles.divideTwo}>
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p className={styles.grey}>Redeemable</p>
              <p>{redeemable}</p>
            </div>
            <div>
              <p className={styles.grey}>Bonded</p>
              <p>{bonded}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCardMobile;
