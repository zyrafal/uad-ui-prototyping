import React, { useState } from "react";
import { IconArrowLeft, Button } from "@aragon/ui";
import { BigNumberPlainText } from "../../common/index";
import { ESD, ESDS } from "../../../constants/tokens";

import { isPos, toBaseUnitBN } from "../../../utils/number";
import NumberInput from "../../common/NumberInput";
import { MaxButton } from "../../common/index";
import { purchaseCoupons } from "../../../utils/web3";
import GetFromBigNumber from "../../../components/GetFromBigNumber";

import styles from "./purchaseCouponModal.module.scss";
import BigNumber from "bignumber.js";
type PurchaseCouponModalProps = {
  onClose: Function;
  balance: BigNumber;
  updatePremium: Function;
  user: string;
  debt: BigNumber;
};

function PurchaseCouponModal({
  onClose,
  balance,
  updatePremium,
  user,
  debt,
}: PurchaseCouponModalProps) {
  const [purchaseAmount, setPurchaseAmount] = useState(new BigNumber(0));

  const padClicked = (num) => {
    let str = purchaseAmount.toString();
    if (num === "-1") str = str.substring(0, str.length - 1);
    else if (num === ".") str += ".0";
    else str += num;

    const bn = new BigNumber(str);
    setPurchaseAmount(bn);
  };
  return (
    <div className={styles.modal}>
      <div className={styles.nav}>
        <span
          onClick={() => {
            onClose(false);
          }}
        >
          <IconArrowLeft size="large" />
        </span>
        <div style={{ color: "white" }}>
          <BigNumberPlainText
            asset="Balance"
            balance={balance}
            suffix={" UAD"}
          />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.modalContent}>
          <div style={{ padding: "32px" }}>
            <NumberInput
              value={purchaseAmount}
              setter={(value) => {
                setPurchaseAmount(value);
                isPos(value)
                  ? updatePremium(value)
                  : updatePremium(new BigNumber(0));
              }}
              placeholder="0.000000 UAD"
              border={false}
            >
              <span
                style={{
                  paddingTop: "8px",
                  fontSize: "20px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                UAD
              </span>
            </NumberInput>
            <div style={{ marginTop: "80px" }}>
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
          </div>

          <Button
            className={styles.submitBtn}
            wide
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
          >
            + Burn
          </Button>
          <div className={styles.numberPad}>
            <div className={styles.padItem} onClick={() => padClicked("1")}>
              1
            </div>
            <div className={styles.padItem} onClick={() => padClicked("2")}>
              2
            </div>
            <div className={styles.padItem} onClick={() => padClicked("3")}>
              3
            </div>
            <div className={styles.padItem} onClick={() => padClicked("4")}>
              4
            </div>
            <div className={styles.padItem} onClick={() => padClicked("5")}>
              5
            </div>
            <div className={styles.padItem} onClick={() => padClicked("6")}>
              6
            </div>
            <div className={styles.padItem} onClick={() => padClicked("7")}>
              7
            </div>
            <div className={styles.padItem} onClick={() => padClicked("8")}>
              8
            </div>
            <div className={styles.padItem} onClick={() => padClicked("9")}>
              9
            </div>
            <div className={styles.padItem} onClick={() => padClicked("-1")}>
              <img alt="" src="images/calcRemove.svg" />
            </div>
            <div className={styles.padItem} onClick={() => padClicked("0")}>
              0
            </div>
            <div className={styles.padItem} onClick={() => padClicked(".")}>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseCouponModal;
