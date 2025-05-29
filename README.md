# Find a Community – Step 1: Database Schema Design

## 📌 Project Overview

**Find a Community** is a responsive web app designed to help newcomers in Vancouver (and eventually, other cities) quickly find local groups aligned with their interests — whether it's a church, a volleyball team, a language exchange circle, or study group.

When I first moved to Vancouver, I wanted to find a Brazilian church—but I had no idea where to look. Like many newcomers, I ended up scrolling through Facebook, asking in WhatsApp groups, and hoping someone would point me in the right direction.

Event sites like Meetup are helpful, but they mostly focus on one-time events and make it hard to find ongoing or regular communities.  
**Find a Community** solves this by offering one simple place to search, join, and stay updated on groups you care about. In the future, an AI feature will suggest communities based on your profile and bio.

---

## 🧩 Current Deliverable: Database Schema

This commit includes the **Entity-Relationship (ER) Diagram** and full database schema planning.

### ✅ Tables Created:
- `users`
- `roles`
- `categories`
- `user_interests`
- `communities`
- `events`
- `memberships`
- `event_participants`

> ER Diagram generated with [dbdiagram.io](https://dbdiagram.io) is included as an image in this repo.  
> Each table is documented and designed with real-world field sizes and relational integrity.

---

## 🧠 Core Functionalities (to be implemented next)

- Account creation and user profiles with interests
- Community search and filtering
- Community profile pages with location and upcoming events
- Join/leave community + personal dashboard
- Organizer dashboard to manage communities and events

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

## 📅 Next Steps

- Implement the Prisma schema based on this model  
- Set up database migrations and seed data  
- Start backend routes and authentication logic

---

## ✅ Commit Summary

This commit includes:
- Complete DBML schema  
- ER diagram screenshot  
- README documentation for Step 1

---

> Feel free to clone, suggest, or fork. Feedback is welcome as I move into the development phase!