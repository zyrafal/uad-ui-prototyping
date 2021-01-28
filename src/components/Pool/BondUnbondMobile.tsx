import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { BoxItemTextBlock } from "../common/index";
import { bondPool, unbondPool } from "../../utils/web3";
import { isPos, toBaseUnitBN } from "../../utils/number";
import { UNI } from "../../constants/tokens";
import Box from "../Box";
import BoxItem from "../BoxItem";
import GetFromBigNumber from "../GetFromBigNumber";
import MobileCalcModal from "../../components/MobileCalcModal";

type BondUnbondMobileProps = {
  poolAddress: string;
  staged: BigNumber;
  bonded: BigNumber;
};

function BondUnbondMobile({
  poolAddress,
  staged,
  bonded,
}: BondUnbondMobileProps) {
  const [bondAmount, setBondAmount] = useState(new BigNumber(0));
  const [unbondAmount, setUnbondAmount] = useState(new BigNumber(0));
  const [showModal, setShowModal] = useState(false);

  const [integer, digits] = GetFromBigNumber(bonded);
  const BondText = integer + "." + digits + " UNI-V2";
  const clickStaged = () => {
    setShowModal(true);
  };
  const handleBond = async () => {
    await bondPool(
      poolAddress,
      toBaseUnitBN(bondAmount, UNI.decimals),
      (hash) => setBondAmount(new BigNumber(0))
    );
  };

  const handleUnbond = async () => {
    await unbondPool(
      poolAddress,
      toBaseUnitBN(unbondAmount, UNI.decimals),
      (hash) => setUnbondAmount(new BigNumber(0))
    );
  };

  const btnDisabled1 = poolAddress === "" || !isPos(bondAmount);
  const btnDisabled2 = poolAddress === "" || !isPos(unbondAmount);
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
              asset="Bonded"
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
          prefix=" UNI-V2"
          balance={staged}
          hasTab={true}
          depositAmount={bondAmount}
          setDepositAmount={setBondAmount}
          submitDepositAction={handleBond}
          withdrawAmount={unbondAmount}
          setWithdrawAmount={setUnbondAmount}
          submitWithdrawAction={handleUnbond}
          stagedBalance={bonded}
          btnDisabled1={btnDisabled1}
          btnDisabled2={btnDisabled2}
        />
      )}
    </>
  );
}

export default BondUnbondMobile;
