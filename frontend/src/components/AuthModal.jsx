import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('ROLE_TENANT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await register(name, email, password, phone, role);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoUser = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setIsRegister(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '460px', padding: '2rem', background: '#121318', border: '1px solid var(--border-hover)' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
              {isRegister ? "Create SmartRent Account" : "Welcome Back"}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isRegister ? "Join as a Tenant or Landlord" : "Log in to manage bookings & rent"}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        {/* Demo One-Click Login Buttons */}
        {!isRegister && (
          <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.2rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Zap size={13} /> Quick Demo Accounts
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => fillDemoUser('tenant@smartrent.com', 'ROLE_TENANT')} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                Demo Tenant
              </button>
              <button type="button" onClick={() => fillDemoUser('owner1@smartrent.com', 'ROLE_OWNER')} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                Demo Owner
              </button>
              <button type="button" onClick={() => fillDemoUser('admin@smartrent.com', 'ROLE_ADMIN')} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--gold-light)', fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                Demo Admin
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Full Name</label>
              <input type="text" className="input-field" placeholder="Aarav Sharma" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Email Address</label>
            <input type="email" className="input-field" placeholder="tenant@smartrent.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Password</label>
            <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {isRegister && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Phone Number</label>
                <input type="text" className="input-field" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Account Role</label>
                <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="ROLE_TENANT">Tenant (I want to discover and book rooms)</option>
                  <option value="ROLE_OWNER">Property Owner / Landlord (I want to list properties)</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="btn-gold" disabled={loading} style={{ width: '100%', height: '46px', fontSize: '1rem', marginTop: '0.5rem', justifyContent: 'center' }}>
            {loading ? "Authenticating..." : (isRegister ? "Register Account" : "Log In")} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', color: 'var(--gold-light)', fontWeight: 600 }}>
            {isRegister ? "Log In" : "Register Now"}
          </button>
        </div>

      </div>
    </div>
  );
}
