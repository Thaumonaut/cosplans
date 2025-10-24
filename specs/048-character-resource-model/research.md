# Research: Character-Centric Resource Model

**Feature**: 048-character-resource-model  
**Date**: October 24, 2025  
**Phase**: 0 - Research & Technical Decisions

## Overview

This document consolidates research findings for implementing the character-centric resource model, covering R2 storage integration, many-to-many relationships, data migration strategies, hybrid time tracking, and completion calculation.

## 1. Cloudflare R2 Integration Patterns

### Decision: Use R2 SDK with Direct Uploads

**Rationale**:
- R2 provides S3-compatible API with zero egress fees
- Significantly cheaper than Supabase Storage for file-heavy features (character references, wig photos, patterns)
- Aligns with Constitutional Principle VIII.5 (Cost Optimization)

**Pattern**:
```typescript
// Upload flow
1. Client requests signed upload URL from server
2. Server generates presigned PUT URL via R2 SDK
3. Client uploads file directly to R2 using presigned URL
4. Client sends R2 URL to server for database storage
5. Server stores R2 URL in character/wig/costume record

// Access flow
1. Database stores R2 URLs (e.g., "https://pub-xxx.r2.dev/characters/uuid/ref1.jpg")
2. R2 bucket configured as public for read access
3. Images load directly from R2 CDN (fast, no server involvement)
```

**Implementation Details**:
- Use `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` packages
- Presigned URLs expire after 1 hour
- File paths: `characters/{characterId}/{filename}`, `wigs/{wigId}/{filename}`, `patterns/{costumeId}/{filename}`
- Max file size: 10MB (enforced client-side before upload)

**Migration from Existing Storage**:
- Identify existing images in Supabase Storage
- Copy to R2 using server-side transfer
- Update database URLs to point to R2
- Keep Supabase files for 30 days as backup, then delete

**Alternatives Considered**:
- Supabase Storage: Rejected due to higher costs and egress fees
- Direct server uploads: Rejected due to server bandwidth costs and slower uploads

---

## 2. Many-to-Many Relationship Patterns in PostgreSQL

### Decision: Junction Tables with Composite Primary Keys

**Rationale**:
- Clean, normalized design following database best practices
- Efficient for querying "all resources for character" and "all characters for resource"
- Supports metadata on relationships if needed later (e.g., "primary wig for character")

**Pattern**:
```sql
-- Junction table structure
CREATE TABLE character_wigs (
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  wig_id UUID REFERENCES wigs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (character_id, wig_id)
);

CREATE INDEX idx_character_wigs_character ON character_wigs(character_id);
CREATE INDEX idx_character_wigs_wig ON character_wigs(wig_id);
```

**Query Patterns**:
```sql
-- Get all wigs for a character
SELECT w.* 
FROM wigs w
JOIN character_wigs cw ON w.id = cw.wig_id
WHERE cw.character_id = $1;

-- Get all characters for a wig
SELECT c.* 
FROM characters c
JOIN character_wigs cw ON c.id = cw.character_id
WHERE cw.wig_id = $1;

-- Get character with ALL linked resources (single query)
SELECT 
  c.*,
  json_agg(DISTINCT jsonb_build_object('type', 'costume', 'data', co.*)) 
    FILTER (WHERE co.id IS NOT NULL) as costumes,
  json_agg(DISTINCT jsonb_build_object('type', 'wig', 'data', w.*)) 
    FILTER (WHERE w.id IS NOT NULL) as wigs,
  json_agg(DISTINCT jsonb_build_object('type', 'prop', 'data', p.*)) 
    FILTER (WHERE p.id IS NOT NULL) as props
FROM characters c
LEFT JOIN character_costumes cc ON c.id = cc.character_id
LEFT JOIN costumes co ON cc.costume_id = co.id
LEFT JOIN character_wigs cw ON c.id = cw.character_id
LEFT JOIN wigs w ON cw.wig_id = w.id
LEFT JOIN character_props cp ON c.id = cp.character_id
LEFT JOIN props p ON cp.prop_id = p.id
WHERE c.id = $1
GROUP BY c.id;
```

**Cascade Delete Behavior**:
- `ON DELETE CASCADE` on junction tables ensures links are automatically removed when either character or resource is deleted
- Meets FR-009 requirement: character deletion auto-unlinks resources

**Alternatives Considered**:
- Array columns in characters table: Rejected due to poor query performance and difficulty maintaining referential integrity
- JSONB resource list: Rejected due to inability to enforce foreign key constraints

---

## 3. Data Migration Strategies

### Decision: Phased Migration with Feature Flags

**Rationale**:
- Zero-downtime deployment critical for production system
- Allows testing new schema before switching over
- Provides rollback path if issues arise

**Migration Phases**:

**Phase M1: Schema Creation (Non-Breaking)**
```sql
-- Create new tables without touching existing data
CREATE TABLE characters (...);
CREATE TABLE wigs (...);
CREATE TABLE character_wigs (...);
-- etc.

-- These coexist with existing accessories table
```

**Phase M2: Data Migration (Read-Only)**
```sql
-- Copy wig data from accessories to wigs table
INSERT INTO wigs (id, name, color, length, team_id, created_at, ...)
SELECT id, name, color, length, team_id, created_at, ...
FROM accessories
WHERE type = 'wig' OR category = 'wig';

-- Verify data integrity
SELECT COUNT(*) FROM accessories WHERE type = 'wig';
SELECT COUNT(*) FROM wigs;
-- Counts should match
```

**Phase M3: Dual-Write Period (Transition)**
```typescript
// Write to both tables temporarily
async function createWig(data) {
  const wig = await db.wigs.create(data);
  // Also create in accessories for backward compat (feature flag controlled)
  if (FEATURE_FLAG_DUAL_WRITE) {
    await db.accessories.create({...data, type: 'wig'});
  }
  return wig;
}
```

**Phase M4: Switch Reads to New Table**
```typescript
// Update UI to read from wigs table
const wigs = await db.wigs.findMany({where: {teamId}});
// Old code reading from accessories.where(type='wig') remains but unused
```

**Phase M5: Delete Old Data (After Verification)**
```sql
-- After 30 days of successful operation
DELETE FROM accessories WHERE type = 'wig';
-- Keep table for other accessories
```

**Rollback Procedure**:
- If issues detected, reverse feature flag to read from accessories again
- Wig data still exists in accessories table during transition period
- Can re-sync from wigs back to accessories if needed

**Alternatives Considered**:
- Big-bang migration: Rejected due to downtime risk
- Keep wigs in accessories: Rejected as it doesn't meet spec requirement for dedicated wig category

---

## 4. Hybrid Time Tracking Implementation

### Decision: Automatic Calculation with Manual Override Field

**Rationale**:
- Automatic tracking provides baseline without user effort
- Manual override allows accuracy for interrupted work
- Aligns with clarification decision from spec (Option D - Hybrid)

**Database Schema**:
```sql
ALTER TABLE wigs ADD COLUMN time_spent_auto INTEGER; -- minutes, calculated
ALTER TABLE wigs ADD COLUMN time_spent_manual INTEGER; -- minutes, user override (nullable)
ALTER TABLE wigs ADD COLUMN status_history JSONB; -- [{status: 'in-progress', timestamp: '...'}]

-- Same for costumes
ALTER TABLE costumes ADD COLUMN time_spent_auto INTEGER;
ALTER TABLE costumes ADD COLUMN time_spent_manual INTEGER;
ALTER TABLE costumes ADD COLUMN status_history JSONB;
```

**Calculation Logic**:
```typescript
function calculateAutoTime(statusHistory: StatusChange[]): number {
  // Sum time between "in-progress" status and "completed" status
  let totalMinutes = 0;
  let inProgressStart: Date | null = null;
  
  for (const change of statusHistory) {
    if (change.status === 'in-progress' && !inProgressStart) {
      inProgressStart = change.timestamp;
    } else if (change.status === 'completed' && inProgressStart) {
      const minutes = (change.timestamp - inProgressStart) / 60000;
      totalMinutes += minutes;
      inProgressStart = null;
    }
  }
  
  return Math.round(totalMinutes / 60); // Convert to hours
}

function getDisplayTime(wig: Wig): number {
  // Prioritize manual override if provided
  return wig.time_spent_manual ?? wig.time_spent_auto;
}
```

**UI Display**:
```svelte
{#if wig.time_spent_manual}
  <span>Time: {wig.time_spent_manual}h (manually entered)</span>
{:else}
  <span>Time: ~{wig.time_spent_auto}h (estimated)</span>
  <button on:click={showManualOverride}>Enter actual time</button>
{/if}
```

**Alternatives Considered**:
- Manual-only tracking: Rejected due to user burden
- Automatic-only tracking: Rejected due to inaccuracy for interrupted projects
- Task-based calculation: Deferred to future enhancement

---

## 5. Character Completion Calculation

### Decision: Simple Count with Cached Results

**Rationale**:
- Simple formula easy to understand and debug
- Meets clarification decision (Option A - Simple count)
- Cache invalidation on resource status change prevents performance issues

**Formula**:
```
completion_percentage = (completed_resources / total_resources) * 100

Where:
- completed_resources = count of resources with status in ['completed', 'owned', 'done']
- total_resources = count of all linked resources (costumes + wigs + props + accessories)
```

**Implementation**:
```typescript
async function calculateCharacterCompletion(characterId: string): Promise<number> {
  // Single query with multiple counts
  const result = await db.$queryRaw`
    SELECT 
      COUNT(DISTINCT CASE 
        WHEN co.status IN ('completed', 'owned') THEN co.id 
      END) as completed_costumes,
      COUNT(DISTINCT co.id) as total_costumes,
      COUNT(DISTINCT CASE 
        WHEN w.status = 'completed' THEN w.id 
      END) as completed_wigs,
      COUNT(DISTINCT w.id) as total_wigs,
      COUNT(DISTINCT CASE 
        WHEN p.status IN ('completed', 'owned') THEN p.id 
      END) as completed_props,
      COUNT(DISTINCT p.id) as total_props,
      COUNT(DISTINCT CASE 
        WHEN a.status IN ('completed', 'owned') THEN a.id 
      END) as completed_accessories,
      COUNT(DISTINCT a.id) as total_accessories
    FROM characters c
    LEFT JOIN character_costumes cc ON c.id = cc.character_id
    LEFT JOIN costumes co ON cc.costume_id = co.id
    LEFT JOIN character_wigs cw ON c.id = cw.character_id
    LEFT JOIN wigs w ON cw.wig_id = w.id
    LEFT JOIN character_props cp ON c.id = cp.character_id
    LEFT JOIN props p ON cp.prop_id = p.id
    LEFT JOIN character_accessories ca ON c.id = ca.character_id
    LEFT JOIN accessories a ON ca.accessory_id = a.id
    WHERE c.id = ${characterId};
  `;
  
  const completed = result.completed_costumes + result.completed_wigs + 
                   result.completed_props + result.completed_accessories;
  const total = result.total_costumes + result.total_wigs + 
               result.total_props + result.total_accessories;
  
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
```

**Caching Strategy**:
```typescript
// Store calculated percentage in characters table
ALTER TABLE characters ADD COLUMN completion_percentage INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN completion_calculated_at TIMESTAMPTZ;

// Invalidate cache when resource status changes
// Trigger or application logic:
async function onResourceStatusChange(resourceId: string, characterId: string) {
  const newPercentage = await calculateCharacterCompletion(characterId);
  await db.characters.update({
    where: {id: characterId},
    data: {
      completion_percentage: newPercentage,
      completion_calculated_at: new Date()
    }
  });
}
```

**Performance Target**:
- Calculate completion in <500ms (SC-006)
- With caching, display is instant (read from characters.completion_percentage)
- Recalculation only on resource status change (infrequent operation)

**Alternatives Considered**:
- Weighted completion (outfit 40%, wig 30%, etc.): Rejected per clarification (too complex, user preference varies)
- Real-time calculation on every page load: Rejected due to performance concerns with many resources

---

## Summary

All research tasks completed with decisions aligned to:
- Constitutional Principle VIII.5 (Cost Optimization via R2)
- Clarifications from spec (hybrid time tracking, simple completion, free status transitions, comma-separated aliases)
- Performance targets from success criteria (<2s loads, <500ms search, <1% accuracy)

Ready to proceed to Phase 1 (Data Model & Contracts).

