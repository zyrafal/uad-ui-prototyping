import React, { useState, useEffect } from "react";

import {
  getImplementation,
  getStatusOf,
  getTokenBalance,
  getTokenTotalSupply,
} from "../../utils/infura";
import { ESDS } from "../../constants/tokens";
import { toTokenUnitsBN } from "../../utils/number";
import BigNumber from "bignumber.js";
import CandidateHistory from "./CandidateHistory";
import { BigNumberPlainText } from "../common/index";
import NavBar from "../../components/NavBar";
import { ownership } from "../../utils/number";
import { GOVERNANCE_PROPOSAL_THRESHOLD } from "../../constants/values";

import styles from "./index.module.scss";
function Governance({
  user,
  hasWeb3,
  setUser,
}: {
  user: string;
  hasWeb3: boolean;
  setUser: Function;
}) {
  const [stake, setStake] = useState(new BigNumber(0));
  const [totalStake, setTotalStake] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [implementation, setImplementation] = useState("0x");
  const STATUS_MAP = ["Unlocked", "Locked", "Undefined"];
  useEffect(() => {
    if (user === "") {
      setStake(new BigNumber(0));
      setUserStatus(0);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [statusStr, stakeStr] = await Promise.all([
        getStatusOf(ESDS.addr, user),
        getTokenBalance(ESDS.addr, user),
      ]);

      if (!isCancelled) {
        setStake(toTokenUnitsBN(stakeStr, ESDS.decimals));
        setUserStatus(parseInt(statusStr, 10));
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
    let isCancelled = false;

    async function updateUserInfo() {
      const [totalStakeStr, implementationStr] = await Promise.all([
        getTokenTotalSupply(ESDS.addr),
        getImplementation(ESDS.addr),
      ]);

      if (!isCancelled) {
        setTotalStake(toTokenUnitsBN(totalStakeStr, ESDS.decimals));
        setImplementation(implementationStr);
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
  const setUserFormat = (str: string) => {
    let substr = str.substring(0, 5) + "......" + str.substring(37);
    if (str === "") return str;
    return substr;
  };
  return (
    <>
      <NavBar user={user} hasWeb3={hasWeb3} setUser={setUser}>
        <span>
          <div>
            <div className={styles.firstLine}>
              DAO Ownership
              <div>
                <BigNumberPlainText
                  asset=""
                  balance={ownership(stake, totalStake).toFixed(2)}
                  suffix={"%"}
                />
              </div>
            </div>
            <div className={styles.firstLine}>
              Proposal Threshold
              <div>
                <BigNumberPlainText
                  asset=""
                  balance={GOVERNANCE_PROPOSAL_THRESHOLD.multipliedBy(100)}
                  suffix={"%"}
                />
              </div>
            </div>
            <div className={styles.firstLine}>
              Status
              <div>{STATUS_MAP[userStatus]}</div>
            </div>
            <div className={styles.firstLine}>
              Implementation
              <div>
                <a
                  target="_blank"
                  href={"https://etherscan.io/address/" + implementation}
                  style={{ textDecoration: "none" }}
                  rel="noopener noreferrer"
                >
                  {setUserFormat(implementation)}
                </a>
              </div>
            </div>
          </div>
        </span>
      </NavBar>

      <div className={styles.historyContainer}>
        <CandidateHistory user={user} hasWeb3={hasWeb3} setUser={setUser} />
      </div>
    </>
  );
}

export default Governance;
