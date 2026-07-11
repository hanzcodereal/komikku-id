import { useState, useEffect } from "react";
import { getHome } from "../lib/api";
import ComicCard from "../components/ComicCard";
import { Loader2, Download, X, Smartphone, ArrowRight } from "lucide-react";
import PWAInstallModal from "../components/PWAInstallModal";
import { motion } from "motion/react";

export default function HomePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // PWA installation state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getHome().then((res) => {
      setData(res);
      setLoading(false);
    });

    // Check PWA status
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    setIsInstalled(isStandalone);

    // Check iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isApple);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Only show banner if not already dismissed in this session or stored dismissed
      const isDismissed =
        localStorage.getItem("komikku_pwa_dismissed") === "true";
      if (!isStandalone && !isDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Fallback display for iOS/Safari or other browsers where prompt isn't supported automatically
    // but we still want to show them how to install easily
    const isDismissed =
      localStorage.getItem("komikku_pwa_dismissed") === "true";
    if (!isStandalone && !isDismissed && isApple) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Directly trigger the native browser install prompt — no extra confirm step
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // No native prompt available (e.g. iOS Safari) — show manual guidance
      setIsModalOpen(true);
    }
  };

  const handleDismissBanner = () => {
    localStorage.setItem("komikku_pwa_dismissed", "true");
    setShowBanner(false);
  };

  const featured = data.slice(0, 5);
  const others = data.slice(5, 25);

  if (loading) {
    return (
      <div className="flex justify-center py-12 text-yellow-400">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="p-4 space-y-8 pb-8"
    >
      <header className="sticky top-0 z-50 pt-4 pb-3 bg-neutral-950/90 backdrop-blur-md -mx-4 px-4 mb-2 border-b border-neutral-900/50 flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight text-white">
          Komikku ID
        </h1>

        {/* Quick Header Install Button if available */}
        {!isInstalled && (deferredPrompt || isIOS) && (
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-neutral-900 rounded-full text-xs font-black transition-colors shadow-lg shadow-yellow-400/10"
          >
            <Download size={13} className="stroke-[3]" />
            <span>Instal App</span>
          </button>
        )}
      </header>

      {/* Prominent PWA Banner */}
      {showBanner && (
        <div className="relative overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-900 to-yellow-950/20 border border-yellow-400/20 rounded-2xl p-5 shadow-xl animate-fade-in">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />
          <button
            onClick={handleDismissBanner}
            className="absolute top-3 right-3 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex gap-4">
            <div className="shrink-0 w-12 h-12 bg-neutral-950 border border-neutral-800 rounded-xl p-1.5 flex items-center justify-center shadow-lg">
              <img
                src="/logo.png"
                alt="Komikku ID Logo"
                className="w-full h-full object-contain rounded"
              />
            </div>

            <div className="space-y-1 pr-6">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                Instal Komikku ID
                <span className="bg-yellow-400/10 text-yellow-400 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  PWA Ready
                </span>
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Baca komik favorit tanpa iklan, lebih hemat kuota, dan langsung
                dari layar utama HP Anda!
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/50 flex gap-3">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-neutral-950 text-xs font-black py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-yellow-950/20"
            >
              <Download size={14} className="stroke-[3]" /> Instal Sekarang
            </button>
            <button
              onClick={handleDismissBanner}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-xl transition-colors"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-lg font-bold mb-4 text-neutral-200">Rekomendasi</h2>
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
          }}
          initial="hidden"
          animate="visible"
          className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar"
        >
          {featured.map((c) => (
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { type: "spring", stiffness: 180, damping: 26, mass: 0.8 },
                },
              }}
              key={c.title_no}
              className="shrink-0 w-[260px] snap-center"
            >
              <ComicCard comic={c} variant="featured" />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-neutral-200">Sedang Hangat</h2>
        </div>
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
          }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4"
        >
          {others.map((c) => (
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
      </motion.section>

      {/* Interactive PWA Install Modal */}
      <PWAInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isIOS={isIOS}
      />
    </motion.div>
  );
                }
