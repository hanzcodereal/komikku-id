import { useState, useEffect } from "react";
import { getRead } from "../lib/api";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function ReadPage() {
  const { slug, ep } = useParams();
  const navigate = useNavigate();

  let url = "";
  if (slug && ep) {
    const isCanvas = slug.startsWith("c-");
    const match = slug.match(/-(\d+)$/);
    const titleNo = match ? match[1] : "";
    url = `https://m.webtoons.com/id/${isCanvas ? "canvas" : "originals"}/dummy/ep/viewer?title_no=${titleNo}&episode_no=${ep}`;
  }

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleInteraction = () => {
      setShowNav(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowNav(false), 3000);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("scroll", handleInteraction, { passive: true });

    handleInteraction();

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (url) {
      setLoading(true);
      setImagesLoaded(false);
      setLoadedCount(0);
      window.scrollTo(0, 0);
      getRead(url).then((res) => {
        setData(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (data && data.images && data.images.length > 0) {
      let loaded = 0;
      const total = data.images.length;

      data.images.forEach((img: any) => {
        const image = new Image();
        image.onload = () => {
          loaded++;
          setLoadedCount(loaded);
          if (loaded >= Math.ceil(total / 4)) {
            setImagesLoaded(true);
          }
        };
        image.onerror = () => {
          loaded++;
          setLoadedCount(loaded);
          if (loaded >= Math.ceil(total / 4)) {
            setImagesLoaded(true);
          }
        };
        image.src = img.url;
      });
    } else if (data && (!data.images || data.images.length === 0)) {
      setImagesLoaded(true);
    }
  }, [data]);

  if (!url)
    return <div className="p-4 text-white">URL episode tidak ditemukan</div>;

  if (loading || (data && !imagesLoaded)) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen pb-16 text-yellow-400 bg-neutral-950 space-y-4">
        <Loader2 className="animate-spin" size={40} />
        <div className="text-sm font-medium text-neutral-400">
          {loading
            ? "Memuat episode..."
            : `Memuat gambar... ${loadedCount} / ${Math.ceil((data?.images?.length || 0) / 4)}`}
        </div>
      </div>
    );
  }

  if (!data || !data.images || data.images.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[50vh] text-center bg-neutral-950 text-white">
        <p className="mb-4 text-neutral-400">Gagal memuat gambar episode.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-yellow-400 text-black font-bold rounded flex items-center gap-2 animate-pulse"
        >
          <ChevronLeft size={20} /> Kembali
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-black relative pb-20"
    >
      <div
        className={`fixed top-0 w-full max-w-5xl mx-auto z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900/50 p-4 transition-transform duration-300 flex items-center ${showNav ? "translate-y-0" : "-translate-y-full"}`}
      >
        <button
          onClick={() => navigate(`/comic/${slug}`)}
          className="mr-3 p-2 bg-neutral-800 rounded-full text-white hover:bg-neutral-700 active:scale-90 transition-transform"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-white leading-tight line-clamp-1 text-sm md:text-base">
            Membaca
          </h1>
          <h2 className="text-neutral-400 text-xs">{data.episode}</h2>
        </div>
      </div>

      <div className="flex flex-col mx-auto w-full max-w-5xl">
        {data.images.map((img: any, i: number) => (
          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "200px" }}
            transition={{ duration: 0.4 }}
            key={i}
            src={img.url}
            alt={`Page ${i + 1}`}
            className="w-full h-auto block m-0 p-0"
            loading={i < 4 ? "eager" : "lazy"}
          />
        ))}
      </div>

      {data.next && (
        <div className="p-6 flex justify-center mt-4">
          <Link
            to={`/read/${slug}/${parseInt(ep || "0") + 1}`}
            className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-bold rounded-xl shadow-lg transition active:scale-95 duration-150"
          >
            Episode Selanjutnya
          </Link>
        </div>
      )}
    </motion.div>
  );
}
