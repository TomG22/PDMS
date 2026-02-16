import React from "react";

const Footer = () => {
  return (
    <div style={{ width: "100%", background: "#862424", color: "white" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "32px",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <div>Eleven</div>
          <div>Twelve</div>
          <div>Thirteen</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#C1C7CD" }}>DLTA</div>
          <div style={{ fontSize: "12px", color: "#C1C7CD" }}>Innovation</div>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <div>◯</div>
          <div>◯</div>
          <div>◯</div>
          <div>◯</div>
          <div>◯</div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "40px", fontSize: "14px" }}>
        DLTA Innovation LLC. © 2026. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
