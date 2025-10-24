# Quickstart: Character-Centric Resource Model

**Feature**: 048-character-resource-model  
**Date**: October 24, 2025  
**Audience**: Developers implementing or integrating with this feature

## Overview

This guide provides a quick introduction to the character-centric resource model, covering the core concepts, common workflows, and code examples for implementation.

## Core Concepts

### Character as Organizational Hub

**Before (Flat Model)**:
```
Costumes List → Select costume → View details
Wigs List (in Accessories) → Select wig → View details
Props List → Select prop → View details
```

**After (Character-Centric)**:
```
Characters List → Select character → View all linked resources
   ├─ Costumes (1-5 per character)
   ├─ Wigs (1-3 per character)
   ├─ Props (2-10 per character)
   └─ Accessories (3-15 per character)
```

**Key Principle**: Character is the **brainstorming hub**. Users start with "I want to cosplay Saber from Fate/stay night", then add resources (costume, wig, sword prop) to that character.

### Relationship Types

- **Character → Costume**: One-to-one (each costume is a specific character version)
- **Character → Wig**: Many-to-many (generic blonde wig can be reused across characters)
- **Character → Prop**: Many-to-many (katana prop can be used by multiple samurai characters)
- **Character → Accessory**: Many-to-many (jewelry, contacts can be reused)

### Completion Tracking

**Formula**: `completion_percentage = (completed_resources / total_resources) × 100`

Where:
- `completed_resources` = count where resource status is "completed", "owned", or equivalent terminal state
- `total_resources` = total count of all linked resources (costumes + wigs + props + accessories)

**Example**:
- Character "Saber" has: 1 costume (completed), 1 wig (in-progress), 2 props (1 completed, 1 planned), 0 accessories
- Completed: 2 (costume + 1 prop)
- Total: 4
- Percentage: 50%

---

## Common Workflows

### 1. Create Character with Resources

```typescript
// Step 1: Create character
const character = await db.characters.create({
  data: {
    teamId: currentTeam.id,
    characterName: "Saber (Artoria Pendragon)",
    seriesName: "Fate/stay night",
    sourceMedium: "anime",
    aliases: "Saber, Artoria Pendragon, Altria Pendragon",
    appearanceDescription: "Blonde hair, green eyes, armor with blue and silver",
    referenceImages: [
      {url: "https://pub-xxx.r2.dev/characters/uuid/ref1.jpg", filename: "saber-ref1.jpg"}
    ]
  }
});

// Step 2: Create and link costume
const costume = await db.costumes.create({
  data: {
    teamId: currentTeam.id,
    name: "Saber Armor",
    version: "Fate/stay night anime",
    status: "planned"
  }
});

await db.characterCostumes.create({
  data: {
    characterId: character.id,
    costumeId: costume.id
  }
});

// Step 3: Create and link wig
const wig = await db.wigs.create({
  data: {
    teamId: currentTeam.id,
    wigName: "Saber Blonde Wig",
    color: "Blonde",
    length: "short",
    fiberType: "synthetic",
    baseWigCost: 45.00,
    status: "planned"
  }
});

await db.characterWigs.create({
  data: {
    characterId: character.id,
    wigId: wig.id
  }
});

// Step 4: Calculate initial completion
const completion = await calculateCharacterCompletion(character.id);
await db.characters.update({
  where: {id: character.id},
  data: {completionPercentage: completion}
});
```

### 2. Fetch Character with All Resources

```typescript
async function getCharacterDetail(characterId: string) {
  const character = await db.characters.findUnique({
    where: {id: characterId},
    include: {
      characterCostumes: {
        include: {
          costume: {
            include: {
              outfitTasks: true
            }
          }
        }
      },
      characterWigs: {
        include: {
          wig: {
            include: {
              wigTasks: true,
              wigMaterials: true
            }
          }
        }
      },
      characterProps: {
        include: {prop: true}
      },
      characterAccessories: {
        include: {accessory: true}
      }
    }
  });
  
  return {
    ...character,
    linkedCostumes: character.characterCostumes.map(cc => cc.costume),
    linkedWigs: character.characterWigs.map(cw => cw.wig),
    linkedProps: character.characterProps.map(cp => cp.prop),
    linkedAccessories: character.characterAccessories.map(ca => ca.accessory)
  };
}
```

### 3. Search Characters by Alias

```typescript
async function searchCharacters(query: string, teamId: string) {
  // Full-text search across name, aliases, and series
  return await db.characters.findMany({
    where: {
      teamId,
      deletedAt: null,
      OR: [
        {characterName: {contains: query, mode: 'insensitive'}},
        {aliases: {contains: query, mode: 'insensitive'}},
        {seriesName: {contains: query, mode: 'insensitive'}}
      ]
    },
    orderBy: {createdAt: 'desc'}
  });
}

// Using PostgreSQL full-text search (faster for large datasets)
async function searchCharactersFTS(query: string, teamId: string) {
  return await db.$queryRaw`
    SELECT * FROM characters
    WHERE team_id = ${teamId}
      AND deleted_at IS NULL
      AND to_tsvector('english', character_name || ' ' || COALESCE(aliases, '') || ' ' || series_name)
          @@ plainto_tsquery('english', ${query})
    ORDER BY created_at DESC;
  `;
}
```

### 4. Calculate and Update Completion Percentage

```typescript
async function calculateCharacterCompletion(characterId: string): Promise<number> {
  const result = await db.$queryRaw<{
    completed_costumes: bigint,
    total_costumes: bigint,
    completed_wigs: bigint,
    total_wigs: bigint,
    completed_props: bigint,
    total_props: bigint,
    completed_accessories: bigint,
    total_accessories: bigint
  }[]>`
    SELECT 
      COUNT(DISTINCT CASE WHEN co.status IN ('completed', 'owned') THEN co.id END) as completed_costumes,
      COUNT(DISTINCT co.id) as total_costumes,
      COUNT(DISTINCT CASE WHEN w.status = 'completed' THEN w.id END) as completed_wigs,
      COUNT(DISTINCT w.id) as total_wigs,
      COUNT(DISTINCT CASE WHEN p.status IN ('completed', 'owned') THEN p.id END) as completed_props,
      COUNT(DISTINCT p.id) as total_props,
      COUNT(DISTINCT CASE WHEN a.status IN ('completed', 'owned') THEN a.id END) as completed_accessories,
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
  
  const row = result[0];
  const completed = Number(row.completed_costumes) + Number(row.completed_wigs) + 
                   Number(row.completed_props) + Number(row.completed_accessories);
  const total = Number(row.total_costumes) + Number(row.total_wigs) + 
               Number(row.total_props) + Number(row.total_accessories);
  
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// Trigger on resource status change
async function onResourceStatusChange(resourceId: string, resourceType: string, characterId: string) {
  const newPercentage = await calculateCharacterCompletion(characterId);
  await db.characters.update({
    where: {id: characterId},
    data: {
      completionPercentage: newPercentage,
      completionCalculatedAt: new Date()
    }
  });
}
```

### 5. Delete Character with Auto-Unlink

```typescript
async function deleteCharacter(characterId: string) {
  // Count resources that will be unlinked
  const costumesCount = await db.characterCostumes.count({where: {characterId}});
  const wigsCount = await db.characterWigs.count({where: {characterId}});
  const propsCount = await db.characterProps.count({where: {characterId}});
  const accessoriesCount = await db.characterAccessories.count({where: {characterId}});
  
  // Soft delete character (CASCADE on junction tables auto-removes links)
  await db.characters.update({
    where: {id: characterId},
    data: {deletedAt: new Date()}
  });
  
  return {
    message: "Character deleted successfully",
    unlinkedResources: {
      costumes: costumesCount,
      wigs: wigsCount,
      props: propsCount,
      accessories: accessoriesCount
    }
  };
  
  // Note: Resources themselves are NOT deleted, only the links are removed
}
```

### 6. Wig Time Tracking (Hybrid)

```typescript
// Automatic time calculation
function calculateAutoTime(statusHistory: {status: string, timestamp: Date}[]): number {
  let totalMinutes = 0;
  let inProgressStart: Date | null = null;
  
  for (const change of statusHistory) {
    if (change.status === 'in_progress' && !inProgressStart) {
      inProgressStart = change.timestamp;
    } else if (change.status === 'completed' && inProgressStart) {
      const minutes = (change.timestamp.getTime() - inProgressStart.getTime()) / 60000;
      totalMinutes += minutes;
      inProgressStart = null;
    }
  }
  
  return Math.round(totalMinutes / 60); // Convert to hours
}

// Update wig status
async function updateWigStatus(wigId: string, newStatus: string, manualTimeOverride?: number) {
  const wig = await db.wigs.findUnique({where: {id: wigId}});
  
  // Add to status history
  const history = [...(wig.statusHistory as any[]), {status: newStatus, timestamp: new Date()}];
  
  // Calculate auto time
  const autoTime = calculateAutoTime(history);
  
  await db.wigs.update({
    where: {id: wigId},
    data: {
      status: newStatus,
      statusHistory: history,
      timeSpentAuto: autoTime,
      timeSpentManual: manualTimeOverride ?? wig.timeSpentManual,
      completionDate: newStatus === 'completed' ? new Date() : wig.completionDate
    }
  });
}

// Display time (prioritize manual override)
function getDisplayTime(wig: Wig): number {
  return wig.timeSpentManual ?? wig.timeSpentAuto;
}
```

---

## API Routes (SvelteKit)

### Character Routes

```
src/routes/api/characters/
├── +server.ts          # GET list, POST create
├── [id]/
│   ├── +server.ts      # GET detail, PATCH update, DELETE delete
│   ├── link-costume/
│   │   └── +server.ts  # POST link costume
│   ├── link-wig/
│   │   └── +server.ts  # POST link wig
│   └── unlink/
│       └── [resourceType]/
│           └── [resourceId]/
│               └── +server.ts  # DELETE unlink
```

### Wig Routes

```
src/routes/api/wigs/
├── +server.ts          # GET list, POST create
└── [id]/
    ├── +server.ts      # GET detail, PATCH update, DELETE delete
    ├── tasks/
    │   └── +server.ts  # POST add task, PATCH update task
    └── materials/
        └── +server.ts  # POST add material, PATCH update material
```

---

## UI Components

### Character Detail Page Structure

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import CharacterCompletionBadge from '$lib/components/characters/CharacterCompletionBadge.svelte';
  import LinkedResourceCard from '$lib/components/resource-linking/LinkedResourceCard.svelte';
  
  let { character } = $page.data;
</script>

<div class="character-detail">
  <!-- Header -->
  <div class="header">
    <h1>{character.characterName}</h1>
    <p>{character.seriesName} ({character.sourceMedium})</p>
    <CharacterCompletionBadge percentage={character.completionPercentage} />
  </div>
  
  <!-- Reference Images -->
  <div class="reference-gallery">
    {#each character.referenceImages as image}
      <img src={image.url} alt={image.filename} />
    {/each}
  </div>
  
  <!-- Linked Resources -->
  <section class="linked-resources">
    <h2>Costumes</h2>
    {#each character.linkedCostumes as costume}
      <LinkedResourceCard 
        type="costume" 
        resource={costume} 
        characterId={character.id} 
      />
    {/each}
    <button on:click={linkExistingOrCreateCostume}>+ Add Costume</button>
    
    <h2>Wigs</h2>
    {#each character.linkedWigs as wig}
      <LinkedResourceCard 
        type="wig" 
        resource={wig} 
        characterId={character.id} 
      />
    {/each}
    <button on:click={linkExistingOrCreateWig}>+ Add Wig</button>
    
    <!-- Props, Accessories sections similar -->
  </section>
</div>
```

---

## Migration Procedure

### Step 1: Run Migrations

```bash
# Create all new tables
supabase migration new create_character_resource_model
# Edit migration file with SQL from data-model.md
supabase db push

# Verify tables created
supabase db remote --table characters
supabase db remote --table wigs
```

### Step 2: Migrate Wig Data

```sql
-- Run migration query
INSERT INTO wigs (...)
SELECT ...
FROM accessories
WHERE type = 'wig';

-- Verify
SELECT 
  (SELECT COUNT(*) FROM accessories WHERE type = 'wig') as source_count,
  (SELECT COUNT(*) FROM wigs) as migrated_count;
```

### Step 3: Deploy UI

```bash
# Deploy character pages
git add src/routes/(auth)/characters/
git commit -m "feat(characters): add character pages"

# Deploy wig pages
git add src/routes/(auth)/wigs/
git commit -m "feat(wigs): separate wigs from accessories"

# Update sidebar navigation
git add src/lib/components/Sidebar.svelte
git commit -m "feat(nav): add characters and wigs to sidebar"
```

---

## Testing

### Unit Tests

```typescript
// Test completion calculation
import { calculateCharacterCompletion } from './character-service';

describe('Character Completion Calculation', () => {
  it('should return 0% for character with no resources', async () => {
    const completion = await calculateCharacterCompletion(emptyCharacterId);
    expect(completion).toBe(0);
  });
  
  it('should return 50% for character with 1/2 resources completed', async () => {
    // Setup: character with 1 costume (completed) and 1 wig (in-progress)
    const completion = await calculateCharacterCompletion(characterId);
    expect(completion).toBe(50);
  });
  
  it('should return 100% when all resources completed', async () => {
    const completion = await calculateCharacterCompletion(fullCharacterId);
    expect(completion).toBe(100);
  });
});
```

### E2E Tests

```typescript
// Test character-centric workflow
import { test, expect } from '@playwright/test';

test('create character and link resources', async ({ page }) => {
  // Navigate to characters page
  await page.goto('/characters');
  
  // Create character
  await page.click('button:text("Add Character")');
  await page.fill('input[name="characterName"]', 'Saber');
  await page.fill('input[name="seriesName"]', 'Fate/stay night');
  await page.selectOption('select[name="sourceMedium"]', 'anime');
  await page.click('button:text("Create")');
  
  // Verify character created
  await expect(page.locator('h1')).toHaveText('Saber');
  
  // Link costume
  await page.click('button:text("+ Add Costume")');
  await page.fill('input[name="version"]', 'Fate/stay night anime');
  await page.click('button:text("Link")');
  
  // Verify completion updated
  await expect(page.locator('.completion-badge')).toContainText('0%'); // Costume is planned
});
```

---

## Performance Optimization

### 1. Character Detail Query

Use single query with joins to fetch character + all resources:

```sql
-- Optimized query (single round-trip)
SELECT 
  c.*,
  json_agg(DISTINCT jsonb_build_object('type', 'costume', 'data', co.*)) FILTER (WHERE co.id IS NOT NULL) as costumes,
  json_agg(DISTINCT jsonb_build_object('type', 'wig', 'data', w.*)) FILTER (WHERE w.id IS NOT NULL) as wigs
FROM characters c
LEFT JOIN character_costumes cc ON c.id = cc.character_id
LEFT JOIN costumes co ON cc.costume_id = co.id
LEFT JOIN character_wigs cw ON c.id = cw.character_id
LEFT JOIN wigs w ON cw.wig_id = w.id
WHERE c.id = $1
GROUP BY c.id;
```

Target: <2 seconds for 10+ resources (SC-004)

### 2. Completion Percentage Caching

Store calculated value, invalidate on resource status change:

```typescript
// Cache in characters.completion_percentage
// Only recalculate when:
// - Resource status changes
// - Resource linked/unlinked
// - Character first loaded (if stale)

if (!character.completionCalculatedAt || isStale(character.completionCalculatedAt)) {
  const newPercentage = await calculateCharacterCompletion(character.id);
  await updateCachedCompletion(character.id, newPercentage);
}
```

Target: <500ms recalculation (SC-006)

### 3. Search Optimization

Use PostgreSQL full-text search index:

```sql
CREATE INDEX idx_characters_search ON characters 
USING gin(to_tsvector('english', character_name || ' ' || COALESCE(aliases, '') || ' ' || series_name))
WHERE deleted_at IS NULL;
```

Target: <500ms for 100+ characters (SC-009)

---

## Troubleshooting

### Character completion not updating

1. Check if resource status change triggers completion recalculation
2. Verify completion cache invalidation logic
3. Manually trigger recalculation:
   ```typescript
   const completion = await calculateCharacterCompletion(characterId);
   await db.characters.update({
     where: {id: characterId},
     data: {completionPercentage: completion, completionCalculatedAt: new Date()}
   });
   ```

### Wig migration issues

1. Verify wig records exist in accessories table before migration
2. Check foreign key constraints
3. Rollback procedure:
   ```sql
   -- Re-insert wigs into accessories
   INSERT INTO accessories SELECT * FROM wigs;
   -- Drop wigs table
   DROP TABLE wigs CASCADE;
   ```

### Character deletion not unlinking resources

1. Verify CASCADE on junction table foreign keys:
   ```sql
   ALTER TABLE character_wigs 
   DROP CONSTRAINT character_wigs_character_id_fkey,
   ADD CONSTRAINT character_wigs_character_id_fkey 
     FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE;
   ```

---

## Next Steps

1. Review [data-model.md](./data-model.md) for complete entity schemas
2. Review [contracts/character-api.yaml](./contracts/character-api.yaml) for API specs
3. Run `/speckit.tasks` to break down implementation into tasks
4. Start with migration tasks (M1, M2) before UI implementation

---

**Questions?** Refer to:
- Feature spec: [spec.md](./spec.md)
- Research findings: [research.md](./research.md)
- Implementation plan: [plan.md](./plan.md)

