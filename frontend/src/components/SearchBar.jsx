import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleScan = () => {
    if (!query.trim()) return;

    navigate(`/area/${query}`);
  };

  return (
    <div
      style={{
        display: "flex",
        background: "#141414",
        border: "1px solid #2a2a2a",
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "14px",
      }}
    >
      <span
        style={{
          color: "#333",
          fontSize: "16px",
          padding: "0 4px 0 14px",
          alignSelf: "center",
        }}
      >
        📍
      </span>

      <input
        type="text"
        placeholder="Enter area or landmark..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleScan()}
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#ccc",
          fontSize: "13px",
          padding: "12px 16px",
          flex: 1,
        }}
      />

      <button
        onClick={handleScan}
        style={{
          background: "#ff3b3b",
          color: "#fff",
          border: "none",
          padding: "0 22px",
          fontSize: "13px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        SCAN
      </button>
    </div>
  );
}