import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, Zap, Target } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import SkeletonLoader from '../components/SkeletonLoader';
import api from '../services/api';

export default function AiRecommendationPage() {
  const [maxBudget, setMaxBudget] = useState(12000);
  const [preferredLocation, setPreferredLocation] = useState('REVA University');
  const [preferredRoomType, setPreferredRoomType] = useState('SINGLE');
  const [foodRequired, setFoodRequired] = useState(true);
  const [wifiRequired, setWifiRequired] = useState(true);
  const [parkingRequired, setParkingRequired] = useState(false);
  const [acRequired, setAcRequired] = useState(false);
  const [maxDistanceKm, setMaxDistanceKm] = useState(3.0);

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/ai/recommendations', {
        maxBudget: parseFloat(maxBudget),
        preferredLocation,
        preferredRoomType,
        foodRequired,
        wifiRequired,
        parkingRequired,
        acRequired,
        maxDistanceKm: parseFloat(maxDistanceKm)
      });
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <div className="gold-badge" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> AI Recommendation Engine
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            SmartRent Match Quiz
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Tell us your budget, lifestyle preferences, and commute limits. Our AI algorithm evaluates every property in real-time to compute your percentage match score.
          </p>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleGenerate} className="glass-card" style={{ padding: '2rem', maxWidth: '850px', margin: '0 auto 3rem', border: '1px solid var(--border-hover)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            
            {/* Budget */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Maximum Monthly Budget: <strong style={{ color: 'var(--gold-light)' }}>₹{parseInt(maxBudget).toLocaleString('en-IN')}</strong>
              </label>
              <input 
                type="range" 
                min="6000" 
                max="25000" 
                step="500" 
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
              />
            </div>

            {/* Location */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Target Location / Campus
              </label>
              <select className="input-field" value={preferredLocation} onChange={(e) => setPreferredLocation(e.target.value)}>
                <option value="REVA University">REVA University, Yelahanka</option>
                <option value="Koramangala">Koramangala</option>
                <option value="Indiranagar">Indiranagar</option>
                <option value="Whitefield">Whitefield</option>
                <option value="HSR Layout">HSR Layout</option>
                <option value="Electronic City">Electronic City</option>
              </select>
            </div>

            {/* Room Type */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Preferred Sharing Option
              </label>
              <select className="input-field" value={preferredRoomType} onChange={(e) => setPreferredRoomType(e.target.value)}>
                <option value="SINGLE">Single Room (Private)</option>
                <option value="DOUBLE">Double Sharing</option>
                <option value="TRIPLE">Triple Sharing</option>
              </select>
            </div>

            {/* Distance */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Max Distance to Location: <strong style={{ color: 'var(--gold-light)' }}>{maxDistanceKm} km</strong>
              </label>
              <input 
                type="range" 
                min="0.5" 
                max="10" 
                step="0.5" 
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
              />
            </div>

          </div>

          {/* Toggle Switches / Checkboxes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            {[
              { label: "Food & Mess Included", state: foodRequired, setter: setFoodRequired },
              { label: "High-Speed Wi-Fi", state: wifiRequired, setter: setWifiRequired },
              { label: "Parking Space", state: parkingRequired, setter: setParkingRequired },
              { label: "Air Conditioning (AC)", state: acRequired, setter: setAcRequired },
            ].map((item, idx) => (
              <label key={idx} style={{
                padding: '0.75rem 1rem',
                background: item.state ? 'rgba(212,175,55,0.12)' : 'var(--bg-surface)',
                border: item.state ? '1px solid var(--gold-light)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: item.state ? 'var(--gold-light)' : 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: 500
              }}>
                <input 
                  type="checkbox" 
                  checked={item.state} 
                  onChange={(e) => item.setter(e.target.checked)}
                  style={{ accentColor: 'var(--gold-primary)' }}
                />
                {item.label}
              </label>
            ))}
          </div>

          <button type="submit" className="btn-gold" disabled={loading} style={{ width: '100%', height: '50px', fontSize: '1.05rem', justifyContent: 'center' }}>
            {loading ? "Calculating Match Percentages..." : <>Generate Personalized Recommendations <Sparkles size={18} /></>}
          </button>
        </form>

        {/* Results Showcase */}
        {loading && <SkeletonLoader type="card" count={3} />}

        {recommendations && (
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              Your Top AI Matched Properties ({recommendations.length})
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {recommendations.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  
                  {/* Match Score Banner */}
                  <div className="glass-card" style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(18,19,24,0.95) 100%)',
                    border: '1px solid var(--gold-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                        {item.matchPercentage}% Match
                      </span>
                      <div className="gold-badge" style={{ fontSize: '0.7rem' }}>
                        <Target size={12} /> Ranked #{idx + 1}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      {item.matchReasons?.map((reason, rIdx) => (
                        <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Check size={12} color="var(--gold-light)" /> {reason}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Property Card */}
                  <PropertyCard property={item.property} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
