import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { useNotification } from '../context/NotificationContext';
import { Home, Search, Sparkles, Scale, Heart, Bell, User, LogOut, Menu, X, ShieldCheck, Building, LayoutDashboard } from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useAuth();
  const { compareList } = useCompare();
  const { notifications, unreadCount, markRead } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 10, 12, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--gold-light), var(--gold-primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 'bold'
          }}>
            <Home size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
              Smart<span style={{ color: 'var(--gold-light)' }}>Rent</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '-4px' }}>
              AI PG & Rental Platform
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }} className="desktop-nav">
          <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 500 }}>
            <Search size={16} /> Explore Rooms
          </Link>
          
          <Link to="/ai-recommendations" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-light)', fontSize: '0.95rem', fontWeight: 600 }}>
            <Sparkles size={16} /> AI Match Quiz
          </Link>

          {compareList.length > 0 && (
            <Link to="/compare" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 500, position: 'relative' }}>
              <Scale size={16} /> Compare
              <span style={{
                background: 'var(--gold-primary)',
                color: '#000',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>{compareList.length}</span>
            </Link>
          )}

          {user && user.role === 'ROLE_TENANT' && (
            <Link to="/tenant/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
              <LayoutDashboard size={16} /> Tenant Dashboard
            </Link>
          )}

          {user && user.role === 'ROLE_OWNER' && (
            <Link to="/owner/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
              <Building size={16} /> Owner Dashboard
            </Link>
          )}

          {user && user.role === 'ROLE_ADMIN' && (
            <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-light)', fontSize: '0.95rem', fontWeight: 600 }}>
              <ShieldCheck size={16} /> Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Notifications dropdown */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: 'var(--gold-light)',
                    color: '#000',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '50px',
                  width: '320px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-hover)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-gold)',
                  padding: '1rem',
                  zIndex: 200
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notifications</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{unreadCount} unread</span>
                  </div>
                  {notifications.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>No notifications yet</p>
                  ) : (
                    <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {notifications.map(n => (
                        <div key={n.id} onClick={() => markRead(n.id)} style={{
                          padding: '0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          background: n.read ? 'transparent' : 'rgba(212,175,55,0.08)',
                          borderLeft: n.read ? 'none' : '3px solid var(--gold-light)',
                          cursor: 'pointer'
                        }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{n.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.message}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Auth state */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right', display: 'none' }} className="user-text">
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{user.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--gold-light)' }}>{user.role.replace('ROLE_', '')}</div>
              </div>
              <button 
                onClick={logout}
                className="btn-outline" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                title="Logout"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn-gold">
              <User size={16} /> Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
