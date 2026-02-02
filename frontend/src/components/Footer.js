import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Zap, ArrowUpRight, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socials = [
    { icon: <Github size={16} />, url: "https://github.com/nainashilpi" },
    { icon: <Linkedin size={16} />, url: "https://www.linkedin.com/in/nainashilpi" },
    { icon: <Instagram size={16} />, url: "https://www.instagram.com/_niyo__neta____/" },
    { icon: <Mail size={16} />, url: "mailto:nainashilpi24@gmail.com" }
  ];

  return (
    <footer className="relative bg-[#020408] border-t border-white/5 pt-16 pb-8 overflow-hidden selection:bg-cyan-500/30">
      
      {/* --- SUBTLE NEURAL GLOW --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[10%] w-[300px] h-[300px] bg-cyan-600/5 blur-[100px] rounded-full opacity-50" />
        <div className="absolute bottom-0 right-[5%] w-[250px] h-[250px] bg-purple-600/5 blur-[80px] rounded-full opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-white/[0.03]">
          
          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                <Zap size={18} className="group-hover:fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                  ALGO<span className="text-cyan-500">PULSE_</span>
                </span>
                <span className="text-[7px] font-black text-slate-600 tracking-[0.5em] uppercase">Neural_Ecosystem</span>
              </div>
            </Link>
            <p className="text-slate-500 text-[11px] font-bold leading-relaxed max-w-xs uppercase italic tracking-tight opacity-70">
              The ultimate grid for mastering DSA. We provide the protocol—you provide the consistency.
            </p>
            <div className="flex gap-3">
              {socials.map((social, i) => (
                <a 
                  key={i} 
                  href={social.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-9 h-9 flex items-center justify-center bg-white/[0.02] border border-white/10 rounded-xl text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-black mb-6 text-[9px] uppercase tracking-[0.3em] italic border-l border-cyan-500 pl-3">Sector_Map</h4>
              <ul className="space-y-3">
                {['Dashboard', 'Leaderboard', 'Resources', 'Arena'].map((link) => (
                  <li key={link}>
                    <Link to={`/${link.toLowerCase()}`} className="text-slate-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest italic flex items-center gap-2 group">
                      <div className="w-1 h-[1px] bg-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black mb-6 text-[9px] uppercase tracking-[0.3em] italic border-l border-purple-500 pl-3">Protocols</h4>
              <ul className="space-y-3">
                {['Roadmap', 'Dev_Log', 'Network', 'Sync_Status'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-500 hover:text-purple-400 transition-all text-[9px] font-black uppercase tracking-widest italic flex items-center gap-2 group">
                      <div className="w-1 h-[1px] bg-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Mini */}
            <div className="col-span-2 md:col-span-1">
               <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 relative group overflow-hidden">
                  <p className="text-[9px] font-black text-white mb-2 uppercase tracking-widest">Neural_Brief</p>
                  <form className="flex items-center bg-[#0a0f1a] border border-white/5 rounded-lg overflow-hidden focus-within:border-cyan-500/30 transition-all">
                    <input type="email" placeholder="NODE_ID" className="bg-transparent w-full px-3 py-2 text-[8px] font-bold text-white outline-none" />
                    <button type="button" className="p-2 bg-white text-black hover:bg-cyan-500 transition-colors">
                      <ArrowUpRight size={14} />
                    </button>
                  </form>
               </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: SIGNATURE --- */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[8px] text-slate-700 font-black tracking-[0.4em] uppercase">
            © {currentYear} ALGOPULSE_SYSTEMS. ALL PROTOCOLS RESERVED.
          </p>

          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-white/[0.02] border border-white/10 group">
            <div className="text-right">
              <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest block mb-0.5">Architected By</span>
              <a 
                href="https://www.linkedin.com/in/nainashilpi" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs font-black text-white hover:text-cyan-400 transition-all uppercase italic tracking-tighter"
              >
                Naina Shilpi
              </a>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#05070a] border border-white/10 overflow-hidden p-0.5 group-hover:border-cyan-500/50 transition-all">
               <img 
                 src="/naina-profile.jpg" 
                 alt="Naina" 
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                 onError={(e) => e.target.src="https://ui-avatars.com/api/?name=Naina+Shilpi&background=0D0D0D&color=06b6d4"}
               />
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;