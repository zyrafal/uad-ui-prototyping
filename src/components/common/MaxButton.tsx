import React from "react";

import { ButtonBase } from "@aragon/ui";

function MaxButton({ onClick, text }: { onClick: Function; text?: string }) {
  return (
    <div style={{ padding: 3 }}>
      <ButtonBase onClick={onClick}>
        <span
          style={{
            color: "#ffffff",
            fontSize: "20px",
            lineHeight: "24px",
          }}
        >
          <span style={{ marginRight: "5px" }}>MAX</span>
          <span style={{ opacity: "0.4" }}>{text}</span>
        </span>
      </ButtonBase>
    </div>
  );
}

export default MaxButton;
