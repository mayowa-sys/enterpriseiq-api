# EnterpriseIQ API

A multi-tenant enterprise appointment management system with role-based access control, audit logging, and a real-time analytics microservice.

## Live URLs
- **API Base:** `web-production-eea9a.up.railway.app`
- **Analytics Service:** `web-production-12be9.up.railway.app`
- **Analytics Repo:** https://github.com/mayowa-sys/enterpriseiq-analytics

## What It Does

EnterpriseIQ allows organisations to manage appointments, staff, and clients — and generates business intelligence from that data. Multiple organisations can use the same system with complete data isolation between them.

A banking organisation can manage loan review appointments, account openings, and consultations. A telecom organisation can manage network audit slots. Each organisation's data is completely invisible to others.

## Architecture

```
Client (Postman / Frontend)
        ↓
Node.js API (Express + TypeScript)
  ├── Auth & RBAC (JWT)
  ├── Organisation Management
  ├── User Management
  ├── Appointment CRUD (Factory Pattern)
  └── Analytics Proxy
        ↓
Python Microservice (FastAPI)
  └── MongoDB Aggregation Pipelines
        ↓
MongoDB Atlas (Shared Database)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | Node.js, TypeScript, Express |
| Analytics | Python, FastAPI, Motor |
| Database | MongoDB Atlas |
| Auth | JWT (access + refresh tokens) |
| Validation | Zod |
| Deployment | Railway |

## Features

- **Multi-tenant architecture** — complete data isolation per organisation
- **4 user roles** — Super Admin, Org Admin, Staff, Client
- **Factory Design Pattern** — 5 extensible appointment types with type-specific validation
- **Audit logging** — every mutation recorded with before/after snapshots
- **Analytics microservice** — peak hours, staff utilisation, no-show rates, revenue estimates
- **JWT authentication** — access tokens + refresh token rotation

## Appointment Types

| Type | Industry | Required Fields |
|------|----------|----------------|
| `consultation` | Healthcare | symptoms |
| `loan_review` | Banking | loanAmount, accountNumber |
| `account_opening` | Banking | idType, idNumber, bvn |
| `network_audit` | Telecom | siteId, issueType |
| `general` | Any | none |

## API Endpoints

### Auth
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
```

### Organisations
```
POST   /api/v1/organisations
GET    /api/v1/organisations
GET    /api/v1/organisations/:id
PATCH  /api/v1/organisations/:id
PATCH  /api/v1/organisations/:id/suspend
```

### Users
```
POST   /api/v1/users/staff
POST   /api/v1/users/client
GET    /api/v1/users
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id/deactivate
```

### Appointments
```
POST   /api/v1/appointments
GET    /api/v1/appointments
GET    /api/v1/appointments/mine
GET    /api/v1/appointments/:id
PATCH  /api/v1/appointments/:id/status
PATCH  /api/v1/appointments/:id
DELETE /api/v1/appointments/:id
```

### Analytics
```
GET    /api/v1/analytics/summary
GET    /api/v1/analytics/peak-hours
GET    /api/v1/analytics/no-show-rate
GET    /api/v1/analytics/staff-utilisation
GET    /api/v1/analytics/volume-trend
GET    /api/v1/analytics/revenue-estimate
```

### Audit Logs
```
GET    /api/v1/audit-logs
GET    /api/v1/audit-logs/:id
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Python analytics service running (see analytics repo)

### Setup

```bash
git clone https://github.com/mayowa-sys/enterpriseiq-api
cd enterpriseiq-api
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### Environment Variables

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/enterpriseiq
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=7d
ANALYTICS_SERVICE_URL=http://localhost:8000
INTERNAL_API_KEY=your_internal_key
```

### Seed Demo Data

```bash
npm run seed
```

This creates a demo organisation, admin, staff member, client, and sample appointments so you can test all endpoints immediately.

### Demo Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@enterpriseiq.com | Admin2026! |
| Org Admin | admin@zenithbank.com | Admin2026! |
| Staff | chidi@zenithbank.com | Staff2026! |
| Client | emeka@zenithbank.com | Client2026! |

## Design Decisions

**Why the Factory Pattern?** Each appointment type has different validation rules and required metadata. The Factory Pattern means adding a new type requires creating one class and one registry entry — nothing else changes.

**Why a separate Python microservice?** Python's aggregation tooling and data ecosystem make it better suited for analytics pipelines. The separation also means the analytics layer can scale independently from the core API.

**Why audit logging on every mutation?** Enterprise systems require accountability.