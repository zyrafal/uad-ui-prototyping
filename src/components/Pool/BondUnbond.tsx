import React, { useState } from "react";
import { Button } from "@aragon/ui";
import BigNumber from "bignumber.js";
import { BoxItemTextBlock, MaxButton } from "../common/index";
import { bondPool, unbondPool } from "../../utils/web3";
import { isPos, toBaseUnitBN } from "../../utils/number";
import { UNI } from "../../constants/tokens";
import NumberInput from "../common/NumberInput";
import Box from "../../components/Box";
import BoxItem from "../../components/BoxItem";
import GetFromBigNumber from "../../components/GetFromBigNumber";

type BondUnbondProps = {
  poolAddress: string;
  staged: BigNumber;
  bonded: BigNumber;
};

function BondUnbond({ poolAddress, staged, bonded }: BondUnbondProps) {
  const [bondAmount, setBondAmount] = useState(new BigNumber(0));
  const [unbondAmount, setUnbondAmount] = useState(new BigNumber(0));
  const [integer, digits] = GetFromBigNumber(bonded);
  const BondText = "Bonded " + integer + "." + digits + " UAD";
  return (
    <Box bgcolor="#171717" height="288px">
      <BoxItem>
        <BoxItemTextBlock fontSize="20px" color="#ffffff" asset={BondText} />
        <div>
          <NumberInput
            placeholder="0.000000 UNI-V2"
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
                await bondPool(
                  poolAddress,
                  toBaseUnitBN(bondAmount, UNI.decimals),
                  (hash) => setBondAmount(new BigNumber(0))
                );
              }}
              disabled={poolAddress === "" || !isPos(bondAmount)}
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
            placeholder="0.000000 UNI-V2"
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
                await unbondPool(
                  poolAddress,
                  toBaseUnitBN(unbondAmount, UNI.decimals),
                  (hash) => setUnbondAmount(new BigNumber(0))
                );
              }}
              disabled={poolAddress === "" || !isPos(unbondAmount)}
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
