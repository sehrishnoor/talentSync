import React, { useContext, useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Layers, LogOut, Code, Users, BarChart2, Bell, Settings, Globe } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const isActive = (path) => location.pathname === path;

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const res = await api.get('/messages/unread/count');
        setUnreadCount(res.data.count);
      } catch (err) {}
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <nav className="navbar">
      <Link to={user ? "/dashboard" : "/"} className="nav-brand">
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', 
          padding: '0.6rem', 
          borderRadius: '12px', 
          color: '#fff',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Layers size={22} />
        </div>
        <span className="gradient-text" style={{ fontSize: '1.6rem' }}>TalentSync</span>
      </Link>
      
      <div className="nav-links">
        {user ? (
          <>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>
                <Code size={18} /> <span>Projects</span>
              </Link>
              <Link to="/recommendations" className={`nav-link ${isActive('/recommendations') ? 'active' : ''}`}>
                <Users size={18} /> <span>Matches</span>
              </Link>
              <Link to="/analytics" className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}>
                <BarChart2 size={18} /> <span>Reports</span>
              </Link>
              <Link to="/network" className={`nav-link ${isActive('/network') ? 'active' : ''}`}>
                <Globe size={18} /> <span>Network</span>
              </Link>
            </div>
            
            <div className="nav-divider"></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="nav-link" style={{ padding: '0.5rem', position: 'relative' }} onClick={() => navigate('/network')}>
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{ 
                    position: 'absolute', top: '0px', right: '0px', 
                    background: 'var(--danger-color)', color: '#fff', 
                    fontSize: '0.6rem', fontWeight: 800, padding: '2px 5px', 
                    borderRadius: '10px', boxShadow: '0 0 10px rgba(239,68,68,0.5)'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              <div className="avatar" title={user.name}>
                {user.name.charAt(0)}
              </div>
              <button onClick={handleLogout} className="nav-link" style={{ padding: '0.5rem', color: 'var(--danger-color)' }}>
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems:'center' }}>
            <Link to="/login" className="nav-link">Log in</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '0.7rem 1.5rem', borderRadius: '10px' }}>
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
