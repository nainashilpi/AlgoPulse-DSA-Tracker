import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Code2, UserPlus, Activity, Loader2, ShieldCheck } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    leetcodeHandle: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, formData);
      
      alert("Registration successful! Your neural link is active.");
      navigate("/login");
    } catch (err) {
      console.error("Auth Error:", err.response?.data);
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020408] flex justify-center px-6 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Background Glow Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/[0.03] blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[420px] pt-[12vh] pb-20 relative z-10"
      >
        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
          
          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-4 shadow-inner group-hover:shadow-cyan-500/10 transition-all">
              <UserPlus className="text-cyan-500" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Create Identity</h1>
            <div className="flex items-center gap-2 mt-2">
              <Activity size={12} className="text-cyan-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">System Initialization</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 ml-1">Full Name</label>
              <div className="relative group/input">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-cyan-500 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-white/[0.03] border border-white/5 pl-12 pr-4 py-4 rounded-xl text-white text-sm outline-none focus:border-cyan-500/40 focus:bg-white/[0.05] transition-all placeholder:text-slate-700"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 ml-1">Email Address</label>
              <div className="relative group/input">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-cyan-500 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-white/[0.03] border border-white/5 pl-12 pr-4 py-4 rounded-xl text-white text-sm outline-none focus:border-cyan-500/40 focus:bg-white/[0.05] transition-all placeholder:text-slate-700"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 ml-1">Access Key (Password)</label>
              <div className="relative group/input">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-cyan-500 transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/5 pl-12 pr-4 py-4 rounded-xl text-white text-sm outline-none focus:border-cyan-500/40 focus:bg-white/[0.05] transition-all placeholder:text-slate-700"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {/* LeetCode Handle */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 ml-1">LeetCode Handle</label>
              <div className="relative group/input">
                <Code2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-cyan-500 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="leetcode_username"
                  className="w-full bg-white/[0.03] border border-white/5 pl-12 pr-4 py-4 rounded-xl text-white text-sm outline-none focus:border-cyan-500/40 focus:bg-white/[0.05] transition-all placeholder:text-slate-700"
                  onChange={(e) => setFormData({ ...formData, leetcodeHandle: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] mt-4 disabled:opacity-50 shadow-lg shadow-cyan-500/10"
            >
              {isLoading ? (
                <>Initializing Node... <Loader2 size={18} className="animate-spin" /></>
              ) : (
                <>Initialize Identity <UserPlus size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-xs text-slate-500">
              Already have an identity?{" "}
              <Link to="/login" className="text-cyan-500 hover:text-cyan-400 font-semibold transition-colors">
                Login Now
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-2 opacity-20">
           <ShieldCheck size={12} className="text-white" />
           <p className="text-[10px] text-white font-medium tracking-widest uppercase">Secured Neural Registration</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;