import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { Activity, TrendingUp, Users, Target, Award, PieChart as PieIcon, BarChart3, Star, Zap, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#6366F1', '#06B6D4', '#8B5CF6', '#10B981', '#F59E0B'];

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const init = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/dashboard'); 
        setStats(res.data); 
      } catch (err) {
        console.error('Analytics init failed:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // FOOLPROOF EARLY RETURN
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '1.5rem' }}>
       <motion.div 
         animate={{ rotate: 360 }} 
         transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
         style={{ color: 'var(--primary-color)' }}
       >
         <Activity size={48} />
       </motion.div>
       <div className="text-secondary font-bold text-lg">Aggregating Global Metrics...</div>
    </div>
  );

  if (!stats) return (
    <div style={{ textAlign: 'center', padding: '5rem' }}>
      <p className="text-muted">Unable to synchronize with the analytics core. Check network connectivity.</p>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}
          >
            <Zap size={16} fill="var(--primary-color)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Live Platform Metrics</span>
          </motion.div>
          <h1 className="page-title">
            <BarChart3 className="text-secondary" /> 
            Platform Analytics
          </h1>
          <p className="text-muted">Real-time collaboration graph and performance indicators.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="card" style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, border: '1px solid rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.05)', color: 'var(--success-color)', textTransform: 'uppercase' }}>
                Node Status: Online
            </div>
        </div>
      </div>

      {/* Executive Stats Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Talent Pool', val: stats.totalUsers, icon: Users, color: 'var(--primary-color)' },
          { label: 'Active Matrix', val: stats.totalProjects, icon: Target, color: 'var(--secondary-color)' },
          { label: 'Skill Nodes', val: stats.totalSkills, icon: TrendingUp, color: 'var(--accent-color)' },
          { label: 'Network Health', val: '98.2%', icon: Activity, color: 'var(--success-color)' },
        ].map((s,i) => (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i*0.1 }} key={i} className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', borderRadius: '16px', background: `rgba(${s.color==='var(--primary-color)'?'99,102,241':s.color==='var(--secondary-color)'?'6,182,212':'139,92,246'}, 0.1)`, border: '1px solid rgba(255,255,255,0.05)', color: s.color }}>
              <s.icon size={28} />
            </div>
            <div>
              <p className="text-muted font-bold text-xs uppercase tracking-widest">{s.label}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.val}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Horizontal Bar Chart */}
        <div className="card" style={{ height: '450px', background: 'rgba(15,23,42,0.4)', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <BarChart3 size={20} className="text-primary" />
            <h3 style={{ fontSize: '1.25rem' }}>High-Demand Skillsets</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stats.topSkills} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="Skill.name" 
                type="category" 
                stroke="#94a3b8" 
                width={110} 
                tick={{fill: '#f8fafc', fontSize: 12, fontWeight: 600}}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.03)'}} 
                contentStyle={{backgroundColor: '#0f172a', border: '1px solid var(--border-color)', borderRadius: '12px', color: '#fff'}}
                itemStyle={{color: 'var(--primary-color)', fontWeight: 800}}
              />
              <Bar dataKey="user_count" fill="var(--primary-color)" radius={[0, 6, 6, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card" style={{ height: '450px', background: 'rgba(15,23,42,0.4)', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <PieIcon size={20} className="text-secondary" />
            <h3 style={{ fontSize: '1.25rem' }}>Regional Collaboration Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie 
                data={stats.stateCollab} 
                dataKey="user_count" 
                nameKey="state" 
                cx="50%" 
                cy="50%" 
                innerRadius={80}
                outerRadius={130} 
                paddingAngle={5}
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {stats.stateCollab.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid var(--border-color)', borderRadius: '12px', color: '#fff'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Award size={24} className="text-warning" />
            <h3 style={{ fontSize: '1.5rem' }}>Top Performance Leaderboard</h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {stats.topUsers.map((u, i) => (
            <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i*0.1 }}
                key={u.id} 
                className="card card-hover" 
                style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: `4px solid ${COLORS[i % COLORS.length]}` }}
            >
              <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '1.5rem', background: 'var(--surface-light)', border: '1px solid rgba(255,255,255,0.05)' }}>
                {u.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.2rem' }}>{u.name}</h4>
                <p className="text-xs text-muted flex-row" style={{ gap: '0.3rem' }}><MapPin size={12} className="text-secondary" /> {u.state}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--warning-color)', fontWeight: 800, fontSize: '1.25rem' }}>
                    <Star size={18} fill="var(--warning-color)" /> {u.avg_rating}
                </div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>{u.total_ratings} Feedbacks</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Analytics;
