// app/youtube/page.js

import YouTubeSearch from "../components/YouTubeSearch";

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 mt-4">YouTube Video Search</h1>
      <YouTubeSearch />
    </div>
  );
}
