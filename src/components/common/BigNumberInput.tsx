import React from "react";

import BigNumber from "bignumber.js";
import { TextInput } from "@aragon/ui";

type BigNumberInputProps = {
  value: BigNumber;
  setter: (value: BigNumber) => void;
  adornment?: any;
  placeholder: string;
  disabled?: boolean;
};

function BigNumberInput({
  value,
  setter,
  adornment,
  placeholder,
  disabled = false,
}: BigNumberInputProps) {
  return (
    <>
      <TextInput
        placeholder={placeholder}
        style={{
          border: "none",
          background: "transparent",
          borderBottom: "1px solid #ffffff",
          borderRadius: "0",
        }}
        wide
        // value={value.isNegative() ? "" : value.toFixed()}
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
    </>
  );
}

export default BigNumberInput;
