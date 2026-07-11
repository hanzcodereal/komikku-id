import { useState, useEffect } from "react";
import { getDetail } from "../lib/api";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Play, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function ComicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  let url = "";
  if (slug) {
    const isCanvas = slug.startsWith("c-");
    const match = slug.match(/-(\d+)$/);
    const titleNo = match ? match[1] : "";
    url = `https://m.webtoons.com/id/${isCanvas ? "canvas" : "originals"}/dummy/list?title_no=${titleNo}`;
  }

  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    if (url) {
      getDetail(url).then((res) => {
        setDetail(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [url]);

  if (!url)
    return <div className="p-4 text-white">URL komik tidak ditemukan</div>;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pb-16 text-yellow-400 bg-neutral-950">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!detail)
    return (
      <div className="p-4 text-center text-white bg-neutral-950 min-h-screen">
        Gagal memuat detail komik.
      </div>
    );

  const bgUrl = detail.image ? detail.image : "https://picsum.photos/400/600";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-neutral-950 pb-20"
    >
      <div className="relative aspect-[3/4] sm:aspect-square overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          src={bgUrl}
          className="w-full h-full object-cover"
          alt={detail.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent flex flex-col justify-end p-4 pb-6">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-yellow-400 text-neutral-900 text-xs font-bold px-2 py-1 rounded">
              {detail.genre}
            </span>
            {detail.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="bg-neutral-800 text-neutral-300 text-xs font-medium px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-black text-white leading-tight mb-1">
            {detail.title}
          </h1>
          <p className="text-neutral-300 text-sm">{detail.author}</p>
        </div>
      </div>

      <div className="px-4 space-y-6 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex gap-4 mb-2"
        >
          {detail.episodes.length > 0 && (
            <Link
              to={`/read/${slug}/${detail.episodes[detail.episodes.length - 1].episode_no}`}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition active:scale-[0.98] duration-200"
            >
              <Play size={20} fill="currentColor" /> Mulai Baca
            </Link>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-neutral-400 text-sm leading-relaxed whitespace-pre-wrap"
        >
          {detail.synopsis}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-lg font-bold text-white mb-3">
            Episode ({detail.total_episodes})
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
            className="flex flex-col gap-2"
          >
            {detail.episodes.map((ep: any) => (
              <motion.div
                key={ep.episode_no}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                <Link
                  to={`/read/${slug}/${ep.episode_no}`}
                  className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800/60 rounded-xl p-4 flex items-center justify-between transition active:scale-[0.99] duration-150"
                >
                  <div>
                    <h3 className="text-white font-medium">
                      Episode {ep.episode_no}
                    </h3>
                  </div>
                  <ChevronLeft
                    size={20}
                    className="text-neutral-500 rotate-180"
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
              }
