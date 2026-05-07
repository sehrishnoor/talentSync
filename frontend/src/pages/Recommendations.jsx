import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Sparkles, Users, Award, Briefcase, Star, MapPin, Target, Zap, ChevronRight, UserPlus, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Recommendations = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [popular, setPopular] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const init = async () => {
      try {
        setLoading(true);
        await fetchRecommendations();
      } catch (err) {
        console.error('Recommendations init failed:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const [uRes, pRes, popRes] = await Promise.all([
        api.get('/recommendations/users'),
        api.get('/recommendations/projects'),
        api.get('/recommendations/popular')
      ]);
      setUsers(uRes.data); setProjects(pRes.data); setPopular(popRes.data);
      console.log('Recommendations Synchronized:', { users: uRes.data.length, projects: pRes.data.length });
    } catch(err) {
      console.error(' Data Retrieval Failure:', err);
    }
  };

  const handleConnect = async (recipientId) => {
    try {
      await api.post('/connections', { recipient_id: recipientId });
      toast.success('Connection sequence initialized.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signal failure');
    }
  };

  return (
    <div className="fade-in" style={{ position: 'relative' }}>
      {/* Background Decoration */}
      <div className="glow-orb" style={{ top: '20%', right: '10%' }}></div>

      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(99,102,241,0.1)', padding: '0.6rem 1.25rem', borderRadius: '100px', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '1.5rem' }}
        >
          <Zap size={16} className="text-primary" />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>AI-Powered Networking</span>
        </motion.div>
        <h1 className="page-title justify-center" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Intelligent <span className="gradient-text">Matches</span>
        </h1>
        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Our neural engine analyzes your skill graph to find the most compatible partners and high-impact projects.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem' }}>
        {[
          { id: 'users', label: 'Suggested Colleagues', icon: Users },
          { id: 'projects', label: 'Best Fit Projects', icon: Briefcase },
          { id: 'popular', label: 'Popular Experts', icon: Award }
        ].map(tab => (
          <button 
            key={tab.id}
            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              padding: '1rem 2rem', 
              fontSize: '1rem', 
              background: activeTab === tab.id ? 'rgba(99,102,241,0.1)' : 'transparent',
              border: '1px solid',
              borderColor: activeTab === tab.id ? 'rgba(99,102,241,0.3)' : 'transparent',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <tab.icon size={20} className={activeTab === tab.id ? 'text-primary' : 'text-muted'} />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <div className="text-secondary font-bold">Generating compatibility reports...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'users' && users.map((u, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i*0.05 }} 
                key={u.user.id} 
                className="card card-hover"
                style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                  <div className="badge badge-success" style={{ padding: '0.25rem 0.6rem' }}>
                    {u.score}% Match
                  </div>
                </div>
                
                <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', margin: '1rem auto 1.5rem auto', border: '2px solid var(--border-color)' }}>
                  {u.user.name.charAt(0)}
                </div>
                
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{u.user.name}</h3>
                <p className="text-muted text-sm flex-row justify-center" style={{ gap: '0.4rem', marginBottom: '1.5rem' }}>
                  <MapPin size={14} className="text-secondary" /> {u.user.state}
                </p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
                   {u.user.skills.slice(0, 3).map((s) => (
                     <span key={s.id} className="skill-tag" style={{ fontSize: '0.7rem' }}>{s.name}</span>
                   ))}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Star size={18} fill="var(--warning-color)" color="var(--warning-color)" />
                    <span style={{ fontWeight: 800 }}>{u.user.avg_rating || '5.0'}</span>
                  </div>
                  
                  {u.user.connectionStatus === 'accepted' ? (
                    <div className="flex-row text-success" style={{ gap: '0.4rem', fontWeight: 800, fontSize: '0.8rem' }}>
                       <UserCheck size={16} /> Connected
                    </div>
                  ) : u.user.connectionStatus === 'pending' ? (
                    <div className="flex-row text-warning" style={{ gap: '0.4rem', fontWeight: 800, fontSize: '0.8rem' }}>
                       <Zap size={16} className="pulse" /> Pending
                    </div>
                  ) : (
                    <button onClick={() => handleConnect(u.user.id)} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }}>
                      Connect <UserPlus size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {activeTab === 'projects' && projects.map((p, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i*0.05 }} 
                key={p.project.id} 
                className="card card-hover"
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                   <h3 style={{ fontSize: '1.3rem', flex: 1, paddingRight: '1rem' }}>{p.project.title}</h3>
                   <div style={{ 
                      background: 'rgba(99,102,241,0.1)', 
                      padding: '0.5rem', 
                      borderRadius: '10px', 
                      color: 'var(--primary-color)',
                      border: '1px solid rgba(99,102,241,0.2)'
                    }}>
                    <Target size={20} />
                   </div>
                </div>
                
                <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '2rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                  {p.project.description}
                </p>
                
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      <span className="text-muted">Compatibility</span>
                      <span className="text-primary">{p.match_pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${p.match_pct}%` }} 
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))', boxShadow: '0 0 10px rgba(99,102,241,0.5)' }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p className="text-muted" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Founder</p>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{p.project.leader.name}</p>
                    </div>
                    <Link to={`/projects/${p.project.id}`} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      Details <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}

            {activeTab === 'popular' && popular.map((u, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i*0.05 }} 
                key={u.id} 
                className="card card-hover"
                style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}
              >
                <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '1.5rem', background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', color: '#fff', border: 'none' }}>
                  {u.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{u.name}</h3>
                  <p className="text-muted text-xs flex-row" style={{ gap: '0.3rem' }}>
                    <MapPin size={12} className="text-secondary" /> {u.state || 'Network'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.4rem', color: 'var(--warning-color)', fontWeight: 800, marginBottom: '0.5rem' }}>
                    <Star size={16} fill="var(--warning-color)" /> {u.avg_rating}
                  </div>
                  
                  {u.connectionStatus === 'accepted' ? (
                     <div className="text-success" style={{ fontWeight: 800, fontSize: '0.65rem' }}>CONNECTED</div>
                  ) : u.connectionStatus === 'pending' ? (
                     <div className="text-warning" style={{ fontWeight: 800, fontSize: '0.65rem' }}>PENDING</div>
                  ) : (
                    <button onClick={() => handleConnect(u.id)} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>
                      <UserPlus size={12} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
