import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Code, Users, MapPin, Search, Filter, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const init = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchProjects(), fetchSkills()]);
      } catch (err) {
        console.error('Projects init failed:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [skillFilter]);

  const fetchProjects = async () => {
    try {
      const url = skillFilter ? `/projects?skill=${skillFilter}` : '/projects';
      const res = await api.get(url); setProjects(res.data.projects);
    } catch (err) {}
  };
  const fetchSkills = async () => {
    try { const res = await api.get('/skills'); setSkills(res.data); } catch (err) {}
  };

  const filtered = projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 className="page-title">
            <Sparkles className="text-secondary" size={32} />
            Explore Projects
          </h1>
          <p className="text-muted">Discover open opportunities and join cutting-edge teams.</p>
        </div>
        <Link to="/create-project" className="btn-primary">
          <Code size={20} /> Create Project
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '3rem', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)' }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={20} style={{ position: 'absolute', left: '1.25rem', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="input-field" 
            style={{ border: 'none', background: 'transparent', paddingLeft: '3.5rem', boxShadow: 'none' }} 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
        <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingRight: '1rem' }}>
          <Filter size={18} className="text-muted" />
          <select 
            className="input-field" 
            style={{ border: 'none', background: 'transparent', width: '220px', fontWeight: 600, boxShadow: 'none' }} 
            value={skillFilter} 
            onChange={e => setSkillFilter(e.target.value)}
          >
            <option value="">All Skills</option>
            {skills.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
           <div className="text-secondary font-bold">Scanning the network for opportunities...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          <AnimatePresence>
            {filtered.map((p, i) => (
              <motion.div 
                layout
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: i * 0.05 }} 
                key={p.id} 
                className="card card-hover" 
                style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              >
                <div style={{ padding: '1.75rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', lineHeight: '1.4' }}>{p.title}</h3>
                    <span className={`badge ${p.status === 'open' ? 'badge-success' : 'badge-warning'}`}>
                      {p.status}
                    </span>
                  </div>
                  
                  <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>
                    {p.description || 'No description provided.'}
                  </p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {p.required_skills?.slice(0,3).map((s) => (
                      <span key={s.id} className="skill-tag" style={{ border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem' }}>
                        {s.name}
                      </span>
                    ))}
                    {p.required_skills?.length > 3 && (
                      <span className="skill-tag" style={{ border: 'none', background: 'transparent' }}>
                        +{p.required_skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem 1.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                      <Users size={14} className="text-primary" /> {p.team_members?.length || 1} / {p.max_members}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                      <MapPin size={14} /> {p.state || 'Local'}
                    </span>
                  </div>
                  <Link to={`/projects/${p.id}`} className="btn-secondary" style={{ width: '100%', padding: '0.7rem', fontSize: '0.85rem' }}>
                    View & Apply <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filtered.length === 0 && (
          <div className="card" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
             <Search size={48} className="text-muted" style={{ margin: '0 auto 1.5rem auto', opacity: 0.3 }} />
             <h2 style={{ marginBottom: '0.5rem' }}>No projects match your search</h2>
             <p className="text-muted">Try adjusting your filters or checking back later for new opportunities.</p>
          </div>
      )}
    </div>
  );
};

export default Projects;
