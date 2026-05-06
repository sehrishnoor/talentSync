import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, User as UserIcon, MapPin, UserPlus, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const states = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Islamabad Capital Territory', 'Gilgit-Baltistan', 'Azad Jammu & Kashmir'];

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', state: '' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success('Origin Created. Welcome to TalentSync.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: '2rem 0' }}>
      {/* Decorative Orbs */}
      <div className="glow-orb" style={{ top: '5%', right: '5%', width: '400px', height: '400px', opacity: 0.15 }}></div>
      <div className="glow-orb" style={{ bottom: '5%', left: '5%', width: '300px', height: '300px', opacity: 0.1 }}></div>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="card" 
        style={{ width: '100%', maxWidth: '650px', padding: '3.5rem', position: 'relative', zIndex: 1, backdropFilter: 'blur(20px)', background: 'rgba(15, 23, 42, 0.6)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.1)', padding: '0.4rem 0.8rem', borderRadius: '100px', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--success-color)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            <Sparkles size={12} /> Join the network
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>Create <span className="gradient-text">Identity</span></h2>
          <p className="text-muted">Establish your professional node in the global talent matrix.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="text-muted" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Full Name</label>
              <div className="input-with-icon">
                <UserIcon size={18} style={{ color: 'var(--text-muted)' }} />
                <input type="text" name="name" className="input-field" placeholder="Display Name" onChange={handleChange} required style={{ height: '52px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="text-muted" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Email Endpoint</label>
              <div className="input-with-icon">
                <Mail size={18} style={{ color: 'var(--text-muted)' }} />
                <input type="email" name="email" className="input-field" placeholder="Primary Email" onChange={handleChange} required style={{ height: '52px' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             <div className="form-group">
              <label className="text-muted" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Access Key</label>
              <div className="input-with-icon">
                <Lock size={18} style={{ color: 'var(--text-muted)' }} />
                <input type="password" name="password" className="input-field" placeholder="Secure Password" onChange={handleChange} required style={{ height: '52px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="text-muted" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Regional Sector</label>
              <div className="input-with-icon">
                <MapPin size={18} style={{ color: 'var(--text-muted)' }} />
                <select name="state" className="input-field" onChange={handleChange} required defaultValue="" style={{ height: '52px' }}>
                  <option value="" disabled>Select Location</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem', height: '60px', fontSize: '1.1rem' }}>
            Create Account <UserPlus size={20} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Already initialized? <Link to="/login" className="text-primary" style={{ fontWeight: 800 }}>Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
