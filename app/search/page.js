"use client"; // Ensure this component is client-side

import { useState } from "react";
import Link from "next/link";

export default function SearchComponent() {
  const [query, setQuery] = useState("");
  const [engine, setEngine] = useState("google"); // Default search engine

  // Search engines and their query URLs
  const searchEngines = {
    google: "https://www.google.com/search?q=",
    bing: "https://www.bing.com/search?q=",
    duckduckgo: "https://duckduckgo.com/?q=",
    yahoo: "https://search.yahoo.com/search?p=",
  };

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return;

    // Construct search URL based on selected engine
    const searchUrl = `${searchEngines[engine]}${encodeURIComponent(query)}`;

    // Open search URL in a new tab
    window.open(searchUrl, "_blank");
  };

  // Handle clear/reset
  const handleClear = () => {
    setQuery(""); // Clear search input
    setEngine("google"); // Reset search engine selection to Google
  };

  return (
    <div className="container mx-auto mt-8">
      <form onSubmit={handleSearch} className="search-form">
        {/* Search Input */}
        <h1 className="mb-0 text-2xl font-bold">URLs Search</h1>
        <Link href="/enhanced">
          <button className="back-button">⬅️ Library</button>
        </Link>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query"
          required
        />

        {/* Search Engine Selection */}
        <select value={engine} onChange={(e) => setEngine(e.target.value)}>
          <option value="google">Google</option>
          <option value="bing">Bing</option>
          <option value="duckduckgo">DuckDuckGo</option>
          <option value="yahoo">Yahoo</option>
        </select>

        <div className="buttons">
          {/* Search Button */}
          <button type="submit">Search</button>

          {/* Clear Button */}
          <button type="button" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>

      <style jsx>{`
        .search-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .search-form {
          display: flex;
          flex-direction: column;
          gap: 1rem; /* Space between elements */
          width: 300px;
          margin: 0 auto; /* Centers the form horizontally */
        }

        input,
        select {
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .buttons {
          display: flex;
          justify-content: space-between;
        }

        .back-button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          border: none;
          border-radius: 4px;
          background-color: black;
          color: white;
          transition: background-color 0.3s;
        }

        button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          border: none;
          border-radius: 4px;
          background-color: #0070f3;
          color: white;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #005bb5;
        }

        button[type="button"] {
          background-color: #f44336;
        }

        button[type="button"]:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </div>
  );
}
