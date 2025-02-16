// app/about/page.js
import styles from "@/styles/Home.module.css"; // Import the CSS module
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className={styles.homeContainer}>
      <div className="relative w-64 h-64 flex justify-center mt-10">
        {/* Image Component */}
        <Image
          className="w-full h-full object-cover z-10"
          src="/Found.jpg"
          width={250}
          height={200}
          alt="Picture of the author"
          style={{
            WebkitMaskImage:
              "radial-gradient(circle, rgba(0,0,0,1) 50%, transparent 100%)",
            maskImage:
              "radial-gradient(circle, rgba(0,0,0,1) 50%, transparent 100%)",
          }} // Apply the radial gradient mask
        />
      </div>

      <h1 className={styles.gradientText}>Media Locker</h1>
      <p className={styles.description}>Media Locker Goes Here</p>
    </div>
  );
}
