import { useState, useEffect } from "react";
import {
  Info,
  Download,
  CheckCircle2,
  ChevronRight,
  Heart,
} from "lucide-react";
import { motion } from "motion/react";
import PWAInstallModal from "../components/PWAInstallModal";

export default function InfoPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleMobile);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
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
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="p-4 space-y-6 pb-24 text-neutral-100 min-h-screen bg-neutral-950"
    >
      {/* Header */}
      <header className="sticky top-0 z-50 pt-4 pb-3 bg-neutral-950/90 backdrop-blur-md -mx-4 px-4 mb-2 border-b border-neutral-900/50">
        <h1 className="text-2xl font-black tracking-tight text-white">
          Tentang Aplikasi
        </h1>
      </header>

      {/* Brand Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-900 rounded-2xl shadow-xl"
      >
        <img
          src="/logo.png"
          alt="Komikku ID Logo"
          className="w-24 h-24 object-contain rounded-2xl shadow-2xl mb-4 border border-neutral-800 bg-neutral-950"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            if (e.currentTarget.nextElementSibling) {
              (
                e.currentTarget.nextElementSibling as HTMLElement
              ).style.display = "flex";
            }
          }}
        />
        <div className="hidden w-24 h-24 bg-yellow-400 text-neutral-950 text-4xl font-black rounded-2xl items-center justify-center mb-4 shadow-xl">
          K
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">
          Komikku ID
        </h2>
        <p className="text-xs text-yellow-400 font-medium tracking-wider uppercase mt-1">
          Platform Baca Komik
        </p>

        <p className="text-sm text-neutral-400 leading-relaxed mt-4 max-w-md">
          Komikku ID adalah platform baca komik gratis tanpa iklan yang menyajikan
          berbagai pilihan komik terpopuler dengan jadwal rilis harian
          terupdate.
        </p>
      </motion.div>

      {/* Dukung Kami Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="overflow-hidden bg-rose-950/20 border border-rose-900/30 rounded-2xl p-5 relative"
      >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl" />
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
            <Heart size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              Dukung Kami
              <span className="bg-rose-500/15 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                Support
              </span>
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Dukung pengembangan Komikku ID agar tetap gratis dan bebas iklan. 
              Setiap dukungan sangat berarti untuk kami!
            </p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-rose-950/50 flex">
          <a
            href="https://saweria.co/hanzreally"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 transition-colors"
          >
            <Heart size={16} fill="currentColor" /> Dukung Sekarang
          </a>
        </div>
      </motion.div>

      {/* PWA / App Installation Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-neutral-900 border border-neutral-800/80 rounded-2xl p-5"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-400/10 rounded-xl text-yellow-400">
            <Download size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              Instal Aplikasi
              <span className="bg-yellow-400/10 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-400/30">
                PWA
              </span>
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Dapatkan akses instan langsung dari layar utama perangkat Anda,
              berjalan lebih cepat, lebih hemat kuota, dan mendukung baca
              offline.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-800/60">
          {isInstalled ? (
            <div className="flex items-center gap-2 p-3 bg-neutral-950/50 rounded-xl border border-neutral-800/30 text-emerald-400">
              <CheckCircle2 size={20} className="shrink-0" />
              <span className="text-xs font-semibold">
                Komikku ID telah terinstal di layar utama Anda!
              </span>
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className="w-full bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-neutral-950 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-950/20 transition-colors duration-300"
            >
              <Download size={18} /> Instal Sekarang
            </button>
          )}
        </div>
      </motion.div>

      {/* App Version Info Footer */}
      <div className="text-center pt-4 text-neutral-600 space-y-1">
        <p className="text-[10px] font-mono">KOMIKKU ID | HANZCODE</p>
        <p className="text-[10px]">&copy; 2026 Komikku ID. All rights reserved.</p>
      </div>

      {/* PWA Installation Overlay Modal */}
      <PWAInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isIOS={isIOS}
      />
    </motion.div>
  );
        }
