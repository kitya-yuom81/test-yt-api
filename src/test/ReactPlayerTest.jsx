import { useMemo, useState } from "react";
import ReactPlayer from "react-player";

function normalizeYouTube(urlOrId) {
  if (!urlOrId) return "";
  // Accept raw ID or any YouTube URL (youtu.be, watch, shorts)
  const idMatch =
    urlOrId.match(/[?&]v=([^&]+)/)?.[1] ||           // watch?v=ID
    urlOrId.match(/youtu\.be\/([^?&]+)/)?.[1] ||     // youtu.be/ID
    urlOrId.match(/shorts\/([^?&]+)/)?.[1] ||        // shorts/ID
    (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId) ? urlOrId : null);
  return idMatch ? `https://www.youtube.com/watch?v=${idMatch}` : urlOrId;
}

export default function ReactPlayerTest() {
  const [raw, setRaw] = useState("https://www.youtube.com/watch?v=jMzaS3bqd60");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);   // start muted -> autoplay allowed
  const [light, setLight] = useState(false);  // set true if you want click-to-play thumbnail

  const url = useMemo(() => normalizeYouTube(raw), [raw]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-4">React Player — YouTube (minimal)</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Paste YouTube URL or video ID"
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button
          onClick={() => setPlaying((p) => !p)}
          className="px-4 py-2 rounded-lg bg-black text-white"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      <div className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden">
        <ReactPlayer
          url={url}
          playing={playing}
          muted={muted}
          controls
          light={light}
          width="100%"
          height="100%"
          onReady={() => {
            // Start playing only after the player is ready (reduces AbortError noise)
            setPlaying(true);
          }}
          onPlay={() => {/* keep state in sync */}}
          onPause={() => {/* keep state in sync */}}
          onError={(e) => {
            console.error("ReactPlayer error:", e);
            alert("Could not load this link. Try a standard watch URL or the video ID.");
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

      <div className="mt-3 flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={muted} onChange={() => setMuted((m) => !m)} />
          Muted (autoplay needs this)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={light} onChange={() => setLight((v) => !v)} />
          Thumbnail mode (click to start)
        </label>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        If you still see “play() request was interrupted by pause()”, it’s a harmless browser
        warning that happens when play/pause state changes quickly—your video should still play.
      </p>
    </div>
  );
}
