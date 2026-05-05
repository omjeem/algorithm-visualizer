import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import Navbar from './components/ui/Navbar';
import Sidebar from './components/ui/Sidebar';
import Dashboard from './pages/Dashboard';
import AlgorithmsPage from './pages/AlgorithmsPage';
import AnalyticsPage from './pages/AnalyticsPage';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen bg-[#020617] text-white flex flex-col overflow-hidden">
      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-8"
             style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.2), transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] opacity-8"
             style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent)' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-[80px] opacity-5"
             style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2), transparent)' }} />
      </div>

      <Navbar />

      {/* Mobile menu toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed left-4 bottom-4 z-40 w-12 h-12 rounded-full
                   bg-neon-blue/90 text-white shadow-glow-blue flex items-center justify-center"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* pt-14 offsets the fixed navbar; min-h-0 lets flex children shrink below their content size */}
      <div className="flex flex-1 min-h-0 pt-14">
        <Sidebar isMobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        {/* main is the single scroll container for scrollable pages */}
        <main className="flex-1 min-h-0 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    key="dashboard"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                  >
                    <Dashboard />
                  </motion.div>
                }
              />
              <Route
                path="/algorithms"
                element={
                  <motion.div
                    key="algorithms"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    style={{ height: 'calc(100vh - 3.5rem)' }}
                    className="overflow-hidden flex flex-col"
                  >
                    <AlgorithmsPage />
                  </motion.div>
                }
              />
              <Route
                path="/analytics"
                element={
                  <motion.div
                    key="analytics"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                  >
                    <AnalyticsPage />
                  </motion.div>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
