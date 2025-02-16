"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import YouTube from "react-youtube";

export default function Home() {
  const [displayedImageUrl, setDisplayedImageUrl] = useState("");
  const [storedUrls, setStoredUrls] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUrls, setFilteredUrls] = useState([]);
  const [, setLoading] = useState(true);

  const collectionRoute = "/api/urlhtml";

  const fetchUrls = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(collectionRoute);
      if (!res.ok) throw new Error("Failed to fetch URLs");
      const data = await res.json();
      setStoredUrls(data.urls);
      setFilteredUrls(data.urls);
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

  const handleDelete = async (id) => {
    try {
      const res = await fetch(collectionRoute, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete media.");
      fetchUrls();
    } catch (err) {
      console.error(err);
      setError("Failed to delete media.");
    }
  };

  const handleImageClick = (storedUrl) => {
    setDisplayedImageUrl(storedUrl.url);
  };

  const renderPreview = (storedUrl) => {
    const contentType = getContentType(storedUrl.url);

    switch (contentType) {
      case "image":
        return (
          <Image
            src={storedUrl.url}
            alt={storedUrl.title}
            style={styles.previewImage}
            onClick={() => handleImageClick(storedUrl)}
            width={200}
            height={200}
            loading="lazy"
          />
        );
      case "video":
        return (
          <div style={styles.videoContainer}>
            <video controls style={styles.previewVideo} preload="metadata">
              <source src={storedUrl.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case "youtube": {
        const videoId = extractYouTubeId(storedUrl.url);
        if (!videoId) return <p>Invalid YouTube Video ID</p>;
        return (
          <YouTube
            videoId={videoId}
            opts={{
              width: "100%",
              height: "200px",
              playerVars: { autoplay: 0, modestbranding: 1 },
            }}
            onReady={(e) =>
              e.target.getIframe().setAttribute("allowfullscreen", "1")
            }
          />
        );
      }
      default:
        return (
          <div style={styles.webpagePreview}>
            <a
              href={storedUrl.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.previewLink}
            >
              Open Website
            </a>
          </div>
        );
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredUrls(storedUrls);
    } else {
      const filtered = storedUrls.filter((storedUrl) =>
        storedUrl.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUrls(filtered);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredUrls(storedUrls);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Media Library</h2>

      {displayedImageUrl && (
        <Image
          src={displayedImageUrl}
          alt="Displayed Media"
          style={styles.image}
          width={600}
          height={400}
          loading="eager"
        />
      )}

      <div>
        {error && <p style={styles.error}>{error}</p>}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <Link href="/youtube">
            <button style={styles.youtubeButton1}>🔍 YouTube</button>
          </Link>
          <Link href="/customsearch">
            <button style={styles.youtubeButton2}>🔍 URLs</button>
          </Link>
        </div>
      </div>

      <input
        className="mt-4"
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={styles.input}
      />
      <button onClick={handleReset} style={styles.resetbutton}>
        Reset
      </button>

      <div style={{ marginTop: "25px" }}>
        <ul style={styles.urlList}>
          {filteredUrls.map((storedUrl) => (
            <li key={storedUrl._id} style={styles.urlItem}>
              <div style={styles.previewContainer}>
                <h3 style={styles.vidTitle}>{storedUrl.title}</h3>
                {renderPreview(storedUrl)}
                <button
                  onClick={() => handleDelete(storedUrl._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%", // Take full width of the page
    maxWidth: "1200px", // Optional: Set a reasonable max width for large screens
    margin: "0 auto",
    padding: "0 20px", // Add padding for spacing inside the container
    textAlign: "left",
  },

  vidTitle: {
    fontSize: "1rem",
    fontWeight: "300",
    marginBottom: "5px",
    color: "grey",
  },

  loadingText: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
    marginBottom: "10px",
  },

  title: {
    fontSize: "2rem",
    marginTop: "20px",
    marginBottom: "10px",
    textAlign: "left",
    color: "black",
  },
  subtitle: {
    fontSize: "1.3rem",
    marginTop: "10px",
    marginBottom: "10px",
    textAlign: "left",
    color: "grey",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    width: "100%",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "17px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  youtubeButton1: {
    padding: "10px 20px",
    backgroundColor: "black",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "0px",
  },

  youtubeButton2: {
    padding: "10px 20px",
    backgroundColor: "black",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "20px",
  },

  resetbutton: {
    padding: "10px 20px",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  image: {
    width: "100%",
    maxHeight: "400px",
    objectFit: "contain",
    marginBottom: "20px",
  },
  previewImage: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "cover",
    borderRadius: "4px",
    marginBottom: "10px",
    cursor: "pointer",
  },

  videoContainer: {
    width: "100%",
    height: "200px",
    marginBottom: "10px",
  },

  previewVideo: {
    width: "100%",
    maxHeight: "200px",
    borderRadius: "15px",
    marginBottom: "10px",
    objectFit: "cover", // Optional: Ensures video scales nicely inside the rounded corners
  },
  webpagePreview: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "10px",
    textAlign: "left",
  },
  previewLink: {
    color: "#0070f3",
    textDecoration: "none",
  },
  urlList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Create responsive grid columns
    gap: "20px", // Space between grid items
    padding: 0,
    marginTop: "10px",
    listStyleType: "none",
    margin: 0, // Ensure there’s no margin that causes extra space
  },
  urlItem: {
    padding: "10px",
    border: "1px solid #eaeaea",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    wordBreak: "break-word",
  },
  previewContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "2px solid grey",
    padding: "15px",
    backgroundColor: "lightblue",
    borderRadius: "8px",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "red",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "8px",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
};
