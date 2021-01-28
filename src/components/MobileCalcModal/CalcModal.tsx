import React from "react";
import NumberInput from "../common/NumberInput";
import BigNumber from "bignumber.js";
import { MaxButton } from "../common/index";
import { Button } from "@aragon/ui";
import GetFromBigNumber from "../../components/GetFromBigNumber";

type CalcModalProps = {
  depositAmount: BigNumber;
  setDepositAmount: Function;
  balance: BigNumber;
  btnLabel: string;
  submitBtnAction: Function;
  color: string;
  btnDisabled: Boolean;
  prefix: string;
  maxBtnAction?: Function;
  usdcAmount?: string;
};
function CalcModal({
  depositAmount,
  setDepositAmount,
  balance,
  btnLabel,
  submitBtnAction,
  color,
  btnDisabled,
  prefix,
  maxBtnAction,
  usdcAmount,
}: CalcModalProps) {
  const placeholder = "0.000000";
  return (
    <div>
      <div style={{ padding: "32px" }}>
        <NumberInput
          value={depositAmount}
          border={false}
          setter={setDepositAmount}
          placeholder={placeholder}
        >
          <span
            style={{
              paddingTop: "8px",
              fontSize: "20px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {prefix}
          </span>
        </NumberInput>
        <div style={{ height: "50px" }}></div>
        {maxBtnAction ? (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <MaxButton
              onClick={() => {
                maxBtnAction();
              }}
              text={""}
            />
            <span
              style={{
                color: "#ffffff",
                fontSize: "20px",
                lineHeight: "24px",
              }}
            >
              <span style={{ opacity: "0.4", marginRight: "5px" }}>
                {"U8D->USDC"}
              </span>
              <span style={{ opacity: "0.4" }}>{usdcAmount}</span>
            </span>
          </div>
        ) : (
          <MaxButton
            onClick={() => {
              setDepositAmount(balance);
            }}
            text={GetFromBigNumber(balance).toString().replace(",", ".")}
          />
        )}
      </div>
      <Button
        style={{
          border: "none",
          boxShadow: "none",
          borderRadius: "0",
          color: "white",
          background: color,
          fontSize: "20px",
          cursor: "pointer",
          flex: "1",
          height: "75px",
          paddingLeft: "32px",
          justifyContent: "left",
        }}
        wide
        label={btnLabel}
        onClick={() => {
          submitBtnAction();
        }}
        disabled={btnDisabled}
      />
    </div>
  );
}
export default CalcModal;
