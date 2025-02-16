"use client";

import styles from "../styles/Home.module.css"; // Import the CSS module
import YouTube from "react-youtube"; // Import the YouTube component
import HelpVideo from "./components/HelpVideo";

export default function HomePage() {
  const videos = [
    /*{ id: "sRxrwjOtIag", title: "Sample Video 1" },*/
    { id: "eUDVUZZyA0M", title: "Ludovico Einaudi - Experience" },
  ];

  return (
    <div className="background-container">
      {/* Video Background */}
      {/* Uncomment if needed
      <video autoPlay muted loop playsInline className="background-video">
        <source src="/clouds.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>*/}

      <div className="flex flex-col items-left">
        <div className={styles.homeContainer}>
          <h1 className={styles.gradientText}>Welcome To Your Media Library</h1>
          <p className={styles.description}>
            Keep your most important media in a personal repository for easy
            reference.
          </p>

          {/*<h1 className="text-xl font-bold mt-3">Help</h1>*/}
          <HelpVideo />

          <div className="flex justify-center items-center">
            <ul className="text-left ml-8 mt-4 text-slate-800">
              <li className="text-base font-thin">
                ❤️ Add your favourite YouTube videos.
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginTop: "10px",
                  }}
                >
                  {videos.map((video, index) => (
                    <div
                      key={index}
                      style={{
                        margin: "0 10px",
                        marginRight: "80px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <YouTube
                        videoId={video.id}
                        opts={{
                          width: "250", // Adjust for responsiveness
                          height: "150",
                          playerVars: {
                            autoplay: 0,
                            modestbranding: 1,
                            rel: 0,
                          },
                        }}
                      />
                      <p
                        style={{
                          marginTop: "5px",
                          fontSize: "12px",
                          color: "gray",
                        }}
                      >
                        {video.title}
                      </p>
                    </div>
                  ))}
                </div>
              </li>
              <li className="mt-8 text-base font-thin">
                ➕ Add URLs for quick reference.
              </li>
              <li className="mt-8 text-base font-thin">
                🔍 Easily search your library.
              </li>
              <li className="mt-8 text-base font-thin">
                🏠 Centralise your media links.
              </li>
              {/*<li className="mt-6">🏆 Bonus applications included.</li>*/}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
