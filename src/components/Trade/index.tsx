import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import { getTokenBalance } from "../../utils/infura";
import { toTokenUnitsBN } from "../../utils/number";
import { ESD, UNI, USDC } from "../../constants/tokens";
import NavBar from "../../components/NavBar";
import UseWindowSize from "../../components/UseWindowSize";
import Trade from "./Trade";
import { BigNumberPlainText } from "../common/index";
import TradeMobile from "./TradeMobile";
import styles from "./index.module.scss";
function UniswapPool({
  user,
  hasWeb3,
  setUser,
}: {
  user: string;
  hasWeb3: boolean;
  setUser: Function;
}) {
  const [pairBalanceESD, setPairBalanceESD] = useState(new BigNumber(0));
  const [pairBalanceUSDC, setPairBalanceUSDC] = useState(new BigNumber(0));
  const windowSize = UseWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [pairBalanceESDStr, pairBalanceUSDCStr] = await Promise.all([
        getTokenBalance(ESD.addr, UNI.addr),
        getTokenBalance(USDC.addr, UNI.addr),
      ]);

      if (!isCancelled) {
        setPairBalanceESD(toTokenUnitsBN(pairBalanceESDStr, ESD.decimals));
        setPairBalanceUSDC(toTokenUnitsBN(pairBalanceUSDCStr, USDC.decimals));
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

  useEffect(() => {
    if (windowSize < 781) setIsMobile(true);
    else setIsMobile(false);
  }, [windowSize]);
  return (
    <>
      {!isMobile && (
        <>
          <NavBar user={user} hasWeb3={hasWeb3} setUser={setUser}>
            <span>
              <div>
                <div className={styles.firstLine}>
                  Wallet
                  <div>
                    <BigNumberPlainText asset="" balance={0} suffix={" uAD"} />
                  </div>
                </div>
              </div>
            </span>
          </NavBar>
          <Trade
            pairBalanceUSDC={pairBalanceUSDC}
            pairBalanceESD={pairBalanceESD}
          />
        </>
      )}

      {isMobile && (
        <TradeMobile
          pairBalanceUSDC={pairBalanceUSDC}
          pairBalanceESD={pairBalanceESD}
        />
      )}
    </>
  );
}

export default UniswapPool;
