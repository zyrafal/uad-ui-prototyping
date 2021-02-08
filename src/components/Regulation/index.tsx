import React, { useState, useEffect } from "react";

import {
  getCouponPremium,
  getPoolTotalClaimable,
  getPoolTotalRewarded,
  getTokenBalance,
  getTokenTotalSupply,
  getTotalBonded,
  getTotalCoupons,
  getTotalDebt,
  getTotalRedeemable,
  getTotalStaged,
  getEpoch,
  getEpochTime,
} from "../../utils/infura";
import { advance } from "../../utils/web3";
import { ESD, ESDS, UNI } from "../../constants/tokens";
import { toTokenUnitsBN } from "../../utils/number";
import BigNumber from "bignumber.js";
import RegulationHeader from "./Header";
import RegulationInfo from "./Info";
import RegulationHistory from "./RegulationHistory";
import { getLegacyPoolAddress, getPoolAddress } from "../../utils/pool";
import NavBar from "../../components/NavBar";
import UseWindowSize from "../../components/UseWindowSize";
import { BigNumberPlainText } from "../common/index";
import RegulationHistoryMobile from "./RegulationHistoryMobile";
import styles from "./index.module.scss";
const ONE_COUPON = new BigNumber(10).pow(18);

function Regulation({
  user,
  hasWeb3,
  setUser,
}: {
  user: string;
  hasWeb3: boolean;
  setUser: Function;
}) {
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [totalBonded, setTotalBonded] = useState(new BigNumber(0));
  const [totalStaged, setTotalStaged] = useState(new BigNumber(0));
  const [totalRedeemable, setTotalRedeemable] = useState(new BigNumber(0));
  const [poolLiquidity, setPoolLiquidity] = useState(new BigNumber(0));
  const [poolTotalRewarded, setPoolTotalRewarded] = useState(new BigNumber(0));
  const [poolTotalClaimable, setPoolTotalClaimable] = useState(
    new BigNumber(0)
  );
  const [legacyPoolTotalRewarded, setLegacyPoolTotalRewarded] = useState(
    new BigNumber(0)
  );
  const [legacyPoolTotalClaimable, setLegacyPoolTotalClaimable] = useState(
    new BigNumber(0)
  );
  const [daoTotalSupply, setDaoTotalSupply] = useState(new BigNumber(0));
  const [poolTotalSupply, setPoolTotalSupply] = useState(new BigNumber(0));
  const [totalDebt, setTotalDebt] = useState(new BigNumber(0));
  const [totalCoupons, setTotalCoupons] = useState(new BigNumber(0));
  const [couponPremium, setCouponPremium] = useState(new BigNumber(0));
  const [epoch, setEpoch] = useState(0);
  const [epochTime, setEpochTime] = useState(0);
  const windowSize = UseWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (windowSize < 781) setIsMobile(true);
    else setIsMobile(false);
  }, [windowSize]);
  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const poolAddress = await getPoolAddress();
      const legacyPoolAddress = getLegacyPoolAddress(poolAddress);

      const [
        totalSupplyStr,
        totalBondedStr,
        totalStagedStr,
        totalRedeemableStr,
        poolLiquidityStr,
        poolTotalRewardedStr,
        poolTotalClaimableStr,
        legacyPoolTotalRewardedStr,
        legacyPoolTotalClaimableStr,
        totalDebtStr,
        totalCouponsStr,
        epochStr,
        epochTimeStr,
      ] = await Promise.all([
        getTokenTotalSupply(ESD.addr),

        getTotalBonded(ESDS.addr),
        getTotalStaged(ESDS.addr),
        getTotalRedeemable(ESDS.addr),

        getTokenBalance(ESD.addr, UNI.addr),
        getPoolTotalRewarded(poolAddress),
        getPoolTotalClaimable(poolAddress),

        getPoolTotalRewarded(legacyPoolAddress),
        getPoolTotalClaimable(legacyPoolAddress),

        getTotalDebt(ESDS.addr),
        getTotalCoupons(ESDS.addr),

        getEpoch(ESDS.addr),
        getEpochTime(ESDS.addr),
      ]);

      if (!isCancelled) {
        setTotalSupply(toTokenUnitsBN(totalSupplyStr, ESD.decimals));
        const daoSupply = toTokenUnitsBN(totalBondedStr, ESD.decimals)
          .plus(toTokenUnitsBN(totalStagedStr, ESD.decimals))
          .plus(toTokenUnitsBN(totalRedeemableStr, ESD.decimals));
        setDaoTotalSupply(daoSupply);
        const poolSupply = toTokenUnitsBN(poolLiquidityStr, ESD.decimals)
          .plus(toTokenUnitsBN(poolTotalRewardedStr, ESD.decimals))
          .plus(toTokenUnitsBN(poolTotalClaimableStr, ESD.decimals));
        setPoolTotalSupply(poolSupply);
        setTotalBonded(toTokenUnitsBN(totalBondedStr, ESD.decimals));
        setTotalStaged(toTokenUnitsBN(totalStagedStr, ESD.decimals));
        setTotalRedeemable(toTokenUnitsBN(totalRedeemableStr, ESD.decimals));

        setPoolLiquidity(toTokenUnitsBN(poolLiquidityStr, ESD.decimals));
        setPoolTotalRewarded(
          toTokenUnitsBN(poolTotalRewardedStr, ESD.decimals)
        );
        setPoolTotalClaimable(
          toTokenUnitsBN(poolTotalClaimableStr, ESD.decimals)
        );

        setLegacyPoolTotalRewarded(
          toTokenUnitsBN(legacyPoolTotalRewardedStr, ESD.decimals)
        );
        setLegacyPoolTotalClaimable(
          toTokenUnitsBN(legacyPoolTotalClaimableStr, ESD.decimals)
        );

        setTotalDebt(toTokenUnitsBN(totalDebtStr, ESD.decimals));
        setTotalCoupons(toTokenUnitsBN(totalCouponsStr, ESD.decimals));

        if (new BigNumber(totalDebtStr).isGreaterThan(ONE_COUPON)) {
          const couponPremiumStr = await getCouponPremium(
            ESDS.addr,
            ONE_COUPON
          );
          setCouponPremium(toTokenUnitsBN(couponPremiumStr, ESD.decimals));
        } else {
          setCouponPremium(new BigNumber(0));
        }

        setEpoch(parseInt(epochStr, 10));
        setEpochTime(parseInt(epochTimeStr, 10));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);
  const handleAdvance = async () => {
    await advance(ESDS.addr);
  };
  return (
    <>
      <NavBar user={user} hasWeb3={hasWeb3} setUser={setUser}>
        <span>
          <div>
            <div className={styles.firstLine}>
              Wallet
              <div>
                <BigNumberPlainText asset="" balance={0} suffix={" UAD"} />
              </div>
            </div>
          </div>
          {epochTime - epoch > 0 && user !== "" ? (
            <div
              className={styles.advanceBtn}
              onClick={() => {
                handleAdvance();
              }}
            >
              Advance epoch{" "}
            </div>
          ) : (
            ""
          )}
        </span>
      </NavBar>

      <RegulationHeader
        totalSupply={totalSupply}
        totalBonded={totalBonded}
        totalStaged={totalStaged}
        totalRedeemable={totalRedeemable}
        poolLiquidity={poolLiquidity}
        poolRewarded={poolTotalRewarded}
        poolClaimable={poolTotalClaimable}
        legacyPoolRewarded={legacyPoolTotalRewarded}
        legacyPoolClaimable={legacyPoolTotalClaimable}
        totalDebt={totalDebt}
        totalCoupons={totalCoupons}
        couponPremium={couponPremium}
      />
      <RegulationInfo
        user={user}
        poolTotalSupply={poolTotalSupply}
        daoTotalSupply={daoTotalSupply}
        poolLiquidity={poolLiquidity}
      />
      {isMobile ? (
        <RegulationHistoryMobile user={user} />
      ) : (
        <RegulationHistory user={user} />
      )}
    </>
  );
}

export default Regulation;
