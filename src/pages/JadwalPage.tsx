import { useState, useEffect, useRef } from "react";
import { getJadwal } from "../lib/api";
import ComicCard from "../components/ComicCard";
import { useParams, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function JadwalPage() {
  const { hari } = useParams();
  const navigate = useNavigate();
  const currentHari = hari || "senin";
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const days = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];

  useEffect(() => {
    setLoading(true);
    getJadwal(currentHari).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [currentHari]);

  // Scroll to keep the selected day in view
  useEffect(() => {
    if (buttonRefs.current[currentHari]) {
      const button = buttonRefs.current[currentHari];
      const container = scrollContainerRef.current;
      if (button && container) {
        const buttonLeft = button.offsetLeft;
        const containerWidth = container.clientWidth;
        const buttonWidth = button.clientWidth;
        // Scroll to center the button
        container.scrollTo({
          left: buttonLeft - containerWidth / 2 + buttonWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [currentHari]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="p-4 space-y-6 pb-8"
    >
      <header className="sticky top-0 z-50 pt-4 pb-3 bg-neutral-950/90 backdrop-blur-md -mx-4 px-4 mb-2 border-b border-neutral-900/50">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-4">
          Jadwal Harian
        </h1>

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar -mx-4 px-4"
        >
          {days.map((day) => (
            <button
              key={day}
              ref={(el) => (buttonRefs.current[day] = el)}
              onClick={() => navigate(`/jadwal/${day}`)}
              className={twMerge(
                "px-4 py-2 rounded-full text-sm font-medium capitalize shrink-0 transition-colors",
                currentHari === day
                  ? "bg-yellow-400 text-neutral-900"
                  : "bg-neutral-800 text-neutral-400 hover:text-white",
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </header>

      <section>
        {loading ? (
          <div className="flex justify-center py-12 text-yellow-400">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <>
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
              }}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4"
            >
              {data.map((c) => (
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
            {data.length === 0 && (
              <div className="text-center py-12 text-neutral-500">
                Tidak ada jadwal hari ini
              </div>
            )}
          </>
        )}
      </section>
    </motion.div>
  );
            }
