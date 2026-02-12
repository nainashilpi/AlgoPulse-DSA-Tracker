
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Image as ImageIcon, MessageCircle, X, 
  Trash2, Heart, Terminal, Cpu, Activity 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Discussion = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [replyText, setReplyText] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const isAdmin = currentUser?.role?.toLowerCase() === 'admin';

  const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/discussions`;
  const AUTH_HEADER = { headers: { Authorization: `Bearer ${token}` } };

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(API_URL);
      setPosts(res.data);
    } catch (err) {
      toast.error("SYSTEM_SYNC_FAILED");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !preview) return;
    try {
      if (preview && preview.length > 10 * 1024 * 1024) return toast.error("PAYLOAD_TOO_LARGE");
      const res = await axios.post(API_URL, { content, image: preview }, AUTH_HEADER);
      setPosts([res.data, ...posts]);
      setContent(""); 
      setPreview(""); 
      toast.success("BROADCAST_SENT");
    } catch (err) { 
      toast.error(err.response?.data?.message || "POST_FAILED"); 
    }
  };

  const handleLike = async (postId) => {
    if (!isLoggedIn) return toast.error("AUTH_REQUIRED");
    try {
      const res = await axios.post(`${API_URL}/${postId}/like`, {}, AUTH_HEADER);
      setPosts(prev => prev.map(p => p._id === postId ? res.data : p));
    } catch (err) { console.error("LIKE_ERR", err); }
  };

  const handleReplySubmit = async (postId) => {
    const text = replyText[postId];
    if (!text?.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/${postId}/reply`, { content: text }, AUTH_HEADER);
      setPosts(prev => prev.map(p => p._id === postId ? res.data : p));
      setReplyText(prev => ({ ...prev, [postId]: "" }));
      toast.success("LOG_ADDED");
    } catch (err) { toast.error("REPLY_FAILED"); }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("PURGE_DATA_PERMANENTLY?")) return;
    try {
      await axios.delete(`${API_URL}/${postId}`, AUTH_HEADER);
      setPosts(prev => prev.filter(p => p._id !== postId));
      toast.success("ENTRY_DELETED");
    } catch (err) { toast.error("PURGE_FAILED"); }
  };

  const handleDeleteReply = async (postId, replyId) => {
    if (!window.confirm("REMOVE_SUB_LOG?")) return;
    try {
      await axios.delete(`${API_URL}/${postId}/reply/${replyId}`, AUTH_HEADER);
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, replies: p.replies.filter(r => r._id !== replyId) } : p));
      toast.success("REPLY_REMOVED");
    } catch (err) { toast.error("DELETE_FAILED"); }
  };

  const toggleReplies = (postId) => setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));

  const SkeletonPost = () => (
    <div className="w-full p-5 rounded-[1.5rem] border border-white/5 bg-white/[0.01] animate-pulse mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
        <div className="space-y-2">
          <div className="w-24 h-2 bg-white/10 rounded"></div>
          <div className="w-16 h-1 bg-white/5 rounded"></div>
        </div>
      </div>
      <div className="w-full h-4 bg-white/5 rounded mb-2"></div>
      <div className="w-full h-40 bg-white/5 rounded-xl"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020408] text-slate-300 font-sans pb-20 selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Cyan Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto pt-32 px-4 relative z-10">
        
        {/* Hub Header Styled like Leaderboard */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Terminal size={20} className="text-cyan-500" />
            </div>
            <h1 className="text-lg font-black tracking-[0.2em] text-white uppercase italic">Discussion_Hub</h1>
          </div>
          <div className="flex items-center gap-2">
             <Cpu size={14} className="text-cyan-500 animate-pulse" />
             <span className="text-[10px] font-black text-cyan-500/40 uppercase tracking-widest">Neural_Sync</span>
          </div>
        </div>

        {/* Input Interface with Leaderboard Theme */}
        {isLoggedIn && (
          <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-4 mb-10 backdrop-blur-xl shadow-2xl">
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-700 text-sm resize-none h-20 italic"
              placeholder="System.out.print('Broadcast your query...');"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {preview && (
              <div className="relative w-24 h-24 mb-4 rounded-xl overflow-hidden border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <img src={preview} className="w-full h-full object-cover" alt="preview" />
                <button onClick={() => setPreview("")} className="absolute top-1 right-1 bg-red-500 rounded-full p-0.5"><X size={10}/></button>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <label className="cursor-pointer text-slate-600 hover:text-cyan-400 p-2 transition-colors">
                <ImageIcon size={18}/>
                <input type="file" hidden accept="image/*" onChange={(e) => {
                  const reader = new FileReader();
                  reader.onloadend = () => setPreview(reader.result);
                  reader.readAsDataURL(e.target.files[0]);
                }} />
              </label>
              <button onClick={handleSubmit} className="bg-cyan-500 text-black px-5 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-white transition-all shadow-lg">
                EXECUTE <Send size={12}/>
              </button>
            </div>
          </div>
        )}

        {/* Main Stream */}
        <div className="space-y-10 flex flex-col">
          {loading ? (
            <><SkeletonPost /><SkeletonPost /></>
          ) : (
            <AnimatePresence>
              {posts.map((post) => {
                const isMe = currentUser?.id === post.user || currentUser?._id === post.user;
                const canDelete = isAdmin || isMe;
                const isExpanded = expandedPosts[post._id];
                const displayReplies = isExpanded ? post.replies : post.replies?.slice(0, 2);

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    key={post._id} 
                    className={`w-full p-5 rounded-[1.5rem] border transition-all duration-300 backdrop-blur-sm ${
                      isMe ? "bg-cyan-500/[0.02] border-cyan-500/20" : "bg-white/[0.01] border-white/5 hover:border-white/10"
                    }`}
                  >
                    {/* Entry Meta */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.profilePic || `https://api.dicebear.com/7.x/identicon/svg?seed=${post.username}`} 
                          className="w-8 h-8 rounded-lg object-cover border border-white/10 grayscale hover:grayscale-0 transition-all" 
                          alt="avatar" 
                        />
                        <div>
                          <h4 className="text-[11px] font-black text-white uppercase italic tracking-wider leading-none">{post.username || "NODE_USER"}</h4>
                          <p className="text-[7px] text-slate-600 font-bold uppercase tracking-tight mt-1">{new Date(post.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      {isLoggedIn && canDelete && (
                        <button onClick={() => handleDeletePost(post._id)} className="text-slate-800 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                      )}
                    </div>

                    <p className="text-[13px] text-slate-300 mb-4 leading-relaxed px-1 font-medium">{post.content}</p>
                    {post.image && <img src={post.image} className="rounded-xl border border-white/5 mb-4 max-h-80 w-full object-contain bg-black/20" alt="media" />}

                    {/* Metrics Styled like Leaderboard Stats */}
                    <div className="flex gap-4 mb-4 px-1">
                      <button onClick={() => handleLike(post._id)} className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 hover:text-rose-500 transition-colors uppercase tracking-widest">
                        <Heart size={14} className={post.likes?.includes(currentUser?.id || currentUser?._id) ? "fill-rose-500 text-rose-500" : ""} /> {post.likes?.length || 0}
                      </button>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 italic uppercase tracking-widest">
                        <MessageCircle size={14} /> {post.replies?.length || 0}_LOGS
                      </div>
                    </div>

                    {/* Replies Section */}
                    <div className="space-y-3 pt-4 border-t border-white/5">
                      {displayReplies?.map((reply) => {
                        const isReplyMe = currentUser?.id === reply.user || currentUser?._id === reply.user;
                        return (
                          <div key={reply._id} className={`flex gap-2 pl-2 ${isReplyMe ? "ml-4" : ""}`}>
                            <img src={reply.profilePic || `https://api.dicebear.com/7.x/identicon/svg?seed=${reply.username}`} className="w-5 h-5 rounded-md border border-white/10 object-cover flex-shrink-0 grayscale" alt="" />
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-cyan-500 uppercase italic leading-none">{reply.username}</span>
                                {isLoggedIn && (isAdmin || isReplyMe) && (
                                  <button onClick={() => handleDeleteReply(post._id, reply._id)} className="text-slate-800 hover:text-red-500"><Trash2 size={10}/></button>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{reply.content}</p>
                            </div>
                          </div>
                        );
                      })}

                      {post.replies?.length > 2 && (
                        <button onClick={() => toggleReplies(post._id)} className="text-[8px] font-black text-slate-700 hover:text-white uppercase tracking-widest pl-2 transition-colors">
                          {isExpanded ? "▲ CLOSE_LOGS" : `▼ VIEW_ALL_${post.replies.length}_LOGS`}
                        </button>
                      )}

                      {/* Response Input */}
                      {isLoggedIn && (
                        <div className="flex gap-2 mt-4 bg-white/[0.03] rounded-xl p-1 px-3 border border-white/5 focus-within:border-cyan-500/30 transition-all">
                          <input 
                            type="text" placeholder="RESPOND..." 
                            className="flex-1 bg-transparent border-none text-[11px] text-white focus:ring-0 outline-none h-8 font-bold tracking-wider"
                            value={replyText[post._id] || ""}
                            onChange={(e) => setReplyText({ ...replyText, [post._id]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(post._id)}
                          />
                          <button onClick={() => handleReplySubmit(post._id)} className="text-cyan-500 hover:text-white transition-colors active:scale-90"><Send size={14}/></button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
        
        {/* Footer Note */}
        <div className="mt-32 text-center opacity-10">
          <Activity size={20} className="mx-auto mb-4 text-white" />
          <p className="text-[9px] font-black tracking-[1em] uppercase">Archive_Secured // No_Unauthorized_Access</p>
        </div>
      </div>
    </div>
  );
};

export default Discussion;