import React from "react";
import styles from "./index.module.scss";
import CardTextBlock from "../CardTextBlock";

type CardProps = {
  epoch: any;
  click: Function;
};

function Card({ epoch, click }: CardProps) {
  return (
    <div className={styles.card} onClick={() => click(epoch)}>
      <div className={epoch.bool ? styles.redeem : styles.redeemed}>
        <div style={{ marginBottom: "48px" }}>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "20px",
              lineHeight: "24px",
              marginBottom: "0px",
            }}
          >
            Epoch
          </p>
          <p
            style={{
              color: "rgba(255,255,255,1)",
              fontSize: "20px",
              lineHeight: "24px",
            }}
          >
            {epoch.epoch}
          </p>
        </div>
        {!epoch.bool && <div className={styles.redeemedMark}>Redeemed</div>}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <CardTextBlock title="Purchased" value={epoch.coupons} />
          <CardTextBlock title="Balance" value={epoch.balance} />
        </div>
        <CardTextBlock title="Expires" value={epoch.expiration} />
        {/* <CardTextBlock title="Redemption penalty" value={epoch.penalty} /> */}
      </div>
    </div>
  );
}

export default Card;
