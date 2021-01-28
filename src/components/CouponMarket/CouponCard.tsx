import React from "react";
import RedeemBtn from "./RedeemBtn";
import CardTextBlock from "./CardTextBlock";
import styles from "./couponcard.module.scss";
type CouponCardProps = {
  epoch: any;
  redeemBtnAction: Function;
};
function CouponCard({ epoch, redeemBtnAction }: CouponCardProps) {
  return (
    <div className={styles.cardContainer}>
      <div className={epoch.bool ? styles.redeemCard : styles.redeemedCard}>
        <div className={styles.mainCard}>
          <div style={{ padding: "32px" }}>
            <CardTextBlock title="Epoch" value={epoch.epoch} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.flexBlock}>
              <div>
                <CardTextBlock title="Purchased" value={epoch.coupons} />
                <CardTextBlock title="Expires" value={epoch.expiration} />
              </div>
              <div>
                <CardTextBlock title="Balance" value={epoch.balance} />
                {/* <CardTextBlock
                  title="Redemption penalty"
                  value={epoch.penalty}
                  prefix="%"
                /> */}
              </div>
            </div>
            <RedeemBtn
              redeemBtnAction={redeemBtnAction}
              redeemable={epoch.bool}
              epoch={epoch}
            />
          </div>
        </div>
        {epoch.bool && <div className={styles.offserver1}></div>}
        {epoch.bool && <div className={styles.offserver2}></div>}
      </div>
    </div>
  );
}
export default CouponCard;
