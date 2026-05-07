import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Zap, Shield, Globe, ArrowRight, Star, Sparkles } from 'lucide-react';

const Landing = () => {
  return (
    <div className="fade-in" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Elements */}
      <div className="glow-orb" style={{ top: '-10%', left: '-5%', opacity: 0.2 }}></div>
      <div className="glow-orb" style={{ bottom: '10%', right: '-5%', background: 'radial-gradient(circle, var(--secondary-color) 0%, transparent 70%)', opacity: 0.15 }}></div>

      <div className="landing-hero">
        <motion.div 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <Sparkles size={14} className="text-secondary" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>The Future of Collaboration</span>
          </div>
          
          <h1>
            Connect. Build. <br />
            <span className="gradient-text">Succeed Together.</span>
          </h1>
          
          <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
            TalentSync is the ultimate skill-based collaboration platform. Match with the right teammates, join impactful projects, and build your professional portfolio with AI-powered precision.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <Link to="/register" className="btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
              Start Building <ArrowRight size={20} />
            </Link>
            <Link to="/projects" className="btn-secondary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
              Explore Projects
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 60, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 1, delay: 0.3 }} 
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '4rem', paddingBottom: '4rem' }}
      >
        {[
          { icon: Zap, title: "Smart Matching", desc: "Our AI-driven engine finds the perfect teammates based on skill overlap and project goals.", color: "var(--primary-color)" },
          { icon: Users, title: "Dropout Handling", desc: "Automatic suggestions to replace team members if someone leaves, keeping projects on track.", color: "var(--secondary-color)" },
          { icon: Globe, title: "Cross-State Network", desc: "Collaborate with talented individuals across different regions with seamless workflow tools.", color: "var(--accent-color)" },
          { icon: Shield, title: "Verified Skills", desc: "Built-in rating and review system ensures high-quality contributions and trust.", color: "var(--success-color)" }
        ].map((feature, i) => (
          <div key={i} className="card card-hover">
            <div style={{ 
              background: `rgba(${feature.color === 'var(--primary-color)' ? '99,102,241' : feature.color === 'var(--secondary-color)' ? '6,182,212' : '139,92,246'}, 0.15)`, 
              width: '56px', height: '56px', borderRadius: '14px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              color: feature.color, marginBottom: '1.5rem',
              border: `1px solid rgba(${feature.color === 'var(--primary-color)' ? '99,102,241' : '6,182,212'}, 0.2)`
            }}>
              <feature.icon size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{feature.title}</h3>
            <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Landing;
