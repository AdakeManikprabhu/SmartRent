import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Navigation, Check, Heart, Scale, User, Phone, Star, MessageSquare, ArrowLeft, Bed, Zap } from 'lucide-react';
import StarRating from '../components/StarRating';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import api from '../services/api';

export default function PropertyDetailsPage({ onOpenAuth }) {
  const { id } = useParams();
  const { user } = useAuth();
  const { toggleCompare } = useCompare();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Review Form State
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const pRes = await api.get(`/properties/${id}`);
      setProperty(pRes.data);
      if (pRes.data.images && pRes.data.images.length > 0) {
        setSelectedImage(pRes.data.images[0].imageUrl);
      }

      const rRes = await api.get(`/reviews/property/${id}`);
      setReviews(rRes.data);

      if (user) {
        const favRes = await api.get('/favorites');
        setIsFavorite(favRes.data.some(f => f.id === parseInt(id)));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, user]);

  const handleFavoriteToggle = async () => {
    if (!user) return onOpenAuth();
    try {
      await api.post(`/favorites/${id}`);
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) return onOpenAuth();
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        propertyId: parseInt(id),
        rating: userRating,
        comment: userComment
      });
      setUserComment('');
      fetchDetails();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to post review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !property) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading property details...</p>
      </div>
    );
  }

  const defaultImages = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
  ];
  const gallery = property.images && property.images.length > 0 ? property.images.map(i => i.imageUrl) : defaultImages;
  const currentMainImg = selectedImage || gallery[0];

  return (
    <div style={{ padding: '2rem 0 5rem' }}>
      <div className="container">
        
        {/* Back Link */}
        <Link to="/search" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Search Results
        </Link>

        {/* Title Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{property.name}</h1>
              {property.status === 'VERIFIED' && (
                <div className="gold-badge">
                  <ShieldCheck size={14} /> Verified Property
                </div>
              )}
            </div>

            <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
              <MapPin size={16} color="var(--gold-light)" /> {property.address}, {property.area}, {property.city} ({property.pincode})
              {property.distanceKm && <span style={{ color: 'var(--gold-light)' }}>• {property.distanceKm} km from hub</span>}
            </p>
          </div>

          {/* Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={handleFavoriteToggle} className="btn-outline" style={{ padding: '0.6rem 1.2rem' }}>
              <Heart size={16} fill={isFavorite ? "var(--gold-light)" : "none"} color={isFavorite ? "var(--gold-light)" : "#fff"} /> {isFavorite ? "Saved" : "Save"}
            </button>
            <button onClick={() => toggleCompare(property)} className="btn-outline" style={{ padding: '0.6rem 1.2rem' }}>
              <Scale size={16} /> Compare
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ height: '420px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <img src={currentMainImg} alt={property.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '420px', overflowY: 'auto' }}>
            {gallery.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImage(img)}
                style={{
                  height: '130px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: currentMainImg === img ? '2px solid var(--gold-light)' : '1px solid var(--border-color)',
                  opacity: currentMainImg === img ? 1 : 0.75
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
          
          {/* Left Column */}
          <div>
            {/* Description */}
            <div className="glass-card" style={{ padding: '1.8rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1rem' }}>About this Property</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>{property.description}</p>
            </div>

            {/* Amenities Grid */}
            <div className="glass-card" style={{ padding: '1.8rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.2rem' }}>Included Amenities</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                {Array.from(property.amenities || []).map((amenity, idx) => (
                  <div key={idx} style={{
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontSize: '0.9rem',
                    color: '#fff'
                  }}>
                    <Check size={16} color="var(--gold-light)" /> {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Available Rooms Breakdown */}
            <div className="glass-card" style={{ padding: '1.8rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.2rem' }}>Available Room Types</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {property.rooms && property.rooms.length > 0 ? property.rooms.map(room => (
                  <div key={room.id} style={{
                    padding: '1.2rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>Room {room.roomNumber} ({room.type})</span>
                        {room.ac && <span className="gold-badge" style={{ fontSize: '0.7rem' }}>AC</span>}
                        {room.furnished && <span className="gold-badge" style={{ fontSize: '0.7rem' }}>Furnished</span>}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                        Deposit: ₹{room.depositAmount?.toLocaleString('en-IN')} • Available Beds: {room.availableBeds}/{room.totalBeds}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                        ₹{room.rentMonthly?.toLocaleString('en-IN')}<span style={{ fontSize: '0.8rem', fontWeight: 500 }}>/mo</span>
                      </div>
                      <button 
                        onClick={() => {
                          if (!user) return onOpenAuth();
                          if (user.role !== 'ROLE_TENANT') return alert("Only Tenants can book rooms!");
                          setSelectedRoom(room);
                        }}
                        className="btn-gold" 
                        style={{ marginTop: '0.4rem', padding: '0.4rem 1.2rem', fontSize: '0.85rem' }}
                      >
                        Book This Room
                      </button>
                    </div>
                  </div>
                )) : (
                  <p style={{ color: 'var(--text-muted)' }}>No room configurations currently listed.</p>
                )}
              </div>
            </div>

            {/* Reviews & Ratings Section */}
            <div className="glass-card" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Tenant Reviews ({reviews.length})</h3>
                <StarRating rating={property.ratingAvg || 4.5} count={reviews.length} size={18} />
              </div>

              {/* Submit Review Form */}
              {user && user.role === 'ROLE_TENANT' && (
                <form onSubmit={handleAddReview} style={{ background: 'var(--bg-surface)', padding: '1.2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.75rem' }}>Write a Review</h4>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Overall Rating</label>
                    <StarRating rating={userRating} interactive onChange={(r) => setUserRating(r)} size={22} />
                  </div>
                  <textarea 
                    className="input-field"
                    rows={3}
                    placeholder="Share your experience regarding food, cleanliness, Wi-Fi speed, and owner behavior..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    required
                    style={{ marginBottom: '0.8rem' }}
                  />
                  <button type="submit" className="btn-gold" disabled={submittingReview} style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>
                    {submittingReview ? "Posting..." : "Submit Review"}
                  </button>
                </form>
              )}

              {/* Review Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {reviews.map(rev => (
                  <div key={rev.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{rev.tenant?.name || "Verified Tenant"}</div>
                      <StarRating rating={rev.rating} size={14} />
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sticky Sidebar */}
          <div>
            <div className="glass-card" style={{ padding: '1.8rem', position: 'sticky', top: '90px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Starting Rent</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '1.5rem' }}>
                ₹{property.startingRent?.toLocaleString('en-IN')}<span style={{ fontSize: '1rem', fontWeight: 500 }}>/mo</span>
              </div>

              {/* Owner Info Card */}
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Property Landlord</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold-glow)', border: '1px solid var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--gold-light)' }}>
                    {property.owner?.name?.charAt(0) || 'V'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{property.owner?.name || "Vikram Reddy"}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <ShieldCheck size={12} /> Identity Verified
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Call to Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <button 
                  onClick={() => {
                    if (!user) return onOpenAuth();
                    if (property.rooms && property.rooms.length > 0) setSelectedRoom(property.rooms[0]);
                  }}
                  className="btn-gold" 
                  style={{ width: '100%', height: '48px', fontSize: '1rem' }}
                >
                  Book Room Now
                </button>

                <a 
                  href={`tel:${property.owner?.phone || '+919876543210'}`} 
                  className="btn-outline" 
                  style={{ width: '100%', justifyContent: 'center', height: '44px', fontSize: '0.9rem' }}
                >
                  <Phone size={16} /> Contact Owner
                </a>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                🔒 Zero Brokerage • Direct Owner Booking • Safe Escrow
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Booking Trigger Modal */}
      {selectedRoom && (
        <BookingModal 
          room={selectedRoom} 
          property={property} 
          onClose={() => setSelectedRoom(null)}
          onSuccess={() => fetchDetails()}
        />
      )}
    </div>
  );
}
