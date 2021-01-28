import React, { useState } from "react";
// import { getPreference, storePreference } from "../../utils/storage";
import { COUPON_EXPIRATION } from "../../constants/values";
import styles from "./warning.module.scss";
function ModalWarning() {
  // const storedShowWarning = getPreference("showCouponWarning", "1");
  // const [showWarning, setShowWarning] = useState(storedShowWarning === "1");
  const [showWarning, setShowWarning] = useState(true);
  const handleClose = () => {
    // storePreference("showCouponWarning", "0");
    setShowWarning(false);
  };
  return (
    <>
      {showWarning && (
        <>
          <div
            className={styles.mask}
            onClick={() => {
              handleClose();
            }}
          ></div>
          <div className={styles.content}>
            <div className={styles.warning}>
              <p>Warning</p>
              <p>
                Coupons will expire worthless if not redeemed within{" "}
                {COUPON_EXPIRATION} epochs
              </p>
            </div>
            <div className={styles.text}>
              <p>
                By purchasing coupons the buyer incurs significant risk of loss.
                Coupons will only become redeemable during the next supply
                expansion. Each expansionary epoch, a tranche of rewards are
                reserved for coupon redemptions by the DAO. At that time, the
                redemption process is first come, first served. Coupon
                redemption is not guaranteed.
              </p>
            </div>
          </div>
          <div
            className={styles.btn}
            onClick={() => {
              handleClose();
            }}
          >
            <p>Understand</p>
          </div>
        </>
      )}
    </>
  );
}

export default ModalWarning;
