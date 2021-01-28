import React from "react";

import BigNumber from "bignumber.js";
import { formatBN } from "../../utils/number";

type BigNumberPlainTextProps = {
  asset: string;
  balance: BigNumber | string | number;
  suffix?: string;
  color?: string;
};

function BigNumberPlainText({
  asset,
  balance,
  suffix = "",
  color = "grey",
}: BigNumberPlainTextProps) {
  let integer = "0";
  let digits = "0";
  const balanceBN = new BigNumber(balance);
  if (balanceBN.gte(new BigNumber(0))) {
    const tokens = formatBN(balanceBN, 2).split(".");
    integer = tokens[0];
    digits = tokens[1];
  }

  return (
    <>
      <p style={{ display: "flex" }}>
        {asset !== "" && color === "grey" && (
          <span className="asset" style={{ marginRight: "5px" }}>
            {asset}
          </span>
        )}
        {asset !== "" && color === "white" && (
          <span style={{ marginRight: "5px" }}>{asset}</span>
        )}
        <span>{integer}</span>.<span> {digits} </span>
        {suffix === "" ? (
          ""
        ) : (
          <span
            style={{
              marginLeft: suffix === "%" || suffix === "%)" ? "0px" : "5px",
            }}
          >
            {suffix}
          </span>
        )}
      </p>
      <style>{`
        @media screen and (max-width: 781px){
          .asset{
            color: rgba(255, 255, 255, 0.4);
          }
        }
      `}</style>
    </>
  );
}

export default BigNumberPlainText;
