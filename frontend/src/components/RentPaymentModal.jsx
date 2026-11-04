import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Smartphone, Building } from 'lucide-react';
import api from '../services/api';

export default function RentPaymentModal({ payment, onClose, onSuccess }) {
  const [method, setMethod] = useState('UPI (Google Pay / PhonePe)');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [txnId, setTxnId] = useState('');

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await api.post('/payments/pay', {
        paymentId: payment.id,
        paymentMethod: method
      });
      setTxnId(res.data.transactionId);
      setDone(true);
      if (onSuccess) onSuccess();
    } catch (e) {
      alert("Payment processing failed. Please try again.");
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
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2rem', background: '#121318', border: '1px solid var(--border-hover)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>Pay Rent</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{payment.monthYear} Rent</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={56} color="var(--gold-light)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>Payment Successful!</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Rent of ₹{payment.amount?.toLocaleString('en-IN')} paid successfully.
            </p>
            <div className="gold-badge" style={{ marginBottom: '1.5rem', fontSize: '0.8rem' }}>
              Transaction ID: {txnId}
            </div>
            <button onClick={onClose} className="btn-gold" style={{ width: '100%' }}>Close Receipt</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Amount Payable</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                ₹{payment.amount?.toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due Date: {payment.dueDate}</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Select Payment Option
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  { id: 'UPI (Google Pay / PhonePe)', icon: <Smartphone size={18} /> },
                  { id: 'Credit / Debit Card', icon: <CreditCard size={18} /> },
                  { id: 'Net Banking (SBI, HDFC, ICICI)', icon: <Building size={18} /> }
                ].map((opt) => (
                  <div 
                    key={opt.id}
                    onClick={() => setMethod(opt.id)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: method === opt.id ? 'rgba(212,175,55,0.12)' : 'var(--bg-surface)',
                      border: method === opt.id ? '1px solid var(--gold-light)' : '1px solid var(--border-color)',
                      color: method === opt.id ? 'var(--gold-light)' : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}
                  >
                    {opt.icon} {opt.id}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handlePay} className="btn-gold" disabled={loading} style={{ width: '100%', height: '48px', fontSize: '1rem', marginTop: '0.5rem' }}>
              {loading ? "Processing Payment..." : `Pay ₹${payment.amount?.toLocaleString('en-IN')} Now`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
