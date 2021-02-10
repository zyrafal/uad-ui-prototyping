import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { BoxItemTextBlock } from "../common/index";
import { startRewardStream, boostRewardStream } from "../../utils/web3";
import { isPos, toBaseUnitBN } from "../../utils/number";
import { ESD } from "../../constants/tokens";
import Box from "../Box";
import BoxItem from "../BoxItem";
import GetFromBigNumber from "../GetFromBigNumber";
import MobileCalcModal from "../../components/MobileCalcModal";
import SettingModalMobile from "../common/SettingModal/SettingModalMobile";
import ModalTitle from "../common/SettingModal/ModalTitle";
import ModalBtn from "../common/SettingModal/ModalBtn";

type ClaimMobileProps = {
  poolAddress: string;
  claimable: BigNumber;
};

function ClaimMobile({ poolAddress, claimable }: ClaimMobileProps) {
  const [claimAmount, setClaimAmount] = useState(new BigNumber(0));
  const [integer, digits] = GetFromBigNumber(claimable);
  const [showModal, setShowModal] = useState(false);
  const [claimSetting, setClaimSetting] = useState(false);
  const stagedText = integer + "." + digits + " uAD";
  const clickStaged = () => {
    setShowModal(true);
  };
  const btnDisabled1 = poolAddress === "" || !isPos(claimAmount);
  const btnDisabled2 = btnDisabled1;
  const showClaimSetting = () => {
    setClaimSetting(true);
  };
  const handleClaim = async (type) => {
    await startRewardStream(
      poolAddress,
      toBaseUnitBN(claimAmount, ESD.decimals)
    );
    if (type === "boost") {
      await boostRewardStream(poolAddress);
    }
    setClaimSetting(false);
  };
  return (
    <>
      <Box bgcolor="#282828" height="244px">
        <div
          style={{ width: "100%", display: "flex" }}
          onClick={() => clickStaged()}
        >
          <BoxItem>
            <BoxItemTextBlock
              fontSize="20px"
              color="rgba(255,255,255,0.4)"
              asset="Claimed"
            />
            <BoxItemTextBlock
              fontSize="32px"
              color="#ffffff"
              asset={stagedText}
            />
          </BoxItem>
        </div>

        {showModal && (
          <>
            <MobileCalcModal
              onClose={setShowModal}
              assets="Claimed "
              prefix=" uAD"
              balance={claimable}
              hasTab={false}
              depositAmount={claimAmount}
              setDepositAmount={setClaimAmount}
              submitDepositAction={showClaimSetting}
              withdrawAmount={claimAmount}
              setWithdrawAmount={setClaimAmount}
              submitWithdrawAction={showClaimSetting}
              stagedBalance={claimable}
              btnDisabled1={btnDisabled1}
              btnDisabled2={btnDisabled2}
            />
            {claimSetting && (
              <SettingModalMobile bgColor="#060606" onClose={setClaimSetting}>
                <ModalTitle>
                  <p>Your Withdraw</p>
                  <p>will take 36 hours</p>
                </ModalTitle>
                <div
                  style={{ position: "absolute", bottom: "0", width: "100%" }}
                >
                  <ModalBtn
                    height="262px"
                    bgColor="#3C67FF"
                    clickAction={handleClaim}
                    type="boost"
                  >
                    <p
                      style={{
                        fontSize: "32px",
                        lineHeight: "38px",
                        color: "#ffffff",
                        paddingTop: "93px",
                      }}
                    >
                      Make 2x faster for 25% penalty (
                      {claimAmount.toNumber() * 0.25 < 0.001
                        ? "<0.001"
                        : parseFloat(
                            (claimAmount.toNumber() * 0.25).toFixed(3)
                          ).toString()}{" "}
                      <span>uAD</span>)
                    </p>
                  </ModalBtn>

                  <ModalBtn
                    height="176px"
                    bgColor="#060606"
                    clickAction={handleClaim}
                    type="normal"
                  >
                    <p
                      style={{
                        fontSize: "32px",
                        lineHeight: "38px",
                        color: "#ffffff",
                        paddingTop: "50px",
                      }}
                    >
                      Will wait for 36 hours
                    </p>
                  </ModalBtn>
                </div>
              </SettingModalMobile>
            )}
          </>
        )}
      </Box>
    </>
  );
}

export default ClaimMobile;
