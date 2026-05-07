import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Access Granted. Welcome back.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-container fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      {/* Decorative Orbs */}
      <div className="glow-orb" style={{ top: '10%', left: '10%', width: '300px', height: '300px' }}></div>
      <div className="glow-orb" style={{ bottom: '10%', right: '10%', width: '400px', height: '400px', opacity: 0.1 }}></div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="card" 
        style={{ width: '100%', maxWidth: '440px', padding: '3rem', position: 'relative', zIndex: 1, backdropFilter: 'blur(20px)', background: 'rgba(15, 23, 42, 0.6)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.div 
            initial={{ y: -10 }} 
            animate={{ y: 0 }} 
            style={{ width: '60px', height: '60px', background: 'rgba(99,102,241,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', border: '1px solid rgba(99,102,241,0.2)', color: 'var(--primary-color)' }}
          >
            <Lock size={30} />
          </motion.div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem', fontWeight: 800 }}>Welcome Back</h2>
          <p className="text-muted">Enter your credentials to access the matrix.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="text-muted" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Security Identity</label>
            <div className="input-with-icon">
              <Mail size={18} style={{ color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="input-field" 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ height: '52px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="text-muted" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Access Key</label>
            <div className="input-with-icon">
              <Lock size={18} style={{ color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="input-field" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ height: '52px' }}
              />
            </div>
            <div style={{ textAlign: 'right', marginTop: '0.75rem' }}>
              <Link to="#" className="text-primary" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Forgot Access Key?</Link>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem', height: '56px', fontSize: '1rem' }}>
            Initialize Session <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            New to the network? <Link to="/register" className="text-primary" style={{ fontWeight: 800 }}>Create an Origin</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
