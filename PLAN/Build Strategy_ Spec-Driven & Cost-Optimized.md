# **🛠️ Build Strategy: Spec-Driven & Cost-Optimized**

## **I. Spec-Driven Workflow (GitHub Spec Kit)**

All development must strictly adhere to the Spec Kit's four-phase workflow, leveraging AI agents for task breakdown and code drafting. **Human validation at every checkpoint is mandatory.**

## **II. Technical Implementation Directives**

| Component | Directive | Cost/Scale Justification |
| :---- | :---- | :---- |
| **Monetization Core** | Prioritize Stripe Connect setup (webhooks, subscriptions) for P3. The 0\\% commission fee on the Free Tier must be enforced via the payment logic. | Ensures immediate revenue generation (P3) is built on the core competitive advantage. |
| **Image Delivery Sync** | Implement the **XMP Metadata Export/Import** feature (P4). Client-side culling data is stored in DB, exported as XMP sidecar files for C1/LR desktop import. | **Near zero cost** solution for editing integration. Defer the expensive **Dedicated LR/C1 Plugins** to P7+. |
| **Storage & Cost Control** | All media uploads must use **Cloudflare R2** for hosting. High-cost logic (Reputation) must use **Cloudflare Workers** (3M/month free quota) over Supabase Edge Functions. | Critical for maintaining the 0/month budget during the Soft Launch phase. |
| **Core Gating Logic** | The **Max 3 Active Projects** limit for Free Tier users is the primary conversion hook. This must be a central, hardened RLS/DB constraint in P1. | Drives conversion to the affordable $5 Growth Premium tier. |

## **III. Revised Dependency Roadmap (P3 & P4 Focus)**

The build order reflects the requirement to monetize quickly and integrate high-value provider tools.

1. **Attendance Tracking** \\rightarrow **Reputation Logic Engine** (Edge Function) \\rightarrow **Reputation Tier Display**  
2. **Stripe Connect** \\rightarrow **Commission Milestone Payments** \\rightarrow **Service Booking & Deposit (0% Commission)**  
3. **Client Proofing UI (in-app culling)** \\rightarrow **XMP Metadata Export/Import** (P4 Integration)  
4. **Reputation System** \\rightarrow **Two-Way Reviews** \\rightarrow **Provider Profile & Rate Cards**  
5. **AI Credit System** \\rightarrow **Core AI Integrations** (Task/Pose Suggestions)