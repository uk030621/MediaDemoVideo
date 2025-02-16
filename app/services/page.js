// app/services/page.js
import styles from "@/styles/Home.module.css"; // Import the CSS module

export default function ServicesPage() {
  return (
    <div className="background-container">
      {/* Video Background */}
      {/*<video autoPlay muted loop playsInline className="background-video">
        <source src="/passingclouds.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>*/}

      <div className={styles.homeContainer}>
        <h1 className={styles.gradientText}>Handy Applications</h1>
        <p className={styles.description}>
          Links To Other Applications Goes Here.
        </p>
      </div>
    </div>
  );
}
