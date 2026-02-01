
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Send, ShieldCheck, Activity, Cpu, Zap, 
  Search, BellRing, ChevronRight, X, BarChart3, Target, Trash2, Loader2, Lock 
} from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('tracker'); 
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [potd, setPotd] = useState({ title: '', difficulty: 'Easy', link: '', _id: null });
  const [notifMsg, setNotifMsg] = useState('');
  const [allNotifications, setAllNotifications] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => { 
    fetchUsers(); 
    fetchAllNotifs();
    fetchLatestPOTD();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/leaderboard');
      const userData = Array.isArray(res.data) ? res.data : (res.data.users || []);
      setUsers(userData);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const fetchAllNotifs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications');
      setAllNotifications(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchLatestPOTD = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/problems/latest');
      if (res.data) {
        setPotd({ 
          title: res.data.title || '', 
          difficulty: res.data.difficulty || 'Easy', 
          link: res.data.link || '',
          _id: res.data._id 
        });
      }
    } catch (err) { console.error("POTD Fetch Error"); }
  };

  const handlePOTDSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const loadToast = toast.loading(potd._id ? "Updating POTD..." : "Pushing New POTD...");
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      if (potd._id) {
        await axios.put(`http://localhost:5000/api/problems/${potd._id}`, potd, config);
        toast.success("POTD Refined! ⚡", { id: loadToast });
      } else {
        await axios.post('http://localhost:5000/api/problems/add', potd, config);
        toast.success("POTD Deployed! 🚀", { id: loadToast });
      }
      fetchLatestPOTD();
    } catch (err) { toast.error("Operation Failed", { id: loadToast }); }
    finally { setIsProcessing(false); }
  };

  const deletePOTD = async () => {
    if (!potd._id || !window.confirm("Purge current POTD?")) return;
    setIsProcessing(true);
    try {
      await axios.delete(`http://localhost:5000/api/problems/${potd._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPotd({ title: '', difficulty: 'Easy', link: '', _id: null });
      toast.success("POTD Purged");
    } catch (err) { toast.error("Delete Failed"); }
    finally { setIsProcessing(false); }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if(!notifMsg) return toast.error("Empty Signal!");
    setIsProcessing(true);
    const loadToast = toast.loading("Broadcasting...");
    try {
      const res = await axios.post('http://localhost:5000/api/notifications/create', 
        { message: notifMsg, type: 'Update' }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAllNotifications([res.data, ...allNotifications]); 
      setNotifMsg('');
      toast.success("Broadcast Live! 📢", { id: loadToast });
    } catch (err) { toast.error("Transmission Failed", { id: loadToast }); }
    finally { setIsProcessing(false); }
  };

  const deleteNotification = async (id) => {
    const previousNotifs = [...allNotifications];
    setAllNotifications(allNotifications.filter(n => n._id !== id));
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("Signal Purged");
    } catch (err) {
      setAllNotifications(previousNotifs);
      toast.error("Delete Failed");
    }
  };

  const deleteUser = async (id) => {
    if(!window.confirm("Purge this Node permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.filter(u => u._id !== id));
      setSelectedUser(null);
      toast.success("Node Terminated");
    } catch (err) { toast.error("Purge Failed"); }
  };

  const filteredUsers = users.filter(u => {
    const name = u.name || u.username || "";
    const handle = u.leetcodeHandle || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           handle.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#020408] text-slate-300 font-sans selection:bg-cyan-500/30 pb-20 pt-36 relative overflow-x-hidden">
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/[0.03] blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
           <div className="flex items-center gap-4">
              <div className="bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/20">
                  <ShieldCheck size={28} className="text-cyan-400" />
              </div>
              <div>
                 <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">Neural <span className="text-cyan-400">Admin_</span></h1>
                 <p className="text-[9px] text-slate-600 font-black tracking-[0.4em] uppercase">Control_Systems_V5.0</p>
              </div>
           </div>
           
           <div className="flex bg-white/[0.02] p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
              {[{ id: 'tracker', label: 'Nodes', icon: <Activity size={14}/> }, { id: 'potd', label: 'POTD', icon: <Zap size={14}/> }, { id: 'broadcast', label: 'Signal', icon: <BellRing size={14}/> }].map(tab => (
                <button key={tab.id} onClick={() => {setActiveTab(tab.id); setSelectedUser(null);}} className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-cyan-500 text-black' : 'text-slate-500 hover:text-white'}`}>
                  {tab.icon} {tab.label.toUpperCase()}
                </button>
              ))}
           </div>
        </div>

        <div className="mb-12 group">
          <div className="flex items-center justify-between mb-4 px-2">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /> Live_Sync_Stream
            </p>
            {selectedUser && <button onClick={() => setSelectedUser(null)} className="text-[9px] font-black text-cyan-400 uppercase hover:underline transition-all italic">Close_Analysis ✕</button>}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {users.length > 0 ? users.map((u, i) => (
              <div key={u._id || i} onClick={() => {setSelectedUser(u); setActiveTab('tracker');}} className={`flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer transition-all ${selectedUser?._id === u._id ? 'scale-110' : 'opacity-40 hover:opacity-100'}`}>
                <div className={`w-14 h-14 rounded-full p-0.5 border-2 ${selectedUser?._id === u._id ? 'border-cyan-400' : 'border-white/10'}`}>
                   <img src={u.profilePic || 'https://via.placeholder.com/150'} className="w-full h-full rounded-full object-cover" alt="" />
                </div>
                <span className={`text-[8px] font-black uppercase ${selectedUser?._id === u._id ? 'text-cyan-400' : 'text-slate-700'}`}>ID_{i+10}</span>
              </div>
            )) : <div className="text-[9px] font-black text-slate-800 uppercase italic py-4">Syncing_Nodes...</div>}
          </div>
        </div>

        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {selectedUser && activeTab === 'tracker' ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="analysis" className="grid grid-cols-1 md:grid-cols-12 gap-8">
                 <div className="md:col-span-4 bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl text-center">
                    <img src={selectedUser.profilePic || 'https://via.placeholder.com/150'} className="w-24 h-24 rounded-3xl mx-auto mb-4 border-2 border-cyan-500/10" alt="" />
                    <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">{selectedUser.name || selectedUser.username || "Unknown Node"}</h2>
                    <p className="text-cyan-500 text-[10px] font-black tracking-[0.3em] mt-1 mb-6 uppercase italic">Node_Analysis_Mode</p>
                    <div className="space-y-3 text-left">
                       <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                          <span className="text-[10px] text-slate-600 font-black uppercase">Handle</span>
                          <span className="text-white font-black italic text-sm">@{selectedUser.leetcodeHandle || 'N/A'}</span>
                       </div>
                       <div className="bg-cyan-500 text-black p-4 rounded-2xl flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase">Points</span>
                          <span className="text-xl font-black">{selectedUser.points ?? 0}</span>
                       </div>
                    </div>
                 </div>
                 <div className="md:col-span-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl">
                    <h3 className="text-[10px] font-black text-slate-600 uppercase mb-8 italic flex items-center gap-2"><BarChart3 size={14}/> Problem_Decomposition</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                       {[
                         { label: 'EASY', val: selectedUser.stats?.easySolved ?? selectedUser.easySolved ?? 0, color: 'bg-emerald-500', id: '01' },
                         { label: 'MEDIUM', val: selectedUser.stats?.mediumSolved ?? selectedUser.mediumSolved ?? 0, color: 'bg-orange-500', id: '02' },
                         { label: 'HARD', val: selectedUser.stats?.hardSolved ?? selectedUser.hardSolved ?? 0, color: 'bg-red-500', id: '03' }
                       ].map((s, i) => (
                         <div key={i} className="relative bg-black/40 border border-white/5 p-6 rounded-3xl group">
                            <span className="absolute top-4 right-6 text-white/[0.02] font-black text-4xl group-hover:text-cyan-500/5 transition-colors">{s.id}</span>
                            <p className="text-[10px] font-black text-slate-600 mb-2">{s.label}</p>
                            <p className="text-3xl font-black text-white italic">{s.val}</p>
                            <div className={`h-1 w-12 ${s.color} mt-4 rounded-full opacity-50`} />
                         </div>
                       ))}
                    </div>
                    <div className="mt-8 p-6 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-4 text-[10px] font-black uppercase italic text-slate-500">
                          <Target size={16} className="text-cyan-400" /> Neural Consistency: <span className="text-cyan-400">{selectedUser.streak || 0} Day Streak</span>
                       </div>
                       <button onClick={() => deleteUser(selectedUser._id)} className="bg-red-500/10 text-red-500 p-3 rounded-xl hover:bg-red-500/20 transition-all"><Trash2 size={16}/></button>
                    </div>
                 </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={activeTab}>
                {activeTab === 'tracker' && (
                  <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                       <h3 className="text-xs font-black text-white uppercase italic tracking-widest">Node_Stream</h3>
                       <div className="relative w-64">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                          <input className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 text-[10px] font-black text-white outline-none focus:border-cyan-500/30 transition-all uppercase placeholder:text-slate-800" placeholder="SEARCH_NODE..." onChange={(e) => setSearchTerm(e.target.value)} />
                       </div>
                    </div>
                    <div className="divide-y divide-white/5 max-h-[450px] overflow-y-auto custom-scrollbar">
                       {filteredUsers.map((u, i) => (
                         <div key={i} onClick={() => setSelectedUser(u)} className="flex items-center justify-between p-6 hover:bg-white/[0.02] cursor-pointer group transition-all">
                            <div className="flex items-center gap-4">
                               <img src={u.profilePic || 'https://via.placeholder.com/150'} className="w-10 h-10 rounded-xl border border-white/10 group-hover:border-cyan-500/30 transition-all" alt="" />
                               <div>
                                  <p className="text-[11px] font-black text-white italic uppercase group-hover:text-cyan-400 transition-colors">{u.name || u.username || "Unknown"}</p>
                                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">@{u.leetcodeHandle || 'N/A'}</p>
                               </div>
                            </div>
                            <div className="text-right flex items-center gap-6">
                               <div><p className="text-xs font-black text-white">{u.points || 0}</p><p className="text-[8px] text-slate-700 uppercase font-black">Points</p></div>
                               <ChevronRight className="text-slate-800 group-hover:text-cyan-400 transition-all" size={16} />
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {activeTab === 'potd' && (
                  <div className="max-w-2xl mx-auto bg-white/[0.01] border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl">
                      <h2 className="text-2xl font-black italic text-white uppercase text-center mb-10 tracking-tighter underline decoration-cyan-500/20">{potd._id ? "Refine_POTD" : "Initialize_POTD"}</h2>
                      <form onSubmit={handlePOTDSubmit} className="space-y-6">
                        <input className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl text-[10px] font-black text-white outline-none focus:border-cyan-500/30 transition-all uppercase placeholder:text-slate-800" placeholder="PROBLEM TITLE" value={potd.title} onChange={(e) => setPotd({...potd, title: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                           <select className="bg-black/40 border border-white/5 rounded-2xl p-4 text-[10px] font-black text-white outline-none cursor-pointer uppercase" value={potd.difficulty} onChange={(e) => setPotd({...potd, difficulty: e.target.value})}><option>Easy</option><option>Medium</option><option>Hard</option></select>
                           <input className="bg-black/40 border border-white/5 rounded-2xl p-4 text-[10px] font-black text-white outline-none focus:border-cyan-500/30 uppercase placeholder:text-slate-800" placeholder="LINK" value={potd.link} onChange={(e) => setPotd({...potd, link: e.target.value})} />
                        </div>
                        <div className="flex gap-4">
                          <button type="submit" disabled={isProcessing} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-black py-5 rounded-2xl text-[10px] font-black uppercase italic transition-all active:scale-95 flex justify-center items-center gap-2">
                            {isProcessing ? <Loader2 className="animate-spin" size={16}/> : (potd._id ? "Commit_Changes" : "Execute_Update")}
                          </button>
                          {potd._id && (
                            <button type="button" onClick={deletePOTD} className="bg-red-500/10 text-red-500 px-6 rounded-2xl hover:bg-red-500/20 transition-all">
                              <Trash2 size={20}/>
                            </button>
                          )}
                        </div>
                      </form>
                  </div>
                )}

                {activeTab === 'broadcast' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                      <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl">
                          <h2 className="text-2xl font-black italic text-white uppercase text-center mb-10 tracking-tighter underline decoration-cyan-500/20">Neural_Broadcast</h2>
                          <form onSubmit={handleSendNotification} className="space-y-6">
                            <textarea className="w-full bg-black/40 border border-white/5 p-6 rounded-3xl text-[10px] font-black text-white outline-none min-h-[120px] resize-none focus:border-cyan-500/30 transition-all uppercase placeholder:text-slate-800" placeholder="ENTER TRANSMISSION DATA..." value={notifMsg} onChange={(e) => setNotifMsg(e.target.value)} />
                            <button type="submit" disabled={isProcessing} className="w-full bg-cyan-600 hover:bg-cyan-500 text-black py-5 rounded-2xl text-[10px] font-black uppercase italic flex items-center justify-center gap-3 transition-all active:scale-95">
                               {isProcessing ? <Loader2 className="animate-spin" size={16}/> : <>Broadcast Signal <Send size={16}/></>}
                            </button>
                          </form>
                      </div>
                      
                      <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8">
                         <h3 className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mb-6 italic">Active_Signals_Log</h3>
                         <div className="space-y-3">
                            <AnimatePresence initial={false}>
                              {allNotifications.map((n) => (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }} 
                                  animate={{ opacity: 1, height: 'auto' }} 
                                  exit={{ opacity: 0, x: 20 }}
                                  key={n._id} 
                                  className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl group hover:border-cyan-500/10 transition-all"
                                >
                                   <div className="flex-1 pr-4">
                                      <p className="text-[10px] text-white font-black uppercase tracking-tight leading-relaxed">{n.message}</p>
                                      <p className="text-[8px] text-slate-700 uppercase mt-2 font-black italic tracking-widest">{n.type} • {new Date(n.createdAt).toLocaleTimeString()}</p>
                                   </div>
                                   <button onClick={() => deleteNotification(n._id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                            {allNotifications.length === 0 && <p className="text-center text-[9px] text-slate-800 py-8 font-black italic uppercase tracking-[0.3em]">No signals in orbit</p>}
                         </div>
                      </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-20 py-8 border-t border-white/5 flex flex-col items-center justify-center gap-3 opacity-30">
           <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 tracking-[0.5em] uppercase italic">
              <Lock size={10} className="text-cyan-500" /> Administrative_Access_Only
           </div>
           <p className="max-w-md text-center text-[7px] text-slate-600 font-bold leading-relaxed uppercase tracking-widest">
              This terminal is strictly encrypted. Unauthorized access to Core_V5.0 protocols is monitored. Normal nodes have no visibility or permission to override these neural triggers.
           </p>
        </div>

      </div>
      <style jsx>{` .no-scrollbar::-webkit-scrollbar { display: none; } .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.1); border-radius: 10px; } `}</style>
    </div>
  );
};

export default Admin;