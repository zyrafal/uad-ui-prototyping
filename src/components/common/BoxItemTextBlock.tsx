import React from "react";

type BoxItemTextBlockProps = {
  asset: string;
  color?: string;
  fontSize?: string;
};

function BoxItemTextBlock({ asset, color, fontSize }: BoxItemTextBlockProps) {
  return (
    <div
      style={{
        fontSize: fontSize,
        color: color,
        display: "flex",
        whiteSpace: "nowrap",
      }}
    >
      {asset}
    </div>
  );
}

export default BoxItemTextBlock;
