"use client";

import { useState } from "react";
//import Link from "next/link";
import { useRouter } from "next/navigation";

const YouTubeSearch = () => {
  const [query, setQuery] = useState("");
  const [maxResults, setMaxResults] = useState(10); // Default to 10 results
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Function to handle search
  const handleSearch = async () => {
    if (!query) return;

    try {
      const response = await fetch(
        `/api/youtube?q=${query}&maxResults=${maxResults}`
      );
      const data = await response.json();

      if (response.ok) {
        setVideos(data.items);
        setError(null); // Clear any previous errors
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Something went wrong");
    }
  };

  // Function to clear/reset the search form
  const handleClear = () => {
    setQuery(""); // Clear the search query
    setMaxResults(10); // Reset maxResults to default
    setVideos([]); // Clear the video results
    setError(null); // Clear any error messages
  };

  // New function to handle adding media (POST request to your MongoDB backend)
  const handleAddMedia = async (videoId, title) => {
    try {
      const response = await fetch("/api/urlhtml", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: videoId, // Use the video ID here
          title: title, // Use the video title
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add video to the library.");
      }

      // Optionally redirect to the library after adding the video
      window.location.href = "/enhanced";
    } catch (error) {
      console.error("Error adding video to the library:", error);
      alert("Failed to add video to the library.");
    }
  };

  // Function to copy video ID and automatically add it to the library
  const handleCopyVideoID = (videoId, title) => {
    navigator.clipboard
      .writeText(videoId)
      .then(async () => {
        alert("Video ID copied to clipboard and added to the library!");

        // Automatically add media to the library
        await handleAddMedia(videoId, title);
      })
      .catch((err) => {
        console.error("Failed to copy the video ID: ", err);
      });
  };

  // Function to clean and truncate text
  const sanitizeText = (text, length = 100) => {
    // Remove URLs and replace special characters
    const cleanText = text
      .replace(/https?:\/\/[^\s]+/g, "") // Remove URLs
      .replace(/[&<>]/g, "") // Remove symbols like &, <, >
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim(); // Trim whitespace

    // Truncate the text if it exceeds the length
    return cleanText.length > length
      ? `${cleanText.substring(0, length)}...`
      : cleanText;
  };

  return (
    <div className="container mx-auto">
      <button
        className="bg-black text-white p-2 ml-2 rounded-md"
        onClick={() => router.back()} // Navigate to the previous page
      >
        ⬅️ Back
      </button>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search YouTube"
          className="border p-2 w-full sm:w-auto rounded-md mb-3 mt-4"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 ml-2 rounded-md"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="bg-black text-white p-2 ml-2 rounded-md"
        >
          Clear/Reset
        </button>
      </div>

      <div className="mt-4">
        <label htmlFor="maxResults" className="mr-2">
          Max Results:
        </label>
        <select
          id="maxResults"
          value={maxResults}
          onChange={(e) => setMaxResults(Number(e.target.value))}
          className="border p-2 rounded-md"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div
            key={video.id.videoId}
            className="border p-4 flex flex-col sm:flex-row items-center rounded-md"
          >
            <img
              src={video.snippet.thumbnails.default.url}
              alt={video.snippet.title}
              className="w-full sm:w-1/3 h-auto mb-4 sm:mb-0 sm:mr-4 rounded-md"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{video.snippet.title}</h3>
              <p className="text-sm text-gray-700">
                {sanitizeText(video.snippet.description)}
              </p>
              <button
                className="bg-green-500 text-white p-2 mt-2 rounded-md"
                onClick={() =>
                  handleCopyVideoID(video.id.videoId, video.snippet.title)
                }
              >
                Add to Library
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeSearch;
