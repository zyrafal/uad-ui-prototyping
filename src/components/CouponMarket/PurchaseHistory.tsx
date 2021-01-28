import React, { useEffect, useState } from "react";

import {
  getBatchBalanceOfCoupons,
  getBatchCouponsExpiration,
  getCouponEpochs,
} from "../../utils/infura";
import { ESD, ESDS } from "../../constants/tokens";
import { toBaseUnitBN } from "../../utils/number";
import BigNumber from "bignumber.js";
import { redeemCoupons } from "../../utils/web3";
import CouponCard from "./CouponCard";
import styles from "./index.module.scss";
type PurchaseHistoryProps = {
  user: string;
  hideRedeemed: boolean;
  totalRedeemable: BigNumber;
};

function PurchaseHistory({
  user,
  hideRedeemed,
  totalRedeemable,
}: PurchaseHistoryProps) {
  const [epochs, setEpochs] = useState([]);

  //Update User balances
  useEffect(() => {
    if (user === "") return;
    let isCancelled = false;

    async function updateUserInfo() {
      const epochsFromEvents = await getCouponEpochs(ESDS.addr, user);
      const epochNumbers = epochsFromEvents.map((e) => parseInt(e.epoch));
      const balanceOfCoupons = await getBatchBalanceOfCoupons(
        ESDS.addr,
        user,
        epochNumbers
      );
      const couponsExpirations = await getBatchCouponsExpiration(
        ESDS.addr,
        epochNumbers
      );

      const couponEpochs = epochsFromEvents.map((epoch, i) => {
        epoch.balance = new BigNumber(balanceOfCoupons[i]);
        epoch.expiration = couponsExpirations[i];
        return epoch;
      });

      if (!isCancelled) {
        // @ts-ignore
        setEpochs(couponEpochs);
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user, totalRedeemable]);

  const redeemBtnAction = async (cardData) => {
    await redeemCoupons(
      ESDS.addr,
      cardData.epoch,
      cardData.balance.isGreaterThan(
        toBaseUnitBN(totalRedeemable, ESD.decimals)
      )
        ? toBaseUnitBN(totalRedeemable, ESD.decimals)
        : cardData.balance
    );
  };
  return (
    <div className={styles.couponsConatiner}>
      <div className={styles.title}>
        <p>{epochs.length > 0 ? "Coupons" : "You don't have any coupons"}</p>
      </div>
      <div className={styles.content}>
        {epochs.map((epoch, index) => {
          return (
            <CouponCard
              key={index}
              epoch={epoch}
              redeemBtnAction={redeemBtnAction}
            />
          );
        })}
      </div>
    </div>
  );
}

export default PurchaseHistory;
