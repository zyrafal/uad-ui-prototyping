import React, { useState } from "react";
import { Button } from "@aragon/ui";
import { CSSTransition } from "react-transition-group";
import BigNumber from "bignumber.js";
import { BoxItemTextBlock, MaxButton } from "../common/index";
import {
  deposit,
  depositAndBond,
  startStream,
  boostStream,
} from "../../utils/web3";
import { isPos, toBaseUnitBN } from "../../utils/number";
import { ESD, ESDS } from "../../constants/tokens";
import NumberInput from "../common/NumberInput";
import Box from "../../components/Box";
import BoxItem from "../../components/BoxItem";
import GetFromBigNumber from "../../components/GetFromBigNumber";
import SettingModal from "../common/SettingModal";
import ModalTitle from "../common/SettingModal/ModalTitle";
import ModalBtn from "../common/SettingModal/ModalBtn";
import "../NavBar/fade.css";
type WithdrawDepositProps = {
  balance: BigNumber;
  stagedBalance: BigNumber;
  status: number;
};

function WithdrawDeposit({
  balance,
  stagedBalance,
  status,
}: WithdrawDepositProps) {
  const [depositAmount, setDepositAmount] = useState(new BigNumber(0));
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));
  const [integer, digits] = GetFromBigNumber(stagedBalance);
  const stagedText = "Staged " + integer + "." + digits + " U8D";
  const [depositSetting, setDepositSetting] = useState(false);
  const [withdrawSetting, setWithdrawSetting] = useState(false);

  const handleDisabled = () => {
    console.log("action disabled");
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
  return (
    <Box bgcolor="#282828" height="288px">
      <BoxItem>
        <BoxItemTextBlock fontSize="20px" color="#ffffff" asset={stagedText} />
        <div>
          <NumberInput
            value={depositAmount}
            setter={setDepositAmount}
            placeholder="0.000000 U8D"
            disabled={status !== 0}
          >
            <Button
              style={{
                border: "none",
                boxShadow: "none",
                background: "transparent",
                color: "white",
                fontSize: "40px",
                cursor: "pointer",
                flex: 1,
                justifyContent: "flex-start",
              }}
              wide
              label="+ Deposit"
              onClick={() => {
                setDepositSetting(true);
              }}
              disabled={
                !isPos(depositAmount) || depositAmount.isGreaterThan(balance)
              }
            />
          </NumberInput>
          <MaxButton
            onClick={() => {
              setDepositAmount(balance);
            }}
            text={GetFromBigNumber(balance).toString().replace(",", ".")}
          />
        </div>
      </BoxItem>

      <BoxItem>
        <BoxItemTextBlock
          fontSize="20px"
          color="rgba(255,255,255,0.4)"
          asset="Default streaming time: 72 hours"
        />
        <div>
          <NumberInput
            value={withdrawAmount}
            setter={setWithdrawAmount}
            placeholder="0.000000 U8D"
            disabled={status !== 0}
          >
            <Button
              style={{
                border: "none",
                boxShadow: "none",
                background: "transparent",
                color: "white",
                fontSize: "40px",
                flex: 1,
                cursor: "pointer",
                justifyContent: "flex-start",
              }}
              wide
              label="- Withdraw"
              onClick={() => {
                setWithdrawSetting(true);
              }}
              disabled={
                !isPos(withdrawAmount) ||
                withdrawAmount.isGreaterThan(stagedBalance)
              }
            />
          </NumberInput>

          <MaxButton
            onClick={() => {
              setWithdrawAmount(stagedBalance);
            }}
            text={GetFromBigNumber(stagedBalance).toString().replace(",", ".")}
          />
        </div>
      </BoxItem>
      <CSSTransition
        in={depositSetting}
        timeout={200}
        classNames="fade"
        unmountOnExit
      >
        <div>
          <SettingModal onClose={setDepositSetting}>
            <ModalTitle>
              <p>Where do you</p>
              <p>want to deposit?</p>
            </ModalTitle>
            <div style={{ position: "absolute", bottom: "0", width: "100%" }}>
              <ModalBtn
                height="216px"
                bgColor="#3C67FF"
                clickAction={status === 1 ? handleDisabled : handleDeposit}
                type="both"
                disabled={status === 1 ? true : false}
              >
                <p
                  style={{
                    fontSize: "32px",
                    lineHeight: "38px",
                    color: "#ffffff",
                    paddingTop: "70px",
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
                bgColor="#424242"
                clickAction={handleDeposit}
                type="stage"
                disabled={false}
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
          </SettingModal>
        </div>
      </CSSTransition>

      <CSSTransition
        in={withdrawSetting}
        timeout={200}
        classNames="fade"
        unmountOnExit
      >
        <div>
          <SettingModal onClose={setWithdrawSetting}>
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
                  <span>U8D</span>)
                </p>
              </ModalBtn>

              <ModalBtn
                height="176px"
                bgColor="#424242"
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
          </SettingModal>
        </div>
      </CSSTransition>
    </Box>
  );
}

export default WithdrawDeposit;
