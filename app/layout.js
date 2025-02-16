// app/layout.js
import "./globals.css";
import Link from "next/link";
/*import Image from 'next/image'*/

export const metadata = {
  title: "Media Library App",
  description: "Developed by LWJ",
  icons: {
    icon: "/icons/icon-512x512.png", // Favicon
    apple: "/icons/icon-180x180.png", // Apple touch icon for iOS home screen
  },
  manifest: "/manifest.json", // Link to your Web App Manifest
};

export const viewport = {
  themeColor: "#000000", // Set theme color for browsers and devices here
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav className="navbar">
            {/*<a href="/" className="logo">Media Library <span className='text-5xl'>📺</span></a>*/}
            {/*<Image
            className='logo'
              src="/lion.jpg"
              width={100}
              height={70}
              alt="Picture of the author"
            />*/}
            <ul className="nav-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/youtube">YouTube</Link>
              </li>
              <li>
                <Link href="/customsearch">URL</Link>
              </li>
              <li>
                <Link href="/enhanced">Library</Link>
              </li>
              {/*<li>
                <Link href="/services">Bonus</Link>
              </li>*/}
              {/*<li><Link href="/htmlpage">Form</Link></li>*/}
            </ul>
          </nav>
        </header>

        <main>{children}</main>

        <footer>
          <p>© 2024 LWJ Media Library. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
