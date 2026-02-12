import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Fingerprint, Activity, Loader2, ShieldCheck } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (err) {
      console.error("Authentication failed:", err);
      alert(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020408] flex justify-center px-6 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/[0.03] blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[400px] pt-[20vh] relative z-10" 
      >
        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
          
          <div className="flex flex-col items-center mb-10 relative z-10">
            <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <Fingerprint className="text-cyan-500" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
            <div className="flex items-center gap-2 mt-2">
              <Activity size={12} className="text-cyan-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">System Secure</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 ml-1">Email Address</label>
              <div className="relative group/input">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-cyan-500 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-white/[0.03] border border-white/5 pl-12 pr-4 py-4 rounded-xl text-white text-sm outline-none focus:border-cyan-500/40 focus:bg-white/[0.05] transition-all placeholder:text-slate-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 ml-1">Password</label>
              <div className="relative group/input">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-cyan-500 transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/5 pl-12 pr-4 py-4 rounded-xl text-white text-sm outline-none focus:border-cyan-500/40 focus:bg-white/[0.05] transition-all placeholder:text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] mt-4 disabled:opacity-50 shadow-lg shadow-cyan-500/10"
            >
              {isLoading ? (
                <>Logging in... <Loader2 size={18} className="animate-spin" /></>
              ) : (
                <>Login to Account <LogIn size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-xs text-slate-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-cyan-500 hover:text-cyan-400 font-semibold transition-colors">
                Create Access
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-2 opacity-20">
           <ShieldCheck size={12} className="text-white" />
           <p className="text-[10px] text-white font-medium tracking-widest uppercase">Encrypted Neural Link</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;