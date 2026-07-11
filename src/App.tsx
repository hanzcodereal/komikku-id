/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import JadwalPage from './pages/JadwalPage';
import ComicPage from './pages/ComicPage';
import ReadPage from './pages/ReadPage';
import InfoPage from './pages/InfoPage';
import { Navbar } from './components/Navbar';

function AppContent() {
  const location = useLocation();
  const isReadPage = location.pathname.startsWith('/read');

  return (
    <div className={`max-w-5xl mx-auto min-h-screen bg-neutral-950 relative md:border-x border-neutral-900/50 shadow-2xl text-neutral-50 ${isReadPage ? '' : 'pb-16'}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/jadwal" element={<JadwalPage />} />
            <Route path="/jadwal/:hari" element={<JadwalPage />} />
            <Route path="/comic/:slug" element={<ComicPage />} />
            <Route path="/read/:slug/:ep" element={<ReadPage />} />
            <Route path="/info" element={<InfoPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <Navbar />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
