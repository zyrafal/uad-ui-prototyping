import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import BigNumber from "bignumber.js";
import {
  getPoolBalanceOfBonded,
  getPoolBalanceOfClaimable,
  getPoolBalanceOfRewarded,
  getPoolBalanceOfStaged,
  getPoolTotalBonded,
  getTokenAllowance,
  getTokenBalance,
} from "../../utils/infura";
import { ESD, UNI, USDC } from "../../constants/tokens";
import { toTokenUnitsBN } from "../../utils/number";
import {
  streamLpTimeleft,
  releasableLpAmount,
  unreleasedLpAmount,
  releaseLp,
  boostLpStream,
  cancelLpStream,
  streamRewardTimeleft,
  releasableRewardAmount,
  unreleasedRewardAmount,
  releaseReward,
  boostRewardStream,
  cancelRewardStream,
  approve,
} from "../../utils/web3";
import WithdrawDeposit from "./WithdrawDeposit";
import WithdrawDepositMobile from "./WithdrawDepositMobile";
import BondUnbond from "./BondUnbond";
import BondUnbondMobile from "./BondUnbondMobile";
import Claim from "./Claim";
import ClaimMobile from "./ClaimMobile";
import Provide from "./Provide";
import ProvideMobile from "./ProvideMobile";
import { ownership } from "../../utils/number";
import { getLegacyPoolAddress, getPoolAddress } from "../../utils/pool";
import { BigNumberPlainText } from "../common/index";
import NavBar from "../../components/NavBar";
import UseWindowSize from "../../components/UseWindowSize";
import Streaming from "../common/Streaming";
import StreamMobile from "../common/Streaming/StreamMobile";
import { MAX_UINT256 } from "../../constants/values";
import styles from "../Wallet/wallet.module.scss";

function Pool({
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

  const [poolAddress, setPoolAddress] = useState("");
  const [poolTotalBonded, setPoolTotalBonded] = useState(new BigNumber(0));
  const [pairBalanceESD, setPairBalanceESD] = useState(new BigNumber(0));
  const [pairBalanceUSDC, setPairBalanceUSDC] = useState(new BigNumber(0));
  const [userUNIBalance, setUserUNIBalance] = useState(new BigNumber(0));
  const [userUNIAllowance, setUserUNIAllowance] = useState(new BigNumber(0));
  const [userUSDCBalance, setUserUSDCBalance] = useState(new BigNumber(0));
  const [userUSDCAllowance, setUserUSDCAllowance] = useState(new BigNumber(0));
  const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userRewardedBalance, setUserRewardedBalance] = useState(
    new BigNumber(0)
  );
  const [userClaimableBalance, setUserClaimableBalance] = useState(
    new BigNumber(0)
  );
  const [legacyUserRewardedBalance, setLegacyUserRewardedBalance] = useState(
    new BigNumber(0)
  );
  const [userUnreleasedLpValue, setUserUnreleasedLpValue] = useState(0);
  const [userUnreleasedRewardValue, setUserUnreleasedRewardValue] = useState(0);

  const [unlockBtn, SetUnlockBtn] = useState(false);
  const windowSize = UseWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  const handleUnlockBtn = async () => {
    if (user === "") {
      alert("connect metamask first");
      return;
    }
    await approve(UNI.addr, poolAddress);
    SetUnlockBtn(true);
  };
  useEffect(() => {
    if (windowSize < 781) setIsMobile(true);
    else setIsMobile(false);
  }, [windowSize]);
  //Update User balances
  useEffect(() => {
    if (user === "") {
      setPoolAddress("");
      setPoolTotalBonded(new BigNumber(0));
      setPairBalanceESD(new BigNumber(0));
      setPairBalanceUSDC(new BigNumber(0));
      setUserUNIBalance(new BigNumber(0));
      setUserUNIAllowance(new BigNumber(0));
      setUserUSDCBalance(new BigNumber(0));
      setUserUSDCAllowance(new BigNumber(0));
      setUserStagedBalance(new BigNumber(0));
      setUserBondedBalance(new BigNumber(0));
      setUserRewardedBalance(new BigNumber(0));
      setUserClaimableBalance(new BigNumber(0));
      setLegacyUserRewardedBalance(new BigNumber(0));
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const poolAddressStr = await getPoolAddress();
      const legacyPoolAddress = getLegacyPoolAddress(poolAddressStr);

      const [
        poolTotalBondedStr,
        pairBalanceESDStr,
        pairBalanceUSDCStr,
        balance,
        usdcBalance,
        allowance,
        usdcAllowance,
        stagedBalance,
        bondedBalance,
        rewardedBalance,
        claimableBalance,
        legacyRewardedBalance,
        unreleasedLpValue,
        unreleasedRewardValue,
      ] = await Promise.all([
        getPoolTotalBonded(poolAddressStr),
        getTokenBalance(ESD.addr, UNI.addr),
        getTokenBalance(USDC.addr, UNI.addr),
        getTokenBalance(UNI.addr, user),
        getTokenBalance(USDC.addr, user),
        getTokenAllowance(UNI.addr, user, poolAddressStr),
        getTokenAllowance(USDC.addr, user, poolAddressStr),
        getPoolBalanceOfStaged(poolAddressStr, user),
        getPoolBalanceOfBonded(poolAddressStr, user),
        getPoolBalanceOfRewarded(poolAddressStr, user),
        getPoolBalanceOfClaimable(poolAddressStr, user),
        getPoolBalanceOfRewarded(legacyPoolAddress, user),
        unreleasedLpAmount(poolAddressStr),
        unreleasedRewardAmount(poolAddressStr),
      ]);

      const poolTotalBonded = toTokenUnitsBN(poolTotalBondedStr, ESD.decimals);
      const pairESDBalance = toTokenUnitsBN(pairBalanceESDStr, ESD.decimals);
      const pairUSDCBalance = toTokenUnitsBN(pairBalanceUSDCStr, USDC.decimals);
      const userUNIBalance = toTokenUnitsBN(balance, UNI.decimals);
      const userUSDCBalance = toTokenUnitsBN(usdcBalance, USDC.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, UNI.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, UNI.decimals);
      const userRewardedBalance = toTokenUnitsBN(rewardedBalance, ESD.decimals);
      const userClaimableBalance = toTokenUnitsBN(
        claimableBalance,
        ESD.decimals
      );
      const legacyUserRewardedBalance = toTokenUnitsBN(
        legacyRewardedBalance,
        UNI.decimals
      );

      if (!isCancelled) {
        setPoolAddress(poolAddressStr);
        setPoolTotalBonded(new BigNumber(poolTotalBonded));
        setPairBalanceESD(new BigNumber(pairESDBalance));
        setPairBalanceUSDC(new BigNumber(pairUSDCBalance));
        setUserUNIBalance(new BigNumber(userUNIBalance));
        setUserUNIAllowance(new BigNumber(allowance));
        setUserUSDCAllowance(new BigNumber(usdcAllowance));
        setUserUSDCBalance(new BigNumber(userUSDCBalance));
        setUserStagedBalance(new BigNumber(userStagedBalance));
        setUserBondedBalance(new BigNumber(userBondedBalance));
        setUserRewardedBalance(new BigNumber(userRewardedBalance));
        setUserClaimableBalance(new BigNumber(userClaimableBalance));
        setLegacyUserRewardedBalance(new BigNumber(legacyUserRewardedBalance));
      }
      setUserUnreleasedLpValue(unreleasedLpValue);
      setUserUnreleasedRewardValue(unreleasedRewardValue);
      if (new BigNumber(allowance).comparedTo(MAX_UINT256) === 0) {
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
  // Check for error in .call()
  const isRewardedNegative = legacyUserRewardedBalance.isGreaterThan(
    new BigNumber("1000000000000000000")
  );
  const supplylink =
    "https://app.uniswap.org/#/add/" +
    ESD.addr +
    "/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

  return (
    <>
      <NavBar user={user} hasWeb3={hasWeb3} setUser={setUser}>
        <span>
          <div>
            <div className={styles.firstLine}>
              Balance
              <div>
                <BigNumberPlainText
                  asset=""
                  balance={userUNIBalance}
                  suffix={" UNI-V2"}
                />
              </div>
            </div>

            <div className={styles.firstLine}>
              Pool Ownership
              <div>
                <BigNumberPlainText
                  asset=""
                  balance={ownership(
                    userBondedBalance,
                    poolTotalBonded
                  ).toFixed(2)}
                  suffix={"%"}
                />
              </div>
            </div>

            <div className={styles.firstLine}>
              Rewarded
              <div>
                <BigNumberPlainText
                  asset=""
                  balance={userRewardedBalance}
                  suffix={" U8D"}
                />
              </div>
            </div>
          </div>
          <p>
            <span className={styles.cursorPointer}>
              <a
                style={{ textDecoration: "none" }}
                target="_blank"
                href={supplylink}
                rel="noopener noreferrer"
              >
                + Provide Liquidity
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
          <div className={styles.unlockBtn}>+ Unlock UNI-V2</div>
        </div>
      )}
      {unlockBtn && (
        <div className={styles.container}>
          {!isMobile && (
            <>
              <WithdrawDeposit
                poolAddress={poolAddress}
                user={user}
                balance={userUNIBalance}
                allowance={userUNIAllowance}
                stagedBalance={userStagedBalance}
              />
              {userUnreleasedLpValue > 0 && (
                <Streaming
                  streamTimeleft={streamLpTimeleft}
                  releasableAmount={releasableLpAmount}
                  unreleasedAmount={unreleasedLpAmount}
                  release={releaseLp}
                  boostStream={boostLpStream}
                  cancelStream={cancelLpStream}
                  addr={poolAddress}
                  decimals={UNI.decimals}
                  prefix="UNI-V2"
                  roundable={false}
                />
              )}
              <BondUnbond
                poolAddress={poolAddress}
                staged={userStagedBalance}
                bonded={userBondedBalance}
              />

              <Claim
                poolAddress={poolAddress}
                claimable={userClaimableBalance}
              />
              {userUnreleasedRewardValue > 0 && (
                <Streaming
                  streamTimeleft={streamRewardTimeleft}
                  releasableAmount={releasableRewardAmount}
                  unreleasedAmount={unreleasedRewardAmount}
                  release={releaseReward}
                  boostStream={boostRewardStream}
                  cancelStream={cancelRewardStream}
                  addr={poolAddress}
                  decimals={ESD.decimals}
                />
              )}
              <Provide
                poolAddress={poolAddress}
                user={user}
                rewarded={
                  isRewardedNegative ? new BigNumber(0) : userRewardedBalance
                }
                pairBalanceESD={pairBalanceESD}
                pairBalanceUSDC={pairBalanceUSDC}
                userUSDCBalance={userUSDCBalance}
                userUSDCAllowance={userUSDCAllowance}
              />
            </>
          )}
          {isMobile && (
            <>
              <WithdrawDepositMobile
                poolAddress={poolAddress}
                balance={userUNIBalance}
                stagedBalance={userStagedBalance}
              />
              {userUnreleasedLpValue > 0 && (
                <StreamMobile
                  streamTimeleft={streamLpTimeleft}
                  releasableAmount={releasableLpAmount}
                  unreleasedAmount={unreleasedLpAmount}
                  release={releaseLp}
                  boostStream={boostLpStream}
                  cancelStream={cancelLpStream}
                  addr={poolAddress}
                  decimals={UNI.decimals}
                  prefix="UNI-V2"
                  roundable={false}
                />
              )}
              <BondUnbondMobile
                poolAddress={poolAddress}
                staged={userStagedBalance}
                bonded={userBondedBalance}
              />

              <ClaimMobile
                poolAddress={poolAddress}
                claimable={userClaimableBalance}
              />
              {userUnreleasedRewardValue > 0 && (
                <StreamMobile
                  streamTimeleft={streamRewardTimeleft}
                  releasableAmount={releasableRewardAmount}
                  unreleasedAmount={unreleasedRewardAmount}
                  release={releaseReward}
                  boostStream={boostRewardStream}
                  cancelStream={cancelRewardStream}
                  addr={poolAddress}
                  decimals={ESD.decimals}
                />
              )}
              <ProvideMobile
                poolAddress={poolAddress}
                user={user}
                rewarded={
                  isRewardedNegative ? new BigNumber(0) : userRewardedBalance
                }
                pairBalanceESD={pairBalanceESD}
                pairBalanceUSDC={pairBalanceUSDC}
                userUSDCBalance={userUSDCBalance}
                userUSDCAllowance={userUSDCAllowance}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Pool;
