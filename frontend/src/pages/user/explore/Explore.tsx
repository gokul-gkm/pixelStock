import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../../../components/layouts/Navbar";
import { C } from "../../../components/ui/palette";
import { imageService, type ExploreImage } from "../../../services/api/image.api";
import { IconSearch, IconSpin, IconGrid, IconColumns, IconImage, IconExplore } from "../../../components/ui/icons";

import { Lightbox } from "../../../components/explore/Lightbox";
import { ExploreCard } from "../../../components/explore/ExploreCard";
import { SkeletonCard } from "../../../components/explore/SkeletonCard";

type Layout = "masonry" | "grid";

export default function ExplorePage() {
  const [images, setImages]       = useState<ExploreImage[]>([]);
  const [page, setPage]           = useState(1);
  const [pages, setPages]         = useState(1);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [searching, setSearching] = useState(false);
  const [search, setSearch]       = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [layout, setLayout]       = useState<Layout>("masonry");
  const [lightbox, setLightbox]   = useState<number | null>(null);
  const [error, setError]         = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (v: string) => {
    setSearch(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQ(v), 400);
  };

  const fetchImages = useCallback(async (pg: number, q: string, append: boolean) => {
    append ? setSearching(false) : setLoading(true);
    setError("");
    try {
      const res = await imageService.getPublicImages(pg, 24, q || undefined);
      setImages(prev => append ? [...prev, ...res.images] : res.images);
      setPages(res.pages);
      setTotal(res.total);
      setPage(pg);
    } catch (err: any) {
      setError(err.message ?? "Failed to load images");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    setSearching(true);
    setPage(1);
    fetchImages(1, debouncedQ, false);
  }, [debouncedQ, fetchImages]);

  const loadMore = () => fetchImages(page + 1, debouncedQ, true);

  const navLightbox = useCallback((dir: -1 | 1) => {
    setLightbox(prev => {
      if (prev === null) return null;
      const next = prev + dir;
      return next >= 0 && next < images.length ? next : prev;
    });
  }, [images.length]);

  const SKELETONS = [220, 300, 180, 260, 200, 240, 300, 180, 220, 260, 200, 240];

  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap');
        .display { font-family: 'Sora', sans-serif; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #C084FC44; border-radius: 99px; }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: "radial-gradient(circle,#7C5CFC,transparent)" }} />
        <div className="absolute top-1/2 -left-32 w-72 h-72 rounded-full blur-3xl opacity-[0.07]" style={{ background: "radial-gradient(circle,#C084FC,transparent)" }} />
        <div className="absolute -bottom-24 right-1/3 w-64 h-64 rounded-full blur-3xl opacity-[0.06]" style={{ background: "radial-gradient(circle,#7C5CFC,transparent)" }} />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold"
            style={{ background: "rgba(124,92,252,0.1)", color: C.accent1, border: "1px solid rgba(124,92,252,0.2)" }}>
            <IconExplore /> Discover Creative Work
          </div>
          <h1 className="display font-bold text-3xl sm:text-5xl mb-3" style={{ color: C.text }}>
            Explore the <span style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Gallery</span>
          </h1>
          <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: C.muted }}>
            Browse public images shared by creators across the platform
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12, ease: [0.22,1,0.36,1] }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.muted }}>
              {searching ? <IconSpin size={16} /> : <IconSearch size={16} />}
            </div>
            <input
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search by image title…"
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.85)",
                border: `1.5px solid ${search ? C.accent1 : C.border}`,
                backdropFilter: "blur(12px)",
                color: C.text,
                boxShadow: search ? "0 0 0 3px rgba(124,92,252,0.12)" : "none",
              }}
            />
            {search && (
              <button onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ color: C.muted, background: "rgba(124,92,252,0.08)" }}>
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 p-1 rounded-2xl shrink-0"
            style={{ background: "rgba(255,255,255,0.8)", border: `1px solid ${C.border}` }}>
            {([["masonry", <IconColumns size={15} />], ["grid", <IconGrid size={15} />]] as [Layout, React.ReactElement][]).map(([mode, icon]) => (
              <button key={mode} onClick={() => setLayout(mode)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize"
                style={{
                  background: layout === mode ? "linear-gradient(135deg,#7C5CFC,#C084FC)" : "transparent",
                  color: layout === mode ? "#fff" : C.muted,
                  boxShadow: layout === mode ? "0 4px 12px rgba(124,92,252,0.28)" : "none",
                }}>
                {icon} {mode}
              </button>
            ))}
          </div>

          {!loading && (
            <div className="shrink-0 px-4 py-2 rounded-2xl text-xs font-bold hidden sm:flex items-center gap-1.5"
              style={{ background: "rgba(124,92,252,0.08)", color: C.accent1, border: "1px solid rgba(124,92,252,0.15)" }}>
              {total.toLocaleString()} image{total !== 1 ? "s" : ""}
            </div>
          )}
        </motion.div>

        {error && !loading && (
          <div className="text-center py-16 rounded-3xl mb-6"
            style={{ background: "rgba(255,107,107,0.04)", border: "1.5px solid rgba(255,107,107,0.15)" }}>
            <p className="text-sm font-semibold mb-2" style={{ color: "#DC2626" }}>{error}</p>
            <button onClick={() => fetchImages(1, debouncedQ, false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#FF6B6B,#FF4444)" }}>Retry</button>
          </div>
        )}

        {loading && (
          <div className={layout === "masonry"
            ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
            : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"}>
            {SKELETONS.map((h, i) => (
              <div key={i} className={layout === "masonry" ? "break-inside-avoid mb-4" : ""}>
                <SkeletonCard h={layout === "masonry" ? h : 200} />
              </div>
            ))}
          </div>
        )}

        {!loading && images.length === 0 && !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-28 rounded-3xl"
            style={{ background: "rgba(255,255,255,0.6)", border: `2px dashed ${C.border}` }}>
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
              style={{ background: "rgba(124,92,252,0.08)", color: C.muted }}>
              <IconImage />
            </div>
            <p className="font-semibold text-lg mb-1" style={{ color: C.text }}>
              {debouncedQ ? `No results for "${debouncedQ}"` : "No public images yet"}
            </p>
            <p className="text-sm" style={{ color: C.muted }}>
              {debouncedQ ? "Try a different search term" : "Be the first to share your work!"}
            </p>
            {debouncedQ && (
              <button onClick={() => handleSearchChange("")}
                className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)", boxShadow: "0 4px 14px rgba(124,92,252,0.28)" }}>
                Clear search
              </button>
            )}
          </motion.div>
        )}

        {!loading && images.length > 0 && layout === "masonry" && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            <AnimatePresence>
              {images.map((img, i) => (
                <div key={img._id} className="break-inside-avoid mb-4">
                  <ExploreCard image={img} index={i} onClick={() => setLightbox(i)} />
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && images.length > 0 && layout === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {images.map((img, i) => (
                <div key={img._id} className="aspect-square overflow-hidden rounded-2xl">
                  <ExploreCard image={img} index={i} onClick={() => setLightbox(i)} />
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && page < pages && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-10">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 12px 32px rgba(124,92,252,0.32)" }}
              whileTap={{ scale: 0.97 }}
              onClick={loadMore}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)", boxShadow: "0 6px 20px rgba(124,92,252,0.28)" }}>
              Load more images
            </motion.button>
          </motion.div>
        )}

        {!loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-16 rounded-3xl p-8 text-center"
            style={{ background: "linear-gradient(135deg,rgba(124,92,252,0.08),rgba(192,132,252,0.08))", border: "1px solid rgba(124,92,252,0.15)" }}>
            <h2 className="display font-bold text-xl mb-2" style={{ color: C.text }}>Share your own work</h2>
            <p className="text-sm mb-5" style={{ color: C.muted }}>Upload images to your dashboard and set them to public</p>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)", boxShadow: "0 6px 18px rgba(124,92,252,0.28)" }}>
                Go to Dashboard →
              </motion.button>
            </Link>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            images={images}
            index={lightbox}
            onClose={() => setLightbox(null)}
            onNav={navLightbox}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
