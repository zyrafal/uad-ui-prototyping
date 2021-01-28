import React from "react";

import BigNumber from "bignumber.js";
import { formatBN } from "../../utils/number";
import { ownership } from "../../utils/number";
import RegulationBlock from "./RegulationBlock";
import styles from "./index.module.scss";
type RegulationHeaderProps = {
  totalSupply: BigNumber;

  totalBonded: BigNumber;
  totalStaged: BigNumber;
  totalRedeemable: BigNumber;

  poolLiquidity: BigNumber;
  poolRewarded: BigNumber;
  poolClaimable: BigNumber;

  legacyPoolRewarded: BigNumber;
  legacyPoolClaimable: BigNumber;

  totalDebt: BigNumber;
  totalCoupons: BigNumber;
  couponPremium: BigNumber;
};

const RegulationHeader = ({
  totalSupply,
  totalBonded,
  totalStaged,
  totalRedeemable,
  poolLiquidity,
  poolRewarded,
  poolClaimable,
  legacyPoolRewarded,
  legacyPoolClaimable,
  totalDebt,
  totalCoupons,
  couponPremium,
}: RegulationHeaderProps) => {
  const daoTotalSupply = totalBonded.plus(totalStaged).plus(totalRedeemable);
  const poolTotalSupply = poolLiquidity.plus(poolRewarded).plus(poolClaimable);

  const circulatingSupply = totalSupply
    .minus(daoTotalSupply)
    .minus(poolTotalSupply);
  const debtTotalSupply = totalDebt.plus(totalCoupons).plus(couponPremium);
  const BNtoText = (balance) => {
    let integer = "0";
    let digits = "0";
    const balanceBN = new BigNumber(balance);
    if (balanceBN.gte(new BigNumber(0))) {
      const tokens = formatBN(balanceBN, 2).split(".");
      integer = tokens[0];
      digits = tokens[1];
    }
    return integer + "." + digits;
  };

  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.header}>
          {BNtoText(totalSupply) !== "0.00" && (
            <div className={styles.item}>
              <div className={styles.title}>
                <p style={{ color: "rgba(254, 178, 88, 0.4)" }}>Total supply</p>
                <p style={{ color: "rgba(254, 178, 88, 1)" }}>
                  {BNtoText(totalSupply)}
                </p>
              </div>
              <div className={styles.block}>
                <RegulationBlock
                  bgColor="#feb258"
                  height={
                    ownership(daoTotalSupply, totalSupply)
                      .toNumber()
                      .toFixed(2) + "%"
                  }
                >
                  <p>{BNtoText(daoTotalSupply)}</p>
                  <p>
                    DAO{" "}
                    {ownership(daoTotalSupply, totalSupply)
                      .toNumber()
                      .toFixed(2) + "%"}
                  </p>
                </RegulationBlock>

                <RegulationBlock
                  bgColor="#fb9d46"
                  height={
                    ownership(poolTotalSupply, totalSupply)
                      .toNumber()
                      .toFixed(2) + "%"
                  }
                >
                  <p>{BNtoText(poolTotalSupply)}</p>
                  <p>
                    UNISWAP{" "}
                    {ownership(poolTotalSupply, totalSupply)
                      .toNumber()
                      .toFixed(2) + "%"}
                  </p>
                </RegulationBlock>

                <RegulationBlock
                  bgColor="#fb933e"
                  height={
                    ownership(circulatingSupply, totalSupply)
                      .toNumber()
                      .toFixed(2) + "%"
                  }
                >
                  <p>{BNtoText(circulatingSupply)}</p>
                  <p>
                    CIRCULATING{" "}
                    {ownership(circulatingSupply, totalSupply)
                      .toNumber()
                      .toFixed(2) + "%"}
                  </p>
                </RegulationBlock>
              </div>
            </div>
          )}
          {BNtoText(daoTotalSupply) !== "0.00" && (
            <div className={styles.item}>
              <div className={styles.title}>
                <p style={{ color: "rgba(60, 103, 255, 0.4)" }}>DAO</p>
                <p style={{ color: "rgba(60, 103, 255, 1)" }}>
                  {BNtoText(daoTotalSupply)}
                </p>
              </div>
              <div className={styles.block}>
                <RegulationBlock
                  bgColor="#3c67ff"
                  height={
                    ownership(totalStaged, daoTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"
                  }
                >
                  <p>{BNtoText(totalStaged)}</p>
                  <p>
                    STAGED{" "}
                    {ownership(totalStaged, daoTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"}
                  </p>
                </RegulationBlock>

                <RegulationBlock
                  bgColor="#365ff3"
                  height={
                    ownership(totalBonded, daoTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"
                  }
                >
                  <p>{BNtoText(totalBonded)}</p>
                  <p>
                    BONDED{" "}
                    {ownership(totalBonded, daoTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"}
                  </p>
                </RegulationBlock>

                <RegulationBlock
                  bgColor="#335cee"
                  height={
                    ownership(totalRedeemable, daoTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"
                  }
                >
                  <p>{BNtoText(totalRedeemable)}</p>
                  <p>
                    REDEEMABLE{" "}
                    {ownership(totalRedeemable, daoTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"}
                  </p>
                </RegulationBlock>
              </div>
            </div>
          )}
          {BNtoText(poolTotalSupply) !== "0.00" && (
            <div className={styles.item}>
              <div className={styles.title}>
                <p style={{ color: "rgba(49, 227, 120, 0.4)" }}>LP</p>
                <p style={{ color: "rgba(49, 227, 120, 1)" }}>
                  {BNtoText(poolTotalSupply)}
                </p>
              </div>
              <div className={styles.block}>
                <RegulationBlock
                  bgColor="#31e378"
                  height={
                    ownership(poolLiquidity, poolTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"
                  }
                >
                  <p>{BNtoText(poolLiquidity)}</p>
                  <p>
                    LIQUIDITY{" "}
                    {ownership(poolLiquidity, poolTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"}
                  </p>
                </RegulationBlock>

                <RegulationBlock
                  bgColor="#2bd16d"
                  height={
                    ownership(poolRewarded, poolTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"
                  }
                >
                  <p>{BNtoText(poolRewarded)}</p>
                  <p>
                    REWARDED{" "}
                    {ownership(poolRewarded, poolTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"}
                  </p>
                </RegulationBlock>

                <RegulationBlock
                  bgColor="#28c767"
                  height={
                    ownership(poolClaimable, poolTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"
                  }
                >
                  <p>{BNtoText(poolClaimable)}</p>
                  <p>
                    CLAIMABLE{" "}
                    {ownership(poolClaimable, poolTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"}
                  </p>
                </RegulationBlock>
              </div>
            </div>
          )}

          {BNtoText(debtTotalSupply) !== "0.00" && (
            <div className={styles.item}>
              <div className={styles.title}>
                <p style={{ color: "rgba(182, 66, 225, 0.4)" }}>Debt Ratio</p>
                <p style={{ color: "rgba(182, 66, 225, 1)" }}>
                  {BNtoText(debtTotalSupply)}
                </p>
              </div>
              <div className={styles.block}>
                <RegulationBlock
                  bgColor="#b642e1"
                  height={
                    ownership(totalDebt, debtTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"
                  }
                >
                  <p>{BNtoText(totalDebt)}</p>
                  <p>
                    DEBT{" "}
                    {ownership(totalDebt, debtTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"}
                  </p>
                </RegulationBlock>

                <RegulationBlock
                  bgColor="#a038c6"
                  height={
                    ownership(totalCoupons, debtTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"
                  }
                >
                  <p>{BNtoText(totalCoupons)}</p>
                  <p>
                    COUPONS{" "}
                    {ownership(totalCoupons, debtTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"}
                  </p>
                </RegulationBlock>

                <RegulationBlock
                  bgColor="#9532b9"
                  height={
                    ownership(couponPremium, debtTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"
                  }
                >
                  <p>{BNtoText(couponPremium)}</p>
                  <p>
                    PREMIUM{" "}
                    {ownership(couponPremium, debtTotalSupply)
                      .toNumber()
                      .toFixed(2) + "%"}
                  </p>
                </RegulationBlock>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RegulationHeader;
