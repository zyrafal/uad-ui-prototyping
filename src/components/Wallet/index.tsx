import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import BigNumber from "bignumber.js";
import {
  getBalanceBonded,
  getBalanceOfStaged,
  getStatusOf,
  getTokenAllowance,
  getTokenBalance,
  getTokenTotalSupply,
} from "../../utils/infura";
import { ESD, ESDS } from "../../constants/tokens";
import { toTokenUnitsBN } from "../../utils/number";
import NavBar from "../../components/NavBar";
import {
  streamTimeleft,
  releasableAmount,
  unreleasedAmount,
  release,
  boostStream,
  cancelStream,
  approve,
} from "../../utils/web3";
import { formatBN } from "../../utils/number";
import { ownership } from "../../utils/number";
import WithdrawDeposit from "./WithdrawDeposit";
import WithdrawDepositMobile from "./WithdrawDepositMobile";
import BondUnbond from "./BondUnbond";
import BondUnbondMobile from "./BondUnbondMobile";
import UseWindowSize from "../../components/UseWindowSize";
import { BigNumberPlainText } from "../common/index";
import Streaming from "../common/Streaming";
import StreamMobile from "../common/Streaming/StreamMobile";
import { MAX_UINT256 } from "../../constants/values";
import styles from "./wallet.module.scss";
function Wallet({
  user,
  hasWeb3,
  setUser,
}: {
  user: string;
  hasWeb3: boolean;
  setUser: Function;
}) {
  const history = useHistory();
  if (user === "") {
    history.push("/");
  }
  const { override } = useParams();
  if (override) {
    user = override;
  }

  const [userESDBalance, setUserESDBalance] = useState(new BigNumber(0));
  const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [userUnreleasedValue, setUserUnreleasedValue] = useState(0);

  const [unlockBtn, SetUnlockBtn] = useState(false);
  const windowSize = UseWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  const [stake, setStake] = useState(new BigNumber(0));
  const [totalStake, setTotalStake] = useState(new BigNumber(0));
  const STATUS_MAP = ["Unlocked", "Locked", "Undefined"];

  useEffect(() => {
    if (windowSize < 781) setIsMobile(true);
    else setIsMobile(false);
  }, [windowSize]);
  //Update User balances
  useEffect(() => {
    if (user === "") {
      setUserESDBalance(new BigNumber(0));
      setUserStagedBalance(new BigNumber(0));
      setUserBondedBalance(new BigNumber(0));
      setStake(new BigNumber(0));
      setTotalStake(new BigNumber(0));
      setUserStatus(0);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        esdBalance,
        esdAllowance,
        stagedBalance,
        bondedBalance,
        status,
        unreleasedValue,
        stakeStr,
        totalStakeStr,
      ] = await Promise.all([
        getTokenBalance(ESD.addr, user),
        getTokenAllowance(ESD.addr, user, ESDS.addr),
        getBalanceOfStaged(ESDS.addr, user),
        getBalanceBonded(ESDS.addr, user),
        getStatusOf(ESDS.addr, user),
        unreleasedAmount(ESDS.addr),
        getTokenBalance(ESDS.addr, user),
        getTokenTotalSupply(ESDS.addr),
      ]);
      const userESDBalance = toTokenUnitsBN(esdBalance, ESD.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, ESDS.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, ESDS.decimals);
      const userStatus = parseInt(status, 10);
      if (!isCancelled) {
        setUserESDBalance(new BigNumber(userESDBalance));
        setUserStagedBalance(new BigNumber(userStagedBalance));
        setUserBondedBalance(new BigNumber(userBondedBalance));
        setTotalStake(toTokenUnitsBN(totalStakeStr, ESDS.decimals));
        setStake(toTokenUnitsBN(stakeStr, ESDS.decimals));
        setUserStatus(userStatus);
      }
      setUserUnreleasedValue(unreleasedValue);
      if (new BigNumber(esdAllowance).comparedTo(MAX_UINT256) === 0) {
        SetUnlockBtn(true);
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

  const handleUnlockBtn = async () => {
    if (user === "") {
      alert("connect metamask first");
      return;
    }
    await approve(ESD.addr, ESDS.addr);
    SetUnlockBtn(true);
  };
  const tradelink =
    "https://app.uniswap.org/#/swap?inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputCurrency=" +
    ESD.addr;
  let integer = "0";
  let digits = "0";
  const balanceBN = new BigNumber(ownership(stake, totalStake));
  if (balanceBN.gte(new BigNumber(0))) {
    const tokens = formatBN(balanceBN, 2).split(".");
    integer = tokens[0];
    digits = tokens[1];
  }
  return (
    <>
      <NavBar user={user} hasWeb3={hasWeb3} setUser={setUser}>
        <span>
          <div>
            <div className={styles.firstLine}>
              Wallet
              <div>
                <BigNumberPlainText
                  asset=""
                  balance={userESDBalance}
                  suffix={" U8D"}
                />
              </div>
            </div>

            <div className={styles.firstLine}>
              Bonded
              <div>
                <BigNumberPlainText
                  asset=""
                  balance={userBondedBalance}
                  suffix={" U8D (" + integer + "." + digits + "%)"}
                />
              </div>
            </div>

            <div className={styles.firstLine}>
              Status
              <div>{STATUS_MAP[userStatus]}</div>
            </div>
          </div>
          <p>
            <span className={styles.cursorPointer}>
              <a
                style={{ textDecoration: "none" }}
                target="_blank"
                href={tradelink}
                rel="noopener noreferrer"
              >
                + Trade on Uniswap
              </a>
            </span>
          </p>
        </span>
      </NavBar>
      {!unlockBtn && (
        <div
          className={styles.unlockStageMask}
          onClick={() => {
            handleUnlockBtn();
          }}
        >
          <div className={styles.title}>Stage</div>
          <div className={styles.unlockBtn}>+ Unlock U8D</div>
        </div>
      )}
      {unlockBtn && (
        <div className={styles.container}>
          {!isMobile && (
            <>
              <WithdrawDeposit
                balance={userESDBalance}
                stagedBalance={userStagedBalance}
                status={userStatus}
              />
              {userUnreleasedValue > 0 && (
                <Streaming
                  streamTimeleft={streamTimeleft}
                  releasableAmount={releasableAmount}
                  unreleasedAmount={unreleasedAmount}
                  release={release}
                  boostStream={boostStream}
                  cancelStream={cancelStream}
                  addr={ESDS.addr}
                  decimals={ESD.decimals}
                />
              )}
              <BondUnbond
                staged={userStagedBalance}
                bonded={userBondedBalance}
                status={userStatus}
              />
            </>
          )}

          {isMobile && (
            <>
              <WithdrawDepositMobile
                balance={userESDBalance}
                stagedBalance={userStagedBalance}
                status={userStatus}
              />
              {userUnreleasedValue > 0 && (
                <StreamMobile
                  streamTimeleft={streamTimeleft}
                  releasableAmount={releasableAmount}
                  unreleasedAmount={unreleasedAmount}
                  release={release}
                  boostStream={boostStream}
                  cancelStream={cancelStream}
                  addr={ESDS.addr}
                  decimals={ESD.decimals}
                />
              )}
              <BondUnbondMobile
                staged={userStagedBalance}
                bonded={userBondedBalance}
                status={userStatus}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Wallet;
