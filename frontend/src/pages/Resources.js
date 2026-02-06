import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ExternalLink, Youtube, Code2, Sparkles, Laptop, 
  Cpu, Zap, Search, Target, Terminal, Trophy, Star, 
  Briefcase, FileCode, Database, ArrowRight,
  Users, Rocket, Globe, Boxes, HardDrive, ShieldCheck, Brain, Mic2
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

const Section = ({ title, subtitle, icon: Icon, children }) => (
  <motion.section
    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
    variants={fadeInUp}
    className="max-w-7xl mx-auto px-6 mb-32 relative z-10"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
        {Icon && <Icon className="text-cyan-400" size={24} />}
      </div>
      <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic uppercase">{title}</h2>
    </div>
    <motion.p className="text-[9px] font-black tracking-[0.4em] uppercase text-slate-600 mb-12 ml-4 md:ml-16 italic border-l border-cyan-500/30 pl-4">
      {subtitle}
    </motion.p>
    {children}
  </motion.section>
);

const ResourceCard = ({ title, desc, tag, link, icon: Icon }) => (
  <motion.a href={link} target="_blank" rel="noreferrer" className="group block h-full">
    <div className="h-full bg-white/[0.01] border border-white/5 rounded-[2rem] p-8 hover:border-cyan-500/30 hover:bg-white/[0.02] transition-all duration-500 relative overflow-hidden backdrop-blur-3xl">
      <div className="flex justify-between items-start mb-8">
        <div className="p-3 bg-white/5 rounded-xl text-cyan-400 group-hover:rotate-[360deg] transition-transform duration-1000">
          {Icon ? <Icon size={20} /> : <Code2 size={20} />}
        </div>
        <span className="text-[8px] px-2.5 py-1 rounded-lg bg-white/5 text-slate-500 border border-white/10 font-black uppercase tracking-widest group-hover:text-cyan-400 transition-colors italic">
          {tag}
        </span>
      </div>
      <h4 className="text-lg font-black text-white mb-3 group-hover:text-cyan-400 transition-colors italic uppercase tracking-tight">{title}</h4>
      <p className="text-[10px] font-bold text-slate-600 leading-relaxed mb-8 uppercase tracking-wide group-hover:text-slate-400">
        {desc}
      </p>
      <div className="flex items-center gap-2 text-[9px] font-black text-cyan-500 opacity-0 group-hover:opacity-100 transition-all uppercase italic">
        Open_Archive <ExternalLink size={10} />
      </div>
    </div>
  </motion.a>
);

const Resources = () => {
  return (
    <div className="min-h-screen bg-[#020408] text-slate-300 pb-32 overflow-x-hidden relative selection:bg-cyan-500/30 font-sans">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-600/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-600/[0.03] blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay" />
      </div>

      <section className="pt-52 md:pt-64 pb-40 text-center relative z-10 px-6">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black tracking-[0.4em] text-cyan-400 uppercase mb-8 backdrop-blur-md italic">
            <Sparkles size={12} className="animate-pulse" /> Placement_Vault_Active
          </div>
          <h1 className="text-6xl md:text-[9rem] font-black mb-6 tracking-tighter text-white italic uppercase leading-none">
            Study <span className="text-cyan-500">Vault_</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] italic leading-relaxed">
            From coding fundamentals to Tier-1 engineering roles. <br /> 
            <span className="text-white border-b border-cyan-500/30">Your roadmap to the future.</span>
          </p>
        </motion.div>
      </section>

      {/* --- 01. PLACEMENT PATH --- */}
      <Section title="Roadmap_Core" subtitle="Comprehensive Placement Strategy." icon={Target}>
        <div className="relative max-w-4xl ml-4 md:ml-16">
          <div className="absolute left-[17px] top-0 w-[1px] h-full bg-white/5" />
          <motion.div 
            initial={{ height: 0 }} whileInView={{ height: "100%" }} viewport={{ once: false }} 
            transition={{ duration: 1.8, ease: "linear" }}
            className="absolute left-[17px] top-0 w-[1px] bg-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
          />
          {[
            { t: "Step 01: Language Mastery", d: "Choose C++ or Java. Master STL/Collections. Focus on basic logic building and time complexity.", i: Terminal },
            { t: "Step 02: Specialized Development", d: "Pick a domain (Web, App, or Cloud). Build 2-3 unique, non-generic projects that solve real problems.", i: Laptop },
            { t: "Step 03: Core DSA Grind", d: "Master Graphs, Trees, and DP. Solve 400+ curated problems across patterns.", i: Cpu },
            { t: "Step 04: The Internship Window", d: "Target Summer Internships. Optimize Resume for ATS and LinkedIn for reach.", i: Rocket },
            { t: "Step 05: CS Subjects & Core", d: "Revision of OS, DBMS, SQL, and CN. Essential for technical interview rounds.", i: Database },
            { t: "Step 06: Final Placement Gear", d: "Mock Interviews, Aptitude, and Referral requests. Cracking the Dream Product Company.", i: Trophy }
          ].map((step, idx) => (
            <div key={idx} className="relative pl-16 pb-20 group">
              <div className="absolute left-0 top-0 w-9 h-9 rounded-xl bg-[#020408] border border-white/10 flex items-center justify-center z-10 group-hover:border-cyan-500/50 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                <step.i size={14} />
              </div>
              <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-2 group-hover:text-cyan-400 transition-colors">{step.t}</h3>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed max-w-2xl group-hover:text-slate-400">{step.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* --- 02. DSA SHEETS --- */}
      <Section title="DSA_Sheets" subtitle="Top rated problem sets." icon={FileCode}>
        <div className="grid md:grid-cols-3 gap-6">
          <ResourceCard title="Striver's A-Z" desc="Comprehensive sheet for all levels." tag="Must Do" icon={Search} link="https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z" />
          <ResourceCard title="Apna College" desc="High-impact questions by Shraddha Khapra." tag="Popular" icon={Sparkles} link="https://dsa.apnacollege.in/" />
          <ResourceCard title="NeetCode 150" desc="Master coding patterns efficiently." tag="Revision" icon={Zap} link="https://neetcode.io/practice/practice/neetcode150" />
        </div>
      </Section>

      {/* --- 03. YOUTUBE --- */}
      <Section title="Video_Lectures" subtitle="Learn from the best." icon={Youtube}>
        <div className="grid md:grid-cols-3 gap-6">
          <ResourceCard title="TakeUForward" desc="Unbeatable logic for DP and Graphs." tag="Striver" icon={Zap} link="https://www.youtube.com/watch?v=0bHoB32fuj0&list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" />
          <ResourceCard title="Apna College" desc="End-to-end DSA and Dev tutorials." tag="Shraddha" icon={Sparkles} link="https://www.youtube.com/watch?v=VTLCoHnyACE&list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt" />
          <ResourceCard title="Aditya Verma" desc="Legendary DP & Recursion intuition." tag="Legend" icon={Brain} link="https://www.youtube.com/watch?v=nqowUJzG-iM&list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go" />
        </div>
      </Section>

      {/* --- 04. CS CORE --- */}
      <Section title="CS_Fundamentals" subtitle="Important interview theory." icon={Database}>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { n: "Operating Systems", i: HardDrive, link: "https://www.youtube.com/watch?v=Q_OU-aKC_Gk&list=PLrL_PSQ6q0606tibu0c9lFIzkFtshv7HI" },
            { n: "DBMS & SQL", i: Database, link: "https://www.youtube.com/watch?v=eylFMNSJCQo&list=PLrL_PSQ6q062cD0vPMGYW_AIpNg6T0_Fq" },
            { n: "Computer Networks", i: Globe, link: "https://whimsical.com/networking-cheatsheet-by-love-babbar-FcLExFDezehhfsbDPfZDBv" },
            { n: "OOPS Concepts", i: Boxes, link: "https://www.youtube.com/watch?v=mlIUKyZIUUU" }
          ].map((item, i) => (
            <motion.a 
              href={item.link} key={i} target="_blank" rel="noopener noreferrer"
              className="p-8 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.02] hover:border-cyan-500/20 transition-all group block"
            >
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-[360deg] transition-transform duration-700">
                <item.i size={18} className="text-cyan-400" />
              </div>
              <h4 className="text-sm font-black text-white italic uppercase tracking-tighter mb-3">{item.n}</h4>
              <div className="flex items-center gap-2 text-[8px] font-black text-cyan-500 opacity-60 group-hover:opacity-100 uppercase tracking-widest transition-all italic">
                Open_Archive <ArrowRight size={10} />
              </div>
            </motion.a>
          ))}
        </div>
      </Section>

      {/* --- 05. CONTESTS --- */}
      <Section title="Contest_Zone" subtitle="Competitive Programming." icon={Trophy}>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: "LeetCode", d: "Weekly (Sun 8AM) & Bi-Weekly (Sat 8PM) IST.", tg: "Global", i: Zap, l: "https://leetcode.com/contest/" },
            { t: "Codeforces", d: "Intense logical rounds weekly.", tg: "Legendary", i: Code2, l: "https://codeforces.com/contests" },
            { t: "CodeChef", d: "Wednesday Starters @ 8:00 PM IST.", tg: "Consistent", i: Star, l: "https://www.codechef.com/contests" }
          ].map((item, i) => (
            <motion.a href={item.l} key={i} target="_blank" rel="noreferrer" className="group relative">
              <div className="relative p-8 bg-white/[0.01] border border-white/5 border-b-2 border-b-cyan-500/10 rounded-[2rem] hover:border-b-cyan-500/50 transition-all duration-500">
                <div className="flex justify-between items-center mb-6">
                  <item.i className="text-cyan-400 group-hover:scale-110 transition-transform" size={20} />
                  <span className="text-[7px] font-black text-slate-700 uppercase tracking-[0.3em]">{item.tg}</span>
                </div>
                <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2 group-hover:text-cyan-400 transition-colors">{item.t}</h4>
                <p className="text-[9px] font-bold text-slate-600 uppercase leading-relaxed">{item.d}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </Section>

      {/* --- 06. INTERVIEW LOGS --- */}
      <Section title="Interview_Logs" subtitle="Fresher & Intern Experiences." icon={Briefcase}>
        <div className="space-y-3">
          {[
            { c: "Microsoft", l: "SWE Intern / Explore Program", d: "Focus on Strings, Arrays, and System Design basics.", s: "Hard", link: "https://www.youtube.com/watch?v=kOJwuRhHZKI" },
            { c: "Google", l: "STEP Intern / New Grad", d: "Heavy focus on Graphs, Trees and clean coding practices.", s: "Hard", link: "https://www.youtube.com/watch?v=Yxjh3QBS0_E" },
            { c: "Amazon", l: "SDE Intern / 6-Month", d: "Hiring via Campus or Off-campus. Leadership Principles are key.", s: "Medium-Hard", link: "https://www.youtube.com/watch?v=vscu3i1_yxs" },
            { c: "JpMorgan", l: "SDE-1", d: "Hiring via Off-campus hiring challenges.", s: "Medium-Hard", link: "https://www.youtube.com/watch?v=Q_mSKYgWtio" }
          ].map((exp, i) => (
            <motion.a href={exp.link} key={i} target="_blank" rel="noreferrer" className="block group">
              <div className="p-6 px-10 bg-white/[0.01] border border-white/5 rounded-[1.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-cyan-500/20 transition-all cursor-pointer">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-cyan-400 font-black italic uppercase text-lg group-hover:tracking-widest transition-all duration-500">{exp.c}</span>
                    <span className="text-[8px] px-2 py-0.5 bg-white/5 rounded text-slate-600 font-black uppercase tracking-tighter">{exp.l}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{exp.d}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[10px] font-black text-cyan-500 uppercase italic tracking-widest">{exp.s}</div>
                  <ArrowRight size={14} className="text-slate-700 group-hover:text-cyan-500 transition-colors" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </Section>

      {/* --- 07. BEYOND CODING --- */}
      <Section title="Beyond_Coding" subtitle="The Professional Edge." icon={Mic2}>
        <div className="grid md:grid-cols-2 gap-12 ml-4 md:ml-16">
          <div className="space-y-12">
            {[
              { t: "Aptitude & Logic", d: "Don't let the first filter stop you. Master Quantitative, Verbal, and Logical Reasoning.", i: Brain },
              { t: "Communication", d: "The ability to explain your 'approach' is more important than the code.", i: Mic2 },
              { t: "LinkedIn & Networking", d: "Your profile is your digital CV. Connect with seniors and share your learning daily.", i: Users },
              { t: "Hackathons & Events", d: "Participation in SIH or MLH proves you can build under pressure.", i: Rocket }
            ].map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="relative group cursor-default">
                <div className="absolute -left-6 top-1 w-[1px] h-0 bg-cyan-500 group-hover:h-full transition-all duration-500" />
                <h4 className="text-xl font-black text-white italic uppercase mb-2 flex items-center gap-3">
                   <item.i size={18} className="text-cyan-400" /> {item.t}
                </h4>
                <p className="text-[10px] text-slate-600 leading-relaxed uppercase font-bold tracking-tight group-hover:text-slate-400 transition-colors">{item.d}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="bg-white/[0.01] border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-center backdrop-blur-3xl">
            <div className="absolute -right-10 -top-10 opacity-[0.03]"><ShieldCheck size={200} className="text-cyan-500" /></div>
            <h4 className="text-xl font-black text-white italic uppercase mb-8 tracking-tighter">Placement_Checklist</h4>
            <div className="space-y-8 relative z-10">
              {[
                { label: "Resume Quality", val: "Single column, ATS-friendly, and impact-driven with metrics." },
                { label: "Mock Interviews", val: "Practice explaining your projects and DSA logic to another human." },
                { label: "Referral Ready", val: "Have a tailored message ready for seniors on LinkedIn." }
              ].map((point, i) => (
                <div key={i} className="group">
                   <span className="text-[9px] font-black text-cyan-500 uppercase block mb-1 tracking-widest group-hover:translate-x-2 transition-transform">{point.label}</span>
                   <p className="text-[10px] text-slate-600 font-bold uppercase leading-relaxed italic">{point.val}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* --- MOTIVATION --- */}
      <section className="max-w-5xl mx-auto px-6 my-48">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="relative border-y border-white/5 py-24 flex flex-col items-center">
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-12">
            <div className="h-[1px] w-12 bg-white/10" />
            <div className="p-2.5 bg-cyan-500/10 rounded-full"><Cpu className="text-cyan-500" size={20} /></div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
              Roz thoda sa <span className="text-cyan-500">code...</span>
            </h2>
            <div className="h-[1px] w-12 bg-white/10" />
          </motion.div>
          <motion.div variants={fadeInUp} className="text-center max-w-3xl">
            <p className="text-base md:text-xl font-bold text-slate-500 uppercase tracking-widest italic leading-relaxed">
              "Bas rukna mat. Aaj ka <span className="text-white">ek question</span> tumhare kal ka placement fix karega."
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 text-center">
        <p className="text-lg font-black text-white uppercase italic tracking-tighter">
          Architected by <span className="text-cyan-500">Naina Shilpi</span> // Undergrid_Systems
        </p>
        <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] mt-4">Secure_Archive_V5.0 // Built for Excellence</p>
      </footer>
    </div>
  );
};

export default Resources;
