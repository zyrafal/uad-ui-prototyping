import React, { useState } from "react";
import { Button } from "@aragon/ui";
import BigNumber from "bignumber.js";
import { BoxItemTextBlock, MaxButton } from "../common/index";
import { approve, providePool } from "../../utils/web3";
import { isPos, toBaseUnitBN, toTokenUnitsBN } from "../../utils/number";
import { ESD, USDC } from "../../constants/tokens";
import NumberInput from "../common/NumberInput";
import Box from "../../components/Box";
import BoxItem from "../../components/BoxItem";
import GetFromBigNumber from "../../components/GetFromBigNumber";
import { MAX_UINT256 } from "../../constants/values";
import { formatBN } from "../../utils/number";

import styles from "./provide.module.scss";
type ProvideProps = {
  poolAddress: string;
  user: string;
  rewarded: BigNumber;
  pairBalanceESD: BigNumber;
  pairBalanceUSDC: BigNumber;
  userUSDCBalance: BigNumber;
  userUSDCAllowance: BigNumber;
};
const BNtoText = (balance, type = 1) => {
  let integer = "0";
  let digits = "0";
  const balanceBN = new BigNumber(balance);
  if (balanceBN.gte(new BigNumber(0))) {
    const tokens = formatBN(balanceBN, 2).split(".");
    integer = tokens[0];
    digits = tokens[1];
  }
  if (type === 2) return integer;
  return integer + "." + digits;
};
function Provide({
  poolAddress,
  user,
  rewarded,
  pairBalanceESD,
  pairBalanceUSDC,
  userUSDCBalance,
  userUSDCAllowance,
}: ProvideProps) {
  const [provideAmount, setProvideAmount] = useState(new BigNumber(0));
  const [usdcAmount, setUsdcAmount] = useState(new BigNumber(0));

  const [unlockBtn, SetUnlockBtn] = useState(
    userUSDCAllowance.comparedTo(MAX_UINT256.dividedBy(2)) > 0 ? true : false
  );
  let [integer, digits] = GetFromBigNumber(rewarded);

  const Rewarded = "Rewarded " + integer + "." + digits + " U8D";
  const maxReward = "U8D " + integer + "." + digits;
  [integer, digits] = GetFromBigNumber(userUSDCBalance);
  const maxUSDC = "USDC " + integer + "." + digits;
  const handleUnlockBtn = async () => {
    if (poolAddress === "" || user === "") {
      alert("connect metamask first or pool address is null");
      return;
    }
    await approve(USDC.addr, poolAddress);
    SetUnlockBtn(true);
  };

  const USDCToESDRatio = pairBalanceUSDC.isZero()
    ? new BigNumber(1)
    : pairBalanceUSDC.div(pairBalanceESD);

  const handleMaxUSDCBtn = (amountUSDC) => {
    if (!amountUSDC) {
      return;
    }
    const newU8D = amountUSDC.div(USDCToESDRatio);

    if (
      new BigNumber(newU8D).toNumber() <= new BigNumber(rewarded).toNumber()
    ) {
      setProvideAmount(newU8D);
      setUsdcAmount(amountUSDC);
    } else {
      setProvideAmount(rewarded);
      const newAmountUSDC = rewarded.multipliedBy(USDCToESDRatio);
      setUsdcAmount(newAmountUSDC);
    }
  };

  const onChangeAmountESD = (amountESD) => {
    if (!amountESD) {
      setProvideAmount(new BigNumber(0));
      setUsdcAmount(new BigNumber(0));
      return;
    }

    const amountESDBN = new BigNumber(amountESD);
    setProvideAmount(amountESDBN);

    const amountESDBU = toBaseUnitBN(amountESDBN, ESD.decimals);
    const newAmountUSDC = toTokenUnitsBN(
      amountESDBU
        .multipliedBy(USDCToESDRatio)
        .integerValue(BigNumber.ROUND_FLOOR),
      ESD.decimals
    );
    setUsdcAmount(newAmountUSDC);
  };

  return (
    <Box bgcolor="#171717" height="288px">
      {/* {userUSDCAllowance.comparedTo(MAX_UINT256.dividedBy(2)) > 0 && unlockBtn && ( */}
      {unlockBtn && (
        <BoxItem>
          <div className={styles.flex}>
            <BoxItemTextBlock
              fontSize="20px"
              color="#ffffff"
              asset={Rewarded}
            />
            {/* <BoxItemTextBlock
              fontSize="20px"
              color="#ffffff"
              asset={USDTBalance}
            /> */}
          </div>
          <div>
            <NumberInput
              placeholder="0.000000 USDC"
              value={provideAmount}
              setter={onChangeAmountESD}
            >
              <Button
                style={{
                  border: "none",
                  boxShadow: "none",
                  background: "transparent",
                  color: "white",
                  fontSize: "40px",
                  cursor: "pointer",
                  flex: "1",
                }}
                wide
                label="+ Provide"
                onClick={async () => {
                  await providePool(
                    poolAddress,
                    toBaseUnitBN(provideAmount, ESD.decimals),
                    (hash) => setProvideAmount(new BigNumber(0))
                  );
                }}
                disabled={
                  poolAddress === "" ||
                  !isPos(provideAmount) ||
                  usdcAmount.isGreaterThan(userUSDCBalance)
                }
              />
            </NumberInput>
            <div className={styles.flex}>
              <MaxButton
                onClick={() => {
                  onChangeAmountESD(rewarded);
                }}
                text={maxReward}
              />
              <MaxButton
                onClick={() => {
                  handleMaxUSDCBtn(userUSDCBalance);
                }}
                text={maxUSDC}
              />

              <div style={{ padding: 3 }}>
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "20px",
                    lineHeight: "24px",
                  }}
                >
                  <span style={{ opacity: "0.4", marginRight: "5px" }}>
                    {"U8D->USDC"}
                  </span>
                  <span style={{ opacity: "0.4" }}>{BNtoText(usdcAmount)}</span>
                </span>
              </div>
            </div>
          </div>
        </BoxItem>
      )}
      {!unlockBtn && (
        <div
          className={styles.unlockStageMask}
          onClick={() => {
            handleUnlockBtn();
          }}
        >
          <div className={styles.title}>{Rewarded}</div>
          <div className={styles.unlockBtn}>+ Unlock Providing</div>
        </div>
      )}
    </Box>
  );
}

export default Provide;
