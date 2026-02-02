import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Trophy, MapPin, Sparkles, Terminal, Target, Rocket, 
  Linkedin, Github, BrainCircuit, Quote, Zap, ChevronDown, Mail, Instagram,
  ShieldCheck, LayoutDashboard, BarChart3, Users, BellRing, Briefcase, Database, Cpu
} from "lucide-react";

const Home = () => {
  const reviews = [
    { name: "Rahul Verma", role: "SDE at Google", text: "AlgoPulse changed my consistency. The heatmap is addictive!" },
    { name: "Sneha Kapoor", role: "Student", text: "The structured roadmap finally cleared my confusion between BFS & DFS." },
    { name: "Amit Raj", role: "Competitive Programmer", text: "Best platform for tracking daily progress without distractions." },
    { name: "Priya Singh", role: "Intern @Amazon", text: "The Logic Vault feature is a lifesaver for last-minute revision." },
    { name: "Ishaan Dev", role: "Final Year Student", text: "Leaderboard keeps me motivated to solve at least one POTD daily." },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative min-h-screen bg-[#020408] text-slate-300 overflow-x-hidden selection:bg-cyan-500/30 font-sans tracking-tight">
      
      {/* --- NEURAL BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-600/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-600/[0.04] blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay" />
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 md:pt-56 pb-20 md:pb-32 px-6 text-center z-10">
        <motion.div initial="hidden" animate="visible" className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black tracking-[0.4em] text-cyan-400 uppercase mb-8 backdrop-blur-md">
             <Cpu size={12} className="animate-pulse" /> LEETCODE_API_INTEGRATED_V2.1
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-6xl sm:text-7xl md:text-[10rem] font-black mb-6 tracking-tighter leading-[0.85] italic text-white uppercase">
            ALGO<span className="text-cyan-500">PULSE_</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-[10px] md:text-xs text-slate-500 max-w-2xl mx-auto mb-12 font-bold uppercase tracking-[0.3em] italic leading-loose">
            A High-Performance Competition Hub. We fetch your <span className="text-white border-b border-cyan-500/50 px-1">LeetCode data</span> to rank you globally based on real-time problem solving.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4 md:gap-5">
            <Link to="/register" className="group px-10 py-5 bg-cyan-500 text-black font-black rounded-xl hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] uppercase tracking-widest text-[10px] italic transition-all">
              SYNC_LEETCODE_ID <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" size={14} />
            </Link>
            <Link to="/leaderboard" className="px-10 py-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] italic flex items-center justify-center gap-3 transition-all">
              COMPETE_NOW <Trophy className="text-cyan-400" size={14} />
            </Link>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-24 opacity-20 flex justify-center">
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </section>

      {/* ================= MISSION: WHY ALGOPULSE? ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-white/5">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-6">The Competition Hub</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed uppercase tracking-wide">
              AlgoPulse isn't just a tracker; it's a battleground. We solve the problem of "isolated learning" by connecting your LeetCode progress to a global ranking system. 
              <br /><br />
              Whether you are preparing for top-tier placements or just honing your skills, our platform provides the competitive edge needed to stay consistent and ahead of the curve.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
              <Database className="text-cyan-500 mb-4" />
              <h4 className="text-xs font-black text-white uppercase italic">Real Data</h4>
              <p className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Fetched directly from LeetCode servers.</p>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
              <Trophy className="text-purple-500 mb-4" />
              <h4 className="text-xs font-black text-white uppercase italic">Live Ranking</h4>
              <p className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Compete with thousands in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CORE CAPABILITIES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-4 bg-cyan-500/5 px-3 py-1 rounded-full border border-cyan-500/10">
            <Sparkles size={12} className="text-cyan-400" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-cyan-300 font-black italic">01 // System Architecture</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">Features</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Briefcase />, title: "Placement Paths", desc: "Access curated roadmaps and company-specific resources for SDE roles." },
            { icon: <Zap />, title: "Daily POTD", desc: "Hand-picked 'Problem of the Day' to test your algorithmic thinking every morning." },
            { icon: <BellRing />, title: "Admin Broadcast", desc: "Stay updated with real-time push notifications from admins about contests & news." },
            { icon: <BarChart3 />, title: "Visual Analytics", desc: "Heatmaps and performance charts derived from your actual LeetCode submissions." }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:border-cyan-400/20 transition-all group">
              <div className="text-cyan-400 mb-6 bg-white/5 w-11 h-11 flex items-center justify-center rounded-xl group-hover:bg-cyan-500 group-hover:text-black transition-all">
                {React.cloneElement(item.icon, { size: 18 })}
              </div>
              <h3 className="text-sm font-black mb-3 text-white uppercase italic tracking-widest">{item.title}</h3>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-32 relative z-10 border-t border-white/5">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-4 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 w-fit mx-auto">
            <Target size={12} className="text-orange-400" />
            <span className="text-[9px] font-black tracking-[0.4em] text-orange-300 uppercase italic">02 // Ranking Protocol</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter">How You Rank</h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-500/20 via-orange-500/20 to-transparent md:-translate-x-1/2" />
          {[
            { tag: "01", title: "API Synchronization", desc: "Connect your LeetCode ID. Our engine fetches your solved count across Easy, Medium, and Hard categories.", color: "bg-green-500" },
            { tag: "02", title: "Difficulty Weightage", desc: "Points are calculated using a weighted formula where Harder problems grant more ranking power.", color: "bg-blue-500" },
            { tag: "03", title: "Consistency Metric", desc: "Regular activity on the platform keeps your profile active in the top-tier competition bracket.", color: "bg-indigo-500" },
            { tag: "04", title: "Global Board", desc: "The final score places you on the Global Leaderboard, visible to peers and top recruiters.", color: "bg-purple-500" }
          ].map((step, i) => (
            <motion.div 
              key={i}
              initial={{ x: i % 2 === 0 ? -40 : 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`relative flex items-center mb-20 md:mb-28 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="flex-1 hidden md:block" />
              <div className="relative z-10 w-10 h-10 rounded-xl bg-[#0a0f1a] border border-white/10 flex items-center justify-center shrink-0">
                <div className={`w-2 h-2 rounded-full ${step.color} animate-pulse`} />
              </div>
              <div className="flex-1 ml-6 md:ml-0 md:px-12 text-left md:text-inherit">
                <div className="p-6 md:p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:border-cyan-400/20 transition-all group">
                  <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${step.color} text-black mb-4 inline-block italic`}>NODE_{step.tag}</span>
                  <h4 className="text-xl md:text-2xl font-black mb-2 text-white italic uppercase group-hover:text-cyan-400 transition-colors tracking-tighter">{step.title}</h4>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= SYSTEM ACCESS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all group">
                <LayoutDashboard className="text-cyan-500 mb-6" size={32} />
                <h3 className="text-2xl font-black text-white uppercase italic mb-4">User Panel</h3>
                <ul className="space-y-4">
                    {["Track LeetCode Stats Live", "Access Placement Resources", "Claim Achievement Badges", "Analyze Solving Consistency"].map((li, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <div className="w-1 h-1 bg-cyan-500 rounded-full" /> {li}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all group">
                <Users className="text-purple-500 mb-6" size={32} />
                <h3 className="text-2xl font-black text-white uppercase italic mb-4">Admin Core</h3>
                <ul className="space-y-4">
                    {["Broadcast Push Notifications", "Assign Daily POTD Challenges", "Moderate Global Leaderboards", "Update Placement Paths"].map((li, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <div className="w-1 h-1 bg-purple-500 rounded-full" /> {li}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-24 relative z-10 bg-white/[0.01] border-y border-white/5">
        <div className="text-center mb-12">
           <span className="text-[9px] font-black tracking-[0.4em] text-cyan-400 uppercase italic">03 // Community Consensus</span>
           <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase mt-2 tracking-tighter">User Feedback</h2>
        </div>
        <div className="flex overflow-hidden relative group">
          <motion.div 
            animate={{ x: [0, -1500] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="flex gap-6 whitespace-nowrap py-4"
          >
            {[...reviews, ...reviews].map((review, i) => (
              <div key={i} className="inline-block w-[300px] p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <p className="text-slate-400 whitespace-normal italic text-[11px] font-medium uppercase tracking-wide leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-black text-black text-[10px] uppercase">{review.name[0]}</div>
                  <div>
                    <h5 className="text-[10px] font-black text-white uppercase italic leading-none mb-1">{review.name}</h5>
                    <p className="text-[7px] text-slate-600 uppercase tracking-widest">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= THE ARCHITECT ================= */}
      <section className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="relative group max-w-4xl mx-auto bg-white/[0.01] border border-white/5 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden backdrop-blur-3xl transition-all hover:border-cyan-500/20">
          <div className="grid md:grid-cols-12 items-center">
            <div className="md:col-span-5 h-[400px] bg-slate-900 overflow-hidden relative grayscale opacity-50 group-hover:opacity-100 transition-all duration-1000">
              <img src="/naina-profile.jpg" alt="Naina Shilpi" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
            </div>
            <div className="md:col-span-7 p-10">
              <Quote className="text-cyan-500/10 w-8 h-8 mb-6" />
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-1">Naina Shilpi</h3>
              <p className="text-cyan-400 font-bold tracking-[0.3em] text-[8px] mb-8 uppercase italic">Founder & Lead Developer • Platform Visionary</p>
              <p className="text-slate-400 text-[13px] italic uppercase tracking-tight leading-relaxed mb-8">
                "I engineered AlgoPulse to turn the solitary grind of DSA into a global competitive experience. By fetching real-time LeetCode data, we ensure every problem you solve counts towards your global rank."
              </p>
              <div className="flex gap-6 opacity-40 hover:opacity-100 transition-opacity">
                  <a href="https://linkedin.com/in/nainashilpi" target="_blank" rel="noreferrer"><Linkedin size={18} className="hover:text-cyan-400 transition-colors" /></a>
                  <a href="https://github.com/nainashilpi" target="_blank" rel="noreferrer"><Github size={18} className="hover:text-cyan-400 transition-colors" /></a>
                  <a href="https://instagram.com/_niyo__neta____/" target="_blank" rel="noreferrer"><Instagram size={18} className="hover:text-cyan-400 transition-colors" /></a>
                  <a href="mailto:nainashilpi24@gmail.com"><Mail size={18} className="hover:text-cyan-400 transition-colors" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="pb-32 pt-20 text-center relative px-6 z-10 border-t border-white/5 max-w-5xl mx-auto">
        <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter italic text-white uppercase leading-none">JOIN_THE_BATTLE</h2>
        <Link to="/register" className="inline-block px-12 py-5 bg-cyan-500 text-black rounded-xl font-black text-[10px] hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all tracking-[0.3em] italic uppercase">INITIALIZE_ACCOUNT</Link>
        <div className="mt-20">
          <p className="text-[9px] font-black text-slate-600 tracking-[0.5em] uppercase italic mb-1">AlgoPulse // Powered by LeetCode API</p>
          <p className="text-[7px] font-bold text-slate-800 tracking-[0.4em] uppercase">Designed & Developed by Naina Shilpi • © 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;