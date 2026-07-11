import React, { useState } from "react";
import { searchComic } from "../lib/api";
import ComicCard from "../components/ComicCard";
import { SearchIcon, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<{
    original: any[];
    canvas: any[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const data = await searchComic(keyword);
      setResults(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="p-4 space-y-6"
    >
      <header className="sticky top-0 z-50 pt-4 pb-3 bg-neutral-950/90 backdrop-blur-md -mx-4 px-4 mb-2 border-b border-neutral-900/50">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-4">
          Pencarian
        </h1>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari judul atau komikus..."
            className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 placeholder:text-neutral-500 transition-all"
          />
          <SearchIcon
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            size={20}
          />
          <button type="submit" className="hidden"></button>
        </form>
      </header>

      {loading ? (
        <div className="flex justify-center py-12 text-yellow-400">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : results ? (
        <div className="space-y-6">
          {results.original.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4 text-neutral-200">
                Originals ({results.original.length})
              </h2>
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.03 },
                  },
                }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-4"
              >
                {results.original.map((c) => (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    key={c.title_no}
                  >
                    <ComicCard comic={c} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}
          {results.canvas.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4 text-neutral-200">
                Canvas ({results.canvas.length})
              </h2>
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.03 },
                  },
                }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-4"
              >
                {results.canvas.map((c) => (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    key={c.title_no}
                  >
                    <ComicCard comic={c} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}
          {results.original.length === 0 && results.canvas.length === 0 && (
            <div className="text-center py-12 text-neutral-500">
              Tidak ada komik yang ditemukan
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-neutral-500">
          Ketik kata kunci untuk mulai mencari
        </div>
      )}
    </motion.div>
  );
}
