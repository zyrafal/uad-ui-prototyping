import React, { useState } from "react";
import { Button } from "@aragon/ui";
import BigNumber from "bignumber.js";
import { BoxItemTextBlock, MaxButton } from "../common/index";
import {
  deposit,
  depositAndBond,
  startLpStream,
  boostLpStream,
} from "../../utils/web3";
import { CSSTransition } from "react-transition-group";
import { isPos, toBaseUnitBN } from "../../utils/number";
import { UNI } from "../../constants/tokens";
import NumberInput from "../common/NumberInput";
import Box from "../../components/Box";
import BoxItem from "../../components/BoxItem";
import GetFromBigNumber from "../../components/GetFromBigNumber";
import SettingModal from "../common/SettingModal";
import ModalTitle from "../common/SettingModal/ModalTitle";
import ModalBtn from "../common/SettingModal/ModalBtn";
import "../NavBar/fade.css";
type WithdrawDepositProps = {
  poolAddress: string;
  user: string;
  balance: BigNumber;
  allowance: BigNumber;
  stagedBalance: BigNumber;
};

function WithdrawDeposit({
  poolAddress,
  user,
  balance,
  allowance,
  stagedBalance,
}: WithdrawDepositProps) {
  const [depositAmount, setDepositAmount] = useState(new BigNumber(0));
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));
  const [integer, digits] = GetFromBigNumber(balance);
  const stagedText = "Staged " + integer + "." + digits + " UNI-V2";
  const [depositSetting, setDepositSetting] = useState(false);
  const [withdrawSetting, setWithdrawSetting] = useState(false);

  const handleDeposit = async (type) => {
    if (type === "stage") {
      await deposit(poolAddress, toBaseUnitBN(depositAmount, UNI.decimals));
    } else if (type === "both") {
      await depositAndBond(
        poolAddress,
        toBaseUnitBN(depositAmount, UNI.decimals)
      );
    }
    setDepositSetting(false);
  };

  const handleWithdraw = async (type) => {
    await startLpStream(
      poolAddress,
      toBaseUnitBN(withdrawAmount, UNI.decimals)
    );
    if (type === "boost") {
      await boostLpStream(poolAddress);
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
            placeholder="0.000000 UNI-V2"
          >
            <Button
              style={{
                boxShadow: "none",
                background: "transparent",
                color: "white",
                fontSize: "40px",
                cursor: "pointer",
                flex: 1,
                justifyContent: "flex-start",
                border: "none",
              }}
              wide
              label="+ Deposit"
              onClick={() => {
                setDepositSetting(true);
              }}
              disabled={poolAddress === "" || !isPos(depositAmount)}
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
          asset=""
        />
        <div>
          <NumberInput
            value={withdrawAmount}
            setter={setWithdrawAmount}
            placeholder="0.000000 StableSwap LP"
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
              label="- Withdraw"
              onClick={() => {
                setWithdrawSetting(true);
              }}
              disabled={poolAddress === "" || !isPos(withdrawAmount)}
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
                clickAction={handleDeposit}
                type="both"
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
              <p>will take 36 hours</p>
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
                  <span>UNI-V2</span>)
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
                  Will wait for 36 hours
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
