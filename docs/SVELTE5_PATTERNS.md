# Svelte 5 Patterns & Best Practices

**Last Updated**: October 24, 2024  
**Project**: Cosplans (SvelteKit + Svelte 5)

This document outlines the correct Svelte 5 patterns to use throughout the project. **Always use Svelte 5 runes** - no Svelte 4 syntax.

---

## 📦 **Component Props**

### ✅ CORRECT (Svelte 5)
```svelte
<script lang="ts">
	import type { PageData } from './$types';
	
	// Props with type-safe interface
	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
</script>
```

### ❌ WRONG (Svelte 4)
```svelte
<script lang="ts">
	// DON'T use export let in Svelte 5
	export let data: PageData;
</script>
```

---

## 🎯 **Event Handlers**

### ✅ CORRECT (Svelte 5)
```svelte
<!-- Use native event attributes (no colon) -->
<button onclick={() => handleClick()}>Click</button>
<input oninput={(e) => handleInput(e)} />
<div onmouseenter={() => show = true} onmouseleave={() => show = false}></div>
<input onfocus={() => active = true} onblur={() => active = false} />
```

### ❌ WRONG (Svelte 4)
```svelte
<!-- DON'T use on: directive syntax -->
<button on:click={() => handleClick()}>Click</button>
<input on:input={(e) => handleInput(e)} />
<div on:mouseenter on:mouseleave></div>
```

**Common Event Mappings:**
- `on:click` → `onclick`
- `on:input` → `oninput`
- `on:change` → `onchange`
- `on:submit` → `onsubmit`
- `on:mouseenter` → `onmouseenter`
- `on:mouseleave` → `onmouseleave`
- `on:focus` → `onfocus`
- `on:blur` → `onblur`

---

## 💾 **Reactive State**

### ✅ CORRECT (Svelte 5)
```svelte
<script lang="ts">
	// Use $state rune for reactive variables
	let count = $state(0);
	let user = $state<User | null>(null);
	let items = $state<Item[]>([]);
</script>
```

### ❌ WRONG (Svelte 4)
```svelte
<script lang="ts">
	// DON'T use plain let for reactive state
	let count = 0;
</script>
```

---

## 🔄 **Derived Values (Computed)**

### ✅ CORRECT (Svelte 5)
```svelte
<script lang="ts">
	let count = $state(0);
	
	// Use $derived for computed values
	let doubled = $derived(count * 2);
	
	// Use $derived() function for complex logic
	let filtered = $derived(() => {
		return items.filter(item => item.active);
	});
</script>
```

### ❌ WRONG (Svelte 4)
```svelte
<script lang="ts">
	let count = 0;
	
	// DON'T use $: reactive declarations
	$: doubled = count * 2;
</script>
```

---

## ⚡ **Side Effects**

### ✅ CORRECT (Svelte 5)
```svelte
<script lang="ts">
	import { tick } from 'svelte';
	
	let searchQuery = $state('');
	
	// Use $effect for side effects
	$effect(() => {
		console.log('Search query changed:', searchQuery);
		// Effect runs when searchQuery changes
	});
	
	// With cleanup
	$effect(() => {
		const timer = setTimeout(() => {
			console.log('Debounced:', searchQuery);
		}, 300);
		
		return () => clearTimeout(timer);
	});
</script>
```

### ❌ WRONG (Svelte 4)
```svelte
<script lang="ts">
	let searchQuery = '';
	
	// DON'T use $: for side effects
	$: {
		console.log('Search query changed:', searchQuery);
	}
</script>
```

---

## 🎨 **Inline Styles & Hover States**

### ✅ CORRECT (Svelte 5)
```svelte
<!-- Use CSS classes for hover states -->
<button 
	class="px-4 py-2 rounded-lg transition-colors hover:opacity-90"
	style="background: var(--theme-primary); color: white;"
>
	Click me
</button>

<!-- Or use Tailwind utilities -->
<button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
	Click me
</button>
```

### ❌ WRONG (Manipulating style directly)
```svelte
<!-- DON'T mutate style attributes directly -->
<button 
	onmouseover="this.style.background = 'var(--theme-primary-hover)'"
	onmouseout="this.style.background = 'var(--theme-primary)'"
>
	Click me
</button>
```

---

## 🔗 **Binding Values**

### ✅ CORRECT (Svelte 5)
```svelte
<script lang="ts">
	let name = $state('');
	let checked = $state(false);
</script>

<input type="text" bind:value={name} />
<input type="checkbox" bind:checked={checked} />
```

**Note**: `bind:` syntax is still valid in Svelte 5 for two-way binding!

---

## 📋 **Common Patterns**

### **Debounced Search**
```svelte
<script lang="ts">
	let searchQuery = $state('');
	let debouncedQuery = $state('');
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	
	$effect(() => {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			debouncedQuery = searchQuery;
		}, 300);
		return () => {
			if (debounceTimer) clearTimeout(debounceTimer);
		};
	});
</script>
```

### **Filtered Lists**
```svelte
<script lang="ts">
	let items = $state<Item[]>([]);
	let filter = $state('');
	
	let filteredItems = $derived(() => {
		if (!filter.trim()) return items;
		return items.filter(item => 
			item.name.toLowerCase().includes(filter.toLowerCase())
		);
	});
</script>

{#each filteredItems() as item (item.id)}
	<div>{item.name}</div>
{/each}
```

### **Toggle State**
```svelte
<script lang="ts">
	let isOpen = $state(false);
</script>

<button onclick={() => isOpen = !isOpen}>
	Toggle
</button>

{#if isOpen}
	<div>Content</div>
{/if}
```

---

## 🚨 **Common Mistakes to Avoid**

1. ❌ Using `export let` instead of `$props()`
2. ❌ Using `on:` event directives instead of native `on*` attributes
3. ❌ Using `$:` reactive declarations instead of `$derived()`
4. ❌ Using `$:` for side effects instead of `$effect()`
5. ❌ Mutating `style` attributes directly for hover states
6. ❌ Forgetting to call `$derived()` functions (use `filteredItems()` not `filteredItems`)
7. ❌ Using plain `let` for reactive state instead of `$state()`

---

## 📚 **Official Svelte 5 Resources**

- [Svelte 5 Runes Documentation](https://svelte.dev/docs/svelte/$state)
- [Migration Guide (Svelte 4 → 5)](https://svelte.dev/docs/svelte/v5-migration-guide)
- [Event Handlers in Svelte 5](https://svelte.dev/docs/svelte/on)

---

## ✅ **Pre-Commit Checklist**

Before committing any new Svelte component:

- [ ] All props use `$props()` (no `export let`)
- [ ] All event handlers use native attributes (`onclick`, not `on:click`)
- [ ] All reactive state uses `$state()`
- [ ] All computed values use `$derived()` or `$derived(() => ...)`
- [ ] All side effects use `$effect()`
- [ ] No `$:` reactive declarations or statements
- [ ] Hover states use CSS classes, not inline style mutations
- [ ] Run `bun run lint` and fix all Svelte 5 warnings

---

**Remember**: When in doubt, check the [official Svelte 5 docs](https://svelte.dev/docs/svelte) - they're comprehensive and well-maintained!

