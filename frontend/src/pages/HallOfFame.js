import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trophy, ExternalLink, Trash2, Calendar, Crown, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';

const HallOfFame = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role?.toLowerCase() === 'admin') {
      setIsAdmin(true);
    }
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/hall-of-fame`);
      setWinners(res.data);
    } catch (err) {
      console.error("SYTEM_FETCH_ERROR");
    } finally {
      setLoading(false);
    }
  };

// --- STREAK FIX START ---
  const processedWinners = useMemo(() => {
    if (!winners.length) return [];

    const winFrequency = {};
    const uniqueWinners = [];
    const seenHandles = new Set();

    // 1. Pehle pure database mein har handle ki total frequency count karo
    winners.forEach(w => {
      const handle = w.leetcodeHandle?.toLowerCase() || 'unknown';
      winFrequency[handle] = (winFrequency[handle] || 0) + 1;
    });

    // 2. Sirf unique users ki latest entry ko dikhao (Duplicate Cards Filter)
    winners.forEach(winner => {
      const handle = winner.leetcodeHandle?.toLowerCase() || 'unknown';
      if (!seenHandles.has(handle)) {
        seenHandles.add(handle);
        uniqueWinners.push({
          ...winner,
          calculatedWinCount: winFrequency[handle] || 1
        });
      }
    });

    return uniqueWinners;
  }, [winners]);
  // --- STREAK FIX END ---

  const handleDelete = async (id) => {
    if (!window.confirm("CRITICAL: Purge this legacy record?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/users/winner/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("DATA_PURGED");
      setWinners(prev => prev.filter(w => w._id !== id));
    } catch (err) {
      toast.error("ACCESS_DENIED");
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-300 font-sans pb-20 selection:bg-cyan-500/30 overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto pt-32 px-6 relative z-10">
        <div className="flex flex-col mb-16 border-l-2 border-cyan-500/30 pl-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-2">
            <Trophy size={14} className="text-cyan-500" />
            <span className="text-cyan-500 font-black text-[10px] tracking-[0.4em] uppercase italic">Legacy_Database</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter leading-none">
            HALL_OF_<span className="text-cyan-500 italic">VICTORS</span>
          </h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-white/[0.02] border border-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {processedWinners.map((winner, index) => {
              const isFirst = index === 0;
              return (
                <motion.div 
                  key={winner._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 10 }}
                  className={`group relative flex items-center bg-white/[0.01] border rounded-[2rem] p-4 transition-all duration-500 overflow-hidden
                    ${isFirst ? 'border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.03)]' : 'border-white/5'}`}
                >
                  <div className="relative shrink-0 mr-6">
                    <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border ${isFirst ? 'border-cyan-500/30' : 'border-white/10'}`}>
                      <img 
                        src={winner.profilePic || `https://api.dicebear.com/7.x/identicon/svg?seed=${winner.username}`} 
                        alt="" 
                        loading="lazy"
                        className={`w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110`} 
                      />
                    </div>
                    {isFirst && (
                      <div className="absolute -top-2 -left-2 bg-cyan-500 p-1.5 rounded-lg">
                        <Crown size={12} className="text-black" fill="currentColor" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="truncate pr-4">
                        <h3 className="text-xl font-black italic text-white uppercase tracking-tight truncate group-hover:text-cyan-400">
                          {winner.name || winner.username}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">@{winner.leetcodeHandle}</p>
                      </div>
                      <div className="text-right shrink-0">
                         <div className="flex items-center gap-1 text-[8px] font-black text-cyan-500/50 uppercase tracking-tighter">
                            <Calendar size={10} /> {new Date(winner.weekEnding).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}
                         </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mb-4">
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest">Compute_Pts</span>
                            <span className="text-sm font-black text-white italic">{winner.points}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest">Scripts_Fixed</span>
                            <span className="text-sm font-black text-white italic">{winner.stats?.totalSolved || 0}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest">Win_Streak</span>
                            <span className="text-sm font-black text-cyan-500 italic">x{winner.calculatedWinCount}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <a 
                        href={`https://leetcode.com/${winner.leetcodeHandle}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 text-[9px] font-black text-white uppercase bg-white/5 px-4 py-2 rounded-xl hover:bg-cyan-500 hover:text-black transition-all"
                      >
                        PROFILE_LINK <ExternalLink size={10} />
                      </a>
                      {isAdmin && (
                        <button 
                          onClick={() => handleDelete(winner._id)}
                          className="p-2 text-red-500/50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-cyan-500/[0.03] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-32 text-center opacity-10">
          <Activity size={24} className="mx-auto mb-4 text-white" />
          <p className="text-[9px] font-black tracking-[1em] uppercase">Archive_Secured // No_Unauthorized_Access</p>
        </div>
      </div>
    </div>
  );
};

export default HallOfFame;