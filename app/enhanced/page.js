"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import YouTube from "react-youtube";
import Link from "next/link";

// Utility function to decode HTML entities
function decodeHtmlEntities(text) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

export default function Home() {
  const [selectedMedia, setSelectedMedia] = useState(null); // Selected media for viewing
  const [storedUrls, setStoredUrls] = useState([]);
  const [filteredUrls, setFilteredUrls] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const selectedMediaRef = useRef(null); // Ref to auto-scroll to selected media

  const collectionRoute = "/api/urlhtml";

  // Fetch media URLs from the backend
  const fetchUrls = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(collectionRoute);
      if (!res.ok) throw new Error("Failed to fetch URLs");
      const data = await res.json();
      setStoredUrls(data.urls);
      setFilteredUrls(data.urls); // Initialize filtered list
    } catch (err) {
      console.error(err);
      setError("Failed to load media URLs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  // Scroll to selected media
  useEffect(() => {
    if (selectedMedia && selectedMediaRef.current) {
      selectedMediaRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedMedia]);

  // Filter the list based on the search query
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = storedUrls.filter((media) =>
      decodeHtmlEntities(media.title).toLowerCase().includes(query)
    );
    setFilteredUrls(filtered);
  };

  // Determine the content type of a URL
  const getContentType = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (youtubeRegex.test(url) || url.length === 11) return "youtube";
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
    if (["mp4", "webm", "ogg"].includes(extension)) return "video";
    return "webpage";
  };

  const extractYouTubeId = (url) => {
    if (url.length === 11) return url;
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match ? match[1] : null;
  };

  // Render selected media dynamically
  const renderSelectedMedia = (media) => {
    if (!media) return null;

    const contentType = getContentType(media.url);

    switch (contentType) {
      case "image":
        return (
          <Image
            src={media.url}
            alt={media.title}
            className="w-full max-h-[400px] object-contain rounded-lg"
            width={800}
            height={400}
            loading="eager"
          />
        );
      case "video":
        return (
          <video
            controls
            className="w-full max-h-[400px] rounded-lg"
            preload="metadata"
          >
            <source src={media.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "youtube": {
        const videoId = extractYouTubeId(media.url);
        return (
          <YouTube
            videoId={videoId}
            opts={{
              width: "100%",
              height: "400px",
              playerVars: { autoplay: 0, modestbranding: 1 },
            }}
          />
        );
      }
      default:
        return (
          <a
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white rounded-md p-2 py-3 bg-black mr-3"
          >
            Open Website
          </a>
        );
    }
  };

  // Delete a media item
  const handleDelete = async (id) => {
    try {
      const res = await fetch(collectionRoute, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete media.");
      fetchUrls();
      if (selectedMedia && selectedMedia._id === id) setSelectedMedia(null); // Deselect deleted media
    } catch (err) {
      console.error(err);
      setError("Failed to delete media.");
    }
  };

  return (
    <div className=" w-full mx-auto p-4">
      <div className="flex justify-start">
        <h2 className="text-3xl font-semibold mb-4">Media Library</h2>
      </div>
      <div className="flex justify-start">
        <Link href="/youtube">
          <button className="bg-black rounded-md text-white mr-3 mb-4 p-2 text-xs">
            🔍 YouTubes
          </button>
        </Link>
        <Link href="/customsearch">
          <button className="bg-black rounded-md text-white mr-3 mb-4 p-2 text-xs">
            🔍 URLs
          </button>
        </Link>
      </div>

      <div className="flex justify-center items-center space-x-3 mb-4">
        {/* Search Field */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by title..."
          className="w-full p-2 border rounded-md h-10"
        />

        <button
          onClick={() => {
            setSearchQuery(""); // Clear the search query
            handleSearch({ target: { value: "" } }); // Trigger handleSearch to restore all images
          }}
          className="bg-gray-700 rounded-md text-white px-4 h-10 text-xs"
        >
          Clear
        </button>
      </div>

      {selectedMedia && (
        <div ref={selectedMediaRef} className="mb-6 p-4 border rounded-md">
          <h3 className="text-xl font-semibold mb-4">{selectedMedia.title}</h3>
          {renderSelectedMedia(selectedMedia)}
          <button
            onClick={() => setSelectedMedia(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md mt-4"
          >
            Close
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUrls.map((media) => (
            <li key={media._id} className="p-4 border bg-slate-300 rounded-md ">
              <h3 className="text-lg text-black font-thin mb-2">
                {decodeHtmlEntities(media.title)}
              </h3>
              <button
                onClick={() => setSelectedMedia(media)}
                className=" text-slate-700 px-4 py-2 rounded-md w-fit mr-10 text-xl"
              >
                📺<span className="text-xs"> View</span>
              </button>
              <button
                onClick={() => handleDelete(media._id)}
                className=" text-slate-700 px-4 py-2 rounded-md mt-2 w-fit text-xl"
              >
                🗑️<span className="text-xs"> Delete</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
