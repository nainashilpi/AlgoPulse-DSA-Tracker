import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Activity, Zap, Target, Calendar, Award, 
  RefreshCcw, Camera, ExternalLink, 
  ChevronRight, Fingerprint, Box, ArrowUpRight, Cpu, Lock
} from 'lucide-react';

const ProgressDashboard = () => {
  const [user, setUser] = useState(null);
  const [potd, setPotd] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const allPossibleBadges = [
    { name: "7-Day Streak", desc: "Consistency for a week", type: 'streak' },
    { name: "Monthly Warrior", desc: "30 days of dedication", type: 'streak' },
    { name: "Consistent King", desc: "100 days streak", type: 'streak' },
    { name: "50 Solver", desc: "Half-century problems", type: 'volume' },
    { name: "Centurion", desc: "100 problems solved", type: 'volume' },
    { name: "LeetCode Legend", desc: "500 problems solved", type: 'volume' }
  ];

  useEffect(() => {
    fetchUserData();
    fetchPOTD();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data); 
    } catch (err) { console.error(err); }
  };

  const fetchPOTD = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/problems/latest`);
      setPotd(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.get(`${BASE_URL}/api/users/sync`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchUserData(); 
    } catch (err) { alert("Sync Failed."); } finally { setIsSyncing(false); }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${BASE_URL}/api/users/update-avatar`, { profilePic: base64Image }, { headers: { Authorization: `Bearer ${token}` } });
        setUser({ ...user, profilePic: base64Image });
      } catch (err) { alert("Update Failed"); }
    };
  };

  if (!user) return (
    <div className="bg-[#05070a] min-h-screen flex items-center justify-center">
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="w-12 h-12 border-2 border-cyan-500 rounded-full border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#05070a] text-slate-400 min-h-screen font-sans selection:bg-cyan-500/30 relative overflow-x-hidden">
      
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-cyan-500 z-[100] origin-left" style={{ scaleX }} />

      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-10 pt-40 pb-20">
        
        {/* --- HEADER SECTION --- */}
        <section className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="relative shrink-0">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute -inset-10 border border-dashed border-cyan-500/20 rounded-full" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute -inset-6 border border-cyan-500/10 rounded-full" />
            
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full p-2 bg-gradient-to-tr from-cyan-500/40 via-transparent to-purple-500/40 relative z-10 backdrop-blur-3xl shadow-[0_0_50px_rgba(34,211,238,0.15)]">
               <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 relative group bg-[#05070a]">
                  <img src={user.profilePic || 'https://via.placeholder.com/300'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="User" />
                  <label className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                    <Camera className="text-white" size={32} />
                    <input type="file" className="hidden" onChange={handleImageChange} />
                  </label>
               </div>
            </div>

            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute top-0 -right-4 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl z-20">
               <p className="text-[10px] font-black uppercase text-cyan-500 tracking-widest">Points</p>
               <h4 className="text-2xl font-black text-white italic">{user.points}</h4>
            </motion.div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
               <span className="w-12 h-[1px] bg-cyan-500" />
               <p className="text-xs font-mono uppercase tracking-[0.5em] text-cyan-500">Progress_Dashboard</p>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none mb-6">
                {user.name.split(' ')[0]} <br/> 
                <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>{user.name.split(' ')[1] || 'Node'}</span>
            </h1>
            <p className="max-w-xl text-slate-500 text-sm leading-relaxed mb-8 italic">
                "System active. Protocol initialized. Decrypting algorithmic patterns in real-time."
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
               <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full">
                  <Cpu size={14} className="text-cyan-500" />
                  <span className="text-[10px] font-black uppercase text-white">Level {Math.floor(user.points/100) || 1}</span>
               </div>
               <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full">
                  <Activity size={14} className="text-green-500" />
                  <span className="text-[10px] font-black uppercase text-white">Status: Active</span>
               </div>
            </div>
          </div>
        </section>

        {/* --- POTD SECTION --- */}
        <AnimatePresence>
          {potd && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="mb-24 border-y border-white/5 py-12 flex flex-col md:flex-row justify-between items-center gap-8"
            >
              <div className="flex gap-6 items-center">
                <Zap className="text-cyan-500 shrink-0" size={32} />
                <div>
                  <h4 className="text-white font-black italic text-2xl uppercase tracking-tighter">Current Objective: {potd.title}</h4>
                  <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Difficulty // <span className="text-cyan-500">{potd.difficulty}</span></p>
                </div>
              </div>
              <a href={potd.link} target="_blank" rel="noreferrer" className="px-8 py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-cyan-500 transition-colors flex items-center gap-2">
                Launch Mission <ArrowUpRight size={14} />
              </a>
            </motion.section>
          )}
        </AnimatePresence>

        {/* --- STATS GRID --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          <StatItem icon={<Target size={20}/>} label="Total Decoded" value={user.stats?.totalSolved || 0} sub={`E:${user.stats?.easySolved} M:${user.stats?.mediumSolved} H:${user.stats?.hardSolved}`} />
          <StatItem icon={<Activity size={20}/>} label="Current Streak" value={`${user.streak || 0} DAYS`} sub="Consistency Multiplier" />
          <StatItem icon={<Award size={20}/>} label="Neural Points" value={user.points || 0} sub="Protocol Rank: Elite" />
        </section>

        {/* --- BADGES --- */}
        <section className="mb-24">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2 flex items-center gap-3">
              <Award className="text-cyan-500" size={24} /> Achievement_Vault
            </h2>
            <p className="text-sm text-slate-500 uppercase tracking-[0.2em]">Consistency and Volume Milestones</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {allPossibleBadges.map((badge, idx) => {
              const isEarned = user.badges?.includes(badge.name);
              return (
                <motion.div 
                  key={idx}
                  whileHover={isEarned ? { y: -5, scale: 1.02 } : {}}
                  className={`relative p-6 rounded-3xl border transition-all duration-500 flex flex-col items-center text-center gap-3 ${
                    isEarned 
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.1)]' 
                    : 'bg-white/[0.02] border-white/5 grayscale opacity-40'
                  }`}
                >
                  <div className={`p-3 rounded-full ${isEarned ? 'bg-cyan-500 text-[#05070a]' : 'bg-white/10 text-slate-500'}`}>
                    {isEarned ? <Award size={20} /> : <Lock size={20} />}
                  </div>
                  <div>
                    <h5 className={`text-[10px] font-black uppercase tracking-tighter ${isEarned ? 'text-white' : 'text-slate-600'}`}>
                      {badge.name}
                    </h5>
                    <p className="text-[8px] font-medium text-slate-500 uppercase leading-tight mt-1">
                      {badge.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* --- CONTENT SPLIT (PROGRESS & TOPICS) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <section className="space-y-12">
            <div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2 flex items-center gap-3">
                <Box className="text-cyan-500" size={24} /> Algorithm_Decomposition
              </h2>
              <p className="text-sm text-slate-500 uppercase tracking-[0.2em]">Efficiency analysis per complexity level</p>
            </div>
            
            <div className="space-y-8">
              <SleekProgress label="Easy" color="bg-green-500" percent={(user.stats?.easySolved / (user.stats?.totalSolved || 1)) * 100} />
              <SleekProgress label="Medium" color="bg-yellow-500" percent={(user.stats?.mediumSolved / (user.stats?.totalSolved || 1)) * 100} />
              <SleekProgress label="Hard" color="bg-red-500" percent={(user.stats?.hardSolved / (user.stats?.totalSolved || 1)) * 100} />
            </div>

            <div className="pt-12 border-t border-white/5 mt-12">
              <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-6 italic">Top_Neural_Specializations</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.topics && user.topics.length > 0 ? (
                  user.topics.map((t, idx) => {
                    const perc = ((t.solved / (user.stats?.totalSolved || 1)) * 100).toFixed(1);
                    return (
                      <div key={idx} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl group hover:border-cyan-500/30 transition-all relative overflow-hidden">
                        <div className="flex justify-between items-start mb-3 relative z-10">
                          <span className="text-[10px] font-black text-white uppercase tracking-tighter italic">{t.name}</span>
                          <span className="text-[10px] font-mono text-cyan-500">{perc}%</span>
                        </div>
                        <h4 className="text-xl font-black text-white italic relative z-10">{t.solved} <span className="text-[8px] text-slate-600 uppercase">Solved</span></h4>
                        <div className="absolute bottom-0 left-0 h-1 bg-cyan-500/20" style={{ width: `${perc}%` }} />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[10px] text-slate-700 font-bold uppercase italic tracking-widest">Awaiting system sync...</p>
                )}
              </div>
            </div>
          </section>

          <section>
             <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3">
               <Calendar className="text-cyan-500" size={24} /> Neural_Activity
             </h2>
             <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 overflow-x-auto">
                <div className="flex gap-1.5 min-w-[400px]">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                      {[...Array(7)].map((_, j) => {
                        const d = new Date();
                        d.setDate(d.getDate() - (23 - i) * 7 - (6 - j));
                        const dateStr = d.toISOString().split('T')[0];
                        const entry = user?.dailyHistory?.find(h => h.date === dateStr);
                        const isActive = entry?.count > 0;
                        return (
                          <motion.div 
                            key={j} 
                            title={`${dateStr}: ${entry?.count || 0} Solved`}
                            whileHover={{ 
                                scale: 1.4, 
                                backgroundColor: isActive ? '#22d3ee' : '#ffffff20',
                                transition: { duration: 0.1 } 
                            }}
                            className={`w-3 h-3 rounded-[3px] border transition-all ${isActive ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'bg-white/5 border-white/5'}`} 
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
             </div>
          </section>
        </div>
      </main>

      {/* Floating Sync Button */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <button onClick={handleSync} disabled={isSyncing} className="bg-white p-6 rounded-full text-black hover:bg-cyan-500 transition-colors shadow-2xl active:scale-95">
          <RefreshCcw size={24} className={isSyncing ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  );
};

const StatItem = ({ icon, label, value, sub }) => (
  <motion.div whileHover={{ y: -5 }} className="border-l-2 border-white/5 pl-8 py-4">
    <div className="text-cyan-500 mb-4">{icon}</div>
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 italic">{label}</p>
    <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">{value}</h3>
    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{sub}</p>
  </motion.div>
);

const SleekProgress = ({ label, color, percent }) => (
  <div>
    <div className="flex justify-between items-end mb-3">
      <span className="text-[10px] font-black uppercase tracking-widest italic text-white">{label}</span>
      <span className="text-[10px] font-mono text-slate-500">{Math.round(percent || 0)}%</span>
    </div>
    <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
      <motion.div initial={{ width: 0 }} whileInView={{ width: `${percent}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`absolute h-full ${color} shadow-[0_0_10px_rgba(34,211,238,0.5)]`} />
    </div>
  </div>
);

export default ProgressDashboard;