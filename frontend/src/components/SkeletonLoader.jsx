import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 3 }) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', width: '100%' }}>
        {items.map((_, i) => (
          <div key={i} className="glass-card" style={{ height: '380px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.6 }}>
            <div style={{ height: '180px', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)' }} />
            <div style={{ height: '20px', width: '70%', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }} />
            <div style={{ height: '15px', width: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
            <div style={{ height: '40px', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', marginTop: 'auto' }} />
          </div>
        ))}
      </div>
    );
  }

  return <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }} />;
}
