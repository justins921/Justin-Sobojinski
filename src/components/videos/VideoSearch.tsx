"use client";

import { Search } from "lucide-react";

export default function VideoSearch({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (query: string) => void;
}) {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="relative max-w-md"
      role="search"
    >
      <Search
        size={16}
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: "16px", color: "#7a7a7a" }}
      />
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search videos..."
        aria-label="Search videos"
        style={{
          width: "100%",
          height: "44px",
          borderRadius: "9999px",
          border: "1px solid #e0e0e0",
          backgroundColor: "#ffffff",
          padding: "12px 20px 12px 42px",
          fontSize: "14px",
          lineHeight: 1.43,
          letterSpacing: "-0.224px",
          color: "#1d1d1f",
          outline: "none",
        }}
        onFocus={(event) => {
          event.currentTarget.style.borderColor = "#0066cc";
          event.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 102, 204, 0.12)";
        }}
        onBlur={(event) => {
          event.currentTarget.style.borderColor = "#e0e0e0";
          event.currentTarget.style.boxShadow = "none";
        }}
      />
    </form>
  );
}
