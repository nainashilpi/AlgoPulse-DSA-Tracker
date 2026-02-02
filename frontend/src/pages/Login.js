import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Fingerprint, Activity, Loader2 } from "lucide-react";

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
      
      navigate("/dashboard");
    } catch (err) {
      console.error("Authentication failed:", err);
      alert(err.response?.data?.message || "Neural Link Failed: Credentials Mismatch ❌");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020408] flex justify-center px-6 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-600/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-600/[0.03] blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[370px] pt-[22vh] relative z-10" 
      >
        <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <motion.div 
            animate={{ top: ["-10%", "110%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent z-0"
          />

          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-4">
              <Fingerprint className="text-cyan-400" size={24} />
            </div>
            <h1 className="text-lg font-black text-white italic tracking-tighter uppercase">Neural_Link</h1>
            <div className="flex items-center gap-2 mt-1">
              <Activity size={10} className="text-cyan-500 animate-pulse" />
              <span className="text-[7px] font-black text-slate-600 tracking-[0.4em] uppercase italic">System_Ready</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div className="relative group">
              <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-cyan-500 transition-colors" />
              <input
                type="email"
                required
                placeholder="IDENTITY_EMAIL"
                className="w-full bg-black/40 border border-white/5 pl-11 pr-4 py-4 rounded-xl text-white text-[10px] font-bold outline-none focus:border-cyan-500/30 transition-all placeholder:text-slate-800 tracking-widest uppercase"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-cyan-500 transition-colors" />
              <input
                type="password"
                required
                placeholder="ACCESS_KEY"
                className="w-full bg-black/40 border border-white/5 pl-11 pr-4 py-4 rounded-xl text-white text-[10px] font-bold outline-none focus:border-cyan-500/30 transition-all placeholder:text-slate-800 tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-black rounded-xl font-black text-[10px] tracking-[0.2em] uppercase italic transition-all flex items-center justify-center gap-2 active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>SYNCING... <Loader2 size={14} className="animate-spin" /></>
              ) : (
                <>Sync_Protocol <LogIn size={14} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <Link
              to="/register"
              className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-cyan-400 transition-colors italic"
            >
              New_Node? <span className="text-slate-400 underline decoration-cyan-500/30">Create_Access</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;