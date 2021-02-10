import React, { useState, useEffect } from "react";
import { useWallet } from "use-wallet";
import { useHistory } from "react-router-dom";
import BigNumber from "bignumber.js";
import {
  connect,
  unreleasedAmount,
  unreleasedLpAmount,
  unreleasedRewardAmount,
} from "../../utils/web3";
import {
  getTokenBalance,
  getPoolBalanceOfBonded,
  getPoolTotalBonded,
  getPoolBalanceOfRewarded,
  getTotalCoupons,
  getTokenTotalSupply,
  getBalanceBonded,
} from "../../utils/infura";
import { getPoolAddress } from "../../utils/pool";

import { ESD, ESDS, UNI } from "../../constants/tokens";
import ConnectModal from "./ConnectModal";
import { toTokenUnitsBN } from "../../utils/number";
import { BigNumberPlainText } from "../common/index";
import { ownership } from "../../utils/number";

import styles from "./index.module.scss";
type connectButtonProps = {
  user: string;
  setUser: Function;
  setter?: Function;
};

function ConnectButton({ user, setUser, setter }: connectButtonProps) {
  const { status, reset } = useWallet();
  const history = useHistory();
  const [userESDBalance, setUserESDBalance] = useState(new BigNumber(0));
  const [userPoolBondedBalance, setUserPoolBondedBalance] = useState(
    new BigNumber(0)
  );
  const [poolTotalBonded, setPoolTotalBonded] = useState(new BigNumber(0));
  const [userRewardedBalance, setUserRewardedBalance] = useState(
    new BigNumber(0)
  );
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));

  const [userUnreleasedValue, setUserUnreleasedValue] = useState(0);
  const [userUnreleasedLpValue, setUserUnreleasedLpValue] = useState(0);
  const [userUnreleasedRewardValue, setUserUnreleasedRewardValue] = useState(0);
  const [stake, setStake] = useState(new BigNumber(0));
  const [totalStake, setTotalStake] = useState(new BigNumber(0));
  const [coupons, setCoupons] = useState(new BigNumber(0));

  const [isModalOpen, setModalOpen] = useState(false);

  const connectWeb3 = async (wallet) => {
    connect(wallet.ethereum);
    setUser(wallet.account);
  };

  const disconnectWeb3 = async () => {
    setUser("");
    reset();
  };
  const setUserFormat = (str: string) => {
    let substr = str.substring(0, 5) + "......" + str.substring(37);
    return substr;
  };

  if (setter) {
    const homeData = status === "connected" ? false : true;
    setter(homeData);
  }
  useEffect(() => {
    if (user === "") {
      setUserESDBalance(new BigNumber(0));
      setUserPoolBondedBalance(new BigNumber(0));
      setPoolTotalBonded(new BigNumber(0));
      setUserRewardedBalance(new BigNumber(0));
      return;
    }
    let isCancelled = false;
    async function updateUserInfo() {
      const [
        esdBalance,
      ] = await Promise.all([
        getTokenBalance(ESD.addr, user),
      ]);
      const userESDBalance = toTokenUnitsBN(esdBalance.toString(), ESD.decimals);

      if (!isCancelled) {
        setUserESDBalance(new BigNumber(userESDBalance));
        setUserPoolBondedBalance(new BigNumber(userPoolBondedBalance));
        setPoolTotalBonded(new BigNumber(poolTotalBonded));
        setUserRewardedBalance(new BigNumber(userRewardedBalance));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);
  const toggleModal = () => setModalOpen(!isModalOpen);
  return (
    <div className={styles.connectWallet}>
      {status === "connected" ? (
        <div className={styles.afterConnect}>
          <div className={styles.walletInfo}>
            <div>
              Wallet Connected<br></br>
              <p style={{ marginTop: "4px" }}>{setUserFormat(user)}</p>
            </div>

            <img
              alt=""
              src="images/wallet_connected.svg"
              onClick={disconnectWeb3}
            />
          </div>
          <div className={styles.walletItemContainer}>
            <div
              className={styles.walletItem}
              onClick={() => history.push("/dao/")}
            >
              <div className={styles.title}>
                <p>
                  DAO {userUnreleasedValue > 0 ? "/ Streaming right now" : ""}
                </p>
                <img alt="" src="images/top-right_arrow.svg" />
              </div>
              <div className={styles.content}>
                <div className={styles.item}>
                  <p>Bonded in DAO</p>
                  <div>
                    <BigNumberPlainText
                      asset=""
                      balance={userBondedBalance}
                      suffix={"uAD ("}
                    />

                    <BigNumberPlainText
                      asset=""
                      balance={ownership(stake, totalStake).toFixed(2)}
                      suffix={"%)"}
                    />
                  </div>
                </div>
                <div className={styles.item}>
                  <p>Wallet</p>
                  <BigNumberPlainText
                    asset=""
                    balance={userESDBalance}
                    suffix={" uAD"}
                  />
                </div>
              </div>
            </div>
            <div
              className={styles.walletItem}
              onClick={() => history.push("/pool/")}
            >
              <div className={styles.title}>
                <p>
                  LP{" "}
                  {userUnreleasedLpValue > 0 || userUnreleasedRewardValue > 0
                    ? "/ Streaming Right now"
                    : ""}
                </p>
                <img alt="" src="images/top-right_arrow.svg" />
              </div>
              <div className={styles.content}>
                <div className={styles.item}>
                  <p>Bonded in Pool</p>
                  <div>
                    <BigNumberPlainText
                      asset=""
                      balance={userPoolBondedBalance}
                      suffix={"UNI-V2 ("}
                    />
                    <BigNumberPlainText
                      asset=""
                      balance={ownership(
                        userPoolBondedBalance,
                        poolTotalBonded
                      ).toFixed(2)}
                      suffix={"%)"}
                    />
                  </div>
                </div>
                <div className={styles.item}>
                  <p>Rewarded</p>
                  <BigNumberPlainText
                    asset=""
                    balance={userRewardedBalance}
                    suffix={" uAD"}
                  />
                </div>
              </div>
            </div>
            <div
              className={styles.walletItem}
              onClick={() => history.push("/coupons/")}
            >
              <div className={styles.title}>
                <p>Coupons</p>
                <img alt="" src="images/top-right_arrow.svg" />
              </div>
              <div className={styles.content}>
                <div className={styles.item}>
                  <p>Coupons</p>
                  <BigNumberPlainText
                    asset=""
                    balance={coupons}
                    suffix={" uAD"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <ConnectModal
            visible={isModalOpen}
            onClose={toggleModal}
            onConnect={connectWeb3}
          />
          <div onClick={toggleModal} className={styles.beforeConnect}>
            <p style={{ marginBottom: "8px" }}>Connect Wallet</p>
            <p>To start participating in the uAD ecosystem</p>
            <img alt="" src="images/icons8-connected 2.svg" />
          </div>
        </>
      )}
    </div>
  );
}

export default ConnectButton;
