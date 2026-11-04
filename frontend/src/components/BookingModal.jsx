import React, { useState } from 'react';
import { X, Calendar, Clock, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function BookingModal({ room, property, onClose, onSuccess }) {
  const [moveInDate, setMoveInDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMonths, setDurationMonths] = useState(11);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/bookings', {
        roomId: room.id,
        moveInDate,
        durationMonths: parseInt(durationMonths),
        notes
      });
      setDone(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '2rem', background: '#121318', border: '1px solid var(--border-hover)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>Book Room {room.roomNumber}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{property.name} • {room.type} Room</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={56} color="var(--gold-light)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>Booking Request Sent!</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              The property owner has received your move-in request and will approve it shortly. You can track status in your Tenant Dashboard.
            </p>
            <button onClick={onClose} className="btn-gold" style={{ width: '100%' }}>Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {error && (
              <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Preferred Move-in Date
              </label>
              <input 
                type="date" 
                className="input-field"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Stay Duration (Months)
              </label>
              <select 
                className="input-field"
                value={durationMonths}
                onChange={(e) => setDurationMonths(e.target.value)}
              >
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={11}>11 Months (Standard Agreement)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Notes / Special Requests for Owner
              </label>
              <textarea 
                className="input-field"
                rows={3}
                placeholder="e.g. Prefer top floor, non-veg meal preference..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Rent Summary Box */}
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                <span>Monthly Rent</span>
                <span>₹{room.rentMonthly?.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <span>Refundable Deposit</span>
                <span>₹{room.depositAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: 'var(--gold-light)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.5rem' }}>
                <span>Total Due at Move-in</span>
                <span>₹{(room.rentMonthly + room.depositAmount)?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button type="submit" className="btn-gold" disabled={loading} style={{ width: '100%', height: '46px', fontSize: '1rem' }}>
              {loading ? "Submitting..." : "Confirm & Send Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
