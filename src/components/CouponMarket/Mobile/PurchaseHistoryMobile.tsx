import React, { useEffect, useState } from "react";

import {
  getBatchBalanceOfCoupons,
  getBatchCouponsExpiration,
  getCouponEpochs,
} from "../../../utils/infura";
import { ESDS, ESD } from "../../../constants/tokens";
import BigNumber from "bignumber.js";
import Box from "../../Box";
import BoxItem from "../../BoxItem";
import { BoxItemTextBlock } from "../../common/index";
import { redeemCoupons } from "../../../utils/web3";
import { toBaseUnitBN } from "../../../utils/number";

import YourCoupons from "./YourCoupons";
type PurchaseHistoryMobileProps = {
  user: string;
  totalRedeemable: BigNumber;
};

function PurchaseHistoryMobile({
  user,
  totalRedeemable,
}: PurchaseHistoryMobileProps) {
  const [epochs, setEpochs] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
    <>
      <Box bgcolor="#171717" height="244px">
        <div
          style={{ width: "100%", display: "flex" }}
          onClick={() => setShowModal(true)}
        >
          <BoxItem>
            <BoxItemTextBlock
              fontSize="20px"
              color="rgba(255,255,255,0.4)"
              asset="Coupons"
            />
            <BoxItemTextBlock
              fontSize="32px"
              color="#ffffff"
              asset="My Coupons"
            />
          </BoxItem>
        </div>
      </Box>
      {showModal && (
        <YourCoupons
          redeemBtnAction={redeemBtnAction}
          epochs={epochs}
          close={setShowModal}
        />
      )}
    </>
  );
}

export default PurchaseHistoryMobile;
