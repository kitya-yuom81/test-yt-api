import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

function normalizeYouTube(input) {
  if (!input) return "";
  const id =
    input.match(/[?&]v=([^&]+)/)?.[1] ||
    input.match(/youtu\.be\/([^?&]+)/)?.[1] ||
    input.match(/shorts\/([^?&]+)/)?.[1] ||
    (/^[a-zA-Z0-9_-]{11}$/.test(input) ? input : null);
  return id ? `https://www.youtube.com/watch?v=${id}` : input;
}

export default function ClickToPlayYouTube() {
  const [raw, setRaw] = useState("https://www.youtube.com/watch?v=jMzaS3bqd60");
  const [url, setUrl] = useState(normalizeYouTube(raw));
  const [playing, setPlaying] = useState(false); // start paused -> user clicks Play
  const [muted, setMuted] = useState(false);
  const debounce = useRef();

  // Debounce URL changes AND pause first (no auto re-play)
  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setPlaying(false);                 // pause before switching
      setUrl(normalizeYouTube(raw));     // update src
      // Do NOT call play here. Wait for user click.
    }, 350);
    return () => clearTimeout(debounce.current);
  }, [raw]);

  return (
    <div className="p-6 max-w-3xl">
      <input
        className="w-full border rounded px-3 py-2 mb-3"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="Paste YouTube URL or ID"
      />

      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <ReactPlayer
          url={url}
          playing={playing}     // only changes when user clicks
          muted={muted}
          controls
          playsinline
          width="100%"
          height="100%"
          // IMPORTANT: no onReady -> don't auto play here
          onError={(e) => console.error("ReactPlayer error:", e)}
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

      <div className="mt-3 flex items-center gap-3">
        <button
          className="px-3 py-1 rounded bg-black text-white"
          onClick={() => setPlaying(p => !p)}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={muted} onChange={() => setMuted(m => !m)} />
          Muted
        </label>
      </div>
    </div>
  );
}
