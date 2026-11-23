# Bravo Academy — Frontend Web Application
### Official Armed Forces ISSB Preparation Platform
**ARMY · NAVY · AIR FORCE**

This is the Next.js 14 frontend web client for Bravo Academy, featuring:
- Tactical military UI with Tailwind CSS and Framer Motion
- 3D Interactive Jet & Battle Simulator powered by Three.js
- Procedural web audio sound effects synthesizer (sonar, radar, jet scrambles, clicks)
- Official defense courses catalog, checkout, and bKash/Nagad gateway simulation
- 1,000+ defense IQ practice questions engine
- 4-Day ISSB simulation portal (Screening, Psychology, GTO ground tasks, Board Interview)
- Command HQ Admin CMS & Student Cadet Dashboard

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set `BACKEND_URL` and `NEXT_PUBLIC_BACKEND_URL` to point to your backend API server (default: `http://localhost:5000`).

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production (Vercel)
```bash
npm run build
npm start
```
