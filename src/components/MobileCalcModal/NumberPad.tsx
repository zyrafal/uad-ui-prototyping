import React, { useState } from "react";
import BigNumber from "bignumber.js";

import styles from "./index.module.scss";
type NumberPadProps = {
  setter: Function;
  value: BigNumber;
};
function NumberPad({ setter, value }: NumberPadProps) {
  const [point, setPoint] = useState(false);
  const padClicked = (num) => {
    let str = value.toString();
    if (num === "-1") {
      if (str.length === 1) str = "0";
      else {
        if (str[str.length] !== ".") str = str.substring(0, str.length - 1);
        else str = str.substring(0, str.length - 2);
      }
    } else if (num === ".") setPoint(true);
    else {
      if (point) {
        str += ".";
        setPoint(false);
      }
      str += num;
    }
    const bn = new BigNumber(str);
    setter(bn);
  };
  return (
    <div className={styles.numberPad}>
      <div className={styles.padItem} onClick={() => padClicked("1")}>
        1
      </div>
      <div className={styles.padItem} onClick={() => padClicked("2")}>
        2
      </div>
      <div className={styles.padItem} onClick={() => padClicked("3")}>
        3
      </div>
      <div className={styles.padItem} onClick={() => padClicked("4")}>
        4
      </div>
      <div className={styles.padItem} onClick={() => padClicked("5")}>
        5
      </div>
      <div className={styles.padItem} onClick={() => padClicked("6")}>
        6
      </div>
      <div className={styles.padItem} onClick={() => padClicked("7")}>
        7
      </div>
      <div className={styles.padItem} onClick={() => padClicked("8")}>
        8
      </div>
      <div className={styles.padItem} onClick={() => padClicked("9")}>
        9
      </div>
      <div className={styles.padItem} onClick={() => padClicked("-1")}>
        <img alt="" src="images/calcRemove.svg" />
      </div>
      <div className={styles.padItem} onClick={() => padClicked("0")}>
        0
      </div>
      <div className={styles.padItem} onClick={() => padClicked(".")}>
        .
      </div>
    </div>
  );
}
export default NumberPad;
