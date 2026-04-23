import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import api from "../api/client";
import DeleteUser from "../components/DeleteUser";
import Navbar from "../components/Navbar";

const Profile = () => {
  useAuth();
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", bio: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const response = await api.get("/user/");
        const { email, first_name, last_name, bio } = response.data;
        setProfile({ email, firstName: first_name, lastName: last_name, bio: bio ?? "" });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setStatus({ type: "error", message: "Failed to load profile." });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const accessToken = localStorage.getItem("access_token");
      await api.put("/user/", {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio
      });
      setStatus({ type: "success", message: "Profile updated successfully." });
    } catch (error) {
      console.error("Error updating profile:", error);
      setStatus({ type: "error", message: "Failed to update profile. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const fieldStyle = {
    width: "100%",
    padding: "10px 14px",
    fontSize: "15px",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    boxSizing: "border-box",
    outline: "none",
    background: "#fff",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: "6px",
  };

  return (
    <>
      <Navbar
        links={[
          { label: "My Tasks", to: "/user-tasks-view" },
          { label: "My Projects", to: "/user-tasks-view" },
          { label: "My Profile", to: "/profile" },
        ]}
      />

      <div style={{ padding: "120px 5%", maxWidth: "560px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, marginBottom: "8px", textAlign: "center" }}>
          Your Profile
        </h1>
        <p style={{ textAlign: "center", color: "#6B7280", marginBottom: "40px" }}>
          Update your account information below.
        </p>

        {loading ? (
          <p style={{ textAlign: "center", color: "#6B7280" }}>Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>First name</label>
                <input name="firstName" value={profile.firstName} onChange={handleChange} required style={fieldStyle} />
              </div>
              <div>
                <label style={labelStyle}>Last name</label>
                <input name="lastName" value={profile.lastName} onChange={handleChange} required style={fieldStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email address</label>
              <input name="email" type="email" value={profile.email} onChange={handleChange} required style={fieldStyle} />
            </div>

            <div>
              <label style={labelStyle}>Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us a little about yourself…"
                style={{ ...fieldStyle, resize: "vertical", lineHeight: "1.5" }}
              />
            </div>

            {status.message && (
              <p style={{
                fontSize: "14px",
                color: status.type === "error" ? "#DC2626" : "#16A34A",
                background: status.type === "error" ? "#FEF2F2" : "#F0FDF4",
                padding: "10px 14px",
                borderRadius: "8px",
                margin: 0,
              }}>
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "12px",
                fontSize: "15px",
                fontWeight: "600",
                background: saving ? "#9CA3AF" : "#111827",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        )}

        <div style={{ marginTop: "48px", borderTop: "1px solid #E5E7EB", paddingTop: "32px", textAlign: "center" }}>
          <DeleteUser />
        </div>
      </div>
    </>
  );
};

export default Profile;
