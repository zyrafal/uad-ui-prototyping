import React, { useState } from "react";
import BigNumber from "bignumber.js";

import { toBaseUnitBN } from "../../../utils/number";
import { ESD, ESDS } from "../../../constants/tokens";
import { getCouponPremium } from "../../../utils/infura";
import Box from "../../Box";
import BoxItem from "../../BoxItem";
import { BigNumberPlainText } from "../../common/index";
import { BoxItemTextBlock } from "../../common/index";
import PurchaseCouponModal from "./PurchaseCouponModal";

type PurchaseCouponsMobileProps = {
  user: string;
  allowance: BigNumber;
  balance: BigNumber;
  debt: BigNumber;
};

function PurchaseCouponsMobile({
  user,
  balance,
  allowance,
  debt,
}: PurchaseCouponsMobileProps) {
  // const [purchaseAmount, setPurchaseAmount] = useState(new BigNumber(0));
  // const [premium, setPremium] = useState(new BigNumber(0));
  const [showModal, setShowModal] = useState(false);

  const updatePremium = async (purchaseAmount) => {
    if (purchaseAmount.lte(new BigNumber(0))) {
      // setPremium(new BigNumber(0));
      return;
    }
    const purchaseAmountBase = toBaseUnitBN(purchaseAmount, ESD.decimals);
    await getCouponPremium(ESDS.addr, purchaseAmountBase);
    // const premium = await getCouponPremium(ESDS.addr, purchaseAmountBase);
    // const premiumFormatted = toTokenUnitsBN(premium, ESD.decimals);
    // setPremium(premiumFormatted);
  };

  return (
    <>
      <Box bgcolor="#282828" height="244px">
        <div
          style={{ width: "100%", display: "flex" }}
          onClick={() => setShowModal(true)}
        >
          <BoxItem>
            <div
              style={{
                color: "white",
                fontSize: "20px",
                lineHeight: "24px",
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.4)",
                  marginRight: "30%",
                }}
              >
                Purchase
              </span>
              <BigNumberPlainText
                asset="Balance"
                balance={balance}
                suffix={" UAD"}
                color="white"
              />
            </div>
            <BoxItemTextBlock fontSize="32px" color="#ffffff" asset="+ Burn" />
          </BoxItem>
        </div>
      </Box>
      {showModal && (
        <PurchaseCouponModal
          balance={balance}
          onClose={setShowModal}
          updatePremium={updatePremium}
          user={user}
          debt={debt}
        />
      )}
    </>
  );
}

export default PurchaseCouponsMobile;
