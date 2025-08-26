import { useEffect, useMemo, useRef, useState } from "react";
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

export default function QuietYouTubePlayer() {
  const [raw, setRaw] = useState("https://www.youtube.com/watch?v=jMzaS3bqd60");
  const [url, setUrl] = useState(normalizeYouTube(raw));
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const debounceRef = useRef();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPlaying(false);
      setUrl(normalizeYouTube(raw));
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [raw]);

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-xl font-semibold mb-3">ReactPlayer (quiet mode)</h2>

      <input
        className="w-full border rounded px-3 py-2 mb-3"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="Paste YouTube URL or ID"
      />

      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <ReactPlayer
          url={url}
          playing={playing}
          muted={muted}
          playsinline
          controls
          width="100%"
          height="100%"
          onReady={() => setPlaying(true)}
          onError={(e) => {
            console.error("ReactPlayer error:", e);
            alert("Could not load this link. Try a normal watch URL or the video ID.");
          }}
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                rel: 0,
                playsinline: 1,
                iv_load_policy: 3,
              },
              embedOptions: { allow: "autoplay; encrypted-media; picture-in-picture" },
            },
          }}
        />
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={muted} onChange={() => setMuted((m) => !m)} />
          Muted (autoplay works when muted)
        </label>
        <button
          className="px-3 py-1 rounded bg-black text-white"
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
