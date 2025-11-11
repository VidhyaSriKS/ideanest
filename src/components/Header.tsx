import { useState, useEffect } from "react";
import { User, Settings, LogOut, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { getSupabaseClient } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";

interface HeaderProps {
  onOpenSettings: () => void;
  onLogout: () => void;
}

export function Header({ onOpenSettings, onLogout }: HeaderProps) {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('ideanest_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('ideanest_user');
      setIsDropdownOpen(false);
      toast.success('Logged out successfully');
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-2xl">🪶</div>
            <h1 className="text-xl font-bold gradient-text">IdeaNest</h1>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl glass-card hover:bg-white/10 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#a855f7] flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{initials}</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-64 glass-card rounded-xl shadow-2xl border border-white/10 overflow-hidden"
                >
                  {/* User Info */}
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#a855f7] flex items-center justify-center">
                        <span className="text-white font-semibold">{initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-green-400 font-medium">Active Session</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenSettings();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left group"
                    >
                      <Settings className="w-5 h-5 text-slate-400 group-hover:text-[#38bdf8]" />
                      <div>
                        <p className="text-sm text-white font-medium">Account Settings</p>
                        <p className="text-xs text-slate-500">Manage your preferences</p>
                      </div>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-left group mt-1"
                    >
                      <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400" />
                      <div>
                        <p className="text-sm text-white font-medium">Sign Out</p>
                        <p className="text-xs text-slate-500">End your session</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
}