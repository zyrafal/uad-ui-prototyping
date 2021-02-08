import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { BoxItemTextBlock } from "../common/index";
import {
  deposit,
  depositAndBond,
  startStream,
  boostStream,
} from "../../utils/web3";
import { ESD, ESDS } from "../../constants/tokens";
import Box from "../../components/Box";
import BoxItem from "../../components/BoxItem";
import MobileCalcModal from "../../components/MobileCalcModal";
import GetFromBigNumber from "../../components/GetFromBigNumber";
import { isPos, toBaseUnitBN } from "../../utils/number";
import SettingModalMobile from "../common/SettingModal/SettingModalMobile";
import ModalTitle from "../common/SettingModal/ModalTitle";
import ModalBtn from "../common/SettingModal/ModalBtn";

type WidthdrawDepositMobileProps = {
  balance: BigNumber;
  stagedBalance: BigNumber;
  status: number;
};

function WidthdrawDepositMobile({
  balance,
  stagedBalance,
  status,
}: WidthdrawDepositMobileProps) {
  const [depositAmount, setDepositAmount] = useState(new BigNumber(0));
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));
  const [showModal, setShowModal] = useState(false);
  const [depositSetting, setDepositSetting] = useState(false);
  const [withdrawSetting, setWithdrawSetting] = useState(false);
  const [integer, digits] = GetFromBigNumber(stagedBalance);
  const stagedText = integer + "." + digits + " UAD";
  const btnDisabled1 =
    !isPos(depositAmount) || depositAmount.isGreaterThan(balance);
  const btnDisabled2 =
    status === 1 ||
    !isPos(withdrawAmount) ||
    withdrawAmount.isGreaterThan(stagedBalance);
  const clickStaged = () => {
    setShowModal(true);
  };
  const handleDeposit = async (type) => {
    if (type === "stage") {
      await deposit(ESDS.addr, toBaseUnitBN(depositAmount, ESD.decimals));
    } else if (type === "both") {
      await depositAndBond(
        ESDS.addr,
        toBaseUnitBN(depositAmount, ESD.decimals)
      );
    }
    setDepositSetting(false);
  };

  const handleWithdraw = async (type) => {
    await startStream(ESDS.addr, toBaseUnitBN(withdrawAmount, ESD.decimals));
    if (type === "boost") {
      await boostStream(ESDS.addr);
    }
    setWithdrawSetting(false);
  };

  const showDepositSetting = () => {
    setDepositSetting(true);
  };
  const showWithdrawSetting = () => {
    setWithdrawSetting(true);
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
              asset="Staged"
            />
            <BoxItemTextBlock
              fontSize="32px"
              color="#ffffff"
              asset={stagedText}
            />
          </BoxItem>
        </div>
      </Box>
      {showModal && (
        <>
          <MobileCalcModal
            onClose={setShowModal}
            assets="Staged "
            prefix=" UAD"
            balance={balance}
            hasTab={true}
            depositAmount={depositAmount}
            setDepositAmount={setDepositAmount}
            submitDepositAction={showDepositSetting}
            withdrawAmount={withdrawAmount}
            setWithdrawAmount={setWithdrawAmount}
            submitWithdrawAction={showWithdrawSetting}
            stagedBalance={stagedBalance}
            status={status}
            btnDisabled1={btnDisabled1}
            btnDisabled2={btnDisabled2}
          />
          {depositSetting && (
            <SettingModalMobile bgColor="#060606" onClose={setDepositSetting}>
              <ModalTitle>
                <p>Where do you</p>
                <p>want to deposit?</p>
              </ModalTitle>
              <div style={{ position: "absolute", bottom: "0", width: "100%" }}>
                <ModalBtn
                  height="216px"
                  bgColor="#3C67FF"
                  clickAction={handleDeposit}
                  type="both"
                >
                  <p
                    style={{
                      fontSize: "32px",
                      lineHeight: "38px",
                      color: "#ffffff",
                      paddingTop: "51px",
                    }}
                  >
                    Stage + bond
                  </p>
                  <p
                    style={{
                      fontSize: "32px",
                      lineHeight: "38px",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    Save gas and bond in one click
                  </p>
                </ModalBtn>

                <ModalBtn
                  height="216px"
                  bgColor="#060606"
                  clickAction={handleDeposit}
                  type="stage"
                >
                  <p
                    style={{
                      fontSize: "32px",
                      lineHeight: "38px",
                      color: "#ffffff",
                      paddingTop: "89px",
                    }}
                  >
                    Only stage
                  </p>
                </ModalBtn>
              </div>
            </SettingModalMobile>
          )}

          {withdrawSetting && (
            <SettingModalMobile bgColor="#060606" onClose={setWithdrawSetting}>
              <ModalTitle>
                <p>Your Withdraw</p>
                <p>will take 72 hours</p>
              </ModalTitle>
              <div style={{ position: "absolute", bottom: "0", width: "100%" }}>
                <ModalBtn
                  height="262px"
                  bgColor="#3C67FF"
                  clickAction={handleWithdraw}
                  type="boost"
                >
                  <p
                    style={{
                      fontSize: "32px",
                      lineHeight: "38px",
                      color: "#ffffff",
                      paddingTop: "112px",
                    }}
                  >
                    Make 2x faster for 25% penalty (
                    {withdrawAmount.toNumber() * 0.25 < 0.001
                      ? "<0.001"
                      : parseFloat(
                          (withdrawAmount.toNumber() * 0.25).toFixed(3)
                        ).toString()}{" "}
                    <span>UAD</span>)
                  </p>
                </ModalBtn>

                <ModalBtn
                  height="176px"
                  bgColor="#060606"
                  clickAction={handleWithdraw}
                  type="normal"
                >
                  <p
                    style={{
                      fontSize: "32px",
                      lineHeight: "38px",
                      color: "#ffffff",
                      paddingTop: "69px",
                    }}
                  >
                    Will wait for 72 hours
                  </p>
                </ModalBtn>
              </div>
            </SettingModalMobile>
          )}
        </>
      )}
    </>
  );
}

export default WidthdrawDepositMobile;
