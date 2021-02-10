import React from "react";
import BigNumber from "bignumber.js";
import { formatBN } from "../../utils/number";
import { ownership } from "../../utils/number";

type InvestProps = {
  expRate: BigNumber;
  totalSupply: BigNumber;
  bondedBalance: BigNumber;
  poolBondedBalance: BigNumber;
  totalBonded: BigNumber;
  user: string;
  daoTotalSupply: BigNumber;
  poolTotalSupply: BigNumber;
  poolLiquidity: BigNumber;
  poolTotalBonded: BigNumber;
};
const BNtoText = (balance) => {
  let integer = "0";
  let digits = "0";
  const balanceBN = new BigNumber(balance);
  if (balanceBN.gte(new BigNumber(0))) {
    const tokens = formatBN(balanceBN, 2).split(".");
    integer = tokens[0];
    digits = tokens[1];
  }
  return integer + "." + digits;
};
const Invest = ({
  expRate,
  totalSupply,
  bondedBalance,
  poolBondedBalance,
  totalBonded,
  user,
  daoTotalSupply,
  poolTotalSupply,
  poolLiquidity,
  poolTotalBonded,
}: InvestProps) => {
  const daohouly =
    (expRate.toNumber() * 7000) /
    (ownership(daoTotalSupply, totalSupply).toNumber() *
      ownership(totalBonded, daoTotalSupply).toNumber());

  const lpHourly =
    (expRate.toNumber() * 3000) /
    (ownership(poolTotalSupply, totalSupply).toNumber() *
      ownership(poolLiquidity, poolTotalSupply).toNumber());

  return (
    <>
      <p>
        The supply will be expanded by{" "}
        {BNtoText(totalSupply.multipliedBy(expRate))} uAD.
      </p>
      {user !== "" ? (
        <p>
          Returning {BNtoText(daohouly * 100)}% (
          {BNtoText(bondedBalance.multipliedBy(daohouly))} uAD) on Bonded TVL &{" "}
          {BNtoText(lpHourly * 100)}% (
          {BNtoText(
            poolLiquidity
              .multipliedBy(lpHourly)
              .multipliedBy(
                ownership(poolBondedBalance, poolTotalBonded).dividedBy(100)
              )
          )}{" "}
          uAD) on LP'd TVL.
        </p>
      ) : (
        <p>
          Returning {BNtoText(daohouly * 100)}% on Bonded TVL &{" "}
          {BNtoText(lpHourly * 100)}% on LP'd TVL.
        </p>
      )}
    </>
  );
};
export default Invest;
