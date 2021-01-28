import React from "react";
type BoxItemProps = {
  children: React.ReactNode;
};

function BoxItem({ children }: BoxItemProps) {
  return (
    <div
      style={{
        justifyContent: "space-between",
        display: "flex",
        flex: "1",
        padding: "32px",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}
export default BoxItem;
