import React from "react";
import { Link, useNavigate } from "react-router";

const Navbar = ({ links = [] }) => {
  const navigate = useNavigate();

  const handleClick = (link) => {
    if (link.onClick) {
      link.onClick();
    }
    if (link.to) {
      navigate(link.to);
    }
  };

  return (
    <div style={{ width: "100%", background: "#B65353", borderBottom: "1px solid #D9D9D9" }}>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "16px 12px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginLeft: "18px" }}>
            <div style={{ fontSize: "24px", fontWeight: 700 }}>DLTA</div>
            <div style={{ fontSize: "12px" }}>Innovation</div>
          </div>
        </Link>

        {/* Links */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {links.map((link, index) => {
            if (link.onClick) {
              return (
                <button
                  key={index}
                  onClick={() => handleClick(link)}
                  style={{
                    padding: "8px 16px",
                    color: "black",
                    fontSize: "16pt",
                    fontWeight: "bold",
                    fontFamily: "inherit",
                    background: "none",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  {link.label}
                </button>
              );
            } else {
              return (
                <Link
                  key={index}
                  to={link.to}
                  style={{
                    padding: "8px 16px",
                    color: "black",
                    fontSize: "16pt",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    textDecoration: "none",
                    textAlign: "center"
                  }}
                >
                  {link.label}
                </Link>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
