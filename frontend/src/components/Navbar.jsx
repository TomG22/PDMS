import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ ctaText, ctaPath }) => {
  return (
    <div style={{ width: "100%", background: "#B65353", borderBottom: "1px solid #D9D9D9" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          padding: "32px 24px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontSize: "24px", fontWeight: 700 }}>DLTA</div>
            <div style={{ fontSize: "12px" }}>Innovation</div>
          </div>
        </Link>

        {/* Links */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" style={navLinkStyle}>Products</Link>
          <Link to="/" style={navLinkStyle}>Solutions</Link>
          <Link to="/" style={navLinkStyle}>Community</Link>
          <Link to="/" style={navLinkStyle}>Resources</Link>
          <Link to="/" style={navLinkStyle}>Pricing</Link>
          <Link to="/" style={navLinkStyle}>Contact</Link>
        </div>

        {/* CTA */}
        <Link
          to={ctaPath}
          style={{
            padding: "8px 16px",
            background: "#2C2C2C",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
};

const navLinkStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  textDecoration: "none",
  color: "black",
};

export default Navbar;
