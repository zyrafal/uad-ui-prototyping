import React, { useState, useEffect } from "react";

import {
  getApproveFor,
  getEpoch,
  getPeriodFor,
  getRecordedVote,
  getRejectFor,
  getStartFor,
  getStatusOf,
  getTokenBalance,
  getTokenTotalSupply,
  getTotalBondedAt,
} from "../../utils/infura";
import { ESDS } from "../../constants/tokens";
import { toTokenUnitsBN } from "../../utils/number";
import BigNumber from "bignumber.js";
import { formatBN } from "../../utils/number";
import { IconArrowLeft } from "@aragon/ui";
import { commit, recordVote } from "../../utils/web3";
import styles from "./index.module.scss";

function approval(approve: BigNumber, reject: BigNumber): BigNumber {
  return approve
    .multipliedBy(10000)
    .dividedToIntegerBy(approve.plus(reject))
    .dividedBy(100);
}

function participation(
  approve: BigNumber,
  reject: BigNumber,
  totalStake: BigNumber
): BigNumber {
  return approve
    .plus(reject)
    .multipliedBy(10000)
    .dividedToIntegerBy(totalStake)
    .dividedBy(100);
}
function BNtoText(balance) {
  let integer = "0";
  let digits = "0";
  const balanceBN = new BigNumber(balance);
  if (balanceBN.gte(new BigNumber(0))) {
    const tokens = formatBN(balanceBN, 2).split(".");
    integer = tokens[0];
    digits = tokens[1];
  }
  return integer + "." + digits;
}
function Candidate({
  user,
  data,
  onClose,
}: {
  user: string;
  data: any;
  onClose: Function;
}) {
  const [approveFor, setApproveFor] = useState(new BigNumber(0));
  const [rejectFor, setRejectFor] = useState(new BigNumber(0));
  const [totalStake, setTotalStake] = useState(new BigNumber(0));
  const [vote, setVote] = useState(0);
  const [status, setStatus] = useState(0);
  const [userStake, setUserStake] = useState(new BigNumber(0));
  const [epoch, setEpoch] = useState(0);
  const [startEpoch, setStartEpoch] = useState(0);
  const [periodEpoch, setPeriodEpoch] = useState(0);
  useEffect(() => {
    if (user === "") {
      setVote(0);
      setStatus(0);
      setUserStake(new BigNumber(0));
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [voteStr, statusStr, userStakeStr] = await Promise.all([
        getRecordedVote(ESDS.addr, user, data.candidate),
        getStatusOf(ESDS.addr, user),
        getTokenBalance(ESDS.addr, user),
      ]);

      if (!isCancelled) {
        setVote(parseInt(voteStr, 10));
        setStatus(parseInt(statusStr, 10));
        setUserStake(toTokenUnitsBN(userStakeStr, ESDS.decimals));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user, data.candidate]);

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      let [
        approveForStr,
        rejectForStr,
        totalStakeStr,
        epochStr,
        startForStr,
        periodForStr,
      ] = await Promise.all([
        getApproveFor(ESDS.addr, data.candidate),
        getRejectFor(ESDS.addr, data.candidate),
        getTokenTotalSupply(ESDS.addr),
        getEpoch(ESDS.addr),
        getStartFor(ESDS.addr, data.candidate),
        getPeriodFor(ESDS.addr, data.candidate),
      ]);

      const epochN = parseInt(epochStr, 10);
      const startN = parseInt(startForStr, 10);
      const periodN = parseInt(periodForStr, 10);

      const endsAfter = startN + periodN - 1;
      if (epochN > endsAfter) {
        totalStakeStr = await getTotalBondedAt(ESDS.addr, endsAfter);
      }

      if (!isCancelled) {
        setApproveFor(toTokenUnitsBN(approveForStr, ESDS.decimals));
        setRejectFor(toTokenUnitsBN(rejectForStr, ESDS.decimals));
        setTotalStake(toTokenUnitsBN(totalStakeStr, ESDS.decimals));
        setEpoch(epochN);
        setStartEpoch(startN);
        setPeriodEpoch(periodN);
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [data.candidate]);

  const showUnvote = vote === 0 || userStake.isZero();
  const candidateLink = "https://etherscan.io/address/" + data.candidate;
  const proposerLink = "https://etherscan.io/address/" + data.account;
  return (
    <div
      className={styles.candidateModal}
      style={{
        background:
          data.status === "Committed"
            ? "#37A33B"
            : data.status === "Rejected"
            ? "#F24900"
            : "",
      }}
    >
      <div className={data.status === "Committed" ? styles.committedText : ""}>
        <div className={styles.modalNav}>
          <span
            onClick={() => {
              onClose(false);
            }}
          >
            <IconArrowLeft size="large" />
          </span>
        </div>
        <div className={styles.candidateLink}>
          <p>Candidate</p>
          <p>
            <a href={candidateLink} target="_blank" rel="noopener noreferrer">
              {data.candidate}
            </a>
          </p>
        </div>
        <div className={styles.proposerLink}>
          <p>Proposer</p>
          <p>
            <a href={proposerLink} target="_blank" rel="noopener noreferrer">
              {data.account}
            </a>
          </p>
        </div>
        <div className={styles.voteHeader}>
          <div className={styles.textBlock}>
            <div className={styles.flexBlock}>
              <div>
                <p>Approve</p>
                <p>{BNtoText(approveFor) + " U8DS"}</p>
              </div>
              <div>
                <p>Epoch</p>
                <p>{epoch}</p>
              </div>
            </div>
          </div>

          <div className={styles.textBlock}>
            <div className={styles.flexBlock}>
              <div>
                <p>Reject</p>
                <p>{BNtoText(rejectFor) + " U8DS"}</p>
              </div>
              <div>
                <p>Starts</p>
                <p>{startEpoch}</p>
              </div>
            </div>
          </div>

          <div className={styles.textBlock}>
            <div className={styles.flexBlock}>
              <div>
                <p>Approval</p>
                <p>{BNtoText(approval(approveFor, rejectFor)) + "%"}</p>
              </div>

              <div>
                <p>Period</p>
                <p>{periodEpoch}</p>
              </div>
            </div>
          </div>

          <div className={styles.textBlock}>
            <div className={styles.flexBlock}>
              <div>
                <p>Participation</p>
                <p>
                  {BNtoText(participation(approveFor, rejectFor, totalStake)) +
                    "%"}
                </p>
              </div>

              <div>
                <p>Complete</p>
                <p>{(data.start + data.period).toString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className={styles.bottom}>
          {data.status === "Approved" && (
            <div
              className={styles.commit}
              onClick={async () => {
                if (user !== "" && data.status === "Approved")
                  await commit(ESDS.addr, data.candidate);
              }}
            >
              <p>Commit changes</p>
            </div>
          )}
          {!showUnvote &&
            data.status !== "Approved" &&
            data.status !== "Committed" &&
            data.status !== "Rejected" && (
              <div className={styles.commit_disabled}>
                <p>Commit changes</p>
              </div>
            )}
          {showUnvote &&
            data.status !== "Approved" &&
            data.status !== "Committed" &&
            data.status !== "Rejected" && (
              <div className={styles.commit_disabled}>
                <p>Commit changes</p>
              </div>
            )}

          <div className={styles.vote}>
            {data.status === "Approved" && !showUnvote && (
              <div className={styles.approved}>
                {vote === 1 && <p>You accepted</p>}
                {vote === 2 && <p>You rejected</p>}
                <p>Approved</p>
              </div>
            )}
            {data.status === "Approved" && showUnvote && (
              <div className={styles.approved}>
                <p>Status</p>
                <p>Approved</p>
              </div>
            )}
            {data.status === "Committed" && (
              <div className={styles.approved}>
                <p>Status</p>
                <p>Committed</p>
              </div>
            )}
            {data.status === "Rejected" && (
              <div className={styles.rejected}>
                <p>Status</p>
                <p>Rejected</p>
              </div>
            )}
            {!showUnvote &&
              data.status !== "Approved" &&
              data.status !== "Committed" &&
              data.status !== "Rejected" && (
                <div
                  className={styles.unvote}
                  onClick={async () => {
                    await recordVote(
                      ESDS.addr,
                      data.candidate,
                      0 // UNVOTE
                    );
                  }}
                >
                  {vote === 1 && <p>You accepted</p>}
                  {vote === 2 && <p>You rejected</p>}
                  <p>Unvote</p>
                </div>
              )}
            {showUnvote &&
              data.status !== "Approved" &&
              data.status !== "Committed" &&
              data.status !== "Rejected" && (
                <>
                  <div
                    className={styles.Accept}
                    onClick={async () => {
                      await recordVote(
                        ESDS.addr,
                        data.candidate,
                        1 // ACCEPT
                      );
                    }}
                  >
                    Accept
                  </div>
                  <div
                    className={styles.Reject}
                    onClick={async () => {
                      await recordVote(
                        ESDS.addr,
                        data.candidate,
                        2 // REJECT
                      );
                    }}
                  >
                    Reject
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Candidate;
