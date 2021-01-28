import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import NavBar from "../NavBar/HomePageNav";
import UseWindowSize from "../../components/UseWindowSize";
import {
  getAllRegulations,
  getPoolTotalClaimable,
  getPoolTotalRewarded,
  getTokenBalance,
  getTokenTotalSupply,
  getTotalBonded,
  getTotalRedeemable,
  getTotalStaged,
  getTotalCoupons,
  getBalanceBonded,
  getPoolBalanceOfBonded,
  getPoolTotalBonded,
} from "../../utils/infura";
import { ownership } from "../../utils/number";
import Invest from "./Invest";
import { ESDS, ESD, UNI, USDC } from "../../constants/tokens";
import { toTokenUnitsBN } from "../../utils/number";
import BigNumber from "bignumber.js";
import { formatBN } from "../../utils/number";
import { getPoolAddress } from "../../utils/pool";

function epochTimeformatted() {
  const epochStart = 1611360000;
  const epochPeriod = 60 * 60;
  const hour = 60 * 60;
  const minute = 60;
  const unixTimeSec = Math.floor(Date.now() / 1000);

  let epochRemainder = unixTimeSec - epochStart;
  const epoch = Math.floor(epochRemainder / epochPeriod);
  epochRemainder -= epoch * epochPeriod;
  const epochHour = Math.floor(epochRemainder / hour);
  epochRemainder -= epochHour * hour;
  const epochMinute = Math.floor(epochRemainder / minute);
  epochRemainder -= epochMinute * minute;
  return `0${epochHour}:${
    epochMinute > 9 ? epochMinute : "0" + epochMinute.toString()
  }:${epochRemainder > 9 ? epochRemainder : "0" + epochRemainder.toString()}`;
}
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
type HomePageProps = {
  hasWeb3: boolean;
  user: string;
  setUser: Function;
  homeData: boolean;
};

function HomePage({ hasWeb3, setUser, user, homeData }: HomePageProps) {
  const [epochTime, setEpochTime] = useState("00:00:00");
  const [epoch, setEpoch] = useState(0);
  const windowSize = UseWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [daoTotalSupply, setDaoTotalSupply] = useState(new BigNumber(0));
  const [poolTotalSupply, setPoolTotalSupply] = useState(new BigNumber(0));
  const [circulatingSupply, setCirculatingSupply] = useState(new BigNumber(0));
  const [totalCoupons, setTotalCoupons] = useState(new BigNumber(0));
  const [pairBalanceUSDC, setPairBalanceUSDC] = useState(new BigNumber(0));
  const [pairBalanceESD, setPairBalanceESD] = useState(new BigNumber(0));
  const [totalBonded, setTotalBonded] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userPoolBondedBalance, setUserPoolBondedBalance] = useState(
    new BigNumber(0)
  );
  const [poolTotalBonded, setPoolTotalBonded] = useState(new BigNumber(0));
  const [poolLiquidity, setPoolLiquidity] = useState(new BigNumber(0));

  useEffect(() => {
    if (windowSize < 781) setIsMobile(true);
    else setIsMobile(false);
  }, [windowSize]);
  useEffect(() => {
    let isCancelled = false;
    async function updateUserInfo() {
      const poolAddress = await getPoolAddress();

      const [
        allRegulations,
        totalSupplyStr,
        totalBondedStr,
        totalStagedStr,
        totalRedeemableStr,
        poolLiquidityStr,
        poolTotalRewardedStr,
        poolTotalClaimableStr,
        totalCouponsStr,
        pairBalanceUSDCStr,
        pairBalanceESDStr,
        bondedBalance,
        poolBondedBalance,
        poolTotalBondedStr,
      ] = await Promise.all([
        getAllRegulations(ESDS.addr),
        getTokenTotalSupply(ESD.addr),
        getTotalBonded(ESDS.addr),
        getTotalStaged(ESDS.addr),
        getTotalRedeemable(ESDS.addr),
        getTokenBalance(ESD.addr, UNI.addr),
        getPoolTotalRewarded(poolAddress),
        getPoolTotalClaimable(poolAddress),

        getTotalCoupons(ESDS.addr),

        getTokenBalance(USDC.addr, UNI.addr),
        getTokenBalance(ESD.addr, UNI.addr),

        getBalanceBonded(ESDS.addr, user),
        getPoolBalanceOfBonded(poolAddress, user),

        getPoolTotalBonded(poolAddress),
      ]);
      if (!isCancelled) {
        setEpochTime(epochTimeformatted());
        setEpoch(allRegulations.length);
        setTotalSupply(toTokenUnitsBN(totalSupplyStr, ESD.decimals));

        const daoSupply = toTokenUnitsBN(totalBondedStr, ESD.decimals)
          .plus(toTokenUnitsBN(totalStagedStr, ESD.decimals))
          .plus(toTokenUnitsBN(totalRedeemableStr, ESD.decimals));
        setTotalBonded(toTokenUnitsBN(totalBondedStr, ESD.decimals));
        setDaoTotalSupply(daoSupply);
        const poolSupply = toTokenUnitsBN(poolLiquidityStr, ESD.decimals)
          .plus(toTokenUnitsBN(poolTotalRewardedStr, ESD.decimals))
          .plus(toTokenUnitsBN(poolTotalClaimableStr, ESD.decimals));
        setPoolTotalSupply(poolSupply);
        setPoolLiquidity(toTokenUnitsBN(poolLiquidityStr, ESD.decimals));

        setCirculatingSupply(
          toTokenUnitsBN(totalSupplyStr, ESD.decimals)
            .minus(daoSupply)
            .minus(poolSupply)
        );
        setTotalCoupons(toTokenUnitsBN(totalCouponsStr, ESD.decimals));
        setPairBalanceUSDC(
          toTokenUnitsBN(pairBalanceUSDCStr, USDC.decimals).multipliedBy(2)
        );
        setPairBalanceESD(
          toTokenUnitsBN(pairBalanceESDStr, ESD.decimals).multipliedBy(2)
        );
        setUserBondedBalance(toTokenUnitsBN(bondedBalance, ESDS.decimals));
        setUserPoolBondedBalance(
          toTokenUnitsBN(poolBondedBalance, UNI.decimals)
        );
        setPoolTotalBonded(toTokenUnitsBN(poolTotalBondedStr, ESD.decimals));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);
  let expRate = new BigNumber(0.02);

  if (expRate.toNumber() <= 0) {
    expRate = new BigNumber(0);
  }
  return (
    <>
      {!homeData && isMobile ? (
        <NavBar hasWeb3={hasWeb3} user={user} setUser={setUser} />
      ) : (
        <NavBar hasWeb3={hasWeb3} user={""} setUser={setUser} />
      )}
      <div className={styles.HomeContainer}>
        <div className={styles.container}>
          {(homeData || !isMobile) && (
            <p className={styles.helloText}>Hello, this is Universal Dollar</p>
          )}

          <div
            className={
              !isMobile || homeData ? styles.statics : styles.noneStatics
            }
          >
            {homeData && <div className={styles.offLine}></div>}

            <div className={styles.item} id={styles.epoch}>
              <h1>{epoch} epoch in progress</h1>
              <h1>{epochTime}</h1>
            </div>
            <div className={styles.item}>
              <h1>U8D Price</h1>
              <h1>${BNtoText(pairBalanceUSDC.dividedBy(pairBalanceESD))}</h1>
            </div>
            <div className={styles.item}>
              <h1>TWAP</h1>
              <h1>$1,48</h1>
            </div>
            {!isMobile && (
              <>
                <div className={styles.item}>
                  <h1>Liquidity</h1>
                  <h1>${BNtoText(pairBalanceUSDC)}</h1>
                </div>
                <div className={styles.item}>
                  <h1>Market Cap</h1>
                  <h1>
                    $
                    {BNtoText(
                      totalSupply.multipliedBy(
                        pairBalanceUSDC.dividedBy(pairBalanceESD)
                      )
                    )}
                  </h1>
                </div>
                {/* <div className={styles.item}>
                  <h1>Volume (24H)</h1>
                  <h1>$8,491,330</h1>
                </div> */}
              </>
            )}
          </div>
          <div className={styles.clearBoth}></div>
        </div>
        <div className={styles.chart}>
          <img alt="" className={styles.lineimg} src="images/Line 20.svg" />
          <img alt="" className={styles.vector} src="images/Vector 1.svg" />
        </div>
        <div
          className={styles.container}
          style={{ position: "absolute", bottom: "0" }}
        >
          <div className={styles.line}></div>
          <Invest
            totalSupply={totalSupply}
            totalBonded={totalBonded}
            expRate={expRate}
            bondedBalance={userBondedBalance}
            poolBondedBalance={userPoolBondedBalance}
            user={user}
            daoTotalSupply={daoTotalSupply}
            poolTotalSupply={poolTotalSupply}
            poolLiquidity={poolLiquidity}
            poolTotalBonded={poolTotalBonded}
          />
          <div className={styles.statics} style={{ marginTop: "36px" }}>
            <div className={styles.item}>
              <h1>Tokens:</h1>
              <h1>{BNtoText(totalSupply, 2)}</h1>
            </div>
            <div className={styles.item}>
              <h1>% in DAO</h1>
              <h1>
                {ownership(daoTotalSupply, totalSupply).toNumber().toFixed(2) +
                  "%"}
              </h1>
            </div>
            <div className={styles.item}>
              <h1>% in LP</h1>
              <h1>
                {ownership(poolTotalSupply, totalSupply).toNumber().toFixed(2) +
                  "%"}
              </h1>
            </div>
            <div className={styles.item}>
              <h1>% Circulating</h1>
              <h1>
                {ownership(circulatingSupply, totalSupply)
                  .toNumber()
                  .toFixed(2) + "%"}
              </h1>
            </div>
            <div className={styles.item}>
              <h1>Coupons</h1>
              <h1>{BNtoText(totalCoupons)}</h1>
            </div>
          </div>
          <div className={styles.clearBoth}></div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
