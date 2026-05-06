import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Users, UserMinus, ShieldAlert, Star, MapPin, Target, Calendar, CheckCircle2, ChevronLeft, UserCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [replacements, setReplacements] = useState([]);
  const [isLeader, setIsLeader] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const init = async () => {
       try {
         setLoading(true);
         const res = await api.get(`/projects/${id}`); 
         setProject(res.data); 
         setIsLeader(res.data.leader_id === user?.id);
       } catch(err) {
         console.error('Project loading failed:', err);
       } finally {
         setLoading(false);
       }
    };
    init();
  }, [id, user?.id]);

  const applyToProject = async () => {
    try { 
      await api.post(`/projects/${id}/apply`); 
      toast.success('Sequence Initiated. Application transmitted.'); 
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Interface error during application'); 
    }
  };

  const updateStatus = async (memberId, status) => {
    try { 
      await api.patch(`/projects/members/${memberId}/status`, { status }); 
      toast.success(`Access level updated to ${status}`); 
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {}
  };

  const handleDropout = async (memberUser, teamMemberId) => {
    const reason = prompt("Enter official reason for dropout:");
    if(!reason) return;
    try {
      const res = await api.post(`/dropouts`, { project_id: id, user_id: memberUser.id, reason });
      toast.error(`${memberUser.name} has been disconnected.`); 
      setReplacements(res.data.replacements); 
      const pRes = await api.get(`/projects/${id}`);
      setProject(pRes.data);
    } catch(err) { 
      toast.error('Logging failure during dropout sequence'); 
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '1rem' }}>
       <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ShieldAlert size={48} className="text-secondary" />
       </motion.div>
       <div className="text-muted font-bold text-lg uppercase tracking-widest">Decrypting Mission Data...</div>
    </div>
  );

  if (!project) return (
    <div style={{ textAlign: 'center', padding: '5rem' }}>
      <h2 className="text-muted">Target Project Not Found</h2>
      <Link to="/projects" className="btn-secondary mt-8">Return to Explorer</Link>
    </div>
  );

  const isMember = project.team_members?.find(m => m.user_id === user?.id);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <Link to="/projects" className="text-primary flex-row" style={{ gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
          <ChevronLeft size={16} /> DATA EXPLORER / MISSION LOG
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '3rem', alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div className="card" style={{ padding: '3.5rem', background: 'rgba(15,23,42,0.6)', border: '1px solid var(--border-color)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
            <div className="glow-orb" style={{ top: '-10%', right: '-10%', width: '200px', height: '200px', opacity: 0.1 }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
              <div>
                <motion.div 
                  initial={{ x: -10, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}
                >
                  <Target size={18} /> Operation Mission Log
                </motion.div>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.04em', fontWeight: 800 }}>{project.title}</h1>
                <p className="text-muted text-lg" style={{ maxWidth: '600px', lineHeight: 1.6 }}>{project.description}</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                <span className={`badge ${project.status === 'open' ? 'badge-success' : 'badge-warning'}`} style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>
                  {project.status === 'open' ? 'Active Matrix' : 'Secured'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
               {[
                  { label: 'Personnel', val: `${project.team_members?.length} / ${project.max_members}`, icon: Users, color: 'var(--primary-color)' },
                  { label: 'Deployment', val: project.state || 'Cloud', icon: MapPin, color: 'var(--secondary-color)' },
                  { label: 'Timeline', val: new Date(project.created_at).toLocaleDateString(), icon: Calendar, color: 'var(--success-color)' }
               ].map((s,i) => (
                 <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <p className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{s.label}</p>
                    <div className="flex-row" style={{ gap: '0.75rem' }}>
                       <s.icon size={18} style={{ color: s.color }} />
                       <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{s.val}</span>
                    </div>
                 </div>
               ))}
            </div>

            <div>
              <h4 className="text-muted" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>Required Tech Stack</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {project.required_skills?.map(s => (
                  <span key={s.id} className="skill-tag" style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 600 }}>{s.name}</span>
                ))}
              </div>
            </div>
          </div>
<section>
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
    <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary-color)' }}>
      <Users size={24} />
    </div>
    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Team Roster</h2>
    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--border-color), transparent)', marginLeft: '1rem' }}></div>
  </div>

  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
    {project.team_members?.map((m, i) => (
      /* 1. Wrap the card in a Link to the user profile */
      <Link 
        to={`/profile/${m.member.id}`} 
        key={m.id} 
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: i*0.05 }}
          className="card card-hover" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem', 
            padding: '1.75rem', 
            cursor: 'pointer',
            border: m.user_id === project.leader_id ? '1px solid var(--accent-light)' : '1px solid var(--border-color)' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="avatar" style={{ width: '64px', height: '64px', fontSize: '1.5rem', border: '2px solid rgba(255,255,255,0.05)' }}>
              {m.member.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem' }}>{m.member.name}</h4>
              {m.user_id === project.leader_id ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-color)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <ShieldAlert size={12} /> Mission Director
                </div>
              ) : (
                /* Use m.status to dynamically handle 'active', 'pending', and 'dropped' badges */
                <span className={`badge ${m.status === 'active' ? 'badge-success' : m.status === 'dropped' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.55rem', padding: '0.2rem 0.6rem', textTransform: 'uppercase' }}>
                  {m.status}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
            <div className="flex-row" style={{ gap: '0.4rem', color: 'var(--warning-color)', fontWeight: 800 }}>
              <Star size={16} fill="var(--warning-color)" /> {m.member.avg_rating || '5.0'}
            </div>

            {isLeader && m.user_id !== user?.id && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {m.status === 'pending' && (
                  /* 2. Added e.preventDefault() to stop the Link from triggering when clicking buttons */
                  <button 
                    onClick={(e) => { e.preventDefault(); updateStatus(m.id, 'active'); }} 
                    className="btn-secondary" 
                    style={{ padding: '0.5rem', borderRadius: '10px', color: 'var(--success-color)' }}
                  >
                    <UserCheck size={20} />
                  </button>
                )}
                {m.status === 'active' && project.status !== 'completed' && (
                  <button 
                    onClick={(e) => { e.preventDefault(); handleDropout(m.member, m.id); }} 
                    className="btn-secondary" 
                    style={{ padding: '0.5rem', borderRadius: '10px', color: 'var(--danger-color)' }}
                  >
                    <UserMinus size={20} />
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    ))}
  </div>
</section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '7rem' }}>
          <div className="card" style={{ padding: '2rem', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}>
            <h4 className="text-muted" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>Leadership</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
               <div className="avatar" style={{ width: '48px', height: '48px', background: 'var(--primary-color)' }}>{project.leader?.name.charAt(0)}</div>
               <div>
                  <p style={{ fontWeight: 800 }}>{project.leader?.name}</p>
                  <p className="text-muted text-xs">Origin Sector: {project.leader?.state || 'Unknown'}</p>
               </div>
            </div>
            
            {user && !isLeader && !isMember && project.status === 'open' && (
              <button onClick={applyToProject} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
                <Zap size={18} /> Apply for Slot
              </button>
            )}
            
            {isMember && !isLeader && (
               <div className="text-success flex-row justify-center" style={{ gap: '0.5rem', fontWeight: 800 }}>
                  <CheckCircle2 size={20} /> Verified Personnel
               </div>
            )}
          </div>

          <AnimatePresence>
            {replacements.length > 0 && (
              <motion.div 
                initial={{ x: 20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }}
                className="card" 
                style={{ borderColor: 'var(--warning-color)', background: 'rgba(245, 158, 11, 0.05)', padding: '1.75rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--warning-color)', marginBottom: '1.25rem' }}>
                   <ShieldAlert size={20}/> 
                   <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Replacement Logic</h4>
                </div>
                <p className="text-muted text-xs mb-6" style={{ lineHeight: 1.5 }}>Operational capacity threatened by dropout. Suggested skill-matched nodes:</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {replacements.map(({user: u, match_score}) => (
                    <div key={u.id} className="flex-row justify-between" style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div>
                        <p className="font-bold text-sm">{u.name}</p>
                        <p className="text-muted" style={{ fontSize: '10px', color: 'var(--warning-color)' }}>Rating: {u.avg_rating}★</p>
                      </div>
                      <div className="text-right">
                        <p className="text-success font-bold" style={{ fontSize: '1.1rem' }}>{match_score}%</p>
                        <p className="text-muted" style={{ fontSize: '9px', fontWeight: 800 }}>SYNERGY</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

      </div>
    </div>
    </div>
  );
};

export default ProjectDetail;
