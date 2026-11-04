import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, MapPin, Grid, List, Sparkles, X } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import NlpSearchBar from '../components/NlpSearchBar';
import SkeletonLoader from '../components/SkeletonLoader';
import api from '../services/api';

export default function SearchPage() {
  const locationState = useLocation();
  const queryParams = new URLSearchParams(locationState.search);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  // Filter States
  const [area, setArea] = useState(queryParams.get('area') || '');
  const [minRent, setMinRent] = useState(queryParams.get('minRent') || '');
  const [maxRent, setMaxRent] = useState(queryParams.get('maxRent') || '');
  const [roomType, setRoomType] = useState(queryParams.get('roomType') || '');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');

  const amenityOptions = ["Wi-Fi", "Food", "AC", "Laundry", "Parking", "Gym", "Security", "Power Backup"];

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (area) params.append('area', area);
      if (minRent) params.append('minRent', minRent);
      if (maxRent) params.append('maxRent', maxRent);
      if (roomType) params.append('roomType', roomType);
      if (selectedAmenities.length > 0) params.append('amenities', selectedAmenities.join(','));

      const res = await api.get(`/properties/search?${params.toString()}`);
      let data = res.data;

      // Sort
      if (sortBy === 'price-low') {
        data.sort((a, b) => (a.startingRent || 0) - (b.startingRent || 0));
      } else if (sortBy === 'price-high') {
        data.sort((a, b) => (b.startingRent || 0) - (a.startingRent || 0));
      } else if (sortBy === 'rating') {
        data.sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
      } else if (sortBy === 'distance') {
        data.sort((a, b) => (a.distanceKm || 99) - (b.distanceKm || 99));
      }

      setProperties(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [area, minRent, maxRent, roomType, selectedAmenities, sortBy]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleNlpResults = (res) => {
    if (res.matchingProperties) {
      setProperties(res.matchingProperties);
    }
  };

  return (
    <div style={{ padding: '2rem 0 5rem' }}>
      <div className="container">
        
        {/* Top Header & NLP Search */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Explore Verified PGs & Rental Rooms
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Filter by area, budget, room sharing options, and luxury amenities
          </p>

          <NlpSearchBar onNlpResults={handleNlpResults} />
        </div>

        {/* Layout with Sidebar & Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }} className="search-layout">
          
          {/* Filter Sidebar */}
          <aside className="glass-card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Filter size={16} color="var(--gold-light)" /> Filters
              </span>
              <button 
                onClick={() => {
                  setArea(''); setMinRent(''); setMaxRent(''); setRoomType(''); setSelectedAmenities([]);
                }}
                style={{ background: 'none', color: 'var(--gold-light)', fontSize: '0.8rem' }}
              >
                Reset All
              </button>
            </div>

            {/* Area Filter */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>Location / Neighborhood</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. REVA, Koramangala..." 
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>

            {/* Budget Range */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>Monthly Rent Range (₹)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="Min ₹" 
                  value={minRent}
                  onChange={(e) => setMinRent(e.target.value)}
                />
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="Max ₹" 
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                />
              </div>
            </div>

            {/* Room Type */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>Room Type</label>
              <select 
                className="input-field" 
                value={roomType} 
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="">All Room Types</option>
                <option value="SINGLE">Single Room</option>
                <option value="DOUBLE">Double Sharing</option>
                <option value="TRIPLE">Triple Sharing</option>
              </select>
            </div>

            {/* Amenities Checkboxes */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Amenities</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {amenityOptions.map((am) => (
                  <label key={am} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedAmenities.includes(am)} 
                      onChange={() => toggleAmenity(am)}
                      style={{ accentColor: 'var(--gold-primary)' }}
                    />
                    {am}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Results Main Area */}
          <div>
            {/* Top Toolbar */}
            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              background: 'var(--bg-card)',
              padding: '0.85rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Showing <strong style={{ color: '#fff' }}>{properties.length}</strong> verified properties
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sort by:</span>
                  <select 
                    className="input-field" 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="distance">Distance to Hub</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Property Cards Grid */}
            {loading ? (
              <SkeletonLoader type="card" count={6} />
            ) : properties.length === 0 ? (
              <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <Search size={48} color="var(--gold-light)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>No PGs match your current filters</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                  Try increasing your budget, removing amenity restrictions, or expanding your search location.
                </p>
                <button 
                  onClick={() => { setArea(''); setMinRent(''); setMaxRent(''); setRoomType(''); setSelectedAmenities([]); }}
                  className="btn-gold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {properties.map(p => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
