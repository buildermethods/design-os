# Cost Estimator & Optimizer

You are helping the user estimate and optimize the infrastructure and service costs for their product. This creates a clear picture of what it will cost to run the product at different scales.

## Step 1: Check Prerequisites

First, verify that the product overview and tech stack exist:

1. Read `/product/product-overview.md` to understand the product
2. Read `/product/tech-stack/tech-stack.md` to understand the technology choices

If the product overview is missing:

"Before estimating costs, you'll need to establish your product vision. Please run `/product-vision` first."

If the tech stack is missing:

"Before estimating costs, you'll need to define your tech stack. Please run `/tech-stack` first so I know which services and infrastructure to estimate."

Stop here if prerequisites are missing.

## Step 2: Explain the Process

"Let's estimate the monthly costs for running **[Product Name]** based on your tech stack.

I'll create cost estimates for different usage tiers:
1. **Starter** — Early stage, small user base
2. **Growth** — Scaling up, moderate traffic
3. **Scale** — Production-grade, high traffic

I'll also suggest optimizations to reduce costs.

Do you have a target budget or any pricing constraints I should know about?"

Wait for their response.

## Step 3: Analyze Tech Stack Costs

Based on the tech stack choices, identify all cost-bearing services:

- **Hosting/Compute** — Server instances, serverless functions, edge workers
- **Database** — Managed database services, storage, backups
- **Authentication** — Auth service pricing per MAU
- **Storage** — File storage, CDN, media processing
- **Email/Notifications** — Transactional email, push notifications
- **Monitoring** — Error tracking, analytics, logging
- **Domain/DNS** — Domain registration, DNS hosting
- **Third-party APIs** — Any external services

For each service, research typical pricing for the chosen technology.

## Step 4: Build Cost Tiers

Present cost estimates for each tier using the AskUserQuestion tool to refine:

"Here's my estimate for the **Starter** tier (~[X] users):

| Category | Item | Monthly Cost | Notes |
|----------|------|-------------|-------|
| Hosting | [Service] | $[X] | [Plan details] |
| Database | [Service] | $[X] | [Plan details] |
| Auth | [Service] | $[X] | [Plan details] |
| ... | ... | ... | ... |

**Estimated total: $[X]/mo**

Does this look reasonable? Any services I'm missing?"

Repeat for Growth and Scale tiers.

## Step 5: Identify Optimizations

Suggest ways to reduce costs:

"Here are some cost optimizations to consider:

1. **[Optimization]** — [How it saves money and estimated savings]
2. **[Optimization]** — [How it saves money and estimated savings]
3. **[Optimization]** — [How it saves money and estimated savings]

Common optimizations:
- Use free tiers where available (Vercel, Supabase, Clerk all have generous free tiers)
- Use serverless instead of always-on servers for low-traffic stages
- Self-host open-source alternatives for services with high per-user costs
- Use CDN caching to reduce compute costs
- Reserve instances for predictable workloads at scale
- Consolidate services (e.g., Supabase for auth + database + storage)

Which of these interest you?"

## Step 6: Present Final Estimate

"Here's your complete cost estimate for **[Product Name]**:

**Starter ([X] users):** ~$[X]/mo
**Growth ([X] users):** ~$[X]/mo
**Scale ([X] users):** ~$[X]/mo

**Top optimizations:**
- [Optimization 1]
- [Optimization 2]
- [Optimization 3]

Ready to save?"

## Step 7: Create the File

Once approved, create the file at `/product/cost-estimator/cost-estimate.md` with this exact format:

```markdown
# Cost Estimate

## [Tier Name] ([User Count])

| Category | Item | Monthly Cost | Notes |
|----------|------|-------------|-------|
| [Category] | [Item] | $[Amount] | [Notes] |
| [Category] | [Item] | $[Amount] | [Notes] |

## [Tier Name] ([User Count])

| Category | Item | Monthly Cost | Notes |
|----------|------|-------------|-------|
| [Category] | [Item] | $[Amount] | [Notes] |
| [Category] | [Item] | $[Amount] | [Notes] |

[Add more tiers as needed]

## Optimizations
- [Optimization 1 with details]
- [Optimization 2 with details]
- [Optimization 3 with details]
```

**Important:** The format with `## Tier Name (User Count)` and the markdown table must match exactly for the app to parse it correctly. Cost values should include the dollar sign (e.g., `$50`).

## Step 8: Confirm Completion

Let the user know:

"I've created your cost estimate at `/product/cost-estimator/cost-estimate.md`.

**Summary:**
- Starter ([X] users): ~$[X]/mo
- Growth ([X] users): ~$[X]/mo
- Scale ([X] users): ~$[X]/mo

**Key optimizations identified:** [count]

This gives you a clear picture of what it will cost to run your product. Review and adjust the estimates as you get more specific pricing from providers.

Next step: Run `/qa-tests` to generate QA test cases for your product sections."

## Important Notes

- Use realistic pricing from actual service providers (as of your knowledge)
- Always include free tier options where available
- Round to reasonable numbers — don't give false precision
- Include notes explaining what each line item covers
- Costs should be monthly unless otherwise specified
- Focus on infrastructure costs, not development costs
- The Growth tier should represent a realistic near-term target
- Include 3 tiers minimum — Starter, Growth, Scale
- Optimizations should be actionable and specific
