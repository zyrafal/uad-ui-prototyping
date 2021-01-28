import React from "react";
import { IconArrowLeft } from "@aragon/ui";
import CardTextBlock from "../CardTextBlock";
import RedeemBtn from "../RedeemBtn";
import styles from "./index.module.scss";

type CardDetailProps = {
  epoch: any;
  close: Function;
  redeemBtnAction: Function;
};

function CardDetail({ epoch, close, redeemBtnAction }: CardDetailProps) {
  const style = epoch.bool
    ? { background: "#282828", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }
    : {
        background:
          "linear-gradient(0deg, rgba(230, 4, 25, 0.1), rgba(230, 4, 25, 0.1)), #282828",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      };
  return (
    <div className={styles.CardDetail} style={style}>
      <div className={styles.nav}>
        <span
          onClick={() => {
            close(false);
          }}
        >
          <IconArrowLeft size="large" />
        </span>
        <div style={{ marginTop: "50px" }}>
          <CardTextBlock
            title="Epoch"
            value={epoch.epoch}
            size="40px"
            height="48px"
          />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.bottom}>
          <div className={styles.flexBlock}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <CardTextBlock title="Purchased" value={epoch.coupons} />
              <CardTextBlock title="Balance" value={epoch.balance} />
            </div>
            <CardTextBlock title="Expires" value={epoch.expiration} />
            {/* <CardTextBlock
              title="Redemption penalty"
              value={epoch.penalty}
              prefix="%"
            /> */}
          </div>
          <RedeemBtn
            redeemable={epoch.bool}
            redeemBtnAction={redeemBtnAction}
            epoch={epoch}
          />
        </div>
      </div>
    </div>
  );
}

export default CardDetail;
