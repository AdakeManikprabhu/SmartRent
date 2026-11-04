import React, { useState, useEffect } from 'react';
import { Home, Calendar, CreditCard, AlertCircle, Heart, Plus, CheckCircle2, Clock, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RentPaymentModal from '../components/RentPaymentModal';
import ComplaintModal from '../components/ComplaintModal';
import PropertyCard from '../components/PropertyCard';
import api from '../services/api';

export default function TenantDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bRes, pRes, cRes, fRes] = await Promise.all([
        api.get('/bookings/my'),
        api.get('/payments/history'),
        api.get('/complaints/my'),
        api.get('/favorites')
      ]);
      setBookings(bRes.data);
      setPayments(pRes.data);
      setComplaints(cRes.data);
      setFavorites(fRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const activeBooking = bookings.find(b => b.status === 'APPROVED') || bookings[0];
  const pendingPayment = payments.find(p => p.status === 'PENDING');

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Welcome Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="gold-badge" style={{ marginBottom: '0.4rem' }}>Tenant Portal</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Welcome back, {user?.name || "Tenant"}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your current room booking, rent payments, and maintenance tickets</p>
        </div>

        {/* Current Active Stay Highlight Card */}
        {activeBooking ? (
          <div className="glass-card" style={{
            padding: '2rem',
            marginBottom: '3rem',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(18,19,24,0.95) 100%)',
            border: '1px solid var(--gold-light)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Current Active Residence
                </div>
                <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.3rem' }}>{activeBooking.property?.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={14} color="var(--gold-light)" /> {activeBooking.property?.address}, {activeBooking.property?.area}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className={`gold-badge ${activeBooking.status === 'APPROVED' ? 'badge-green' : 'badge-yellow'}`}>
                  Booking {activeBooking.status}
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold-light)', marginTop: '0.5rem' }}>
                  ₹{activeBooking.totalMonthlyRent?.toLocaleString('en-IN')}<span style={{ fontSize: '0.8rem', fontWeight: 500 }}>/month</span>
                </div>
              </div>
            </div>

            {/* Stay Details Metric Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              background: 'var(--bg-surface)',
              padding: '1.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Room</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Room {activeBooking.room?.roomNumber}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Room Sharing</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{activeBooking.room?.type} Sharing</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Move-in Date</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{activeBooking.moveInDate}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Next Rent Due</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: pendingPayment ? '#F59E0B' : '#10B981' }}>
                  {pendingPayment ? pendingPayment.dueDate : 'All Paid'}
                </div>
              </div>
            </div>

            {/* Quick Action Triggers */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {pendingPayment && (
                <button onClick={() => setSelectedPayment(pendingPayment)} className="btn-gold">
                  <CreditCard size={16} /> Pay Current Rent (₹{pendingPayment.amount?.toLocaleString('en-IN')})
                </button>
              )}
              <button onClick={() => setShowComplaintModal(true)} className="btn-outline">
                <AlertCircle size={16} /> Submit Maintenance Complaint
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '3rem' }}>
            <Home size={48} color="var(--gold-light)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.5rem' }}>No Active Room Bookings</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Explore verified properties near your location to book your next home.</p>
          </div>
        )}

        {/* Two Column Grid: Payments & Complaints */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }} className="tenant-grid">
          
          {/* Rent Payment History */}
          <div className="glass-card" style={{ padding: '1.8rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} color="var(--gold-light)" /> Rent Payment History
            </h3>

            {payments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No payment records found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {payments.map(p => (
                  <div key={p.id} style={{
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{p.monthYear}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due: {p.dueDate}</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--gold-light)' }}>₹{p.amount?.toLocaleString('en-IN')}</div>
                      <span className={`gold-badge ${p.status === 'PAID' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.65rem' }}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Maintenance Complaints */}
          <div className="glass-card" style={{ padding: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} color="var(--gold-light)" /> Complaints & Issues
              </h3>
              {activeBooking && (
                <button onClick={() => setShowComplaintModal(true)} className="btn-gold" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}>
                  <Plus size={14} /> New Complaint
                </button>
              )}
            </div>

            {complaints.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No maintenance complaints filed.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {complaints.map(c => (
                  <div key={c.id} style={{
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{c.title}</span>
                      <span className={`gold-badge ${c.status === 'RESOLVED' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.65rem' }}>
                        {c.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>Saved Favorite Properties</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {favorites.map(p => (
                <PropertyCard key={p.id} property={p} initialIsFavorite={true} onFavoriteToggle={() => fetchDashboardData()} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Payment Modal */}
      {selectedPayment && (
        <RentPaymentModal 
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onSuccess={() => fetchDashboardData()}
        />
      )}

      {/* Complaint Modal */}
      {showComplaintModal && activeBooking && (
        <ComplaintModal 
          propertyId={activeBooking.property?.id}
          roomId={activeBooking.room?.id}
          onClose={() => setShowComplaintModal(false)}
          onSuccess={() => fetchDashboardData()}
        />
      )}
    </div>
  );
}
