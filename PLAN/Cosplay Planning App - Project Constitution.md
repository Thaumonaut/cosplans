# **🎯 Cosplay Planning App \- Project Constitution**

## **Core Guiding Principles (Immutable)**

1. **Reduce Overwhelm:** Features must enforce prioritization (e.g., **Max 3 Active Projects** for Free Tier) and provide an "Idea Bank" for future plans. UI must be clean and progress-oriented.  
2. **Build Community Trust & Accountability (Tiered):** The Reputation System is the foundation. It must be transparent, use **Tiers** (not raw scores), and enforce accountability via **Event Restrictions**. Must include the **Reputation Grace** mechanism (2 tokens per 12 months) for unavoidable emergencies.  
3. **Flexible & Fair Monetization:** The system must be affordable. Leverage a **low-cost $5 Growth Premium tier** as the primary conversion driver. Offer \\mathbf{0\\%} commission fee on free-tier marketplace sales to aggressively compete against industry standards.  
4. **Data Safety & Permanent Portfolio:** The **Personal Team** is a permanent portfolio archive, intrinsically linked to the user profile. It is never permanently deleted unless the entire user account is deleted. Cost-optimization requires aggressive use of **Cold Storage** for archived data.  
5. **AI is Assistive, Not Creative:** **AI features must be strictly Opt-In** and restricted to **planning, brainstorming, and organizational tasks only** (e.g., task generation, suggestion). Publicly displayed work that used AI must carry an **\[AI-Assisted\] tag**.  
6. **Dependency-First Development:** Features with high internal dependencies (e.g., Reputation, Stripe Payments) must be built and hardened before dependent features are built atop them.  
7. **Solo Developer Efficiency:** All technical decisions must prioritize development speed, automated testing, and minimal maintenance burden, leveraging **SvelteKit \+ Supabase RLS** to the fullest extent.

## **Technical Stack & Constraints**

* **Stack:** SvelteKit, Supabase (PostgreSQL, Auth, RLS, Edge Functions), Bun, Vite, TypeScript.  
* **Storage:** Cloudflare R2 or AWS S3 (Hot/CDN) and Cold Storage (Archive).  
* **Payments:** Stripe Connect.  
* **AI:** OpenAI, Claude, Google Vision (Opt-In only), governed by the **AI Credit System**.