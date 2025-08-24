import React, { useEffect, useMemo, useState } from "react";

/**
 * YouTube Search App — React + Tailwind (single-file component)
 * ------------------------------------------------------------
 * ✅ Copy this file into your React (Vite) project and render <YouTubeSearchApp />.
 * ✅ Create a .env file with: VITE_YT_API_KEY=your_api_key_here
 * ✅ Tailwind optional but recommended (classes included). Works with plain CSS too.
 *
 * Features:
 * - Search videos (YouTube Data API v3)
 * - Play selected video in an <iframe>
 * - Paginated results (Load more)
 * - Clean, responsive UI
 */

// Helper: read API key from env (Vite)
const API_KEY = import.meta.env.VITE_YT_API_KEY;
const API_BASE = "https://www.googleapis.com/youtube/v3";

export default function YouTubeSearchApp() {
  const [query, setQuery] = useState("java tutorials");
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextPageToken, setNextPageToken] = useState(null);

  // Build request URL
  const buildSearchUrl = (pageToken) => {
    const params = new URLSearchParams({
      part: "snippet",
      q: query || "",
      key: API_KEY || "",
      maxResults: "12",
      type: "video",
      safeSearch: "moderate",
    });
    if (pageToken) params.set("pageToken", pageToken);
    return `${API_BASE}/search?${params.toString()}`;
  };

  const fetchVideos = async ({ append = false } = {}) => {
    if (!API_KEY) {
      setError(
        "Missing API key. Add VITE_YT_API_KEY in your .env and restart the dev server."
      );
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await fetch(buildSearchUrl(append ? nextPageToken : undefined));
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      const items = Array.isArray(data.items) ? data.items : [];
      setNextPageToken(data.nextPageToken || null);
      setVideos((prev) => (append ? [...prev, ...items] : items));
      // Auto-select first video on fresh search
      if (!append && items.length > 0) {
        const firstId = items[0]?.id?.videoId ?? null;
        setSelectedVideoId(firstId);
      }
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setNextPageToken(null);
    fetchVideos({ append: false });
  };

  useEffect(() => {
    // initial search
    fetchVideos({ append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="mx-auto max-w-6xl grid gap-6">
        {/* Header */}
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">YouTube Search</h1>
            <p className="text-gray-500">React + YouTube Data API v3</p>
          </div>
          <form onSubmit={onSubmit} className="flex w-full md:w-auto gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full md:w-80 rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="rounded-xl px-4 py-2 bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </header>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        {/* Player + Results */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Player */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden shadow bg-black aspect-video">
              {selectedVideoId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/70">
                  Select a video to play
                </div>
              )}
            </div>
          </section>

          {/* Results List */}
          <aside className="lg:col-span-1 grid gap-3">
            {videos.length === 0 && !loading && (
              <p className="text-gray-500">No results. Try a different search.</p>
            )}
            {videos.map((v) => {
              const id = v?.id?.videoId;
              const s = v?.snippet;
              if (!id || !s) return null;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedVideoId(id)}
                  className={`group text-left rounded-xl overflow-hidden border bg-white hover:shadow transition ${
                    selectedVideoId === id ? "ring-2 ring-indigo-500" : "border-gray-200"
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={s.thumbnails?.medium?.url || s.thumbnails?.default?.url}
                      alt={s.title}
                      className="w-44 h-28 object-cover shrink-0"
                      loading="lazy"
                    />
                    <div className="p-3 pr-4">
                      <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-indigo-600">
                        {s.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.channelTitle}</p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {new Date(s.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Load more */}
            {nextPageToken && (
              <button
                onClick={() => fetchVideos({ append: true })}
                className="mt-2 rounded-xl w-full px-4 py-2 bg-gray-900 text-white font-medium shadow hover:bg-black disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load more"}
              </button>
            )}
          </aside>
        </main>

        {/* Footer note */}
        <p className="text-xs text-gray-500">
          Respect API quotas. Consider moving requests to a small backend to keep your API key secret in production.
        </p>
      </div>
    </div>
  );
}
