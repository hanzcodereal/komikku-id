import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, Sparkles, Share, PlusSquare } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
}

export default function PWAInstallModal({
  isOpen,
  onClose,
  isIOS,
}: PWAInstallModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div id="pwa-modal-overlay" className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
          {/* Animated Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: '15%', opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '10%', opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220, mass: 0.8 }}
            className="relative w-full max-w-md bg-neutral-900 border-t sm:border border-neutral-800/80 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl overflow-hidden z-10"
          >
            {/* Subtle gradient light flare */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              id="close-pwa-modal"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-full transition-colors duration-300 z-20"
            >
              <X size={18} />
            </button>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Icon and Branding */}
              <div className="flex flex-col items-center text-center mt-2 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl blur-md scale-110" />
                  <img
                    src="/logo.png"
                    alt="Komikku ID Logo"
                    className="relative w-20 h-20 object-contain rounded-2xl border border-neutral-800 bg-neutral-950 p-2 shadow-xl"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <div className="hidden w-20 h-20 bg-yellow-400 text-neutral-950 text-3xl font-black rounded-2xl items-center justify-center shadow-xl">
                    K
                  </div>
                </div>

                <h2 className="text-xl font-black text-white mt-4 tracking-tight">Instal Aplikasi Komikku ID</h2>
                <p className="text-xs text-yellow-400 font-bold tracking-wider uppercase mt-0.5">Progressive Web App (PWA)</p>
              </div>

              {/* Feature List */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/40 hover:border-neutral-800 transition-colors duration-300">
                  <div className="p-2 bg-yellow-400/10 text-yellow-400 rounded-lg shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-200">Bebas & Tanpa Iklan</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Nikmati membaca komik favorit dengan performa murni dan lancar.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/40 hover:border-neutral-800 transition-colors duration-300">
                  <div className="p-2 bg-yellow-400/10 text-yellow-400 rounded-lg shrink-0">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-200">Akses Cepat di Layar Utama</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Ikon aplikasi ditambahkan langsung ke layar utama layaknya aplikasi Play Store.</p>
                  </div>
                </div>
              </div>

              {/* Main Action buttons */}
              <div className="border-t border-neutral-800/60 pt-5 mt-4">
                {isIOS ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
                      <p className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                        <Smartphone size={14} /> Panduan Safari iOS:
                      </p>
                      <ul className="text-[11px] text-neutral-400 space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-neutral-800 text-white rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                          <span>Ketuk tombol <span className="text-white font-medium">Bagikan / Share</span> <Share size={12} className="inline mx-1 text-sky-400" /> di bar bawah</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-neutral-800 text-white rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                          <span>Gulir ke bawah dan ketuk <span className="text-white font-medium">'Add to Home Screen'</span> <PlusSquare size={12} className="inline mx-1 text-emerald-400" /></span>
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 text-xs"
                    >
                      Selesai
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                      <p className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                        <Smartphone size={14} /> Cara Instal Manual:
                      </p>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Buka menu opsi browser Anda (biasanya ditandai ikon <span className="text-white font-medium">titik tiga</span> di pojok kanan atas), lalu klik <span className="text-white font-medium">'Instal Aplikasi'</span> atau <span className="text-white font-medium">'Tambahkan ke Layar Utama'</span>.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 text-xs"
                    >
                      Selesai
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
