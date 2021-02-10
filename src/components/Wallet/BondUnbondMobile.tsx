import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { BoxItemTextBlock } from "../common/index";
import { bond, unbondUnderlying } from "../../utils/web3";
import Box from "../../components/Box";
import BoxItem from "../../components/BoxItem";
import MobileCalcModal from "../../components/MobileCalcModal";
import GetFromBigNumber from "../../components/GetFromBigNumber";
import { isPos, toBaseUnitBN } from "../../utils/number";
import { ESD, ESDS } from "../../constants/tokens";

type BondUnbondMobileProps = {
  staged: BigNumber;
  bonded: BigNumber;
  status: number;
};

function BondUnbondMobile({ staged, bonded, status }: BondUnbondMobileProps) {
  const [bondAmount, setBondAmount] = useState(new BigNumber(0));
  const [unbondAmount, setUnbondAmount] = useState(new BigNumber(0));
  const [showModal, setShowModal] = useState(false);

  const [integer, digits] = GetFromBigNumber(bonded);
  const BondText = integer + "." + digits + " uAD";
  const clickStaged = () => {
    setShowModal(true);
  };
  const handleBond = async () => {
    await bond(ESDS.addr, toBaseUnitBN(bondAmount, ESD.decimals));
  };

  const handleUnbond = async () => {
    await unbondUnderlying(ESDS.addr, toBaseUnitBN(unbondAmount, ESD.decimals));
  };
  const btnDisabled2 =
    status === 1 || !isPos(unbondAmount) || unbondAmount.isGreaterThan(bonded);
  const btnDisabled1 =
    status === 1 || !isPos(bondAmount) || bondAmount.isGreaterThan(staged);
  return (
    <>
      <Box bgcolor="#171717" height="244px">
        <div
          style={{ width: "100%", display: "flex" }}
          onClick={() => clickStaged()}
        >
          <BoxItem>
            <BoxItemTextBlock
              fontSize="20px"
              color="rgba(255,255,255,0.4)"
              asset="Bond"
            />
            <BoxItemTextBlock
              fontSize="32px"
              color="#ffffff"
              asset={BondText}
            />
          </BoxItem>
        </div>
      </Box>
      {showModal && (
        <MobileCalcModal
          onClose={setShowModal}
          assets="Bonded "
          prefix=" uAD"
          balance={staged}
          hasTab={true}
          depositAmount={bondAmount}
          setDepositAmount={setBondAmount}
          submitDepositAction={handleBond}
          withdrawAmount={unbondAmount}
          setWithdrawAmount={setUnbondAmount}
          submitWithdrawAction={handleUnbond}
          stagedBalance={bonded}
          status={status}
          btnDisabled1={btnDisabled1}
          btnDisabled2={btnDisabled2}
        />
      )}
    </>
  );
}

export default BondUnbondMobile;
