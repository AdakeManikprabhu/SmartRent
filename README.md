# SmartRent — AI-Powered PG & Rental Management Platform

**SmartRent** is a production-quality full-stack SaaS platform for discovering, comparing, booking, and managing PGs, hostels, and rental rooms. Designed with a luxury dark/gold aesthetic (`#0a0a0c`, `#121318`, `#D4AF37`), SmartRent eliminates fake brokers and manual rent tracking by combining natural-language AI search, match-score recommendation algorithms, automated maintenance classification, and role-based management portals.

---

## 🌟 Key Features

### 1. 🔍 Natural Language AI Search
- Type plain-English queries like:
  > *"Find me a single room PG near REVA University under ₹12,000 with food and Wi-Fi"*
- The backend AI engine automatically extracts structured filter parameters (`location = REVA University`, `roomType = SINGLE`, `maxRent = 12000`, `food = true`, `wifi = true`) and queries the database directly.

### 2. 🎯 AI Match Recommendation Engine
- Takes user preferences (budget, location, sharing option, amenities, max distance) and calculates real match percentages (e.g., **94% Match**).
- Displays explicit explanation points explaining why the property was recommended.

### 3. 🛡️ Role-Based Portals & JWT Security
- **Tenant Portal**: Browse listings, run NLP queries, save favorites, submit room booking requests, pay monthly rent with simulated gateway & receipts, submit maintenance complaints, write multi-criteria property reviews (1–5 stars).
- **Owner Portal**: Manage listings, add rooms & pricing, upload images, approve/reject tenant booking requests, track monthly rent collection revenue, respond to maintenance complaints, generate property marketing descriptions using AI.
- **Admin Portal**: Platform metrics overview, property verification badge toggling, user management audit.

### 4. 🛠️ AI Complaint Auto-Classification
- Automatically parses complaint descriptions (e.g., *"My Wi-Fi drops every evening at 8 PM"*) to auto-assign category (`WIFI`) and priority (`MEDIUM`) with manual override options for tenants and landlords.

### 5. ⚖️ Property Comparison Matrix
- Compare up to 4 properties side-by-side across rent, distance to hub, rating, food, Wi-Fi, AC, and laundry with automated **Best Value** highlighting.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Axios, Lucide Icons, Custom Black/Off-White/Gold Vanilla CSS system.
- **Backend**: Java 17/22, Spring Boot 3.2, Spring Web, Spring Data JPA, Hibernate, Spring Security, JWT (0.12.5), Bean Validation, Maven.
- **Database**: PostgreSQL (Production) + Embedded H2 Fallback (Local Dev Profile).
- **AI Service**: Natural-Language Parser, Match Scorer, Complaint Classifier, Description Generator.

---

## 🚀 Quick Start Instructions

### Prerequisites
- **Node.js** (v18+) & **npm**
- **Java JDK** (17 or 22)
- **Maven** (or bundled build)

### 1. Running the Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
* The backend API server will start at `http://localhost:8080`.
* The embedded H2 console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:smartrentdb`, Username: `sa`, Password: empty).
* Seed data (20+ properties, 50+ rooms, reviews, users) is automatically populated on startup!

### 2. Running the Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
* Open `http://localhost:5173` in your browser.

---

## 🔐 Seed Demo Credentials

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Tenant** | `tenant@smartrent.com` | `password123` | Book rooms, pay rent, log complaints, favorites |
| **Owner** | `owner1@smartrent.com` | `password123` | List properties, approve bookings, track revenue |
| **Admin** | `admin@smartrent.com` | `password123` | Verify properties, audit users & platform revenue |

---

## 📡 REST API Summary

```http
POST   /api/auth/register          Register new tenant/owner
POST   /api/auth/login             Authenticate user & receive JWT token
GET    /api/auth/me                Get logged-in user profile

GET    /api/properties             List verified properties
GET    /api/properties/search      Filter properties (city, area, rent, distance)
GET    /api/properties/{id}        Get property details & rooms
POST   /api/properties             Create new property (Owner/Admin)

POST   /api/bookings               Submit room booking request (Tenant)
GET    /api/bookings/my            Get tenant booking requests
PUT    /api/bookings/{id}/approve  Approve booking request (Owner)
PUT    /api/bookings/{id}/reject   Decline booking request (Owner)

POST   /api/payments/pay           Process rent payment (Tenant)
GET    /api/payments/history       Get tenant payment history
GET    /api/payments/owner/analytics Get owner revenue stats

POST   /api/complaints             Submit maintenance issue (Tenant)
PUT    /api/complaints/{id}/status Update complaint status (Owner)

POST   /api/ai/search              Natural language search parsing
POST   /api/ai/recommendations     Generate match score recommendations
POST   /api/ai/classify-complaint  Auto-classify complaint category & priority
POST   /api/ai/generate-description Generate AI marketing property copy
```
