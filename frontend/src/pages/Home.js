
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Trophy, Sparkles, Target, 
  Linkedin, Github, Quote, Zap, ChevronDown, Mail, Instagram,
  LayoutDashboard, BarChart3, Users, Cpu, MessageSquare, Activity, Globe,
  ShieldCheck, Fingerprint, Rocket, ZapIcon, Lock, Terminal
} from "lucide-react";

const Home = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative min-h-screen bg-[#010204] text-slate-300 overflow-x-hidden selection:bg-emerald-500/30 font-sans tracking-tight">
      
      {/* --- UNIQUE THEME BACKGROUND (Emerald & Purple Glow) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-full h-[700px] bg-emerald-500/[0.04] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/[0.03] blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.18] mix-blend-overlay" />
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 md:pt-48 pb-20 px-6 text-center z-10">
        <motion.div initial="hidden" animate="visible" className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-[9px] font-black tracking-[0.4em] text-emerald-400 uppercase mb-10 backdrop-blur-xl">
             <Fingerprint size={12} className="animate-pulse" /> AUTH_PROTOCOL: MULTI_LEVEL_ACCESS
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-7xl md:text-[11.5rem] font-black mb-8 tracking-tighter leading-[0.8] italic uppercase">
            <span className="text-white">ALGO</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-cyan-600">PULSE_</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-[10px] md:text-[11px] text-slate-500 max-w-2xl mx-auto mb-14 font-black uppercase tracking-[0.4em] italic leading-loose opacity-70">
            Advanced Competition Framework with <span className="text-emerald-500">Dual-Panel Control</span>. 
            Syncing Professional Legacies in <span className="text-purple-500">Real-Time</span>.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/register" className="group px-10 py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black rounded-xl hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] uppercase tracking-[0.2em] text-[10px] italic transition-all hover:scale-105">
              START_USER_SYNC <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" size={14} />
            </Link>
            <Link to="/leaderboard" className="px-10 py-5 bg-white/[0.02] border border-white/10 rounded-xl hover:bg-white/5 text-white font-black uppercase tracking-[0.2em] text-[10px] italic flex items-center justify-center gap-3 transition-all">
              LEADERBOARD <ShieldCheck className="text-purple-500" size={14} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= DUAL PANEL ARCHITECTURE (New Detail) ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-y border-white/5">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Admin Side */}
          <div className="p-10 rounded-[3rem] bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
              <Terminal size={20} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase mb-4 tracking-tighter">Command_Center (Admin)</h3>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <li className="flex items-center gap-3"><Zap size={10} className="text-purple-500"/> Global User Surveillance</li>
              <li className="flex items-center gap-3"><Zap size={10} className="text-purple-500"/> Heatmap & Ranking Override</li>
              <li className="flex items-center gap-3"><Zap size={10} className="text-purple-500"/> Automated POTD Distribution</li>
            </ul>
          </div>
          {/* User Side */}
          <div className="p-10 rounded-[3rem] bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
              <Users size={20} className="text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase mb-4 tracking-tighter">The_Arena (User)</h3>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <li className="flex items-center gap-3"><Zap size={10} className="text-emerald-500"/> Personal LeetCode Pulse Sync</li>
              <li className="flex items-center gap-3"><Zap size={10} className="text-emerald-500"/> Real-time Leaderboard Climbing</li>
              <li className="flex items-center gap-3"><Zap size={10} className="text-emerald-500"/> Interactive Logic Vault Access</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= WHY ALGOPULSE? (Benefits) ================= */}
      <section className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="flex-1">
            <h2 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter mb-8 leading-[0.9]">EVOLVE_OR<br/><span className="text-emerald-500">STAGNATE.</span></h2>
            <div className="space-y-12">
              {[
                { t: "Consistency Algorithm", d: "We track your LeetCode streaks and award Pulse-points. No more lazy days." },
                { t: "Professional Edge", d: "Your ranking is public. Use your AlgoPulse profile as a verified proof of skill for recruiters." },
                { t: "Community Logic", d: "Don't just solve; discuss. Share optimized approaches in the encrypted hub." }
              ].map((b, i) => (
                <div key={i} className="group cursor-default">
                  <h4 className="text-lg font-black text-emerald-400 uppercase italic mb-2 group-hover:translate-x-2 transition-transform tracking-widest">{b.t}</h4>
                  <p className="text-[11px] font-black text-slate-500 uppercase leading-loose tracking-widest">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
            <div className="relative p-12 bg-white/[0.01] border border-white/5 rounded-[4rem] backdrop-blur-3xl">
              <BarChart3 size={40} className="text-emerald-500 mb-8" />
              <h3 className="text-3xl font-black text-white italic uppercase mb-6">QUANTIFIED_SUCCESS</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
                By syncing your LeetCode metrics, we create a visual heatmap of your technical growth. Every Easy, Medium, and Hard problem is weighted to provide an accurate representation of your engineering caliber.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CORE FEATURES (Leaderboard Card Style) ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <MessageSquare />, title: "Hub_Connect", desc: "Real-time global chat for algorithm strategies." },
            { icon: <Trophy />, title: "The_Ranking", desc: "Dynamic leaderboard powered by your LeetCode pulse." },
            { icon: <Rocket />, title: "POTD_Module", desc: "Curated Problem of the Day to maximize efficiency." },
            { icon: <Activity />, title: "Neural_Heatmap", desc: "Data-driven visualization of your coding consistency." }
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-white/[0.01] border border-white/5 hover:bg-emerald-500/[0.02] hover:border-emerald-500/30 transition-all group overflow-hidden">
              <div className="text-emerald-500 mb-8 bg-emerald-500/10 w-12 h-12 flex items-center justify-center rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                {React.cloneElement(item.icon, { size: 20 })}
              </div>
              <h3 className="text-sm font-black mb-4 text-white uppercase italic tracking-[0.2em]">{item.title}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 leading-relaxed group-hover:text-slate-400 transition-colors">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= THE ARCHITECT ================= */}
      <section className="max-w-5xl mx-auto px-6 py-32 relative z-10">
        <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-[3rem] p-1 overflow-hidden">
          <div className="bg-[#020408] rounded-[2.9rem] grid md:grid-cols-12 items-center overflow-hidden">
            <div className="md:col-span-5 h-[450px] relative group overflow-hidden">
              <img src="/naina-profile.jpg" alt="Naina Shilpi" className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent" />
            </div>
            <div className="md:col-span-7 p-12">
              <Quote className="text-emerald-500 mb-6 opacity-20" size={40} />
              <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Naina Shilpi</h3>
              <p className="text-emerald-500 font-black tracking-[0.4em] text-[9px] mb-8 uppercase italic opacity-80">Platform_Architect // Full_Stack_Lead</p>
              <p className="text-slate-400 text-[12px] italic uppercase tracking-widest leading-loose mb-10 border-l-2 border-emerald-500/20 pl-6">
                "AlgoPulse was built to bridge the gap between individual practice and global competition. We've created a system where every byte of code you write contributes to your professional legacy."
              </p>
              <div className="flex gap-8">
                {[
                  { icon: <Linkedin size={18}/>, link: "https://linkedin.com/in/nainashilpi" },
                  { icon: <Github size={18}/>, link: "https://github.com/nainashilpi" },
                  { icon: <Instagram size={18}/>, link: "https://instagram.com/_niyo__neta____/" },
                  { icon: <Mail size={18}/>, link: "mailto:nainashilpi24@gmail.com" }
                ].map((social, i) => (
                  <a key={i} href={social.link} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-emerald-500 transition-colors">
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA & FOOTER ================= */}
      <footer className="pb-32 pt-20 text-center relative px-6 z-10 max-w-5xl mx-auto border-t border-white/5">
        <h2 className="text-6xl md:text-9xl font-black mb-12 tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 uppercase leading-none">READY_FOR_SYNC?</h2>
        <Link to="/register" className="inline-block px-14 py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black rounded-2xl font-black text-[11px] hover:shadow-[0_0_60px_rgba(16,185,129,0.3)] hover:scale-105 transition-all tracking-[0.4em] italic uppercase">INITIALIZE_CONNECTION</Link>
        
        <div className="mt-32 opacity-30">
          <div className="flex justify-center gap-4 mb-4">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
             <p className="text-[10px] font-black text-white tracking-[0.8em] uppercase italic">ALGOPULSE_CORE_SYSTEM</p>
          </div>
          <p className="text-[8px] font-bold text-slate-700 tracking-[0.3em] uppercase">Designed by Naina Shilpi • © 2026 • Encrypted_Connection</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;