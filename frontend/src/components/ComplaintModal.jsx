import React, { useState } from 'react';
import { X, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function ComplaintModal({ propertyId, roomId, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleAiClassify = async (textToUse) => {
    const txt = textToUse || description;
    if (!txt || txt.length < 5) return;

    try {
      const res = await api.post('/ai/classify-complaint', { text: txt });
      setAiAnalysis(res.data);
      if (!category) setCategory(res.data.category);
      if (!priority) setPriority(res.data.priority);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/complaints', {
        propertyId,
        roomId,
        title,
        description,
        category: category || undefined,
        priority: priority || undefined
      });
      setDone(true);
      if (onSuccess) onSuccess();
    } catch (e) {
      alert("Failed to submit complaint.");
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
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>Submit Maintenance Complaint</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI-Assisted Issue Tracker</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={56} color="var(--gold-light)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>Complaint Logged!</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Your maintenance ticket has been dispatched to the property owner. You will receive real-time updates as resolution progresses.
            </p>
            <button onClick={onClose} className="btn-gold" style={{ width: '100%' }}>Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Issue Title
              </label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Wi-Fi router disconnected / No hot water in morning"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Detailed Description
              </label>
              <textarea 
                className="input-field" 
                rows={3}
                placeholder="Describe what is broken and since when..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (e.target.value.length > 10) handleAiClassify(e.target.value);
                }}
                required
              />
            </div>

            {/* AI Classification Feedback Banner */}
            {aiAnalysis && (
              <div style={{
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem'
              }}>
                <Sparkles size={18} color="var(--gold-light)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                    AI Classification Suggestion
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '2px' }}>
                    Category: <strong>{aiAnalysis.category}</strong> • Priority: <strong>{aiAnalysis.priority}</strong>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {aiAnalysis.explanation}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Category (Override AI)
                </label>
                <select 
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="ELECTRICITY">Electricity</option>
                  <option value="WATER">Water</option>
                  <option value="WIFI">Wi-Fi</option>
                  <option value="FOOD">Food</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="CLEANING">Cleaning</option>
                  <option value="SECURITY">Security</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Priority Level
                </label>
                <select 
                  className="input-field"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="">Select Priority</option>
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Urgent Priority</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-gold" disabled={loading} style={{ width: '100%', height: '46px', marginTop: '0.5rem' }}>
              {loading ? "Submitting Ticket..." : "Submit Complaint Ticket"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
