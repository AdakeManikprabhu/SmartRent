import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, count, size = 14, interactive = false, onChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          onClick={() => interactive && onChange && onChange(star)}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            color: star <= Math.round(rating) ? 'var(--gold-light)' : '#333440',
            fill: star <= Math.round(rating) ? 'var(--gold-light)' : 'none',
            transition: 'all 0.15s ease'
          }}
        />
      ))}
      {rating > 0 && (
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-light)', marginLeft: '0.3rem' }}>
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          ({count})
        </span>
      )}
    </div>
  );
}
