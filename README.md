# VESIT Found - Lost & Found Portal

A premium, full-stack campus utility designed for the **Vivekananda Education Society's Institute of Technology (VESIT)** community. This portal allows students and staff to efficiently report, search, and reclaim lost items using a modern, smart, and secure interface.

## 🌟 Key Features
- **💎 Premium Glassmorphism UI**: A high-end, modern design language featuring smooth backdrop blurs, refined typography, and a "VESIT Blue" institutional color palette.
- **🔍 Advanced Search & Discovery**: Filter through reports by **Campus Location** (Canteen, Library, etc.), **Categories**, and **Date Ranges** (Today, This Week, This Month).
- **🤖 Smart Registration**: Context-aware onboarding that dynamically maps graduation years to specific institutional class IDs (e.g., D12A, D17B, D6ADA), preventing data entry errors.
- **🛡️ Secure Institutional Access**: JWT-based authentication strictly restricted to `@ves.ac.in` email addresses, ensuring a closed and safe community environment.
- **📱 Responsive Experience**: Fully optimized for mobile and desktop, providing a seamless reporting experience on the go.
- **⚡ Real-time Analytics**: Live statistics on active lost items, found items today, and successfully returned belongings.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS (Custom Premium Design)
- **Backend**: Node.js, Express.js (Centralized Auth Middleware)
- **Database**: PostgreSQL with Prisma ORM
- **State/Auth**: JSON Web Tokens (JWT) & bcryptjs

## 🚀 How to Run the Project Locally

To run this project, you will need to run the **Backend API** and the **Frontend React App** simultaneously.

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A running [PostgreSQL](https://www.postgresql.org/) database.

---

### 1. Backend Setup (API & Database)
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install all required Node dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables. Open the `.env` file in the `backend` folder and ensure it looks like this:
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_here
   DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/YOUR_DB_NAME?schema=public"
   ```
   *(Make sure to replace the `DATABASE_URL` with your actual local PostgreSQL credentials).*

4. Push the Prisma database schema to automatically generate your SQL tables:
   ```bash
   npx prisma db push
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend should now be running on `http://localhost:5000`.*

---

### 2. Frontend Setup (React App)
1. Open a **new** separate terminal window and stay in the root folder of the project (where `vite.config.js` is located).
2. Install all frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite frontend development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to the local URL provided by Vite (usually `http://localhost:5173`).

🎉 **You are ready to go! Ensure you use a valid `@ves.ac.in` email when registering an account.**
