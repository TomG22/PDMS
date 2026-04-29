import React, { useEffect, useState } from "react";
import { getAccessToken, getRefreshToken } from "../auth/tokens";
import {Link} from "react-router";
import behind_DLTA from "../images/behind_DLTA.jpeg"
import heading_1 from "../images/heading_1.jpg"
import heading_2 from "../images/heading_2.webp"


const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    setIsLoggedIn(!!(accessToken || refreshToken));
  }, []);

  return (
    <div style={{ width: "100%", background: "white", fontFamily: "Inter, sans-serif" }}>

      {/* NAVBAR */}
      <div style={{ width: "100%", background: "#862424" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "auto",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
          }}
        >
          {/* Just changed the color to avoid shifting in the Navbar */}
          <div style={{ display: "flex", gap: "24px", color:"#862424"}}>
            <div>About Us</div>
            <div>Contact</div>
            <div>More</div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 700 }}>DLTA</div>
            <div style={{ fontSize: "12px" }}>Innovation</div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            { isLoggedIn ? (
              <Link to={"/projects-view"}
                style={{
                  padding: "10px 20px",
                  background: "white",
                  color: "black",
                  borderRadius: "4px",
                }}
              >
                Dashboard
              </Link>
            ) : (
            <>
            <Link to={"/login"}
              style={{
                padding: "10px 20px",
                background: "white",
                color: "black",
                borderRadius: "4px",
              }}
            >
              Login
            </Link>
            <Link to={"/register"}
              style={{
                padding: "10px 20px",
                background: "#1E1E1E",
                color: "white",
                borderRadius: "4px",
              }}
            >
              Register
            </Link>
            </>
            )}
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{ backgroundImage:`linear-gradient(rgba(134,36,36,0.55), rgba(0,0,0,0.65)), url(${behind_DLTA})`, backgroundSize: "cover" ,backgroundRepeat: "no-repeat", backgroundPosition: "center", padding: "120px 5%", textAlign: "center" }}>
        <div style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 700, color: "#FFFFFF", letterSpacing:"-0.5px" }}>
          DLTA
        </div>
        <div
          style={{
            fontSize: "clamp(20px, 3vw, 32px)",
            color: "#F2D6D6",
            marginTop: "12px"
          }}
        >
          Where project management becomes simple
        </div>
      </div>

      {/* SECTION 1 */}
      <div style={{ background: "#862424", padding: "80px 5%" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "auto",
            background: "white",
            padding: "60px",
            display: "flex",
            flexWrap: "wrap",
            gap: "48px",
            alignItems: "center",
            borderRadius: "8px",
          }}
        >
          <img
            src={heading_1}
            alt="placeholder"
            style={{
              width: "100%",
              maxWidth: "480px",
              height: "auto",
              flex: 1,
            }}
          />

          <div style={{ flex: 1, minWidth: "280px" }}>
            <div style={{ fontSize: "24px", fontWeight: 600 }}>Better Planning</div>
            <div
              style={{
                fontSize: "20px",
                color: "#757575",
                marginBottom: "16px",
              }}
            >
              The forefront of success
            </div>
            <p > <i>"Those who plan do better than those who do not plan, even though they rarely stick to their plan"</i></p>
            <p>
              — Winston Churchil
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2 */}
      <div style={{ background: "#B65353", padding: "80px 5%" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "auto",
            background: "white",
            padding: "60px",
            display: "flex",
            flexWrap: "wrap-reverse",
            gap: "48px",
            alignItems: "center",
            borderRadius: "8px",
          }}
        >
          <div style={{ flex: 1, minWidth: "280px" }}>
            <div style={{ fontSize: "24px", fontWeight: 600}}>Celebrate Earlier</div>
            <div
              style={{
                fontSize: "20px",
                color: "#757575",
                marginBottom: "16px",
              }}
            >
              See progress before the finish line
            </div>
            <p > <i>"When love and skill work together, expect a masterpiece."</i></p>
            <p>
              — John Ruskin
            </p>
          </div>

          <img
            src={heading_2}
            alt="placeholder"
            style={{
              width: "100%",
              maxWidth: "480px",
              height: "auto",
              flex: 1,
            }}
          />
        </div>
      </div>

      {/* NEWSLETTER */}
      <div style={{ background: "#862424", padding: "80px 5%" }}>
        <div style={{ background: "white", padding: "80px 5%", textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: 600, padding: "15px"}}>
            Register an Account Today
          </div>
          <div style={{ color: "#757575", marginBottom: "24px" }}>
            Start planning your dream projects here, simply, and in one place
          </div>

            <Link to={"/register"}
              style={{
                padding: "10px 20px",
                background: "#1E1E1E",
                color: "white",
                borderRadius: "4px",
                textDecoration: "none"
              }}
            >
              Register
            </Link>
          </div>
      </div>

      {/* FOOTER */}
      {/* <div
        style={{
          borderTop: "1px solid #D9D9D9",
          padding: "80px 5%",
          display: "flex",
          justifyContent: "center",
          gap: "64px",
          flexWrap: "wrap",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, marginBottom: "16px" }}>Use cases</div>
          <div>UI design</div>
          <div>UX design</div>
          <div>Wireframing</div>
          <div>Diagramming</div>
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: "16px" }}>Explore</div>
          <div>Design</div>
          <div>Prototyping</div>
          <div>Design systems</div>
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: "16px" }}>Resources</div>
          <div>Blog</div>
          <div>Best practices</div>
          <div>Support</div>
        </div>
      </div> */}
    </div>
  );
};

export default Home;
