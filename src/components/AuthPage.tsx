import { useState, useEffect } from "react";
import { Mail, Lock, User, Sparkles, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";
import { getSupabaseClient } from "../utils/supabase/client";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface AuthPageProps {
  onAuthSuccess: (user: { id: string; name: string; email: string }) => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const supabaseUrl = `https://${projectId}.supabase.co`;
  const supabase = getSupabaseClient();

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const user = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || ''
        };
        localStorage.setItem('ideanest_user', JSON.stringify(user));
        onAuthSuccess(user);
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isLogin && !name) {
      toast.error("Please enter your name");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
          return;
        }

        if (data.user) {
          const user = {
            id: data.user.id,
            name: data.user.user_metadata?.name || email.split('@')[0],
            email: data.user.email || email
          };
          localStorage.setItem('ideanest_user', JSON.stringify(user));
          onAuthSuccess(user);
          toast.success("Welcome back! 🎉");
        }
      } else {
        // Create new account via server endpoint
        const response = await fetch(
          `${supabaseUrl}/functions/v1/make-server-a61508a1/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({ 
              email, 
              password,
              name 
            }),
          }
        );

        const responseData = await response.json();

        if (!response.ok) {
          if (responseData.error?.includes('already registered')) {
            toast.error("Email already registered. Please sign in instead.");
          } else {
            toast.error(responseData.error || "Failed to create account");
          }
          return;
        }

        // Auto sign-in after successful signup
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          toast.error("Account created but auto sign-in failed. Please sign in manually.");
          setIsLogin(true);
          return;
        }

        if (data.user) {
          const user = {
            id: data.user.id,
            name: name,
            email: data.user.email || email
          };
          localStorage.setItem('ideanest_user', JSON.stringify(user));
          onAuthSuccess(user);
          toast.success("Account created successfully! 🎉");
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Google auth error:', error);
        toast.error("Please configure Google OAuth in Supabase settings", { duration: 5000 });
        toast.info("Visit: https://supabase.com/docs/guides/auth/social-login/auth-google", { duration: 7000 });
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error("Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[#38bdf8]/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#a855f7]/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#06b6d4]/10 rounded-full blur-3xl"
          animate={{ 
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="text-5xl">🪶</div>
            <h1 className="text-5xl font-bold gradient-text">
              IdeaNest
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg"
          >
            {isLogin ? "Welcome back to your idea sanctuary" : "Start your entrepreneurial journey"}
          </motion.p>
        </div>

        {/* Auth Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 rounded-2xl shadow-2xl border border-white/10"
        >
          <form onSubmit={handleEmailAuth} className="space-y-5">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="name" className="text-slate-200">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10 pointer-events-none" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#38bdf8] focus:bg-slate-900/90 transition-colors h-12 [&:-webkit-autofill]:bg-slate-900/80 [&:-webkit-autofill]:text-white autofill:bg-slate-900/80 autofill:text-white"
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#38bdf8] focus:bg-slate-900/90 transition-colors h-12 [&:-webkit-autofill]:bg-slate-900/80 [&:-webkit-autofill]:text-white autofill:bg-slate-900/80 autofill:text-white"
                  disabled={isLoading}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#38bdf8] focus:bg-slate-900/90 transition-colors h-12 [&:-webkit-autofill]:bg-slate-900/80 [&:-webkit-autofill]:text-white autofill:bg-slate-900/80 autofill:text-white"
                  disabled={isLoading}
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors z-10"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-slate-400 mt-1">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#38bdf8] to-[#a855f7] hover:opacity-90 transition-opacity shadow-lg shadow-[#38bdf8]/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/80 text-slate-400">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 text-slate-200 transition-colors"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setName("");
                setEmail("");
                setPassword("");
              }}
              className="text-sm text-[#38bdf8] hover:text-[#a855f7] transition-colors"
              disabled={isLoading}
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>

        {/* Info Notice */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-slate-500 space-y-1"
        >
          <p className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#38bdf8]" />
            <span>Secure authentication powered by Supabase</span>
          </p>
          <p className="text-xs">
            For Google OAuth setup, visit{" "}
            <a 
              href="https://supabase.com/docs/guides/auth/social-login/auth-google"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#38bdf8] hover:underline"
            >
              documentation
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}