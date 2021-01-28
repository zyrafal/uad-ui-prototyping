import React, { useEffect, useState } from "react";
import { Pagination } from "@aragon/ui";

import { getAllRegulations } from "../../utils/infura";
import { ESD, ESDS } from "../../constants/tokens";
import { formatBN, toTokenUnitsBN } from "../../utils/number";
import HistoryCardMobile from "./HistoryCardMobile";
import BigNumber from "bignumber.js";
import styles from "./mobile.module.scss";
type RegulationHistoryMobileProps = {
  user: string;
};

type Regulation = {
  type: string;
  data: RegulationEntry;
};

type RegulationEntry = {
  epoch: string;
  price: string;
  deltaRedeemable: string;
  deltaDebt: string;
  deltaBonded: string;
};

function formatPrice(type, data) {
  return type === "NEUTRAL"
    ? "1.00"
    : formatBN(toTokenUnitsBN(new BigNumber(data.price), ESD.decimals), 3);
}

function formatDeltaRedeemable(type, data) {
  return type === "INCREASE"
    ? "+" +
        formatBN(
          toTokenUnitsBN(new BigNumber(data.newRedeemable), ESD.decimals),
          2
        )
    : "+0.00";
}

function formatDeltaDebt(type, data) {
  return type === "INCREASE"
    ? "-" +
        formatBN(toTokenUnitsBN(new BigNumber(data.lessDebt), ESD.decimals), 2)
    : type === "DECREASE"
    ? "+" +
      formatBN(toTokenUnitsBN(new BigNumber(data.newDebt), ESD.decimals), 2)
    : "+0.00";
}

function formatDeltaBonded(type, data) {
  return type === "INCREASE"
    ? "+" +
        formatBN(toTokenUnitsBN(new BigNumber(data.newBonded), ESD.decimals), 2)
    : "+0.00";
}

function renderEntry({ type, data }: Regulation): RegulationEntry {
  return {
    epoch: data.epoch.toString(),
    price: formatPrice(type, data),
    deltaRedeemable: formatDeltaRedeemable(type, data),
    deltaDebt: formatDeltaDebt(type, data),
    deltaBonded: formatDeltaBonded(type, data),
  };
}

function RegulationHistoryMobile({ user }: RegulationHistoryMobileProps) {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [page, setPage] = useState(0);
  // const [initialized, setInitialized] = useState(false);
  const [selected, setSelected] = useState(0);
  const [historyPerpage, setHistoryPerpage] = useState<RegulationEntry[]>([]);
  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [allRegulations] = await Promise.all([
        getAllRegulations(ESDS.addr),
      ]);

      if (!isCancelled) {
        setRegulations(allRegulations);
        const totalPage = Math.ceil(allRegulations.length / 5);
        setPage(totalPage);
        let i,
          last = 0;
        allRegulations.length < 5 ? (last = allRegulations.length) : (last = 5);
        let array: RegulationEntry[] = [];
        for (i = 0; i < last; i++) {
          array = [...array, renderEntry(allRegulations[i])];
        }
        setHistoryPerpage(array);

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

  const onChangePagination = (item) => {
    setSelected(item);
    let array: RegulationEntry[] = [];
    let i,
      last = Math.min((item + 1) * 5, regulations.length);
    for (i = item * 5; i < last; i++) {
      array = [...array, renderEntry(regulations[i])];
    }
    setHistoryPerpage(array);
  };
  return (
    <div className={styles.history}>
      <p className={styles.historyTitle}>History</p>
      <div className={styles.mobileHistory}>
        {historyPerpage.map((data, index) => {
          return (
            <HistoryCardMobile
              key={index}
              epoch={data.epoch}
              price={data.price}
              redeemable={data.deltaRedeemable}
              dept={data.deltaDebt}
              bonded={data.deltaBonded}
            />
          );
        })}
      </div>
      <div className={styles.pagination}>
        <Pagination
          pages={page}
          selected={selected}
          onChange={onChangePagination}
        />
      </div>
    </div>
  );
}

export default RegulationHistoryMobile;
