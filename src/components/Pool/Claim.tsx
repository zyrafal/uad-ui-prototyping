import React, { useState } from "react";
import { Button } from "@aragon/ui";
import BigNumber from "bignumber.js";
import { CSSTransition } from "react-transition-group";
import { BoxItemTextBlock, MaxButton } from "../common/index";
import { startRewardStream, boostRewardStream } from "../../utils/web3";
import { isPos, toBaseUnitBN } from "../../utils/number";
import { ESD } from "../../constants/tokens";
import NumberInput from "../common/NumberInput";
import Box from "../../components/Box";
import BoxItem from "../../components/BoxItem";
import GetFromBigNumber from "../../components/GetFromBigNumber";
import SettingModal from "../common/SettingModal";
import ModalTitle from "../common/SettingModal/ModalTitle";
import ModalBtn from "../common/SettingModal/ModalBtn";
import "../NavBar/fade.css";
type ClaimProps = {
  poolAddress: string;
  claimable: BigNumber;
};

function Claim({ poolAddress, claimable }: ClaimProps) {
  const [claimAmount, setClaimAmount] = useState(new BigNumber(0));
  const [integer, digits] = GetFromBigNumber(claimable);
  const [withdrawSetting, setWithdrawSetting] = useState(false);
  const handleWithdraw = async (type) => {
    await startRewardStream(
      poolAddress,
      toBaseUnitBN(claimAmount, ESD.decimals)
    );
    if (type === "boost") {
      await boostRewardStream(poolAddress);
    }
    setWithdrawSetting(false);
  };
  const stagedText = "Claimable " + integer + "." + digits + " UAD";
  return (
    <Box bgcolor="#282828" height="288px">
      <BoxItem>
        <BoxItemTextBlock fontSize="20px" color="#ffffff" asset={stagedText} />
        <div>
          <NumberInput
            value={claimAmount}
            setter={setClaimAmount}
            placeholder="0.000000 UAD"
          >
            <Button
              style={{
                border: "none",
                boxShadow: "none",
                background: "transparent",
                color: "white",
                fontSize: "40px",
                cursor: "pointer",
                flex: "1",
              }}
              wide
              label="- Start Stream"
              onClick={() => {
                setWithdrawSetting(true);
              }}
              disabled={poolAddress === "" || !isPos(claimAmount)}
            />
          </NumberInput>
          <MaxButton
            onClick={() => {
              setClaimAmount(claimable);
            }}
            text={GetFromBigNumber(claimable).toString().replace(",", ".")}
          />
        </div>
      </BoxItem>
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
                  {claimAmount.toNumber() * 0.25 < 0.001
                    ? "<0.001"
                    : parseFloat(
                        (claimAmount.toNumber() * 0.25).toFixed(3)
                      ).toString()}{" "}
                  <span>UAD</span>)
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

export default Claim;
