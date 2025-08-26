import { useState } from "react";
import ReactPlayer from "react-player"; // YouTube-optimized build

export default function ReactPlayerTest() {
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=Sz6z5r3W5nQ"); // put any YT link here
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [light, setLight] = useState(true); // show thumbnail until play

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-4">React Player — YouTube (minimal)</h1>

      {/* URL input */}
      <div className="flex gap-2 mb-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a YouTube URL (or MP4/HLS)"
          className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 ring-gray-300"
        />
        <button
          onClick={() => setPlaying((p) => !p)}
          className="px-4 py-2 rounded-lg bg-black text-white"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      {/* Responsive 16:9 wrapper */}
      <div className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden">
        <ReactPlayer
          url={url}
          playing={playing}
          muted={muted}
          controls
          light={light}                 // show preview image; auto loads on play
          width="100%"
          height="100%"
          onError={(e) => {
            console.error("ReactPlayer error:", e);
            alert("Could not load this URL. Check the console for details.");
          }}
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                rel: 0,
                playsinline: 1,
                iv_load_policy: 3,
              },
            },
          }}
        />
      </div>

      {/* Toggles */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={muted} onChange={() => setMuted(!muted)} />
          Muted
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={light} onChange={() => setLight(!light)} />
          Thumbnail mode
        </label>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Tip: Autoplay may be blocked by the browser unless muted. Try toggling <b>Muted</b> on if autoplay doesn’t start.
      </p>
    </div>
  );
}
