import React, { useState } from "react";
import { Button } from "@aragon/ui";
import BigNumber from "bignumber.js";
import { BoxItemTextBlock, MaxButton } from "../common/index";
import { bond, unbond, unbondUnderlying } from "../../utils/web3";
import { isPos, toBaseUnitBN } from "../../utils/number";
import { ESD, ESDS, BOND } from "../../constants/tokens";
import NumberInput from "../common/NumberInput";
import Box from "../../components/Box";
import BoxItem from "../../components/BoxItem";
import GetFromBigNumber from "../../components/GetFromBigNumber";

type BondUnbondProps = {
  staged: BigNumber;
  bonded: BigNumber;
  status: number;
};
function BondUnbond({ staged, bonded, status }: BondUnbondProps) {
  const [bondAmount, setBondAmount] = useState(new BigNumber(0));
  const [unbondAmount, setUnbondAmount] = useState(new BigNumber(0));

  const [integer, digits] = GetFromBigNumber(bonded);
  const BondText = "Bond " + integer + "." + digits + " uAD";

  return (
    <Box bgcolor="#171717" height="288px">
      <BoxItem>
        <BoxItemTextBlock fontSize="20px" color="#ffffff" asset={BondText} />
        <div>
          <NumberInput
            placeholder="0.000000 uAD"
            value={bondAmount}
            setter={setBondAmount}
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
              label="+ Bond"
              onClick={async () => {
                await bond(BOND.addr, toBaseUnitBN(bondAmount, BOND.decimals));
              }}
              disabled={
                status === 1 ||
                !isPos(bondAmount)
              }
            />
          </NumberInput>
          <MaxButton
            onClick={() => {
              setBondAmount(staged);
            }}
            text={GetFromBigNumber(staged).toString().replace(",", ".")}
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
            placeholder="0.000000 uAD"
            value={unbondAmount}
            setter={setUnbondAmount}
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
              label="- Unbond"
              onClick={async () => {
                await unbond(BOND.addr, toBaseUnitBN(unbondAmount, BOND.decimals));;
              }}
              disabled={
                status === 1 ||
                !isPos(unbondAmount)
              }
            />
          </NumberInput>
          <MaxButton
            onClick={() => {
              setUnbondAmount(bonded);
            }}
            text={GetFromBigNumber(bonded).toString().replace(",", ".")}
          />
        </div>
      </BoxItem>
    </Box>
  );
}

export default BondUnbond;
