import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Star, Heart, Building, Award, Zap, Users } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import NlpSearchBar from '../components/NlpSearchBar';
import api from '../services/api';

export default function LandingPage({ onOpenAuth }) {
  const [city, setCity] = useState('Bengaluru');
  const [location, setLocation] = useState('REVA University');
  const [budget, setBudget] = useState('12000');
  const [roomType, setRoomType] = useState('SINGLE');
  const [featured, setFeatured] = useState([]);
  const [nlpResults, setNlpResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/properties/featured')
      .then(res => setFeatured(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    navigate(`/search?area=${encodeURIComponent(location)}&maxRent=${budget}&roomType=${roomType}`);
  };

  return (
    <div style={{ background: 'var(--bg-dark)' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 4rem',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(212,175,55,0.12) 0%, transparent 60%)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          
          <div className="gold-badge" style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem' }}>
            <Sparkles size={14} /> Next-Gen AI PG & Rental Discovery Platform
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.2rem',
            color: '#ffffff'
          }}>
            Find a place that <span style={{
              background: 'linear-gradient(135deg, #ffffff 0%, var(--gold-light) 60%, var(--gold-primary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>feels like home.</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            marginBottom: '2.5rem',
            maxWidth: '720px',
            margin: '0 auto 2.5rem'
          }}>
            Discover verified PGs, hostels and rental rooms that match your budget, location and lifestyle. Powered by intelligent match recommendations.
          </p>

          {/* Structured Search Box */}
          <form onSubmit={handleQuickSearch} className="glass-card" style={{
            padding: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
            gap: '0.8rem',
            alignItems: 'center',
            marginBottom: '2rem',
            border: '1px solid var(--border-hover)'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'left', marginBottom: '0.2rem', fontWeight: 600 }}>LOCATION</label>
              <select className="input-field" value={location} onChange={(e) => setLocation(e.target.value)} style={{ border: 'none', background: 'rgba(255,255,255,0.04)' }}>
                <option value="REVA University">REVA University, Yelahanka</option>
                <option value="Koramangala">Koramangala</option>
                <option value="Indiranagar">Indiranagar</option>
                <option value="Whitefield">Whitefield</option>
                <option value="HSR Layout">HSR Layout</option>
                <option value="Electronic City">Electronic City</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'left', marginBottom: '0.2rem', fontWeight: 600 }}>MAX BUDGET</label>
              <select className="input-field" value={budget} onChange={(e) => setBudget(e.target.value)} style={{ border: 'none', background: 'rgba(255,255,255,0.04)' }}>
                <option value="8000">Under ₹8,000/mo</option>
                <option value="12000">Under ₹12,000/mo</option>
                <option value="15000">Under ₹15,000/mo</option>
                <option value="20000">Under ₹20,000/mo</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'left', marginBottom: '0.2rem', fontWeight: 600 }}>ROOM TYPE</label>
              <select className="input-field" value={roomType} onChange={(e) => setRoomType(e.target.value)} style={{ border: 'none', background: 'rgba(255,255,255,0.04)' }}>
                <option value="SINGLE">Single Room</option>
                <option value="DOUBLE">Double Sharing</option>
                <option value="TRIPLE">Triple Sharing</option>
              </select>
            </div>

            <button type="submit" className="btn-gold" style={{ height: '48px', padding: '0 2rem', fontSize: '1rem', marginTop: 'auto' }}>
              <Search size={18} /> Search Rooms
            </button>
          </form>

          {/* AI Search Bar Integration */}
          <div style={{ marginTop: '2.5rem' }}>
            <NlpSearchBar onNlpResults={(res) => setNlpResults(res)} />
          </div>

          {/* AI Quick Results Container */}
          {nlpResults && (
            <div style={{ marginTop: '2rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>
                  AI Matched Properties ({nlpResults.matchingProperties?.length || 0})
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--gold-light)' }}>
                  Extracted: Max Rent ₹{nlpResults.extractedMaxRent || '12,000'} • {nlpResults.extractedRoomType || 'Single'}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
                {nlpResults.matchingProperties?.slice(0, 3).map(p => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Popular Locations */}
      <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Popular Neighborhoods</h2>
            <p style={{ color: 'var(--text-muted)' }}>Top student and tech hubs in Bengaluru with instant availability</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { name: "REVA University", count: "14 PGs Available", price: "From ₹8,500/mo", area: "Yelahanka" },
              { name: "Koramangala", count: "22 PGs Available", price: "From ₹11,000/mo", area: "Koramangala" },
              { name: "Indiranagar", count: "18 PGs Available", price: "From ₹10,500/mo", area: "Indiranagar" },
              { name: "Whitefield", count: "25 PGs Available", price: "From ₹9,000/mo", area: "Whitefield" },
              { name: "HSR Layout", count: "19 PGs Available", price: "From ₹10,000/mo", area: "HSR Layout" },
            ].map((loc, idx) => (
              <div 
                key={idx} 
                className="glass-card" 
                onClick={() => navigate(`/search?area=${encodeURIComponent(loc.area)}`)}
                style={{ padding: '1.5rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s ease' }}
              >
                <MapPin size={28} color="var(--gold-light)" style={{ marginBottom: '0.8rem' }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{loc.name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--gold-light)', fontWeight: 600 }}>{loc.count}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{loc.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <div className="gold-badge" style={{ marginBottom: '0.5rem' }}>Handpicked Stays</div>
              <h2 style={{ fontSize: '2.2rem' }}>Featured SmartRent Listings</h2>
            </div>
            <Link to="/search" className="btn-outline">
              View All Properties <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {featured.slice(0, 3).map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Why SmartRent Section */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
            <div className="gold-badge" style={{ marginBottom: '0.75rem' }}>Modern SaaS Architecture</div>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>Why Choose SmartRent?</h2>
            <p style={{ color: 'var(--text-muted)' }}>Built to eliminate fake PG brokers, surprise fees, and delayed maintenance responses.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { title: "100% Verified Owners", desc: "Every property owner undergoes strict background & document verification.", icon: <ShieldCheck size={32} color="var(--gold-light)" /> },
              { title: "Natural-Language AI Search", desc: "Type queries like 'single room near REVA with food under 12k' for instant DB matching.", icon: <Sparkles size={32} color="var(--gold-light)" /> },
              { title: "Online Rent & Receipts", desc: "Pay monthly rent seamlessly with digital receipt history and owner notifications.", icon: <Zap size={32} color="var(--gold-light)" /> },
              { title: "AI Complaint Dispatcher", desc: "Auto-classify maintenance tickets for instant landlord resolution.", icon: <Award size={32} color="var(--gold-light)" /> },
            ].map((feature, i) => (
              <div key={i} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>{feature.icon}</div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Trusted by 10,000+ Students & Owners</h2>
            <p style={{ color: 'var(--text-muted)' }}>Real feedback from tenants residing in top Bangalore PGs</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { name: "Rahul Deshmukh", role: "REVA University Student", text: "SmartRent helped me find Urban Nest PG right opposite my campus in 5 minutes! The AI match score was 96% accurate.", rating: 5 },
              { name: "Ananya Iyer", role: "Software Engineer at Whitefield", text: "Paying rent online with instant receipt generation makes keeping track of my expenses so effortless. Excellent platform!", rating: 5 },
              { name: "Vikram Reddy", role: "PG Owner (8 Properties)", text: "Managing 40+ rooms, rent collection, and maintenance tickets through the Owner Dashboard saved me 20 hours every month.", rating: 5 },
            ].map((t, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: 1.6 }}>"{t.text}"</p>
                <div>
                  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.5rem' }}>
                    {[...Array(t.rating)].map((_, idx) => <Star key={idx} size={14} fill="var(--gold-light)" color="var(--gold-light)" />)}
                  </div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gold-light)' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(10,10,12,0.95) 100%)',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.2rem' }}>
            Ready to find your perfect room?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Join thousands of students and working professionals enjoying hassle-free living on SmartRent.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/search" className="btn-gold" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
              Explore Properties <ArrowRight size={18} />
            </Link>
            <Link to="/ai-recommendations" className="btn-outline" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
              Take AI Match Quiz
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
