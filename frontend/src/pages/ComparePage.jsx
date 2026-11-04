import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { Scale, Check, X, Star, MapPin, Award, Trash2 } from 'lucide-react';
import StarRating from '../components/StarRating';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <Scale size={64} color="var(--gold-light)" style={{ marginBottom: '1.5rem', opacity: 0.4 }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>No Properties Selected for Comparison</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Select up to 4 properties from search results or property cards to compare rent, amenities, distance, and ratings side by side.
        </p>
        <Link to="/search" className="btn-gold">
          Explore Properties to Compare
        </Link>
      </div>
    );
  }

  // Find lowest rent for Best Value highlight
  const lowestRent = Math.min(...compareList.map(p => p.startingRent || 99999));

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <div className="gold-badge" style={{ marginBottom: '0.4rem' }}>
              <Scale size={13} /> Comparison Matrix
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Compare Properties Side-by-Side</h1>
          </div>

          <button onClick={clearCompare} className="btn-outline" style={{ fontSize: '0.85rem' }}>
            <Trash2 size={14} /> Clear Matrix
          </button>
        </div>

        {/* Matrix Table Wrapper */}
        <div className="glass-card" style={{ overflowX: 'auto', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', width: '200px' }}>Feature</th>
                {compareList.map(p => (
                  <th key={p.id} style={{ padding: '1rem', width: `${80 / compareList.length}%`, verticalAlign: 'top' }}>
                    <div style={{ position: 'relative' }}>
                      {p.startingRent === lowestRent && (
                        <div className="gold-badge" style={{ marginBottom: '0.5rem', fontSize: '0.7rem' }}>
                          <Award size={12} /> Best Value
                        </div>
                      )}
                      <div style={{ height: '140px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '0.75rem' }}>
                        <img 
                          src={p.images && p.images.length > 0 ? p.images[0].imageUrl : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"} 
                          alt="" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.3rem' }}>{p.name}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.area}, {p.city}</p>
                      <button 
                        onClick={() => removeFromCompare(p.id)} 
                        style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.9rem' }}>
              
              {/* Row: Starting Rent */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Starting Rent</td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: '1rem', fontWeight: 800, fontSize: '1.1rem', color: p.startingRent === lowestRent ? 'var(--gold-light)' : '#fff' }}>
                    ₹{p.startingRent?.toLocaleString('en-IN')}/mo
                  </td>
                ))}
              </tr>

              {/* Row: Distance */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Distance to Hub</td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: '1rem', color: 'var(--text-main)' }}>
                    {p.distanceKm ? `${p.distanceKm} km` : '1.5 km'}
                  </td>
                ))}
              </tr>

              {/* Row: Rating */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Rating</td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: '1rem' }}>
                    <StarRating rating={p.ratingAvg || 4.5} count={p.reviewCount || 10} />
                  </td>
                ))}
              </tr>

              {/* Row: Food */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Food / Mess</td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: '1rem' }}>
                    {p.amenities?.includes('Food') ? <Check color="var(--gold-light)" size={18} /> : <X color="#666" size={18} />}
                  </td>
                ))}
              </tr>

              {/* Row: Wi-Fi */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>High-Speed Wi-Fi</td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: '1rem' }}>
                    {p.amenities?.includes('Wi-Fi') ? <Check color="var(--gold-light)" size={18} /> : <X color="#666" size={18} />}
                  </td>
                ))}
              </tr>

              {/* Row: AC Options */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>AC Available</td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: '1rem' }}>
                    {p.amenities?.includes('AC') ? <Check color="var(--gold-light)" size={18} /> : <X color="#666" size={18} />}
                  </td>
                ))}
              </tr>

              {/* Row: Laundry */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Laundry Service</td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: '1rem' }}>
                    {p.amenities?.includes('Laundry') ? <Check color="var(--gold-light)" size={18} /> : <X color="#666" size={18} />}
                  </td>
                ))}
              </tr>

              {/* Row: Actions */}
              <tr>
                <td style={{ padding: '1rem' }}></td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: '1rem' }}>
                    <Link to={`/properties/${p.id}`} className="btn-gold" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                      View Property
                    </Link>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
