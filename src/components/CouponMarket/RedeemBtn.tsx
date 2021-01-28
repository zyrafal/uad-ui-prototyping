import React from "react";
import styles from "./btn.module.scss";
type RedeemBtnProps = {
  redeemBtnAction: Function;
  redeemable: boolean;
  epoch: any;
};
function RedeemBtn({ epoch, redeemBtnAction, redeemable }: RedeemBtnProps) {
  return (
    <div className={styles.redeemBtn}>
      {redeemable ? (
        <div className={styles.redeem} onClick={() => redeemBtnAction(epoch)}>
          Redeem
        </div>
      ) : (
        <div className={styles.redeemed}>Redeemed</div>
      )}
      <style>{`
        
      `}</style>
    </div>
  );
}
export default RedeemBtn;
