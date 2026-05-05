import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, GitBranch, BarChart3, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { ALGORITHM_CONFIGS } from '../../utils/graphData';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, color: 'text-neon-blue' },
  { path: '/algorithms', label: 'Algorithms', icon: GitBranch, color: 'text-neon-purple' },
  { path: '/analytics', label: 'Analytics', icon: BarChart3, color: 'text-neon-cyan' },
];

export default function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarContent = (
    <div className={`flex flex-col h-full transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
      {/* Collapse toggle */}
      <div className="hidden lg:flex justify-end px-2 pt-3 pb-1">
        <button
          onClick={() => setCollapsed(c => !c)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-neon-blue hover:bg-neon-blue/10 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-2 space-y-1">
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-mono tracking-widest text-slate-600 px-3 pb-2 uppercase"
            >
              Navigation
            </motion.p>
          )}
        </AnimatePresence>

        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${isActive
                ? 'bg-neon-blue/15 text-white border border-neon-blue/30 shadow-[0_0_12px_rgba(14,165,233,0.15)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-neon-blue' : `${item.color} opacity-60 group-hover:opacity-100`}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}

        {/* Algorithm list */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-4"
            >
              <p className="text-[10px] font-mono tracking-widest text-slate-600 px-3 pb-2 uppercase">
                Algorithms
              </p>
              <div className="space-y-0.5">
                {ALGORITHM_CONFIGS.map(algo => (
                  <NavLink
                    key={algo.id}
                    to={`/algorithms?algo=${algo.id}`}
                    onClick={onMobileClose}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-500
                               hover:text-white hover:bg-white/5 transition-all duration-150 group"
                  >
                    <span className="text-sm flex-shrink-0">{algo.icon}</span>
                    <span className="text-xs truncate group-hover:text-white transition-colors">
                      {algo.shortName}
                    </span>
                    <span className="ml-auto flex-shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded
                                     bg-white/5 text-slate-600">
                      {algo.category[0]}
                    </span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Bottom info */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-3 pb-4"
          >
            <div className="p-3 rounded-lg bg-neon-blue/5 border border-neon-blue/15">
              <p className="text-[10px] text-neon-blue font-mono mb-1">NH-58 EXPRESSWAY</p>
              <p className="text-[10px] text-slate-500">Delhi → Dehradun</p>
              <p className="text-[10px] text-slate-500">~250 km · 6 algorithms</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col h-full bg-navy-900/60 backdrop-blur-sm
                         border-r border-neon-blue/10 transition-all duration-300
                         ${collapsed ? 'w-16' : 'w-56'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50
                         bg-navy-900 border-r border-neon-blue/20 pt-14 overflow-y-auto"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-16 right-3 p-1.5 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
