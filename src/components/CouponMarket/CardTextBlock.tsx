import React from "react";
type CardTextBlockProps = {
  title: string;
  value: string;
  size?: string;
  height?: string;
  prefix?: string;
};
function CardTextBlock({
  title,
  value,
  size = "20px",
  height = "24px",
  prefix,
}: CardTextBlockProps) {
  return (
    <div>
      <p
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: size,
          lineHeight: height,
        }}
      >
        {title}
      </p>
      <p
        style={{
          color: "rgba(255,255,255,1)",
          fontSize: size,
          lineHeight: height,
        }}
      >
        {value}
        {prefix}
      </p>
    </div>
  );
}
export default CardTextBlock;
