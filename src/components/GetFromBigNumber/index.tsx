import BigNumber from "bignumber.js";
import { formatBN } from "../../utils/number";

function GetFromBigNumber(number: BigNumber) {
  let integer = "0";
  let digits = "0";
  const balanceBN = new BigNumber(number);
  if (balanceBN.gte(new BigNumber(0))) {
    const tokens = formatBN(balanceBN, 2).split(".");
    integer = tokens[0];
    digits = tokens[1];
  }
  return [integer, digits];
}
export default GetFromBigNumber;
