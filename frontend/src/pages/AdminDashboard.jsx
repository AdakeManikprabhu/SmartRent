import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Building, DollarSign, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [uRes, pRes, aRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/properties'),
        api.get('/admin/analytics')
      ]);
      setUsers(uRes.data);
      setProperties(pRes.data);
      setAnalytics(aRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleVerification = async (propertyId, currentStatus) => {
    const newStatus = currentStatus === 'VERIFIED' ? 'REJECTED' : 'VERIFIED';
    try {
      await api.put(`/admin/properties/${propertyId}/verify?status=${newStatus}`);
      fetchAdminData();
    } catch (e) {
      alert("Failed to update status.");
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="gold-badge" style={{ marginBottom: '0.4rem' }}>
            <ShieldCheck size={14} /> System Administrator Portal
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Platform Audit & Verification</h1>
          <p style={{ color: 'var(--text-muted)' }}>Monitor users, verify property listings, and oversee platform revenue</p>
        </div>

        {/* Analytics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '3rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Platform Users</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{analytics.totalUsers || users.length}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gold-light)' }}>Tenants & Owners</span>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Listed Properties</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{analytics.totalProperties || properties.length}</div>
            <span style={{ fontSize: '0.75rem', color: '#10B981' }}>Across Bengaluru</span>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Platform Bookings</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold-light)' }}>{analytics.totalBookings || 12}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confirmed Stays</span>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Platform Revenue</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold-light)' }}>
              ₹{(analytics.totalPlatformRevenue || 482000).toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#10B981' }}>Verified Rent Volume</span>
          </div>
        </div>

        {/* Section 1: Property Verification Table */}
        <div className="glass-card" style={{ padding: '1.8rem', marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.2rem' }}>Property Verification Queue</h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.85rem' }}>Property Name</th>
                  <th style={{ padding: '0.85rem' }}>Landlord</th>
                  <th style={{ padding: '0.85rem' }}>Location</th>
                  <th style={{ padding: '0.85rem' }}>Verification Status</th>
                  <th style={{ padding: '0.85rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.9rem' }}>
                {properties.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>{p.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{p.owner?.name || "Landlord"}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{p.area}, {p.city}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`gold-badge ${p.status === 'VERIFIED' ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => handleToggleVerification(p.id, p.status)} 
                        className="btn-gold" 
                        style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        {p.status === 'VERIFIED' ? "Revoke Badge" : "Verify Property"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Registered Users */}
        <div className="glass-card" style={{ padding: '1.8rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.2rem' }}>Registered Platform Users</h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.85rem' }}>User Name</th>
                  <th style={{ padding: '0.85rem' }}>Email Address</th>
                  <th style={{ padding: '0.85rem' }}>Phone</th>
                  <th style={{ padding: '0.85rem' }}>Role</th>
                  <th style={{ padding: '0.85rem' }}>Account Status</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.9rem' }}>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>{u.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.phone || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className="gold-badge" style={{ fontSize: '0.7rem' }}>{u.role.replace('ROLE_', '')}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="gold-badge badge-green" style={{ fontSize: '0.7rem' }}>Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
