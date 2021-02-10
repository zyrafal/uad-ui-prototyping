import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { BoxItemTextBlock } from "../common/index";
import { approve, providePool } from "../../utils/web3";
import { isPos, toBaseUnitBN, toTokenUnitsBN } from "../../utils/number";
import { ESD, USDC } from "../../constants/tokens";
import Box from "../Box";
import BoxItem from "../BoxItem";
import GetFromBigNumber from "../GetFromBigNumber";
import MobileCalcModal from "../../components/MobileCalcModal";
import { MAX_UINT256 } from "../../constants/values";
import { IconClose } from "@aragon/ui";
import { formatBN } from "../../utils/number";

import styles from "./provide.module.scss";
type ProvideMobileProps = {
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
function ProvideMobile({
  poolAddress,
  user,
  rewarded,
  pairBalanceESD,
  pairBalanceUSDC,
  userUSDCBalance,
  userUSDCAllowance,
}: ProvideMobileProps) {
  const [provideAmount, setProvideAmount] = useState(new BigNumber(0));
  const [usdcAmount, setUsdcAmount] = useState(new BigNumber(0));
  const [showModal, setShowModal] = useState(false);
  const [showMaxModal, setShowMaxModal] = useState(false);
  const [unlockBtn, SetUnlockBtn] = useState(
    userUSDCAllowance.comparedTo(MAX_UINT256.dividedBy(2)) > 0 ? true : false
  );
  let [integer, digits] = GetFromBigNumber(rewarded);
  const Rewarded = integer + "." + digits;
  [integer, digits] = GetFromBigNumber(userUSDCBalance);
  const maxUSDC = integer + "." + digits;

  const handleProvide = async () => {
    await providePool(
      poolAddress,
      toBaseUnitBN(provideAmount, ESD.decimals),
      (hash) => setProvideAmount(new BigNumber(0))
    );
  };
  const handleUnlockBtn = async () => {
    if (poolAddress === "" || user === "") {
      alert("connect metamask first or pool address is null");
      return;
    }
    await approve(USDC.addr, poolAddress);
    SetUnlockBtn(true);
  };

  const clickStaged = () => {
    setShowModal(true);
  };
  const btnDisabled1 =
    poolAddress === "" ||
    !isPos(provideAmount) ||
    usdcAmount.isGreaterThan(userUSDCBalance);
  const btnDisabled2 = btnDisabled1;
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
    setShowMaxModal(false);
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
    setShowMaxModal(false);
  };

  const onMaxBtnClick = () => {
    setShowMaxModal(true);
  };
  return (
    <>
      <Box bgcolor="#171717" height="244px">
        {/* {userUSDCAllowance.comparedTo(MAX_UINT256.dividedBy(2)) > 0 && unlockBtn && ( */}
        {unlockBtn && !showModal && (
          <div
            style={{ width: "100%", display: "flex" }}
            onClick={() => clickStaged()}
          >
            <BoxItem>
              <BoxItemTextBlock
                fontSize="20px"
                color="rgba(255,255,255,0.4)"
                asset="Rewarded"
              />
              <BoxItemTextBlock
                fontSize="32px"
                color="#ffffff"
                asset={Rewarded + " uAD"}
              />
            </BoxItem>
          </div>
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
      {unlockBtn && showModal && (
        <>
          <MobileCalcModal
            onClose={setShowModal}
            assets="Rewarded "
            prefix=" uAD"
            balance={rewarded}
            hasTab={false}
            depositAmount={provideAmount}
            setDepositAmount={onChangeAmountESD}
            submitDepositAction={handleProvide}
            withdrawAmount={provideAmount}
            setWithdrawAmount={onChangeAmountESD}
            submitWithdrawAction={handleProvide}
            stagedBalance={rewarded}
            btnDisabled1={btnDisabled1}
            btnDisabled2={btnDisabled2}
            maxBtnAction={onMaxBtnClick}
            usdcAmount={BNtoText(usdcAmount)}
          />
          {showMaxModal && (
            <div className={styles.maxModal}>
              <span
                style={{
                  position: "fixed",
                  top: "32px",
                  right: "32px",
                  zIndex: 20,
                  color: "#ffffff",
                }}
                onClick={() => {
                  setShowMaxModal(false);
                }}
              >
                <IconClose size="medium" />
              </span>
              <div className={styles.title}>Select Max</div>
              <div className={styles.btn}>
                <div
                  style={{ marginBottom: "24px" }}
                  onClick={() => {
                    onChangeAmountESD(rewarded);
                  }}
                >
                  <span>
                    uAD <span>{Rewarded}</span>
                  </span>
                </div>
                <div
                  style={{ marginBottom: "24px" }}
                  onClick={() => {
                    handleMaxUSDCBtn(userUSDCBalance);
                  }}
                >
                  <span>
                    USDC <span>{maxUSDC}</span>
                  </span>
                </div>
                <div
                  onClick={() => {
                    setShowMaxModal(false);
                  }}
                >
                  <span>Cancel</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ProvideMobile;
