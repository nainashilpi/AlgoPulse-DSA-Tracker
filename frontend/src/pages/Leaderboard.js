
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Crown, Search, Zap, ChevronRight, BarChart2, Shield, Target, Info
} from "lucide-react";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/leaderboard");
        const sorted = (res.data || []).sort((a, b) => (b.points || 0) - (a.points || 0));
        setUsers(sorted);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchLeaderboard();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.leetcodeHandle || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSearching = searchQuery.length > 0;
  const podiumUsers = users.slice(0, 3);
  const displayList = isSearching ? filteredUsers : filteredUsers.slice(3);

  if (loading) return <LoadingScreen />;

  return (
    <div className="relative min-h-screen bg-[#020408] text-slate-300 pb-32 overflow-hidden selection:bg-cyan-500/30 font-sans">
      
      {/* --- NEURAL BACKGROUND  --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-600/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-600/[0.04] blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay" />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 md:pt-48 pb-16 px-6 text-center z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black tracking-[0.4em] text-cyan-400 uppercase mb-8 backdrop-blur-md italic">
              <Shield size={12} /> Neural_Rankings_v2.0
          </div>
          <h1 className="text-6xl md:text-[9rem] font-black text-white italic tracking-tighter leading-none uppercase mb-6">
            ASCEND<span className="text-cyan-500">_</span>
          </h1>
          <p className="text-slate-500 text-[10px] md:text-xs max-w-2xl mx-auto font-bold uppercase tracking-[0.3em] italic leading-loose">
            The undergrid of elite architects. <span className="text-white border-b border-cyan-500/30">Consistency</span> is the only currency here.
          </p>
        </motion.div>
      </section>

      {/* --- PODIUM --- */}
      <AnimatePresence>
        {!isSearching && (
          <motion.section exit={{ opacity: 0, y: -20 }} className="relative max-w-6xl mx-auto px-6 mb-32 z-10">
            <div className="grid md:grid-cols-3 gap-6 items-end">
              <PodiumBox user={podiumUsers[1]} rank={2} color="border-white/5" height="h-[340px]" delay={0.2} />
              <PodiumBox user={podiumUsers[0]} rank={1} color="border-cyan-500/20" height="h-[420px]" delay={0.1} isChamp />
              <PodiumBox user={podiumUsers[2]} rank={3} color="border-white/5" height="h-[300px]" delay={0.3} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* --- SEARCH & DATA GRID --- */}
      <section className="relative max-w-5xl mx-auto px-6 z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-white/5 pb-12">
          <div>
            <span className="text-[9px] font-black tracking-[0.4em] text-cyan-400 uppercase italic px-1">Active Protocol</span>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mt-1">The_Undergrid</h2>
          </div>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={14} />
            <input
              type="text"
              placeholder="SEARCH_NODE..."
              value={searchQuery}
              className="w-full md:w-80 pl-14 pr-6 py-4 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white font-bold text-[10px] tracking-widest focus:border-cyan-500/50 focus:bg-white/[0.04] transition-all uppercase italic"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <motion.div initial="hidden" animate="visible" className="space-y-3">
          <AnimatePresence mode="popLayout">
            {displayList.map((u) => (
              <motion.div
                key={u._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex items-center justify-between p-5 px-8 rounded-[1.5rem] bg-white/[0.01] border border-white/5 hover:border-cyan-500/20 hover:bg-white/[0.02] transition-all"
              >
                <div className="flex items-center gap-8">
                  <span className="font-black text-[10px] text-slate-700 group-hover:text-cyan-400 transition-colors italic">
                    #{(users.indexOf(u) + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="relative">
                    <img src={u.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`} className="w-10 h-10 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all border border-white/10" alt="" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-500 rounded-full border-2 border-[#020408]" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xs group-hover:text-cyan-400 transition-colors italic tracking-tight">{(u.name || "N/A").toUpperCase()}</h4>
                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">@{u.leetcodeHandle || "unknown"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-cyan-500 font-black italic">{u.points || 0} PTS</p>
                    <p className="text-[7px] font-black text-slate-700 uppercase tracking-widest">Neural_Score</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-white font-black text-xl italic tracking-tighter">
                      <Zap size={12} className="text-cyan-500 fill-cyan-500" />
                      {u.stats?.totalSolved || u.solvedCount || 0}
                    </div>
                    <p className="text-[7px] font-black text-slate-700 uppercase tracking-widest text-right">Decoded</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-800 group-hover:text-white transition-all" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* --- RANKING PROTOCOL (How it works) --- */}
        <div className="mt-24 p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 backdrop-blur-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <Info size={16} />
            </div>
            <h3 className="text-sm font-black text-white italic uppercase tracking-widest">Ranking_Protocol_01</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-white uppercase italic tracking-tighter">01. Dynamic Scoring</p>
              <p className="text-[9px] font-bold text-slate-600 leading-relaxed uppercase tracking-widest">Rankings are calculated based on Neural Points, not just problem count. Quality over quantity.</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-white uppercase italic tracking-tighter">02. Point Weightage</p>
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black text-cyan-400">EASY // +10 PTS</span>
                <span className="text-[8px] font-black text-blue-400">MEDIUM // +20 PTS</span>
                <span className="text-[8px] font-black text-purple-400">HARD // +40 PTS</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-white uppercase italic tracking-tighter">03. Node Sync</p>
              <p className="text-[9px] font-bold text-slate-600 leading-relaxed uppercase tracking-widest">Points are synced in real-time with LeetCode API to ensure zero discrepancy in the undergrid.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* PODIUM BOX */
const PodiumBox = ({ user, rank, color, delay, height, isChamp }) => {
  if (!user) return <div className={`hidden md:block ${height}`} />;
  const solvedCnt = user.stats?.totalSolved || user.solvedCount || 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={`relative group bg-white/[0.02] border ${color} rounded-[2.5rem] p-8 text-center flex flex-col items-center justify-center transition-all hover:bg-white/[0.03] ${height} backdrop-blur-3xl`}
    >
      {isChamp && (
        <div className="absolute -top-12 flex flex-col items-center">
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Crown size={40} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          </motion.div>
          <div className="h-4 w-[1px] bg-cyan-400 mt-2" />
        </div>
      )}
      <div className="relative mb-6">
        <img src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} className={`relative rounded-2xl object-cover border ${isChamp ? 'w-24 h-24 border-cyan-500/50 p-1 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 'w-20 h-20 border-white/10'} grayscale group-hover:grayscale-0 transition-all duration-700`} alt="" />
        <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center font-black border-2 border-[#020408] text-xs ${isChamp ? 'bg-cyan-500 text-black' : 'bg-white/10 text-white'}`}>{rank}</div>
      </div>
      <h3 className="font-black text-white italic tracking-tighter text-lg uppercase truncate w-full mb-1">{user.name || "N/A"}</h3>
      <p className="text-[8px] font-black text-slate-700 mb-4 tracking-widest uppercase">@{user.leetcodeHandle || "unknown"}</p>
      <div className="mb-6 bg-cyan-500/5 px-3 py-1 rounded-full border border-cyan-500/10">
          <span className="text-[9px] font-black text-cyan-400 italic uppercase">{user.points || 0} NEURAL_POINTS</span>
      </div>
      <div className="flex items-center gap-2">
        <BarChart2 size={14} className="text-cyan-500" />
        <span className="text-2xl font-black text-white italic tracking-tighter">{solvedCnt}</span>
      </div>
      <p className="text-[7px] font-black text-slate-700 uppercase tracking-widest italic mt-1">Decoded_Problems</p>
    </motion.div>
  );
};

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center">
    <div className="relative w-16 h-16">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute inset-0 border-t-2 border-cyan-500 rounded-full" />
      <div className="absolute inset-0 flex items-center justify-center"><Target size={16} className="text-cyan-500 animate-pulse" /></div>
    </div>
    <p className="mt-8 text-[9px] font-black text-cyan-400 tracking-[0.6em] uppercase italic animate-pulse">Syncing_Nodes...</p>
  </div>
);

export default Leaderboard;