import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Plus, X, Star, MapPin, Briefcase, Award, Trash2, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [proficiency, setProficiency] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const init = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchMyData(), fetchAllSkills()]);
      } catch (err) {
        console.error('Dashboard init failed:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchMyData = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data); setSkills(res.data.skills || []);
    } catch (err) { }
  };
  const fetchAllSkills = async () => {
    try {
      const res = await api.get('/skills'); setAllSkills(res.data);
    } catch (err) { }
  };

  const addSkill = async () => {
    if (!selectedSkill) return;
    try {
      await api.post('/users/me/skills', { skill_id: selectedSkill, proficiency });
      toast.success('Skill added to your profile'); fetchMyData();
      setSelectedSkill('');
    } catch (err) { toast.error('Failed to add skill'); }
  };
  const removeSkill = async (skillId) => {
    try {
      await api.delete(`/users/me/skills/${skillId}`);
      toast.success('Skill removed'); fetchMyData();
    } catch (err) { toast.error('Failed to remove skill'); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="text-secondary font-bold">Initializing your dashboard...</div>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">
          <LayoutDashboard className="text-primary" size={32} />
          Workspace
        </h1>
        <p className="text-muted">Manage your professional skills and profile visibility.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Profile Card */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="card" style={{ textAlign: 'center', position: 'sticky', top: '7rem' }}>
          <div className="avatar" style={{ width: '100px', height: '100px', fontSize: '2.5rem', margin: '0 auto 1.5rem auto' }}>
            {user?.name?.charAt(0)}
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{user?.name}</h2>
          <div className="text-muted flex-row justify-center text-sm mb-6" style={{ gap: '0.4rem' }}>
            <MapPin size={16} className="text-secondary" /> {user?.state || 'Global'}
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <Star size={24} fill="var(--warning-color)" color="var(--warning-color)" />
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>{user?.avg_rating || '5.0'}</span>
              </div>
              <p className="text-muted text-xs font-bold uppercase tracking-widest">Mastery Rating</p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Based on {user?.total_ratings || 0} collaborations
              </div>
          </div>
        </motion.div>

        {/* Skill Management Container */}
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Award className="text-secondary" /> Add New Competency
            </h3>
            
            <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ flex: 1 }}>
                <label className="text-xs font-bold text-muted uppercase mb-2 block">Select Skill</label>
                <select className="input-field" value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)}>
                  <option value="">Choose a skill...</option>
                  {allSkills.filter(s => !skills.find(my => my.id === s.id)).map(s => (
                    <option key={s.id} value={s.id}>{s.name} — {s.category}</option>
                  ))}
                </select>
              </div>
              <div style={{ width: '150px' }}>
                <label className="text-xs font-bold text-muted uppercase mb-2 block">Expertise</label>
                <select className="input-field" value={proficiency} onChange={e => setProficiency(Number(e.target.value))}>
                  {[1,2,3,4,5].map(v => <option key={v} value={v}>Level {v}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button onClick={addSkill} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
                  <Plus size={20}/> Add
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <AnimatePresence>
              {skills.map((skill, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={skill.id} 
                  className="card card-hover" 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 700 }}>{skill.name}</h4>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {[1,2,3,4,5].map(lvl => (
                        <div 
                          key={lvl} 
                          style={{ 
                            width: '24px', 
                            height: '6px', 
                            borderRadius: '10px', 
                            background: lvl <= skill.UserSkill?.proficiency 
                              ? 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))' 
                              : 'rgba(255,255,255,0.05)',
                            boxShadow: lvl <= skill.UserSkill?.proficiency ? '0 0 10px rgba(99, 102, 241, 0.3)' : 'none'
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => removeSkill(skill.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '0.6rem', borderRadius: '10px', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}>
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {skills.length === 0 && (
              <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.01)', borderStyle: 'dashed' }}>
                <Briefcase size={48} className="text-muted" style={{ margin: '0 auto 1.5rem auto', opacity: 0.5 }} />
                <h3 className="text-muted">Your skill list is currently empty</h3>
                <p className="text-muted text-sm">Add your expertise above to start matching with great projects.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
