import React from "react";
import styles from "./index.module.scss";
type HistoryCardProps = {
  proposal: any;
  clickAction: Function;
};
const statusColorOptions = ["#FEB258", "#37A33B", "#FEB258", "#F24900"];
const statusOptions = ["Voting", "Committed", "Approved", "Rejected"];
const HistoryCard = ({ proposal, clickAction }: HistoryCardProps) => {
  const setUserFormat = (str: string) => {
    let substr = str.substring(0, 5) + "......" + str.substring(37);
    if (str === "") return str;
    return substr;
  };
  const statusColor =
    statusColorOptions[statusOptions.indexOf(proposal.status)];
  return (
    <div
      className={proposal.status === "Voting" ? styles.votingCard : styles.card}
      onClick={() => clickAction(proposal)}
    >
      <div className={styles.flexBlock}>
        <div className={styles.textBlock}>
          <p>Proposal</p>
          <p>{proposal.index}</p>
        </div>
        <div>
          <div className={styles.divideTwo}>
            <div className={styles.flexBlock}>
              <div className={styles.textBlock}>
                <p>Candidate</p>
                <p>{setUserFormat(proposal.candidate)}</p>
              </div>
              <div className={styles.textBlock}>
                <p>Proposed</p>
                <p>{proposal.start.toString()}</p>
              </div>
            </div>
            <div className={styles.flexBlock}>
              <div className={styles.textBlock}>
                <p>Proposer</p>
                <p>{setUserFormat(proposal.account)}</p>
              </div>
              <div className={styles.textBlock}>
                <p>Complete</p>
                <p>{(proposal.start + proposal.period).toString()}</p>
              </div>
            </div>
          </div>
          <div className={styles.textBlock}>
            <p>Status</p>
            <p>{proposal.status}</p>
          </div>
        </div>
      </div>
      <div
        className={styles.statusBar}
        style={{ background: statusColor }}
      ></div>
    </div>
  );
};

export default HistoryCard;
