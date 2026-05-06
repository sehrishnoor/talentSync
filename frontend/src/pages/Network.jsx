import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Users, UserCheck, UserPlus, X, Check, Globe, Zap, MessageSquare, Star, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Network = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [unreadStats, setUnreadStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNetwork();
  }, []);

  const fetchNetwork = async () => {
    try {
      setLoading(true);
      const [connRes, pendRes, statsRes] = await Promise.all([
        api.get('/connections'),
        api.get('/connections/pending'),
        api.get('/messages/unread/stats')
      ]);
      setConnections(connRes.data);
      setPendingRequests(pendRes.data);
      setUnreadStats(statsRes.data);
    } catch (err) {
      toast.error('Failed to sync network data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/connections/${id}/status`, { status });
      toast.success(status === 'accepted' ? 'Connection established' : 'Request declined');
      fetchNetwork();
    } catch (err) {
      toast.error('Protocol failure');
    }
  };

  if (loading) return (
     <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
           <Globe size={40} className="text-primary" />
        </motion.div>
        <p className="text-muted mt-4 uppercase tracking-widest text-xs font-bold">Scanning Global Network...</p>
     </div>
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Professional <span className="gradient-text">Network</span></h1>
        <p className="text-muted">Manage your collaborative nodes and incoming connection signals.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem', alignItems: 'start' }}>
        
        {/* Main Connections Area */}
        <section>
          <div className="flex-row" style={{ gap: '0.75rem', marginBottom: '2rem' }}>
            <Users size={20} className="text-primary" />
            <h2 style={{ fontSize: '1.25rem' }}>Established Connections</h2>
            <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>{connections.length} Nodes</span>
          </div>

          {connections.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)' }}>
              <Users size={48} className="text-muted mb-4" style={{ opacity: 0.2 }} />
              <p className="text-muted">No established connections found in the matrix.</p>
              <p className="text-xs text-muted mt-2">Initialize connections from the Matches explorer.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {connections.map((conn) => {
                const partner = conn.requester.id === user?.id ? conn.recipient : conn.requester;
                const stats = unreadStats.find(s => s.connection_id === conn.id);
                const unreadCount = stats ? stats.unread_count : 0;
                
                return (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={conn.id} className="card card-hover" style={{ padding: '2rem' }}>
                    <div className="flex-row" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
                      <div className="avatar" style={{ width: '56px', height: '56px', fontSize: '1.2rem' }}>
                        {partner.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{partner.name}</h4>
                        <p className="text-muted text-xs uppercase tracking-widest font-bold">{partner.state || 'Global'}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="flex-row" style={{ gap: '0.25rem', color: 'var(--warning-color)', fontWeight: 800, fontSize: '0.9rem' }}>
                          <Star size={14} fill="var(--warning-color)" /> {partner.avg_rating || '5.0'}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                        {partner.skills?.slice(0, 3).map(s => (
                           <span key={s.id} className="skill-tag" style={{ fontSize: '0.65rem' }}>{s.name}</span>
                        ))}
                    </div>

                    <button onClick={() => navigate(`/chat/${conn.id}`)} className="btn-primary" style={{ width: '100%', gap: '0.6rem', height: '48px', fontSize: '0.9rem', position: 'relative' }}>
                      <MessageSquare size={18} /> Open Channel
                      {unreadCount > 0 && (
                        <span style={{ 
                          position: 'absolute', top: '-8px', right: '-8px', 
                          background: 'var(--danger-color)', color: '#fff', 
                          fontSize: '0.7rem', fontWeight: 800, padding: '4px 8px', 
                          borderRadius: '12px', boxShadow: '0 0 10px rgba(239,68,68,0.5)',
                          display: 'flex', alignItems: 'center', gap: '4px'
                        }}>
                          <Bell size={12} fill="#fff" /> {unreadCount}
                        </span>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Pending Requests Sidebar */}
        <aside>
          <div className="flex-row" style={{ gap: '0.75rem', marginBottom: '2rem' }}>
            <Zap size={20} className="text-warning" />
            <h2 style={{ fontSize: '1.25rem' }}>Pending Signals</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingRequests.length === 0 ? (
              <p className="text-muted text-sm italic">No incoming signals detected.</p>
            ) : (
              pendingRequests.map((req) => (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={req.id} className="card" style={{ padding: '1.25rem', borderColor: 'var(--primary-color)', background: 'rgba(99,102,241,0.03)' }}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{req.requester.name}</p>
                    <p className="text-muted text-xs">{req.requester.state}</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <button onClick={() => handleStatusUpdate(req.id, 'accepted')} className="btn-primary" style={{ padding: '0.5rem', fontSize: '0.8rem' }}>
                      <Check size={14} /> Accept
                    </button>
                    <button onClick={() => handleStatusUpdate(req.id, 'rejected')} className="btn-secondary" style={{ padding: '0.5rem', fontSize: '0.8rem', color: 'var(--danger-color)' }}>
                      <X size={14} /> Decline
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Network;
