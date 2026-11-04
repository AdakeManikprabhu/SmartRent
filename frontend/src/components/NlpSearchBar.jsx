import React, { useState } from 'react';
import { Sparkles, Search, ArrowRight, CornerDownLeft } from 'lucide-react';
import api from '../services/api';

export default function NlpSearchBar({ onNlpResults }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    "Find me a single room PG near REVA University under ₹12,000 with food and Wi-Fi",
    "Show me luxury co-living PGs in Koramangala under ₹15,000 with AC and Gym",
    "Affordable double sharing room in Indiranagar with parking under ₹10,000"
  ];

  const handleSearch = async (queryToUse) => {
    const q = queryToUse !== undefined ? queryToUse : prompt;
    if (!q || !q.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/ai/search', { prompt: q });
      if (onNlpResults) {
        onNlpResults(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(18, 19, 24, 0.95)', border: '1px solid var(--border-hover)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div className="gold-badge">
          <Sparkles size={13} /> Natural Language AI Search
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Describe your dream room in plain English!
        </span>
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Search size={18} color="var(--gold-light)" style={{ position: 'absolute', left: '1rem' }} />
        <input 
          type="text" 
          className="input-field" 
          placeholder="e.g. Find me a single room PG near REVA University under ₹12,000 with food and Wi-Fi..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{ paddingLeft: '2.8rem', paddingRight: '7rem', height: '52px', fontSize: '0.95rem' }}
        />
        <button 
          onClick={() => handleSearch()} 
          className="btn-gold" 
          disabled={loading}
          style={{ position: 'absolute', right: '6px', height: '40px', padding: '0 1.2rem', fontSize: '0.85rem' }}
        >
          {loading ? "Searching..." : <>Ask AI <ArrowRight size={14} /></>}
        </button>
      </div>

      {/* Suggested prompts chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.85rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Try asking:</span>
        {samplePrompts.map((sp, i) => (
          <button 
            key={i} 
            onClick={() => { setPrompt(sp); handleSearch(sp); }}
            style={{
              background: 'rgba(212,175,55,0.06)',
              border: '1px solid rgba(212,175,55,0.2)',
              color: 'var(--text-main)',
              fontSize: '0.75rem',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer'
            }}
          >
            "{sp}"
          </button>
        ))}
      </div>
    </div>
  );
}
