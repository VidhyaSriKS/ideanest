import { useState, useEffect } from "react";
import { X, User, Mail, Calendar, Shield, Key, Database, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { getSupabaseClient } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'data'>('profile');
  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [stats, setStats] = useState({ totalIdeas: 0, lastLogin: '' });

  useEffect(() => {
    if (isOpen) {
      loadUserData();
    }
  }, [isOpen]);

  const loadUserData = async () => {
    const supabase = getSupabaseClient();
    
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        setName(session.user.user_metadata?.name || session.user.email?.split('@')[0] || '');
        
        // Get stats from localStorage
        const storedUser = localStorage.getItem('ideanest_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setStats({
            totalIdeas: parseInt(localStorage.getItem('ideanest_total_ideas') || '0'),
            lastLogin: new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          });
        }
      } else {
        // Fallback to localStorage
        const storedUser = localStorage.getItem('ideanest_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser({ email: userData.email, user_metadata: { name: userData.name } });
          setName(userData.name);
          setStats({
            totalIdeas: parseInt(localStorage.getItem('ideanest_total_ideas') || '0'),
            lastLogin: new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsUpdating(true);
    const supabase = getSupabaseClient();

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: name.trim() }
      });

      if (error) throw error;

      // Update localStorage
      const storedUser = localStorage.getItem('ideanest_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.name = name.trim();
        localStorage.setItem('ideanest_user', JSON.stringify(userData));
      }

      toast.success('Profile updated successfully! 🎉');
      loadUserData();
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all your local data? This cannot be undone.')) {
      localStorage.removeItem('ideanest_total_ideas');
      setStats({ ...stats, totalIdeas: 0 });
      toast.success('Local data cleared');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl glass-card rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-[#38bdf8]/10 to-[#a855f7]/10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#a855f7] flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                <p className="text-sm text-slate-400">Manage your profile and preferences</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 bg-slate-950/50">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === 'profile'
                  ? 'text-[#38bdf8]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </div>
              {activeTab === 'profile' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#38bdf8] to-[#a855f7]"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === 'security'
                  ? 'text-[#38bdf8]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Security</span>
              </div>
              {activeTab === 'security' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#38bdf8] to-[#a855f7]"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('data')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === 'data'
                  ? 'text-[#38bdf8]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Database className="w-4 h-4" />
                <span>Data</span>
              </div>
              {activeTab === 'data' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#38bdf8] to-[#a855f7]"
                />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-200">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="pl-10 bg-slate-900/30 border-slate-700 text-slate-400 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-slate-500">Email cannot be changed</p>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Check className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-green-400">Account Verified</p>
                      <p className="text-xs text-green-300/70">Your email is verified and active</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="w-full bg-gradient-to-r from-[#38bdf8] to-[#a855f7] hover:opacity-90"
                  >
                    {isUpdating ? 'Updating...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-400">Secure Connection</p>
                      <p className="text-xs text-blue-300/70 mt-1">
                        Your account is protected by Supabase authentication with industry-standard encryption
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Password</p>
                          <p className="text-xs text-slate-500">Last changed recently</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 text-slate-300 hover:text-white"
                        onClick={() => toast.info('Password reset via email coming soon!')}
                      >
                        Change
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Last Login</p>
                          <p className="text-xs text-slate-500">{stats.lastLogin}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-white">Ideas Evaluated</p>
                      <span className="text-2xl font-bold gradient-text">{stats.totalIdeas}</span>
                    </div>
                    <p className="text-xs text-slate-500">Total number of ideas you've submitted</p>
                  </div>

                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <Database className="w-5 h-5 text-amber-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-400">Local Data Storage</p>
                        <p className="text-xs text-amber-300/70 mt-1">
                          Your data is stored locally in your browser. Clear it to reset your statistics.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleClearData}
                    variant="outline"
                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Local Data
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
