import { useState } from "react";

/**
 * How to use:
 * - Put your YouTube Data API v3 key in Vite env:  VITE_YT_KEY=xxxxx
 * - Import and render <YouTubeSearchMinimal />
 *
 * Features:
 * - Search YouTube and list results
 * - Click a result to play in a minimal YouTube (nocookie) embed (modest branding)
 * - OR paste your own MP4 in "Self-hosted MP4" field to play with a pure HTML5 <video> (no branding)
 */

const YT_API = "https://www.googleapis.com/youtube/v3/search";
const KEY = import.meta.env.VITE_YT_API_KEY; // <-- your API key

export default function YouTubeSearchMinimal() {
  const [q, setQ] = useState("java tutorials");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null); // { type: "yt" | "mp4", id/url, title }
  const [mp4Url, setMp4Url] = useState("");

  async function doSearch(e) {
    e?.preventDefault();
    if (!KEY) {
      alert("Missing VITE_YT_KEY in your env.");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        key: KEY,
        part: "snippet",
        type: "video",
        maxResults: "10",
        q,
      });
      const res = await fetch(`${YT_API}?${params.toString()}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
      alert("Search failed. Check console.");
    } finally {
      setLoading(false);
    }
  }

  function closePlayer() {
    setSelected(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">YouTube Search (clean player)</h1>
          <p className="text-sm text-gray-500">
            Minimal YouTube embed (compliant) or pure HTML5 player for your own MP4.
          </p>
        </header>

        {/* Search Bar */}
        <form onSubmit={doSearch} className="flex gap-2 mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search videos…"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 ring-gray-300"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {/* Self-hosted MP4 (zero branding) */}
        <div className="mb-8 p-4 rounded-xl border border-gray-200 bg-white">
          <label className="block text-sm font-medium mb-2">
            Self-hosted MP4 (zero branding)
          </label>
          <div className="flex gap-2">
            <input
              value={mp4Url}
              onChange={(e) => setMp4Url(e.target.value)}
              placeholder="https://your-cdn.com/video.mp4"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 ring-gray-300"
            />
            <button
              type="button"
              onClick={() => {
                if (!mp4Url) return;
                setSelected({ type: "mp4", url: mp4Url, title: "Custom video" });
              }}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:opacity-90"
            >
              Play MP4
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Use this if you need a fully clean player. Make sure you own the rights to the file.
          </p>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((v) => {
            const vid = v.id?.videoId;
            const sn = v.snippet;
            if (!vid || !sn) return null;
            return (
              <button
                key={vid}
                onClick={() => setSelected({ type: "yt", id: vid, title: sn.title })}
                className="text-left bg-white rounded-xl border border-gray-200 hover:shadow-md transition overflow-hidden"
              >
                <img
                  src={sn.thumbnails?.medium?.url}
                  alt={sn.title}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-2">{sn.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{sn.channelTitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Player Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={closePlayer}
        >
          <div
            className="bg-black rounded-2xl w-full max-w-4xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900">
              <span className="text-white text-sm truncate pr-4">
                {selected.title || "Now playing"}
              </span>
              <button
                onClick={closePlayer}
                className="text-white/80 hover:text-white text-sm px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="bg-black">
              {selected.type === "yt" ? (
                <iframe
                  title="video"
                  className="w-full aspect-video"
                  src={`https://www.youtube-nocookie.com/embed/${selected.id}?autoplay=1&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&color=white`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <video
                  className="w-full aspect-video"
                  src={selected.url}
                  controls
                  playsInline
                  autoPlay
                />
              )}
            </div>

            {selected.type === "yt" && (
              <div className="px-3 py-2 bg-zinc-900 text-xs text-zinc-400">
                Using YouTube’s minimal, privacy-enhanced player (branding reduced as allowed).
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
