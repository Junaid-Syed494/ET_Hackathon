# 🌐 ET Intelligence: AI-Powered Enterprise Terminal

> **A next-generation news consumption engine that learns who you are and builds your feed dynamically.**

ET Intelligence is a personalized, behavior-driven news dashboard built for modern professionals. It replaces generic news feeds with targeted "Intelligence Briefings" based on user personas, behavioral interactions, and real-time visual synthesis.

---

## ✨ Core Features

* **🧠 AI Persona Calibration:** Brand-new users undergo a sleek onboarding calibration quiz. The engine analyzes their priorities and assigns them a tailored archetype (e.g., *Founder, Investor, Executive, Student*).
* **🎯 Dynamic Intelligence Feed:** The dashboard automatically locks into the user's persona, filtering out noise and presenting only highly relevant market data and news.
* **🎬 Zero-Cost Visual Studio:** Reading is optional. Users can click "Experience Visually" on any article to trigger an immersive, cinematic video overlay. It utilizes the browser's native Web Speech API and CSS animations to deliver a zero-latency, zero-cost audiovisual broadcast.
* **🔄 Behavioral Feedback Loop:** Every "Like" and "Share" is tracked in the database, allowing the algorithm to continuously refine and perfect the user's intelligence feed over time.
* **🌍 Vernacular Engine:** Instant UI translation capabilities, breaking down language barriers and making high-level financial intelligence accessible globally.

---

## 🏗️ Tech Stack & Architecture

* **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
* **Authentication:** NextAuth.js (Credentials Provider with custom Bouncer logic)
* **Database:** PostgreSQL (Hosted on Supabase)
* **ORM:** Prisma (with the new V7 Postgres Adapter)
* **Icons & UI:** Lucide React, Custom CSS Animations

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone [https://github.com/Junaid-Syed494/ET_Hackathon.git](https://github.com/Junaid-Syed494/ET_Hackathon.git)
cd ET_Hackathon
```
2. Install dependencies
```Bash
npm install
```
3. Set up Environment Variables
Create a .env file in the root directory and add your secure keys:
```
Code snippet 
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="et_intelligence_super_secret_hackathon_key_2026"

# Supabase PostgreSQL Connection
DATABASE_URL="postgresql://postgres:ET_Intelligence@2026@db.skzugjsmnimzituwlfxd.supabase.co:5432/postgres"

# Supabase API Keys (For Python Ingestion Script)
SUPABASE_URL="https://skzugjsmnimzituwlfxd.supabase.co"
SUPABASE_KEY="sb_publishable_I6yPqk41YTE4VXBrqU-dtQ_3SiOu05_"

```
4. Push the Database Schema
```Bash
npx prisma db push
```
5. Run the Development Server
```Bash
npm run dev
```
Open http://localhost:3000 to access the terminal.
