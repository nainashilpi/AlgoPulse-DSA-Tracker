import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Search, Flame, Target, ChevronRight, Crown, Terminal, Info, AlertTriangle, Zap, Cpu } from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('cache_leaderboard');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [loading, setLoading] = useState(users.length === 0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/leaderboard`);
        const userData = Array.isArray(res.data) ? res.data : (res.data.users || []);
        setUsers(userData);
        localStorage.setItem('cache_leaderboard', JSON.stringify(userData));
      } catch (err) {
        console.error("Critical: Leaderboard sync failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const filteredFromAdmin = users.filter(u => (u.role || 'user').toLowerCase() !== 'admin');

  const sortedUsers = [...filteredFromAdmin].sort((a, b) => {
    if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0);
    return (b.stats?.totalSolved || 0) - (a.stats?.totalSolved || 0);
  });

  const searchedUsers = sortedUsers.filter(u => 
    (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.leetcodeHandle || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const podiumRaw = sortedUsers.filter(u => (u.points || 0) > 0).slice(0, 3);
  const displayPodium = [];
  if (podiumRaw[1]) displayPodium[0] = { ...podiumRaw[1], actualRank: 2 };
  if (podiumRaw[0]) displayPodium[1] = { ...podiumRaw[0], actualRank: 1 };
  if (podiumRaw[2]) displayPodium[2] = { ...podiumRaw[2], actualRank: 3 };

  const listDisplay = searchQuery ? searchedUsers : searchedUsers.slice(3);

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020408] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-12 h-12 border-2 border-cyan-500 rounded-full border-t-transparent animate-spin" 
        />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020408] text-slate-300 font-sans pb-20 selection:bg-cyan-500/30 overflow-x-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-cyan-500/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto pt-32 px-6 relative z-10">
        
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-16 text-center"
        >
          <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-inner">
                <Cpu size={20} className="text-cyan-500 animate-pulse" />
              </div>
              <span className="text-cyan-500 font-black text-[10px] tracking-[0.5em] uppercase italic">Neural_Network_Rankings</span>
          </div>
          
          <motion.h1 
            initial={{ letterSpacing: "0.2em", opacity: 0 }}
            animate={{ letterSpacing: "normal", opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-7xl font-black italic text-white uppercase tracking-tighter leading-none mb-10"
          >
            THE_UNDER<span className="text-cyan-500">GRID_</span>
          </motion.h1>
          
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="text" 
              placeholder="LOCATE_NODE_IDENTITY..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-xs font-black tracking-widest text-white outline-none focus:border-cyan-500/40 backdrop-blur-xl uppercase transition-all placeholder:text-slate-800 focus:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
            />
          </div>
        </motion.div>

        {/* --- ADVANCED PODIUM --- */}
        {!searchQuery && podiumRaw.length > 0 && (
          <motion.div 
            variants={containerVars}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-end"
          >
            {displayPodium.map((user) => {
              const isFirst = user.actualRank === 1;
              return (
                <motion.div
                  key={user._id}
                  variants={itemVars}
                  whileHover={{ 
                    scale: 1.02, 
                    rotateY: isFirst ? 0 : (user.actualRank === 2 ? 5 : -5),
                    y: -10
                  }}
                  className={`relative flex flex-col items-center p-8 rounded-[2.5rem] border transition-all duration-500
                    ${isFirst ? 'bg-cyan-500/[0.04] border-cyan-500/30 scale-105 z-20 shadow-[0_30px_60px_rgba(0,0,0,0.5)]' 
                             : 'bg-white/[0.01] border-white/5 z-10 hover:bg-white/[0.03]'}`}
                >
                  <div className={`absolute -top-3 px-4 py-1 rounded-full text-[8px] font-black italic border tracking-[0.2em] ${
                    isFirst ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-[#0A0C10] text-slate-500 border-white/10'
                  }`}>
                    NODE_0{user.actualRank}
                  </div>

                  <div className="relative mb-6">
                    <motion.div 
                      animate={isFirst ? { rotate: 360 } : {}}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className={`absolute -inset-4 border rounded-full ${isFirst ? 'border-cyan-500/20 border-dashed' : 'border-transparent'}`}
                    />
                    <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-b ${
                      isFirst ? 'from-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'from-white/10 to-transparent'
                    }`}>
                      <img src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} className="w-full h-full rounded-full object-cover border-4 border-[#020408]" alt="" />
                    </div>
                    <AnimatePresence>
                      {user.streak > 0 && (
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="absolute bottom-0 right-0 bg-orange-500 text-black p-1.5 rounded-lg shadow-xl flex items-center gap-1 border-2 border-[#020408]"
                          >
                              <Flame size={12} fill="currentColor" />
                              <span className="text-[10px] font-black">{user.streak}</span>
                          </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="text-center w-full">
                    <h3 className={`font-black italic text-white uppercase tracking-tight truncate ${isFirst ? 'text-2xl' : 'text-xl'}`}>
                      {user.name}
                    </h3>
                    <p className="text-[9px] font-bold text-cyan-500/40 uppercase tracking-[0.3em] mt-1 mb-6">@{user.leetcodeHandle}</p>
                    
                    <div className="grid grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                      <div className="bg-[#020408]/40 p-3">
                        <p className="text-[6px] font-black text-slate-600 uppercase tracking-widest mb-1">Compute_Pts</p>
                        <p className={`text-lg font-black italic ${isFirst ? 'text-cyan-400' : 'text-white'}`}>{user.points}</p>
                      </div>
                      <div className="bg-[#020408]/40 p-3">
                        <p className="text-[6px] font-black text-slate-600 uppercase tracking-widest mb-1">Scripts_Resolved</p>
                        <p className="text-lg font-black text-white italic">{user.stats?.totalSolved || 0}</p>
                      </div>
                    </div>
                  </div>
                  {isFirst && <Crown size={16} className="absolute -top-8 text-cyan-500 animate-bounce" fill="currentColor" />}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* --- COMPACT LIST --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-white/[0.01] border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-3xl mb-24 shadow-2xl"
        >
          <div className="divide-y divide-white/5">
            {listDisplay.map((user, index) => {
              const actualRank = searchQuery ? sortedUsers.indexOf(user) + 1 : index + 4;
              return (
                <motion.div 
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  key={user._id} 
                  className="group flex items-center justify-between p-4 hover:bg-cyan-500/[0.02] transition-all cursor-crosshair"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-[10px] font-black text-slate-800 italic group-hover:text-cyan-500 transition-colors">#{actualRank.toString().padStart(2, '0')}</span>
                    <div className="relative">
                        <img src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} className="w-10 h-10 rounded-full border border-white/10 group-hover:border-cyan-500/40 transition-all" alt="" />
                        {user.streak > 0 && <Flame size={10} className="absolute -top-1 -right-1 text-orange-500 animate-pulse" fill="currentColor" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase italic group-hover:text-cyan-400">{user.name}</h4>
                      <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">@{user.leetcodeHandle} • <span className="text-orange-500/70">{user.streak}D_STREAK</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="hidden md:flex gap-6 text-right">
                       <div>
                          <p className="text-[6px] font-black text-slate-700 uppercase">Points</p>
                          <p className="text-[11px] font-black text-white italic">{user.points}</p>
                       </div>
                       <div>
                          <p className="text-[6px] font-black text-slate-700 uppercase">Solved</p>
                          <p className="text-[11px] font-black text-slate-400 italic">{user.stats?.totalSolved || 0}</p>
                       </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-800 group-hover:text-cyan-500 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* --- SYSTEM_PROTOCOLS (Rule Section in English) --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-[#0A0C10] border border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-inner"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
            <Terminal size={200} className="text-white" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <Zap size={20} className="text-cyan-500" />
              <h2 className="text-xl font-black italic text-white uppercase tracking-[0.3em]">System_Architecture</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Scoring */}
              <div className="space-y-6">
                <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] border-l-2 border-cyan-500 pl-4">Algorithm_Rewards</p>
                <div className="space-y-4">
                  {[
                    { label: 'EASY_LEVEL', pts: '+10' },
                    { label: 'MEDIUM_LEVEL', pts: '+20' },
                    { label: 'HARD_LEVEL', pts: '+40' }
                  ].map((rule, idx) => (
                    <div key={idx} className="flex justify-between items-center group">
                      <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors italic">{rule.label}</span>
                      <span className="text-xs font-black text-white px-2 py-0.5 bg-white/5 rounded">{rule.pts} PTS</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Penalties */}
              <div className="space-y-6">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] border-l-2 border-red-500 pl-4">Integrity_Check</p>
                <div className="bg-red-500/[0.03] border border-red-500/10 p-5 rounded-2xl">
                    <div className="flex items-start gap-4">
                        <AlertTriangle size={16} className="text-red-500 shrink-0" />
                        <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                          <span className="text-white font-black italic">DORMANT_PENALTY:</span> Failing to solve at least one task within a 24-hour cycle triggers an automatic <span className="text-red-500 font-black">-05 PTS</span> deduction. 
                        </p>
                    </div>
                </div>
              </div>

              {/* Reset Logic */}
              <div className="space-y-6">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] border-l-2 border-orange-500 pl-4">Persistence_Log</p>
                <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                  <p className="text-[11px] leading-relaxed text-slate-400 font-medium italic">
                    "Every season, admins will <span className="text-white font-black uppercase">Initiate_Reset</span>. The Top 3 nodes will be permanently archived in the <span className="text-cyan-500 font-black">HALL_OF_VICTORS</span> as legendary entities."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <div className="mt-12 text-center opacity-20">
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[1em]">Core_Memory_Stable // End_Transmission</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;