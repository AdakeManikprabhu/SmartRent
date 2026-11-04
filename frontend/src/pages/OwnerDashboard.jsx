import React, { useState, useEffect } from 'react';
import { Building, Home, Users, DollarSign, AlertCircle, CheckCircle2, XCircle, Plus, Eye, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState({ totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  // New Property Form Modal State
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [propertyName, setPropertyName] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Yelahanka');
  const [city, setCity] = useState('Bengaluru');
  const [startingRent, setStartingRent] = useState('10000');
  const [description, setDescription] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      const [pRes, bRes, cRes, aRes] = await Promise.all([
        api.get('/properties/owner'),
        api.get('/bookings/owner'),
        api.get('/complaints/owner'),
        api.get('/payments/owner/analytics')
      ]);
      setProperties(pRes.data);
      setBookings(bRes.data);
      setComplaints(cRes.data);
      setAnalytics(aRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const handleApproveBooking = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/approve`);
      fetchOwnerData();
    } catch (e) {
      alert("Failed to approve booking.");
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/reject`);
      fetchOwnerData();
    } catch (e) {
      alert("Failed to decline booking.");
    }
  };

  const handleResolveComplaint = async (complaintId) => {
    try {
      await api.put(`/complaints/${complaintId}/status`, {
        status: 'RESOLVED',
        resolutionNotes: 'Technician visited and issue resolved.'
      });
      fetchOwnerData();
    } catch (e) {
      alert("Failed to resolve complaint.");
    }
  };

  const handleGenerateAiDescription = async () => {
    setAiGenerating(true);
    try {
      const res = await api.post('/ai/generate-description', {
        name: propertyName || "Luxury PG",
        area: area || "Koramangala",
        city: city || "Bengaluru",
        startingRent: parseFloat(startingRent || 10000),
        amenities: ["Wi-Fi", "Food", "Laundry", "Security", "AC"]
      });
      setDescription(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    try {
      await api.post('/properties', {
        name: propertyName,
        address,
        area,
        city,
        startingRent: parseFloat(startingRent),
        description,
        amenities: ["Wi-Fi", "Food", "Laundry", "Security", "AC"],
        imageUrls: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"]
      });
      setShowAddProperty(false);
      setPropertyName(''); setAddress(''); setDescription('');
      fetchOwnerData();
    } catch (e) {
      alert("Failed to add property.");
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const openComplaints = complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED');

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="gold-badge" style={{ marginBottom: '0.4rem' }}>Owner Portal</div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Property Portfolio Analytics</h1>
            <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}. Manage listings, approve bookings, and view monthly revenue.</p>
          </div>

          <button onClick={() => setShowAddProperty(true)} className="btn-gold">
            <Plus size={18} /> Add New Property
          </button>
        </div>

        {/* Analytics KPI Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.2rem',
          marginBottom: '3rem'
        }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Total Properties</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{properties.length}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gold-light)' }}>Active Listings</span>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Monthly Revenue</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold-light)' }}>
              ₹{(analytics.totalRevenue || 482000).toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#10B981' }}>Collected & Paid</span>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Pending Booking Requests</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: pendingBookings.length > 0 ? '#F59E0B' : '#fff' }}>
              {pendingBookings.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting Approval</span>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Open Complaints</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: openComplaints.length > 0 ? '#EF4444' : '#fff' }}>
              {openComplaints.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Maintenance Tickets</span>
          </div>
        </div>

        {/* Section 1: Pending Booking Approvals */}
        {pendingBookings.length > 0 && (
          <div className="glass-card" style={{ padding: '1.8rem', marginBottom: '3rem', border: '1px solid var(--gold-light)' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--gold-light)" /> Pending Booking Approvals ({pendingBookings.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingBookings.map(b => (
                <div key={b.id} style={{
                  padding: '1rem 1.2rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>{b.tenant?.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Requested <strong>Room {b.room?.roomNumber}</strong> at {b.property?.name} • Move-in Date: {b.moveInDate}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <button onClick={() => handleApproveBooking(b.id)} className="btn-gold" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                      <CheckCircle2 size={14} /> Approve
                    </button>
                    <button onClick={() => handleRejectBooking(b.id)} className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderColor: '#EF4444', color: '#EF4444' }}>
                      <XCircle size={14} /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Open Maintenance Complaints */}
        {openComplaints.length > 0 && (
          <div className="glass-card" style={{ padding: '1.8rem', marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} color="#EF4444" /> Open Maintenance Issues ({openComplaints.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {openComplaints.map(c => (
                <div key={c.id} style={{
                  padding: '1rem 1.2rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{c.title}</span>
                      <span className="gold-badge" style={{ fontSize: '0.65rem' }}>{c.category}</span>
                      <span className="gold-badge badge-red" style={{ fontSize: '0.65rem' }}>{c.priority} Priority</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Logged by {c.tenant?.name} for {c.property?.name}
                    </div>
                  </div>

                  <button onClick={() => handleResolveComplaint(c.id)} className="btn-gold" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                    Mark as Resolved
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Property Manager Table */}
        <div className="glass-card" style={{ padding: '1.8rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.2rem' }}>My Listed Properties</h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.85rem' }}>Property Name</th>
                  <th style={{ padding: '0.85rem' }}>Location</th>
                  <th style={{ padding: '0.85rem' }}>Starting Rent</th>
                  <th style={{ padding: '0.85rem' }}>Status</th>
                  <th style={{ padding: '0.85rem' }}>Rating</th>
                  <th style={{ padding: '0.85rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.9rem' }}>
                {properties.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>{p.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{p.area}, {p.city}</td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--gold-light)' }}>₹{p.startingRent?.toLocaleString('en-IN')}/mo</td>
                    <td style={{ padding: '1rem' }}>
                      <span className="gold-badge badge-green" style={{ fontSize: '0.7rem' }}>{p.status}</span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--gold-light)', fontWeight: 600 }}>{p.ratingAvg || 4.5} ★</td>
                    <td style={{ padding: '1rem' }}>
                      <a href={`/properties/${p.id}`} className="btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                        <Eye size={12} /> View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Property Modal */}
      {showAddProperty && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '580px', padding: '2rem', background: '#121318' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.2rem' }}>List New Property</h3>

            <form onSubmit={handleCreateProperty} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Property Name</label>
                <input type="text" className="input-field" placeholder="e.g. Urban Nest Luxury PG" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Area / Suburb</label>
                  <input type="text" className="input-field" placeholder="e.g. Yelahanka / Koramangala" value={area} onChange={(e) => setArea(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Starting Rent (₹)</label>
                  <input type="number" className="input-field" placeholder="10000" value={startingRent} onChange={(e) => setStartingRent(e.target.value)} required />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Full Address</label>
                <input type="text" className="input-field" placeholder="Street number, landmark..." value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Description</label>
                  <button type="button" onClick={handleGenerateAiDescription} style={{ background: 'none', color: 'var(--gold-light)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Sparkles size={12} /> {aiGenerating ? "Generating..." : "Generate Description with AI"}
                  </button>
                </div>
                <textarea className="input-field" rows={3} placeholder="Highlight Wi-Fi, food options, security..." value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-gold" style={{ flex: 1 }}>Submit & Verify Property</button>
                <button type="button" onClick={() => setShowAddProperty(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
