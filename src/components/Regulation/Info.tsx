import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { formatBN } from "../../utils/number";
import {
  getAllRegulations,
  getTokenBalance,
  getTokenTotalSupply,
  getTotalBonded,
  getBalanceBonded,
  getPoolBalanceOfBonded,
  getPoolTotalBonded,
} from "../../utils/infura";

import Invest from "../HomePage/Invest";
import { ESDS, ESD, UNI, USDC } from "../../constants/tokens";
import { toTokenUnitsBN } from "../../utils/number";
import { getPoolAddress } from "../../utils/pool";

import styles from "./index.module.scss";
type RegulationInfoProps = {
  user: string;
  poolTotalSupply: BigNumber;
  daoTotalSupply: BigNumber;
  poolLiquidity: BigNumber;
};

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

const RegulationInfo = ({
  user,
  poolTotalSupply,
  daoTotalSupply,
  poolLiquidity,
}: RegulationInfoProps) => {
  const [epochTime, setEpochTime] = useState("00:00:00");
  const [epoch, setEpoch] = useState(0);
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [poolTotalBonded, setPoolTotalBonded] = useState(new BigNumber(0));
  const [pairBalanceUSDC, setPairBalanceUSDC] = useState(new BigNumber(0));
  const [pairBalanceESD, setPairBalanceESD] = useState(new BigNumber(0));
  const [totalBonded, setTotalBonded] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userPoolBondedBalance, setUserPoolBondedBalance] = useState(
    new BigNumber(0)
  );
  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const poolAddress = await getPoolAddress();
      const [
        allRegulations,
        totalSupplyStr,
        totalBondedStr,

        pairBalanceUSDCStr,
        pairBalanceESDStr,
        bondedBalance,
        poolBondedBalance,

        poolTotalBondedStr,
      ] = await Promise.all([
        getAllRegulations(ESDS.addr),
        getTokenTotalSupply(ESD.addr),
        getTotalBonded(ESDS.addr),

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
        setTotalBonded(toTokenUnitsBN(totalBondedStr, ESD.decimals));

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
    <div className={styles.statics}>
      <p>More Information</p>
      <div className={styles.itemBlockContainer}>
        <div className={styles.itemBlock}>
          <div className={styles.item}>
            <p>{epoch} epoch</p>
            <p>{epochTime}</p>
          </div>
          <div className={styles.item}>
            <p>U8D Price</p>
            <p>${BNtoText(pairBalanceUSDC.dividedBy(pairBalanceESD))}</p>
          </div>
        </div>
        <div className={styles.itemBlock}>
          <div className={styles.item}>
            <p>TWAP</p>
            <p>$1,48</p>
          </div>
          <div className={styles.item}>
            <p>Liquidity</p>
            <p>${BNtoText(pairBalanceUSDC)}</p>
          </div>
        </div>

        <div className={styles.itemBlock}>
          <div className={styles.item}>
            <p>Market Cap</p>
            <p>
              $
              {BNtoText(
                totalSupply.multipliedBy(
                  pairBalanceUSDC.dividedBy(pairBalanceESD)
                )
              )}
            </p>
          </div>
          {/* <div className={styles.item}>
            <p>Volume (24H)</p>
            <p>$8,491,330</p>
          </div> */}
        </div>
      </div>
      <div style={{ marginTop: "72px", marginBottom: "80px" }}>
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
      </div>
    </div>
  );
};

export default RegulationInfo;
