import React from "react";
import {Link} from "react-router"

const Home = () => {
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
          <div style={{ display: "flex", gap: "24px" }}>
            <div>About Us</div>
            <div>Contact</div>
            <div>More</div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 700 }}>DLTA</div>
            <div style={{ fontSize: "12px" }}>Innovation</div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
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
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding: "120px 5%", textAlign: "center" }}>
        <div style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 700 }}>
          DLTA
        </div>
        <div
          style={{
            fontSize: "clamp(20px, 3vw, 32px)",
            color: "#757575",
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
            src="https://placehold.co/484x350"
            alt="placeholder"
            style={{
              width: "100%",
              maxWidth: "480px",
              height: "auto",
              flex: 1,
            }}
          />

          <div style={{ flex: 1, minWidth: "280px" }}>
            <div style={{ fontSize: "24px", fontWeight: 600 }}>Heading</div>
            <div
              style={{
                fontSize: "20px",
                color: "#757575",
                marginBottom: "16px",
              }}
            >
              Subheading
            </div>
            <p>Body text for your whole article or post.</p>
            <p>
              Excepteur efficient emerging, minim veniam anim aute carefully curated...
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
          <img
            src="https://placehold.co/484x350"
            alt="placeholder"
            style={{
              width: "100%",
              maxWidth: "480px",
              height: "auto",
              flex: 1,
            }}
          />

          <div style={{ flex: 1, minWidth: "280px" }}>
            <div style={{ fontSize: "24px", fontWeight: 600 }}>Heading</div>
            <div
              style={{
                fontSize: "20px",
                color: "#757575",
                marginBottom: "16px",
              }}
            >
              Subheading
            </div>
            <p>Body text for your whole article or post.</p>
            <p>
              Excepteur efficient emerging, minim veniam anim aute carefully curated...
            </p>
          </div>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div style={{ background: "#862424", padding: "80px 5%" }}>
        <div style={{ background: "white", padding: "80px 5%", textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: 600 }}>
            Follow the latest trends
          </div>
          <div style={{ color: "#757575", marginBottom: "24px" }}>
            With our daily newsletter
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="email"
              placeholder="you@example.com"
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #D9D9D9",
                width: "250px",
                maxWidth: "100%",
              }}
            />

            <button
              style={{
                padding: "12px 24px",
                background: "#2C2C2C",
                color: "white",
                borderRadius: "8px",
                border: "none",
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
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
      </div>
    </div>
  );
};

export default Home;
