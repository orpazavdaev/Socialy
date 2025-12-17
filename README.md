# 📸 Instagram Clone

A beautiful, mobile-first Instagram clone built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- 👤 **Profile Page** - User profile with highlights, stats, and posts grid
- 💬 **Comments** - Comment list with likes and replies
- ⚙️ **Settings** - Comprehensive settings with Meta Accounts Center
- 📖 **Stories** - Full-screen story viewer with music info
- 🎬 **Reels** - Explore grid with search
- 📷 **Create Post** - Photo selection with POST/STORY/REEL tabs

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API Routes
│   │   ├── users/
│   │   └── posts/
│   ├── profile/          # Profile page
│   ├── comments/         # Comments page
│   ├── settings/         # Settings page
│   ├── story/            # Story viewer
│   ├── reels/            # Reels/Explore
│   └── create/           # Create post
└── components/
    ├── layout/           # BottomNav
    ├── profile/          # Profile components
    └── shared/           # Avatar, Button
```

## 🎨 Design System

### Colors (Light Theme)
- Background: `#FFFFFF`
- Border: `#DBDBDB`
- Text: `#262626`
- Muted: `#8E8E8E`
- Accent: `#0095F6`

### Bottom Navigation
Dark pill-shaped navigation bar with icons for:
- Home, Search, Create, Reels, Profile

## 📡 API Routes

Ready-to-use API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api` | API info |
| GET | `/api/users` | List users |
| POST | `/api/users` | Create user |
| GET | `/api/posts` | List posts |
| POST | `/api/posts` | Create post |

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Profile | `/profile` | User profile with highlights |
| Comments | `/comments` | Post comments |
| Settings | `/settings` | App settings |
| Story | `/story` | Story viewer |
| Reels | `/reels` | Explore grid |
| Create | `/create` | New post creation |

## 📄 License

This project is for educational purposes only. Instagram is a trademark of Meta Platforms, Inc.
