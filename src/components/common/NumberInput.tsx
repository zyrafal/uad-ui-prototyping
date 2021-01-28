import React from "react";

import BigNumber from "bignumber.js";
import { TextInput } from "@aragon/ui";
import styles from "./numberInput.module.scss";
type NumberInputProps = {
  value: BigNumber;
  setter: Function;
  adornment?: any;
  placeholder: string;
  border?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
};

function NumberInput({
  value,
  setter,
  adornment,
  border = true,
  placeholder,
  disabled = false,
  children = null,
}: NumberInputProps) {
  const style = border
    ? {
        border: "none",
        boxShadow: "none",
        background: "transparent",
        borderBottom: "1px solid #ffffff",
        borderRadius: "0",
        marginRight: "10px",
        padding: "0px",
        fontSize: "40px",
        flex: 2,
        color: "#ffffff",
        // width: "280px",
        marginBottom: "8px",
        // paddingBottom: "13px",
        height: "48px",
      }
    : {
        border: "none",
        boxShadow: "none",
        background: "transparent",
        borderRadius: "0",
        marginRight: "10px",
        padding: "0px",
        fontSize: "40px",
        color: "#ffffff",
        flex: 2,
        // width: "280px",
        marginBottom: "8px",
        // paddingBottom: "13px",
        height: "48px",
      };
  return (
    <div className={styles.container}>
      <TextInput
        placeholder={placeholder}
        style={style}
        type="number"
        wide
        value={value.isNegative() ? "" : value}
        onChange={(event) => {
          if (event.target.value) {
            setter(new BigNumber(event.target.value));
          } else {
            setter(new BigNumber(-1));
          }
        }}
        onBlur={() => {
          if (value.isNegative()) {
            setter(new BigNumber(0));
          }
        }}
        disabled={disabled}
      />
      {children}
    </div>
  );
}

export default NumberInput;
