import React from 'react';
import { Home, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: '#070709',
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 0 2rem',
      marginTop: '5rem',
      color: 'var(--text-muted)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--gold-light), var(--gold-primary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontWeight: 'bold'
              }}>
                <Home size={18} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                Smart<span style={{ color: 'var(--gold-light)' }}>Rent</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              Find a place that feels like home. Discover verified PGs, hostels, and rental rooms matched to your lifestyle with artificial intelligence.
            </p>
            <div className="gold-badge">
              <Sparkles size={12} /> AI-Powered SaaS Platform
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Explore</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/search">Search PGs near REVA University</Link></li>
              <li><Link to="/search?area=Koramangala">Koramangala Co-Living</Link></li>
              <li><Link to="/search?area=Indiranagar">Indiranagar Hostels</Link></li>
              <li><Link to="/search?area=Whitefield">Whitefield Executive Rooms</Link></li>
              <li><Link to="/ai-recommendations">AI Match Quiz</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Portals</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/tenant/dashboard">Tenant Dashboard</Link></li>
              <li><Link to="/owner/dashboard">Owner Dashboard</Link></li>
              <li><Link to="/admin/dashboard">Admin Verification Portal</Link></li>
              <li><Link to="/compare">Compare Properties</Link></li>
            </ul>
          </div>

          {/* Contact / Verification */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Verified & Secure</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>
              All listings on SmartRent undergo background verification to ensure 100% safety, accurate pricing, and genuine owner contacts.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-light)', fontSize: '0.85rem', fontWeight: 600 }}>
              <ShieldCheck size={18} /> 100% Verified Properties
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem'
        }}>
          <div>
            © {new Date().getFullYear()} SmartRent Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Built with <Heart size={14} color="var(--gold-primary)" fill="var(--gold-primary)" /> for modern renters & owners
          </div>
        </div>
      </div>
    </footer>
  );
}
