# 📸 Socialy - Full-Stack Social Media Platform

<div align="center">

A feature-rich, mobile-first social media application inspired by Instagram, built from scratch with modern web technologies.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

## 🎯 Project Overview

**Socialy** is a comprehensive social media platform that replicates core Instagram functionalities. This project demonstrates my ability to build **production-ready, full-stack applications** with attention to user experience, performance, and clean code architecture.

### Why I Built This

- To showcase **end-to-end development skills** - from database design to pixel-perfect UI
- To demonstrate proficiency in the **modern React/Next.js ecosystem**
- To implement **real-world features** like authentication, file uploads, and real-time interactions
- To practice building **scalable, maintainable code** following industry best practices

---

## ✨ Key Features

### 👤 User Management
- **JWT Authentication** - Secure login/registration system with token-based auth
- **User Profiles** - Customizable profiles with avatars, bios, and post galleries
- **Follow System** - Follow/unfollow users with real-time follower counts
- **User Search** - Find and discover other users on the platform

### 📷 Content Creation
- **Photo Posts** - Create posts with captions, location tags, and image uploads
- **Stories** - 24-hour ephemeral content with music integration
- **Reels** - Short-form video content with dedicated explore page
- **Highlights** - Save favorite stories to profile highlights

### 💬 Social Interactions
- **Comments** - Nested comments with like functionality
- **Likes** - Like posts and comments with optimistic UI updates
- **Bookmarks** - Save posts for later viewing
- **Direct Messages** - Real-time messaging between users

### 🎨 User Experience
- **Mobile-First Design** - Responsive layout optimized for all devices
- **Smooth Animations** - Polished micro-interactions and transitions
- **Optimistic Updates** - Instant UI feedback for better perceived performance
- **Dark/Light Theme** - System-aware theme switching

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | PostgreSQL, Prisma ORM |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **File Storage** | Cloudinary (images & videos) |
| **Deployment** | Vercel (frontend), Supabase (database) |
| **Tools** | ESLint, Prettier, Git |

---

## 🏗️ Architecture Highlights

### Clean Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── layout/          # Navigation, headers, footers
│   ├── profile/         # Profile-specific components
│   ├── post/            # Post cards, grids, modals
│   └── shared/          # Buttons, avatars, inputs
├── pages/
│   ├── api/             # RESTful API endpoints
│   │   ├── auth/        # Login, register, verify
│   │   ├── users/       # User CRUD operations
│   │   ├── posts/       # Post management
│   │   ├── stories/     # Story endpoints
│   │   └── messages/    # Direct messaging
│   └── [routes].tsx     # Page components
├── context/             # React Context (Auth, Notifications)
├── lib/                 # Utilities, Prisma client, Cloudinary
└── styles/              # Global styles, Tailwind config
```

### Database Schema
- **Relational design** with Prisma ORM
- **Optimized queries** with proper indexing
- **Normalized structure** for data integrity

### API Design
- **RESTful endpoints** following best practices
- **Middleware** for authentication and error handling
- **Input validation** and sanitization


## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Cloudinary account (for media uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/orpazavdaev/Socialy.git
cd Socialy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up the database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

## 🔮 Future Improvements

- [ ] WebSocket integration for real-time notifications
- [ ] Push notifications
- [ ] Video stories support
- [ ] Advanced search with filters
- [ ] Analytics dashboard

---

## 📄 License

This project is built for educational and portfolio purposes. Feel free to explore the code!

---

<div align="center">

**⭐ If you found this project interesting, please give it a star! ⭐**

</div>
