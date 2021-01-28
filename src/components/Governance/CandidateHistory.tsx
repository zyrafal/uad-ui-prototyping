import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import {
  getAllProposals,
  getApproveFor,
  getEpoch,
  getIsInitialized,
  getRejectFor,
  getTokenTotalSupply,
  getTotalBondedAt,
} from "../../utils/infura";
import { ESDS } from "../../constants/tokens";
import { proposalStatus } from "../../utils/gov";
import BigNumber from "bignumber.js";
import HistoryCard from "./HistoryCard";
import Candidate from "./Candidate";
type CandidateHistoryProps = {
  user: string;
  hasWeb3: boolean;
  setUser: Function;
};

type Proposal = {
  index: number;
  candidate: string;
  account: string;
  start: number;
  period: number;
  status: string;
};

async function formatProposals(
  epoch: number,
  proposals: any[]
): Promise<Proposal[]> {
  const currentTotalStake = await getTokenTotalSupply(ESDS.addr);
  const initializeds = await Promise.all(
    proposals.map((p) => getIsInitialized(ESDS.addr, p.candidate))
  );
  const approves = await Promise.all(
    proposals.map((p) => getApproveFor(ESDS.addr, p.candidate))
  );
  const rejecteds = await Promise.all(
    proposals.map((p) => getRejectFor(ESDS.addr, p.candidate))
  );
  const supplyAts = await Promise.all(
    proposals.map(async (p) => {
      const at = p.start + p.period - 1;
      if (epoch > at) {
        return await getTotalBondedAt(ESDS.addr, at);
      }
      return currentTotalStake;
    })
  );

  for (let i = 0; i < proposals.length; i++) {
    proposals[i].index = proposals.length - i;
    proposals[i].start = parseInt(proposals[i].start);
    proposals[i].period = parseInt(proposals[i].period);
    proposals[i].status = proposalStatus(
      epoch,
      proposals[i].start,
      proposals[i].period,
      initializeds[i],
      new BigNumber(approves[i]),
      new BigNumber(rejecteds[i]),
      new BigNumber(supplyAts[i])
    );
  }
  return proposals;
}

function CandidateHistory({ user, hasWeb3, setUser }: CandidateHistoryProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  // const [initialized, setInitialized] = useState(false);
  const [data, setData] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [epochStr, allProposals] = await Promise.all([
        getEpoch(ESDS.addr),
        getAllProposals(ESDS.addr),
      ]);

      if (!isCancelled) {
        const formattedProposals = await formatProposals(
          parseInt(epochStr),
          allProposals
        );
        setProposals(formattedProposals);
        // setInitialized(true);
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

  const selectCandidate = (data) => {
    setData(data);
    setShowModal(true);
  };
  return (
    <>
      <p className={styles.governanceTitle}>
        {proposals.length > 0
          ? "Candidate History"
          : "There are no candidates for now"}
      </p>
      <div className={styles.candidateHistory}>
        {proposals.map((proposal, index) => {
          return (
            <HistoryCard
              key={index}
              proposal={proposal}
              clickAction={selectCandidate}
            />
          );
        })}
      </div>
      {showModal && (
        <>
          <div
            className={styles.mask}
            onClick={() => {
              setShowModal(false);
            }}
          ></div>
          <div className={styles.candidate}>
            <Candidate user={user} data={data} onClose={setShowModal} />
          </div>
        </>
      )}
    </>
  );
}

export default CandidateHistory;
