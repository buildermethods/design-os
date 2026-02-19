# Cadence — Project Vision & Evolution Document

> **Last Updated:** 2026-01-19  
> **Project Status:** Planning → Production  
> **Document Purpose:** Living document capturing vision, decisions, and evolution of Cadence from design prototype to production-ready SaaS

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Project Context](#project-context)
3. [Product Vision](#product-vision)
4. [Technical Reality Assessment](#technical-reality-assessment)
5. [Constraints & Requirements](#constraints--requirements)
6. [Production Strategy](#production-strategy)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Decision Log](#decision-log)
9. [Open Questions](#open-questions)
10. [Session Notes](#session-notes)

---

## Executive Summary

**Cadence** is a Sales Operating System designed for Indian educator and coaching businesses. It transforms chaotic lead handling into a predictable conversion machine by providing:
- Daily call queues with prioritized leads
- Automated follow-up scheduling
- Lead scoring and qualification
- Founder dashboards with real-time metrics

### Current State
The project exists as a **design prototype** built using Design OS (by Brian Casel). The UI components are fully designed in React + Tailwind, but there is **no backend, database, or authentication system** yet.

### Target State  
A minimal, production-ready MVP that can serve 1-5 coaching businesses with their BD teams, running on free-tier infrastructure with near-zero maintenance.

---

## Project Context

### Why This Project Exists

This is part of a larger personal mission:

> **"Building a series of products/services that solve business problems using AI, offered as part of business growth consulting services."**

Key motivations:
- **Social proof** — Demonstrate ability to solve real business problems
- **Proof of work** — Show tangible results to potential consulting clients
- **Portfolio building** — Each solved problem becomes a case study
- **Learning by doing** — Building real products using AI-assisted development

### The Bigger Picture

| Aspect | Detail |
|--------|--------|
| **Builder Philosophy** | Use AI to solve every business problem, one at a time |
| **Business Model** | Offer as free tool to clients → builds trust → consulting revenue |
| **Target Users** | Indian coaching/education businesses (initial focus) |
| **Monetization** | None for this tool — value comes from consulting relationships |

### Development Approach

- **AI-First Development**: Built using Claude Code subscription
- **No Traditional Budget**: Using free tiers of all services
- **Self-Managed**: No external developers or team
- **Time Investment**: Willing to invest in thoughtful, quality implementation
- **Maintenance Goal**: Minimal (1-2 hours/month maximum)

---

## Product Vision

### Problem Statement

Indian coaching businesses lose revenue due to:
1. Follow-ups slipping through cracks (WhatsApp + spreadsheets chaos)
2. BDs wasting effort on low-intent leads (no prioritization)
3. Founders having no visibility (no dashboards)
4. Inconsistent processes (no standardization)
5. No understanding of why leads don't convert (no analytics)

### Solution: Cadence

A simple, focused CRM that does these things exceptionally well:
1. **Today View** — BD's command center: who to call today, in what order
2. **Leads View** — Full lead database with search, filter, history
3. **Dashboard** — Founder's metrics: calls → connects → conversions → revenue
4. **Settings** — Configure stages, drop reasons, team members

### Target Users

| User Type | Role | Primary Needs |
|-----------|------|---------------|
| **BD (Business Developer)** | Makes calls, manages leads | Know who to call, log outcomes quickly |
| **Founder/Admin** | Oversees team, makes decisions | See daily numbers, spot problems early |

### Scale Requirements (Initial)

| Metric | Target |
|--------|--------|
| Organizations (Clients) | 1-5 |
| Users per Organization | 5-10 BDs + 1-2 Admins |
| Leads per Organization | ~500-5,000 |
| Daily Calls per BD | 50-100 |

---

## Technical Reality Assessment

### What Exists Today

| Component | Status | Notes |
|-----------|--------|-------|
| **UI Components** | ✅ Complete | React + Tailwind, production-quality |
| **Design System** | ✅ Complete | Colors, typography, patterns defined |
| **Data Model** | ✅ Designed | Lead, Call, FollowUp, User, Stage, etc. |
| **Sample Data** | ✅ Complete | JSON files for preview |
| **Routing** | ✅ Complete | React Router with main views |

### What Needs to Be Built

| Component | Status | Effort Estimate |
|-----------|--------|-----------------|
| **Database** | ❌ Missing | 4-8 hours (Supabase setup) |
| **Authentication** | ❌ Missing | 4-6 hours (Supabase Auth) |
| **API Layer** | ❌ Missing | 8-16 hours |
| **Data Connectivity** | ❌ Missing | 16-24 hours (connect UI to real data) |
| **Multi-tenancy** | ❌ Missing | 4-8 hours |
| **Deployment** | ❌ Missing | 2-4 hours |
| **Testing** | ❌ Missing | 8-16 hours |

**Total Estimated Effort:** 46-82 hours of AI-assisted development

### Technology Stack (Proposed)

```
Frontend:         React + TypeScript + Tailwind (existing)
Backend:          Supabase (PostgreSQL + Auth + API)
Hosting:          Vercel (free tier)
Database:         Supabase PostgreSQL (free tier: 500MB)
Authentication:   Supabase Auth (free tier: 50,000 MAU)
File Storage:     Supabase Storage (free tier: 1GB) — if needed
```

---

## Constraints & Requirements

### Hard Constraints

| Constraint | Implication |
|------------|-------------|
| **₹0 budget** | Must use free tiers only |
| **No dedicated ops team** | Must be self-healing, minimal maintenance |
| **Built with AI** | Claude Code is the primary development tool |
| **Non-technical maintainer** | Solutions must be simple to manage |

### Free Tier Limits to Respect

| Service | Free Tier Limit | Our Usage | Risk |
|---------|-----------------|-----------|------|
| **Supabase Database** | 500 MB | ~10-50 MB | 🟢 Low |
| **Supabase Auth** | 50,000 MAU | ~50 users | 🟢 Very Low |
| **Supabase API** | 500K requests/month | ~100K | 🟢 Low |
| **Vercel Hosting** | 100 GB bandwidth | ~1-5 GB | 🟢 Low |
| **Vercel Builds** | 6,000 min/month | ~100 min | 🟢 Very Low |

### Quality Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| **No data loss** | 🔴 Critical | Supabase provides automatic backups |
| **99% availability** | 🟡 Important | Free tiers are generally reliable |
| **Fast load times** | 🟡 Important | <3s initial load target |
| **Mobile-friendly** | 🟡 Important | BDs may use phones |
| **Offline capability** | 🟢 Nice-to-have | Not required for MVP |

---

## Production Strategy

### Recommended Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     VERCEL (Frontend)                     │
│  ┌─────────────────────────────────────────────────────┐ │
│  │           React App (Static Build)                   │ │
│  │  • Today View  • Leads  • Dashboard  • Settings      │ │
│  └─────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   SUPABASE (Backend)                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│  │ PostgreSQL   │ │   Auth       │ │  Row Level       │ │
│  │ Database     │ │   (Login)    │ │  Security (RLS)  │ │
│  └──────────────┘ └──────────────┘ └──────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Multi-Tenancy Model

```
Organization (coaching business)
    ├── Users (founder, BDs)
    │      └── Role (admin, bd)
    ├── Leads
    │      └── organization_id (segregates data)
    ├── Calls
    ├── FollowUps
    └── Settings (stages, drop reasons, etc.)
```

**Key Principle:** Every database table has an `organization_id` column, and Row Level Security (RLS) ensures users can only see their organization's data.

### Deployment Strategy

| Phase | What | When |
|-------|------|------|
| **1. Local Development** | Build & test locally | Now → 2-3 weeks |
| **2. Staging** | Deploy to Supabase + Vercel (test) | After local complete |
| **3. Beta** | 1 real client tests | After staging stable |
| **4. Production** | Open to 1-5 clients | After beta feedback |

---

## Implementation Roadmap

### Phase 1: Foundation (Est. 12-16 hours)
- [ ] Set up Supabase project
- [ ] Design database schema
- [ ] Implement Row Level Security
- [ ] Set up Supabase Auth (email/password)
- [ ] Create Supabase client in React app
- [ ] Basic login/logout flow

### Phase 2: Core Features (Est. 24-32 hours)
- [ ] Connect Today View to real data
- [ ] Connect Leads View to real data
- [ ] Connect Dashboard to real data
- [ ] Implement all CRUD operations
- [ ] Lead scoring logic
- [ ] Follow-up scheduling

### Phase 3: Multi-Tenancy (Est. 8-12 hours)
- [ ] Organization management
- [ ] User invitation flow
- [ ] Role-based permissions
- [ ] Organization-scoped settings

### Phase 4: Polish & Deploy (Est. 8-12 hours)
- [ ] Error handling & loading states
- [ ] Vercel deployment
- [ ] Custom domain (optional)
- [ ] Basic monitoring/alerts

### Phase 5: Testing & Beta (Est. 8-16 hours)
- [ ] End-to-end testing
- [ ] Beta client onboarding
- [ ] Bug fixes from feedback
- [ ] Documentation for users

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-19 | Use Supabase for backend | Free tier sufficient, built-in auth, easiest for non-technical maintenance |
| 2026-01-19 | Use Vercel for hosting | Free tier, auto-deploys from Git, zero config |
| 2026-01-19 | Organization-based multi-tenancy | Simpler than separate instances, scales better |
| 2026-01-19 | Email/password auth only | Simplest to implement and support |
| 2026-01-19 | Use Vercel's free subdomain | No custom domain budget, subdomain sufficient for MVP |
| 2026-01-19 | No WhatsApp click-to-call for MVP | Reduces complexity, can add later if needed |
| 2026-01-19 | No email notifications for MVP | App-only notifications, reduces external dependencies |
| 2026-01-19 | No mobile app for MVP | Web app works on mobile browsers, native app out of scope |

---

## Open Questions

### Resolved ✅

| Question | Decision | Date |
|----------|----------|------|
| Custom domain? | Use Vercel's free subdomain for MVP | 2026-01-19 |
| WhatsApp integration? | Not needed for MVP | 2026-01-19 |
| Notifications? | No email reminders for MVP (app-only) | 2026-01-19 |
| Mobile app? | Not in scope for MVP (web works on mobile) | 2026-01-19 |

### Still Open 🔄

1. **Data import?** — How will clients import their existing leads? CSV upload?

---

## Session Notes

### Session 1: 2026-01-19 — Initial Planning

**Context Gathered:**
- Reviewed entire codebase structure
- Confirmed this is a Design OS prototype (no backend)
- Understood the product vision (Cadence for educators)

**User Requirements Documented:**
- Part of larger consulting portfolio mission
- ₹0 budget, Claude Code subscription only
- 1-5 clients, 5-10 BDs each
- Smart/thoughtful implementation over fast
- Near-zero maintenance goal (1-2 hrs/month max)
- Need social proof and proof of work

**Key Insight:**
The product vision is solid, the UI is well-designed, but significant development work is needed to make it functional. The constraint of zero budget limits options but Supabase + Vercel free tiers are more than sufficient for the scale.

**MVP Scope Decisions (Session 1 continued):**
- ✅ Use Vercel's free subdomain (no custom domain)
- ✅ No WhatsApp click-to-call integration for MVP
- ✅ No email notifications for MVP (app-only)
- ✅ No mobile app — web app works on mobile browsers

**Next Steps:**
- [x] Get approval on this document and approach
- [ ] Begin Phase 1: Foundation (Supabase setup + Auth)
- [ ] Create detailed implementation plan for each phase

---

## Appendix

### A. Current File Structure

```
design-os/
├── src/
│   ├── components/       # Reusable UI components
│   ├── sections/         # Main views (today, leads, dashboard)
│   ├── lib/              # Loaders and utilities
│   └── types/            # TypeScript definitions
├── product/
│   ├── data-model/       # Entity definitions
│   ├── design-system/    # Colors, typography
│   ├── sections/         # Screen specs and sample data
│   └── shell/            # App shell design
└── docs/                 # Documentation
```

### B. Data Model Summary

| Entity | Description |
|--------|-------------|
| **Lead** | Prospective customer (score, stage, qualification) |
| **Call** | Call attempt/conversation (outcome, duration, notes) |
| **FollowUp** | Scheduled action (due date, reason, completed) |
| **Stage** | Pipeline step (New, Hot, Won, Lost) |
| **DropReason** | Why lead didn't convert |
| **User** | Team member (BD or Admin role) |
| **Source** | Lead origin (YouTube, WhatsApp, Referral) |

### C. Free Tier Services Reference

| Service | Purpose | Free Tier | Link |
|---------|---------|-----------|------|
| Supabase | Database + Auth | 500MB, 50K users | [supabase.com](https://supabase.com) |
| Vercel | Hosting | 100GB bandwidth | [vercel.com](https://vercel.com) |
| GitHub | Version control | Unlimited repos | [github.com](https://github.com) |

---

*This document will be updated as the project evolves. Each session should add notes and update relevant sections.*
