import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { Star, MapPin, Award, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const { id } = useParams(); // Grabs the ID from /profile/:id
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Important: Fetching the specific user by ID
        const res = await api.get(`/auth/${id}`); 
        setProfile(res.data);
      } catch (err) {
        console.error("Profile load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Decrypting Identity...</div>;
  if (!profile) return <div className="p-10 text-center">User not found.</div>;

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '3rem', background: 'rgba(15,23,42,0.6)', borderRadius: '24px' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div className="avatar" style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
            {profile.name.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{profile.name}</h1>
            <div className="flex-row text-muted" style={{ gap: '1rem', marginTop: '0.5rem' }}>
              <span className="flex-row"><MapPin size={16} /> {profile.state || 'Remote'}</span>
              <span className="flex-row"><Star size={16} color="var(--warning-color)" /> {profile.avg_rating || '5.0'}</span>
            </div>
          </div>
        </div>

        <hr style={{ margin: '2rem 0', opacity: 0.1 }} />

        <h3 className="text-muted" style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '1.5rem' }}>Verified Technical Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {profile.skills?.map(s => (
            <div key={s.id} className="skill-tag" style={{ padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontWeight: 700 }}>{s.name}</span>
              <span style={{ marginLeft: '0.5rem', color: 'var(--primary-color)' }}>Lvl {s.UserSkill?.proficiency || 3}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
