import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Navigation, Heart, Scale, ArrowRight, Check } from 'lucide-react';
import StarRating from './StarRating';
import { useCompare } from '../context/CompareContext';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PropertyCard({ property, onFavoriteToggle, initialIsFavorite = false }) {
  const { compareList, toggleCompare } = useCompare();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const isCompared = compareList.some(p => p.id === property.id);

  const primaryImage = property.images && property.images.length > 0 
    ? property.images[0].imageUrl 
    : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to save favorites.");
      return;
    }
    try {
      await api.post(`/favorites/${property.id}`);
      setIsFavorite(!isFavorite);
      if (onFavoriteToggle) onFavoriteToggle(property.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Image Thumbnail Header */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img 
          src={primaryImage} 
          alt={property.name} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }} 
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Verified Badge */}
        {property.status === 'VERIFIED' && (
          <div className="gold-badge" style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(10,10,12,0.85)'
          }}>
            <ShieldCheck size={13} color="var(--gold-light)" /> Verified
          </div>
        )}

        {/* Top Action Buttons (Favorite & Compare) */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '0.4rem' }}>
          <button 
            onClick={handleFavorite} 
            title="Save to Favorites"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(10,10,12,0.75)',
              color: isFavorite ? 'var(--gold-light)' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Heart size={16} fill={isFavorite ? 'var(--gold-light)' : 'none'} />
          </button>

          <button 
            onClick={() => toggleCompare(property)}
            title={isCompared ? "Remove from Compare" : "Compare Property"}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: isCompared ? 'var(--gold-primary)' : 'rgba(10,10,12,0.75)',
              color: isCompared ? '#000000' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Scale size={16} />
          </button>
        </div>

        {/* Starting Price Tag */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'linear-gradient(135deg, var(--gold-light), var(--gold-primary))',
          color: '#000000',
          padding: '0.35rem 0.8rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 800,
          fontSize: '0.95rem'
        }}>
          ₹{property.startingRent ? property.startingRent.toLocaleString('en-IN') : '8,000'}<span style={{ fontSize: '0.75rem', fontWeight: 600 }}>/mo</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
            <Link to={`/properties/${property.id}`} style={{ color: '#fff' }}>
              {property.name}
            </Link>
          </h3>
        </div>

        {/* Rating and Distance */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
          <StarRating rating={property.ratingAvg || 4.5} count={property.reviewCount || 12} />
          {property.distanceKm && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Navigation size={12} color="var(--gold-light)" /> {property.distanceKm} km away
            </span>
          )}
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1rem' }}>
          <MapPin size={14} color="var(--gold-light)" /> {property.area}, {property.city}
        </p>

        {/* Amenities Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.2rem', flexGrow: 1 }}>
          {Array.from(property.amenities || ['Wi-Fi', 'Food', 'Laundry', 'Security']).slice(0, 4).map((amenity, idx) => (
            <span key={idx} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-main)',
              fontSize: '0.75rem',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}>
              <Check size={11} color="var(--gold-light)" /> {amenity}
            </span>
          ))}
        </div>

        {/* Card Footer Button */}
        <Link 
          to={`/properties/${property.id}`} 
          className="btn-outline" 
          style={{ width: '100%', textDecoration: 'none', justifyContent: 'center', fontSize: '0.9rem' }}
        >
          View Property <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
