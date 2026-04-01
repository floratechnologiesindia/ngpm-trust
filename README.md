# NGPM Website Platform

Modern mobile-first website for NGPM/SMPM with:
- Next.js frontend (`apps/web`) on port `6660`
- Node.js + MongoDB API (`apps/api`) on port `6661`
- Docker Compose for local/prod-style orchestration
- Admin panel scaffold for events/gallery CRUD and reorder
- Upload endpoint with image optimization (`sharp`)

## Run with Docker

```bash
docker compose up --build
```

## Run locally

```bash
npm install
npm run dev
npm run dev:api
```

## Content Sources
- Main content: `docs/content.md`
- Magazine PDF: put at `docs/march.pdf` (auto-copy ready)
- Images/logo: place files in `images/` then copy/sync to `apps/web/public/images/`

## Environment
Copy `.env.example` values to your deployment environment.
# NGPM Website

Dockerized full-stack project:
- Frontend: Next.js (SEO-friendly, mobile-first)
- Backend API: Node.js + Express
- Database: MongoDB

## Pages
- Home
- About
- Products
- Loan Consulting Services
- Contact
- Gallery
- Events
- Admin panel (`/admin/login`)

## Run
1. `cp .env.example .env` (already included)
2. `docker compose up --build`
3. Open:
   - Website: `http://localhost:6660`
   - Backend API: `http://localhost:6661/api/health`

## Admin credentials
- Username: value from `.env` (`ADMIN_USERNAME`)
- Password: value from `.env` (`ADMIN_PASSWORD`)

## Notes
- Public content is based on `docs/content.md`.
- Add local website photos into your `images/` folder and wire them as needed.
- `docs/march.pdf` was not found in this workspace; add it to include magazine content.
