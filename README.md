# Find a Community

## 📌 Project Overview

**Find a Community** is a responsive web app designed to help newcomers in Vancouver (and eventually other cities) quickly find local groups aligned with their interests — whether it's a church, a volleyball team, a language exchange circle, or a study group.

When I first moved to Vancouver, I wanted to find a Brazilian church — but I had no idea where to look. Like many newcomers, I ended up scrolling through Facebook, asking in WhatsApp groups, and hoping someone would point me in the right direction.

Event sites like Meetup are helpful, but they mostly focus on one-time events and make it hard to find ongoing or regular communities.  
**Find a Community** solves this by offering one simple place to search, join, and stay updated on groups you care about. In the future, an AI feature will suggest communities based on your profile and bio.

---

## 🛠 Technology Stack

### Frontend
- React + TypeScript  
- React Router  
- Tailwind CSS + shadcn/ui  
- React Big Calendar  
- React Leaflet  
- Fetch API

### Backend
- Node.js (Fastify + TypeScript)  
- PostgreSQL (via Prisma ORM)  
- RESTful API  
- JWT for authentication

### DevOps & Hosting
- GitHub Actions (CI/CD)  
- AWS EC2 + S3  
- Supabase for PostgreSQL hosting

---

## 🧩 Database Schema

This repository includes the **Entity-Relationship (ER) Diagram** and database schema for the application.

The schema was designed to support:
- User registration and interest tracking
- Community and event management
- User participation (joining communities and confirming attendance for events)
- Role-based permissions (user, organizer, admin)
- Support for future AI-driven recommendations

### ✅ Tables

- `users`
- `roles`
- `categories`
- `user_interests`
- `communities`
- `events`
- `memberships`
- `event_participants`

> ER diagram generated with [dbdiagram.io](https://dbdiagram.io/d/FSWD-Find-a-Community-6838d1a6bd74709cb72b3376) is available as an image in this repository.

![ER Diagram](./docs/er-diagram.png)

---

> Feel free to explore, suggest improvements, or follow along as the project develops!