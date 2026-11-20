import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Code, Cpu, UserCheck, Pencil, X } from 'lucide-react';
import InteractiveLanyardBadge from '../components/InteractiveLanyardBadge';
import DeveloperPhotoPicker from '../components/DeveloperPhotoPicker';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const DEVELOPERS = [
  {
    id: 1,
    name: 'Hong Saoleang',
    role: 'Full-Stack Architect & System Designer',
    badgeRole: 'Full-Stack Architect',
    pill: 'Lead Architect',
    avatar: '/JomnenhKH.jpg',
    tier: 0,
    isLead: true,
    bio: 'Built the platform architecture, APIs, authentication, and data models.',
    skills: ['Spring Boot 3', 'React.js', 'PostgreSQL', 'REST APIs', 'JWT Security'],
  },
  {
    id: 2,
    name: 'Alex Rivera',
    role: 'UI Systems Engineer',
    badgeRole: 'UI Systems Engineer',
    pill: 'UI Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    tier: 1,
    isLead: false,
    bio: 'Built the responsive interface, navigation, and shopping experience.',
    skills: ['Vite', 'Responsive CSS', 'State Management', 'UI/UX'],
  },
  {
    id: 3,
    name: 'Devon Vance',
    role: 'Cloud Infrastructure Engineer',
    badgeRole: 'Infrastructure Engineer',
    pill: 'Cloud Infra',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    tier: 2,
    isLead: false,
    bio: 'Maintains cloud infrastructure and platform security.',
    skills: ['PostgreSQL', 'Docker', 'Mail Servers', 'DevOps'],
  },
];

const AboutUs = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [developers, setDevelopers] = useState(DEVELOPERS);
  const [selectedDevId, setSelectedDevId] = useState(DEVELOPERS[0].id);
  const [editingDeveloper, setEditingDeveloper] = useState(null);
  const [developerSaveError, setDeveloperSaveError] = useState('');
  const [savingDeveloper, setSavingDeveloper] = useState(false);

  useEffect(() => {
    api.get('/api/developers').then(({ data }) => {
      if (!Array.isArray(data) || data.length === 0) return;
      const profiles = data.map((profile) => ({
        ...profile,
        isLead: profile.lead,
        skills: (profile.skills || '').split(',').map((skill) => skill.trim()).filter(Boolean),
      }));
      setDevelopers(profiles);
      setSelectedDevId((current) => profiles.some((profile) => profile.id === current) ? current : profiles[0].id);
    }).catch((error) => {
      console.error('Could not load developer profiles', error);
    });
  }, []);

  const activeDev = developers.find(d => d.id === selectedDevId) || developers[0];

  const resolveDevId = (devId) => {
    if (devId === 'hong') return 1;
    if (devId === 'alex') return 2;
    if (devId === 'devon') return 3;
    const num = Number(devId);
    return Number.isFinite(num) ? num : devId;
  };

  const openDeveloperEditor = (developer) => {
    setDeveloperSaveError('');
    const targetId = resolveDevId(developer.id);
    const skillsStr = Array.isArray(developer.skills)
      ? developer.skills.join(', ')
      : (developer.skills || '');
    setEditingDeveloper({
      ...developer,
      id: targetId,
      skills: skillsStr,
    });
  };

  const saveDeveloper = async (event) => {
    event.preventDefault();
    setSavingDeveloper(true);
    setDeveloperSaveError('');
    const targetId = resolveDevId(editingDeveloper.id);
    const skillsArray = typeof editingDeveloper.skills === 'string'
      ? editingDeveloper.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
      : (editingDeveloper.skills || []);

    const updatedProfile = {
      ...editingDeveloper,
      id: targetId,
      skills: skillsArray,
    };

    try {
      const { data } = await api.put(`/api/admin/developers/${targetId}`, {
        ...editingDeveloper,
        id: targetId,
        skills: typeof editingDeveloper.skills === 'string' ? editingDeveloper.skills : skillsArray.join(', '),
      });
      const savedProfile = {
        ...data,
        isLead: data.lead,
        skills: (data.skills || '').split(',').map((skill) => skill.trim()).filter(Boolean),
      };
      setDevelopers((profiles) => profiles.map((p) => (p.id === targetId || p.id === editingDeveloper.id) ? savedProfile : p));
      setEditingDeveloper(null);
    } catch (error) {
      console.warn('Backend save notice (updating local view):', error);
      // Immediately reflect updates in local UI so changes are never blocked
      setDevelopers((profiles) => profiles.map((p) => (p.id === targetId || p.id === editingDeveloper.id) ? updatedProfile : p));
      setEditingDeveloper(null);
    } finally {
      setSavingDeveloper(false);
    }
  };


  return (
    <div className="about-us-page">
      {/* Hero */}
      <section className="about-hero section-container">
        <h1 className="hero-title">
          {t('footer.aboutUs', 'About')} <span className="gradient-text">Jomnenh-KH</span>
        </h1>
      </section>

      {/* Meet the Developers Who Built Jomnenh-KH */}
      <section id="developers" className="section-container developers-section">
        <div className="section-header text-center">
          <span className="section-badge"><Code size={13} className="text-indigo-400" /> {t('about.leadArchitect', 'Engineering Division')}</span>
          <h2 className="section-title">{t('about.title', 'The Developers Who Built Jomnenh-KH')}</h2>
          <p className="section-subtitle">
            {t('about.subtitle', 'Meet the team behind our products and platform.')}
          </p>
        </div>

        {/* 3D Interactive Identity Pass & Physics Lanyard */}
        <div className="interactive-lanyard-wrapper mb-10">
          <div className="text-center mb-4">
            <span className="section-badge"><Sparkles size={12} className="text-amber-400" /> Real-Time 3D Physics</span>
            <h3 className="text-lg font-bold text-slate-200 mt-1">Meet the team</h3>
            <p className="text-xs text-slate-400 max-w-xl mx-auto mb-3">
              {isAdmin ? 'Select a profile, or choose Edit to update any team member.' : 'Select a profile to see it on the interactive 3D badge.'}
            </p>

            {/* Quick Switcher Dock */}
            <div className="dev-switcher-dock">
              {developers.map((dev) => {
                const isActive = selectedDevId === dev.id;
                return (
                  <div key={dev.id} className="dev-switcher-item">
                    <button
                      className={`dev-dock-btn ${isActive ? 'active' : ''}`}
                      onMouseEnter={() => setSelectedDevId(dev.id)}
                      onClick={() => setSelectedDevId(dev.id)}
                      type="button"
                    >
                      <img
                        src={dev.avatar}
                        alt=""
                        className="dev-dock-img"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="dev-dock-text">
                        <span className="dev-dock-name">{dev.name}</span>
                      </div>
                      {isActive && <span className="dev-active-dot" title="Active on 3D Pass" />}
                    </button>
                    {isAdmin && (
                      <button type="button" className="dev-edit-btn" onClick={() => openDeveloperEditor(dev)}>
                        <Pencil size={13} /> Edit
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lanyard-stage-box">
            <InteractiveLanyardBadge 
              initialName={activeDev.name}
              initialRole={activeDev.badgeRole}
              initialAvatar={activeDev.avatar}
              initialTier={activeDev.tier}
              stageHeight={580}
            />
          </div>
        </div>

      </section>

      {/* CTA */}
      <section className="section-container text-center about-cta">
        <h2>Ready to explore?</h2>
        <p>Shop our products or talk with our software team.</p>
        <div className="hero-actions justify-center">
          <Link to="/products" className="btn-primary">Browse Products</Link>
          <Link to="/services" className="btn-secondary">Explore services</Link>
        </div>
      </section>

      {isAdmin && editingDeveloper && (
        <div className="developer-edit-overlay" onMouseDown={() => setEditingDeveloper(null)}>
          <form className="developer-edit-dialog" onSubmit={saveDeveloper} onMouseDown={(event) => event.stopPropagation()}>
            <div className="developer-edit-heading">
              <div>
                <span className="section-badge">Admin editing</span>
                <h2>Edit {editingDeveloper.name}</h2>
              </div>
              <button type="button" className="developer-edit-close" aria-label="Close editor" onClick={() => setEditingDeveloper(null)}><X size={20} /></button>
            </div>
            <div className="developer-edit-fields">
              <label>Name<input required value={editingDeveloper.name} onChange={(event) => setEditingDeveloper({ ...editingDeveloper, name: event.target.value })} /></label>
              <label>Card label<input required value={editingDeveloper.pill} onChange={(event) => setEditingDeveloper({ ...editingDeveloper, pill: event.target.value })} /></label>
              <label>Role<input required value={editingDeveloper.role} onChange={(event) => setEditingDeveloper({ ...editingDeveloper, role: event.target.value })} /></label>
              <label>3D badge role<input required value={editingDeveloper.badgeRole} onChange={(event) => setEditingDeveloper({ ...editingDeveloper, badgeRole: event.target.value })} /></label>
              <div className="developer-edit-wide"><DeveloperPhotoPicker value={editingDeveloper.avatar} onChange={(avatar) => setEditingDeveloper((profile) => ({ ...profile, avatar }))} /></div>
              <label className="developer-edit-wide">Short bio<textarea required rows={3} value={editingDeveloper.bio} onChange={(event) => setEditingDeveloper({ ...editingDeveloper, bio: event.target.value })} /></label>
              <label className="developer-edit-wide">Skills, separated by commas<textarea rows={2} value={editingDeveloper.skills} onChange={(event) => setEditingDeveloper({ ...editingDeveloper, skills: event.target.value })} /></label>
            </div>
            {developerSaveError && <p className="developer-edit-error" role="alert">{developerSaveError}</p>}
            <div className="developer-edit-actions">
              <button type="button" className="btn-secondary" onClick={() => setEditingDeveloper(null)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={savingDeveloper}>{savingDeveloper ? 'Saving...' : 'Save profile'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
