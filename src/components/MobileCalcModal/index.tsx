import React, { useState } from "react";
import BigNumber from "bignumber.js";
import classNames from "classnames";
import ModalNav from "./ModalNav";
import CalcModal from "./CalcModal";
import NumberPad from "./NumberPad";
import GetFromBigNumber from "../../components/GetFromBigNumber";

import styles from "./index.module.scss";

type MobileCalcProps = {
  onClose: Function;
  assets: string;
  prefix: string;
  balance: BigNumber;
  hasTab: boolean;
  depositAmount: BigNumber;
  setDepositAmount: Function;
  withdrawAmount: BigNumber;
  setWithdrawAmount: Function;
  stagedBalance: BigNumber;
  submitDepositAction: Function;
  submitWithdrawAction: Function;
  btnDisabled1: Boolean;
  btnDisabled2: Boolean;
  status?: number;
  maxBtnAction?: Function;
  usdcAmount?: string;
};
function MobileCalcModal({
  onClose,
  assets,
  prefix,
  balance,
  hasTab,
  depositAmount,
  setDepositAmount,
  withdrawAmount,
  setWithdrawAmount,
  stagedBalance,
  submitDepositAction,
  submitWithdrawAction,
  btnDisabled1,
  btnDisabled2,
  status,
  maxBtnAction,
  usdcAmount,
}: MobileCalcProps) {
  const [integer, digits] = GetFromBigNumber(stagedBalance);

  const navTitle = assets + integer + "." + digits + prefix;
  const DepositText =
    assets === "Staged "
      ? "Deposit"
      : assets === "Bonded "
      ? "Bond"
      : assets === "Claimed "
      ? "Start Stream"
      : "Provide";
  const WidthdrawText = assets === "Staged " ? "Withdraw" : "Unbond";
  const btnDepositLabel = "+ " + DepositText;
  const btnWithdrawLabel = "- " + WidthdrawText;
  const [selected, setSelected] = useState(true);
  const handleDeposit = () => {
    setSelected(true);
  };
  const handleWithdraw = () => {
    setSelected(false);
  };
  const tabDepositClass = classNames(styles.tabItem, selected && styles.active);
  const tabWithdrawClass = classNames(
    styles.tabItem,
    !selected && styles.active
  );
  return (
    <div className={styles.modalFront}>
      <div className={styles.modalTop}>
        <ModalNav text={navTitle} onClose={onClose} />
        {hasTab && (
          <>
            <div className={styles.border}></div>
            <div className={styles.tabList}>
              <div className={tabDepositClass} onClick={handleDeposit}>
                {DepositText}
              </div>
              <div className={tabWithdrawClass} onClick={handleWithdraw}>
                {WidthdrawText}
              </div>
            </div>
          </>
        )}
      </div>
      <div className={styles.modalContent}>
        {hasTab && selected && (
          <>
            <CalcModal
              depositAmount={depositAmount}
              setDepositAmount={setDepositAmount}
              balance={balance}
              prefix={prefix}
              btnLabel={btnDepositLabel}
              color="#3C67FF"
              submitBtnAction={submitDepositAction}
              btnDisabled={btnDisabled1}
            />
            <NumberPad setter={setDepositAmount} value={depositAmount} />
          </>
        )}
        {hasTab && !selected && (
          <>
            <CalcModal
              depositAmount={withdrawAmount}
              setDepositAmount={setWithdrawAmount}
              balance={stagedBalance}
              btnLabel={btnWithdrawLabel}
              prefix={prefix}
              color="#E60419"
              submitBtnAction={submitWithdrawAction}
              btnDisabled={btnDisabled2}
            />
            <NumberPad setter={setWithdrawAmount} value={withdrawAmount} />
          </>
        )}
        {!hasTab && (
          <>
            <CalcModal
              depositAmount={depositAmount}
              setDepositAmount={setDepositAmount}
              balance={balance}
              btnLabel={btnDepositLabel}
              prefix={prefix}
              color="#3C67FF"
              submitBtnAction={submitDepositAction}
              btnDisabled={btnDisabled1}
              maxBtnAction={maxBtnAction}
              usdcAmount={usdcAmount}
            />
            <NumberPad setter={setDepositAmount} value={depositAmount} />
          </>
        )}
      </div>
    </div>
  );
}
export default MobileCalcModal;
