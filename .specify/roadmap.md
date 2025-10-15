# Cosplans Feature Roadmap

**Purpose**: Track planned features and their priority for the Cosplans cosplay photoshoot management application.

**Last Updated**: 2025-10-15

---

## Current Specifications (In Progress)

| ID | Feature | Status | Branch |
|----|---------|--------|--------|
| 001 | Shoot Transfer Between Teams | ✅ Spec Complete | `001-shoot-transfer` |
| 002 | AI-Generated Reference Poses with Face Swap | ✅ Spec Complete | `002-ai-references` |
| 003 | AI-Powered Backdrop and Location Suggestions | ✅ Spec Complete | `003-generate-backdrop-or` |

---

## High Priority Features (Next to Spec)

These features are critical to the core cosplay photoshoot workflow and should be implemented early.

### Content Creation & Planning

| Feature | Description | Why High Priority |
|---------|-------------|-------------------|
| **Shot-by-Shot Planning** | Storyboard builder with shot list, director notes, camera angles, timing markers, and reference images per shot. Shot status tracking and on-set checklists. | Core feature for organized shoots. Differentiates from generic project tools. Essential for complex choreographed content. |
| **Trending Audio Integration** | Browse/save trending audio from Instagram/TikTok, attach to shoots, mark audio beats, calculate shot timing, trend alerts. | Critical for viral content creation. Most cosplay shoots are now for reels/TikToks. Helps content perform better. |

### Logistics & Organization

| Feature | Description | Why High Priority |
|---------|-------------|-------------------|
| **Budget Tracking & Expenses** | Set budgets per shoot, track expenses by category (costumes, props, location, travel), shared expense splitting, receipt uploads. | Helps users stay within budget. Common pain point. Required for professional cosplayers tracking ROI. |
| **Gear Checklist Management** | Photography gear checklists, costume piece tracking, prop inventory with "packed" status, pre-shoot verification, ownership tracking. | Prevents forgetting critical items on shoot day. Very common problem that ruins shoots. |
| **Weather Integration** | Weather forecast for locations, rain/wind alerts, alternative date suggestions, indoor backup recommendations. | Weather makes or breaks outdoor shoots. Proactive planning saves wasted trips and money. |
| **Editing Task Assignment** | Assign photos to editors, track editing status (raw → edited → approved), annotation tools, version history, approval workflow. | Editing is major bottleneck. Prevents "did you finish editing?" messages. Essential for team coordination. |

---

## Medium Priority Features

These enhance existing features and improve user experience but aren't critical for MVP.

### Enhanced References & Inspiration

| Feature | Description | Value |
|---------|-------------|-------|
| **Reference Pose Library** | Save/organize reference images from any source, tag by character/difficulty/location, quick "use this pose" linking, community sharing (optional). | Better than camera roll. Organizes constant inspiration collection. Complements AI pose generation. |

### Team Coordination

| Feature | Description | Value |
|---------|-------------|-------|
| **Team Communication/Chat** | In-app chat per shoot, polls, @mentions, file sharing, notification preferences. | Reduces context-switching between messaging apps. Keeps planning conversation with shoot data. |
| **Convention/Event Integration** | Import convention schedules, coordinate group shoots at cons, map meeting spots, track con-specific shoots, badge tracking. | Many shoots happen at conventions. Complex scheduling needs. |

---

## Lower Priority Features

Nice-to-have features that add polish or serve specific use cases. Consider after core features are validated.

### Professional Features

| Feature | Description | Value |
|---------|-------------|-------|
| **Model/Photographer Release Forms** | Digital release templates, electronic signatures, form storage per shoot, PDF export. | Legal protection for professional cosplayers. Not needed by hobbyists initially. |
| **Social Media Post Scheduling** | Schedule edited photos to Instagram/TikTok, caption templates, hashtag suggestions, cross-platform posting, analytics. | Closes loop from planning → shooting → posting. Can use external tools initially (Buffer, Later). |
| **Portfolio/Gallery View** | Public portfolio pages, filter by character/photographer, embed galleries, watermark options, SEO-friendly URLs. | Showcases work. More important once user has content. Can use external portfolio sites initially. |

### Documentation & Tracking

| Feature | Description | Value |
|---------|-------------|-------|
| **Costume Progress Photos** | Progress timeline per costume, before/after comparisons, tutorial notes, social sharing, completion estimates. | Good for build documentation. Secondary to planning features. Can use camera roll initially. |
| **Contact Directory** | Database of photographers, makeup artists, prop makers with ratings, availability calendars, collaboration history. | Network management. More valuable as user base grows. Can use phone contacts initially. |

---

## Future Considerations

Ideas to explore after core product-market fit is established.

- **Team Analytics**: Track shoot completion rates, time estimates vs actual, budget accuracy, team member contributions
- **Marketplace Integration**: Connect with costume commissioners, prop makers, photographers for hire
- **Event Discovery**: Find local cosplay meetups, photoshoots, conventions
- **Skill Sharing**: Tutorial library, technique guides, community Q&A
- **Costume Pattern Library**: Store and share sewing patterns, 3D print files, craft templates
- **Sponsorship Tools**: Track brand partnerships, sponsored content requirements, payment tracking

---

## Feature Prioritization Criteria

When evaluating new features, consider:

1. **Constitutional Alignment**: Does it support mobile-first, real-time collaboration, visual-first content?
2. **User Pain Point Severity**: How much does this problem hurt users daily?
3. **Differentiation**: Does this set us apart from generic project management tools?
4. **Development Complexity**: Can we ship value quickly?
5. **User Adoption Impact**: Will users understand and use this feature?

---

## Next Steps

1. Create specifications for High Priority features using `/speckit.specify`
2. Validate prioritization with target users (cosplayers, photographers)
3. Plan MVP feature set for Phase 1 (SvelteKit web)
4. Review roadmap quarterly based on user feedback
