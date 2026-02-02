import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios"; 
import {
  Trophy, LogOut, ShieldCheck, BookOpen, Bell, X, Zap, User, Clock, Menu, Trash2
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]); 

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Admin Check (Case Insensitive)
  const isAdmin = user && user.role && user.role.toLowerCase() === "admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    if (token) fetchNotifications(); 
    return () => window.removeEventListener("scroll", onScroll);
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const res = await axios.get(`${baseUrl}/api/notifications`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Notif Error:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      await axios.delete(`${baseUrl}/api/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    setShowMobileMenu(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-8 pt-6 flex justify-center pointer-events-none">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          pointer-events-auto flex items-center justify-between
          px-4 md:px-8 transition-all duration-500
          ${scrolled ? "h-14 max-w-5xl bg-[#05070a]/95 shadow-[0_0_30px_rgba(0,0,0,0.5)]" : "h-20 max-w-7xl bg-[#05070a]/40"}
          w-full rounded-[2rem] backdrop-blur-3xl border border-white/10 relative
        `}
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500 transition-all duration-500">
            <Zap size={18} className="text-cyan-400 group-hover:text-black" />
          </div>
          <span className="text-lg font-black tracking-tighter text-white uppercase italic">
            ALGO<span className="text-cyan-500">PULSE_</span>
          </span>
        </Link>

        {/* DESKTOP CENTRAL NAV */}
        <div className="hidden md:flex items-center gap-2 bg-white/[0.05] p-1.5 rounded-2xl border border-white/5">
          <NavItem to="/leaderboard" icon={<Trophy size={14} />} label="ARENA" active={location.pathname === "/leaderboard"} />
          <NavItem to="/resources" icon={<BookOpen size={14} />} label="RESOURCES" active={location.pathname === "/resources"} />
          {isAdmin && (
            <NavItem to="/admin" icon={<ShieldCheck size={14} />} label="CORE_ACCESS" active={location.pathname === "/admin"} danger />
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4">
          {token ? (
            <div className="flex items-center gap-1 md:gap-3">
              <button 
                onClick={() => { setShowNotif(!showNotif); fetchNotifications(); }} 
                className="relative p-2.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full animate-pulse border-2 border-[#05070a]" />
                )}
              </button>

              <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/10">
                <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden hover:border-cyan-500/50 transition-all">
                  {user?.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" /> : <User size={20} className="text-slate-400" />}
                </Link>
                <button onClick={handleLogout} className="p-2.5 rounded-xl text-slate-500 hover:text-rose-500 transition-all">
                  <LogOut size={20} />
                </button>
              </div>

              {/* MOBILE HAMBURGER */}
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden p-2.5 rounded-xl bg-white/5 text-cyan-400 border border-white/5 pointer-events-auto">
                {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[10px] font-black text-slate-400 hover:text-white uppercase italic tracking-widest">LOG_IN</Link>
              <Link to="/register" className="px-5 py-2 rounded-xl bg-cyan-500 text-black text-[10px] font-black uppercase italic tracking-widest">INIT</Link>
            </div>
          )}
        </div>

        {/* MOBILE DRAWER */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-[110%] left-0 right-0 bg-[#0a0f1a]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 md:hidden pointer-events-auto z-[120] flex flex-col gap-2"
            >
              <NavItem to="/dashboard" label="MY_PROFILE" active={location.pathname === "/dashboard"} onClick={() => setShowMobileMenu(false)} />
              <NavItem to="/leaderboard" label="ARENA" active={location.pathname === "/leaderboard"} onClick={() => setShowMobileMenu(false)} />
              <NavItem to="/resources" label="RESOURCES" active={location.pathname === "/resources"} onClick={() => setShowMobileMenu(false)} />
              {isAdmin && (
                <NavItem to="/admin" label="CORE_ACCESS" active={location.pathname === "/admin"} danger onClick={() => setShowMobileMenu(false)} />
              )}
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 text-rose-500 text-[10px] font-black uppercase italic text-left">
                <LogOut size={14} /> LOGOUT_PROTOCOL
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NOTIFICATION DROPDOWN */}
        <AnimatePresence>
          {showNotif && (
            <>
              <div className="fixed inset-0 z-[-1] pointer-events-auto" onClick={() => setShowNotif(false)} />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-[105%] md:top-[120%] w-[90vw] md:w-80 rounded-3xl bg-[#0a0f1a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 z-[110] pointer-events-auto"
              >
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] italic">System_Logs</h4>
                  <X size={14} className="text-slate-600 cursor-pointer hover:text-white" onClick={() => setShowNotif(false)} />
                </div>
                
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n._id} className="relative p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-all group overflow-hidden">
                        <p className="text-[11px] text-slate-300 font-mono italic leading-relaxed mb-3 pr-6">{n.message}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[8px] font-black text-slate-600 uppercase tracking-widest italic">
                            <Clock size={10} /> {new Date(n.createdAt).toLocaleDateString()}
                          </div>
                          <button onClick={() => deleteNotification(n._id)} className="text-slate-600 hover:text-rose-500 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-[10px] font-black text-slate-700 uppercase italic tracking-[0.5em]">Log_Empty</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

const NavItem = ({ to, icon, label, active, danger, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick} 
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic transition-all duration-300 ${active ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]" : danger ? "text-rose-500 hover:bg-rose-500/10" : "text-slate-400 hover:text-white hover:bg-white/10"}`}
  >
    {icon}{label}
  </Link>
);

export default Navbar;