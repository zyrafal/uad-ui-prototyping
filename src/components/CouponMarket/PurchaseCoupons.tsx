import React, { useState } from "react";
import { Button } from "@aragon/ui";
import BigNumber from "bignumber.js";
import { MaxButton } from "../common/index";
import { purchaseCoupons } from "../../utils/web3";

import { isPos, toBaseUnitBN } from "../../utils/number";
import { ESD, ESDS } from "../../constants/tokens";
import { getCouponPremium } from "../../utils/infura";
import NumberInput from "../common/NumberInput";
import Box from "../../components/Box";
import BoxItem from "../../components/BoxItem";
import { BigNumberPlainText } from "../common/index";
import GetFromBigNumber from "../../components/GetFromBigNumber";

type PurchaseCouponsProps = {
  user: string;
  allowance: BigNumber;
  balance: BigNumber;
  debt: BigNumber;
};

function PurchaseCoupons({
  user,
  balance,
  allowance,
  debt,
}: PurchaseCouponsProps) {
  const [purchaseAmount, setPurchaseAmount] = useState(new BigNumber(0));
  // const [premium, setPremium] = useState(new BigNumber(0));

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
    <Box bgcolor="#282828" height="288px">
      <BoxItem>
        <div
          style={{
            display: "flex",
            color: "white",
            fontSize: "20px",
            lineHeight: "24px",
          }}
        >
          <span style={{ marginRight: "30%" }}>Purchase</span>
          <BigNumberPlainText
            asset="Balance"
            balance={balance}
            suffix={" U8D"}
          />
        </div>
        <div>
          <NumberInput
            value={purchaseAmount}
            setter={(value) => {
              setPurchaseAmount(value);
              isPos(value)
                ? updatePremium(value)
                : updatePremium(new BigNumber(0));
            }}
            placeholder="0.000000 U8D"
          >
            <Button
              style={{
                border: "none",
                boxShadow: "none",
                background: "transparent",
                color: "white",
                fontSize: "40px",
                cursor: "pointer",
                flex: 0,
              }}
              wide
              label="+ Burn"
              onClick={async () => {
                await purchaseCoupons(
                  ESDS.addr,
                  toBaseUnitBN(purchaseAmount, ESD.decimals)
                );
              }}
              disabled={
                user === "" ||
                debt.isZero() ||
                balance.isZero() ||
                !isPos(purchaseAmount)
              }
            />
          </NumberInput>
          <MaxButton
            onClick={() => {
              const maxPurchaseAmount =
                debt.comparedTo(balance) > 0 ? balance : debt;
              setPurchaseAmount(maxPurchaseAmount);
              updatePremium(maxPurchaseAmount);
            }}
            text={GetFromBigNumber(
              debt.comparedTo(balance) > 0 ? balance : debt
            )
              .toString()
              .replace(",", ".")}
          />
        </div>
      </BoxItem>
    </Box>
  );
}

export default PurchaseCoupons;
