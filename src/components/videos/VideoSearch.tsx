"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search } from "lucide-react";

export default function VideoSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.push(`/videos?${params.toString()}`);
    },
    [query, router, searchParams]
  );

  return (
    <form onSubmit={handleSearch} className="relative max-w-md">
      <Search
        size={16}
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: "16px", color: "#7a7a7a" }}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search videos..."
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
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#0066cc";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 102, 204, 0.12)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#e0e0e0";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </form>
  );
}
