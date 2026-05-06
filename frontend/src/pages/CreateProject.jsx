import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FolderPlus, Tags, MapPin } from 'lucide-react';

const CreateProject = () => {
  const [formData, setFormData] = useState({ title: '', description: '', state: '', max_members: 5 });
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try { const res = await api.get('/skills'); setAllSkills(res.data); } catch (err) {}
    };
    fetchSkills();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const toggleSkill = (skillId) => {
    setSelectedSkills(prev => prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSkills.length === 0) return toast.error("Please select at least one required skill.");
    try {
      const res = await api.post('/projects', { ...formData, skill_ids: selectedSkills });
      toast.success('Project created successfully!');
      navigate(`/projects/${res.data.id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Error creating project'); }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card">
        <h1 className="page-title" style={{ marginBottom: '2rem' }}><FolderPlus /> Construct New Project</h1>

        <form onSubmit={handleSubmit} className="flex-col">
          <div className="input-group">
            <label className="input-label">Project Title</label>
            <input type="text" name="title" className="input-field" placeholder="E.g., AI-Powered Builder" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label className="input-label">Description & Goals</label>
            <textarea name="description" className="input-field" style={{ minHeight: '120px', resize: 'vertical' }} placeholder="Explain what the project is about..." onChange={handleChange} required></textarea>
          </div>

          <div className="grid-cols-2">
            <div className="input-group">
              <label className="input-label flex-row" style={{ gap: '0.25rem' }}><MapPin size={16}/> Target State (Leave blank for remote)</label>
              <input type="text" name="state" className="input-field" placeholder="E.g., Karnataka" onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">Team Size Limit</label>
              <input type="number" name="max_members" min="1" max="20" className="input-field" value={formData.max_members} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label flex-row" style={{ gap: '0.25rem' }}><Tags size={16}/> Required Skills</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '1rem', background: 'var(--surface-light)', borderRadius: '10px', border: '1px solid var(--border-light)', maxHeight: '250px', overflowY: 'auto' }}>
              {allSkills.map(s => (
                <button type="button" key={s.id} onClick={() => toggleSkill(s.id)}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.875rem', fontWeight: 500, border: '1px solid', transition: 'all 0.2s',
                    background: selectedSkills.includes(s.id) ? 'var(--primary-color)' : 'var(--surface-color)',
                    color: selectedSkills.includes(s.id) ? '#fff' : 'var(--text-muted)',
                    borderColor: selectedSkills.includes(s.id) ? 'var(--primary-color)' : 'var(--border-light)'
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-row justify-between" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => navigate('/projects')} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Launch Project</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateProject;
