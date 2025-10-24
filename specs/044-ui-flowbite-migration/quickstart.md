# Quickstart: Using Themed Components

This guide shows how to use the new reusable themed components in the Cosplans application.

## Overview

All themed components automatically use CSS custom properties (theme variables) to ensure consistent styling across light/dark modes and custom themes.

## Available Components

### ThemedCard

Card/section container with automatic theme styling.

```svelte
<script>
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
</script>

<ThemedCard title="Section Title">
  <!-- Content goes here -->
</ThemedCard>

<!-- Without title -->
<ThemedCard>
  <h2>Custom heading</h2>
  <p>Content</p>
</ThemedCard>

<!-- Custom padding -->
<ThemedCard title="Compact Card" padding="p-4">
  Content with less padding
</ThemedCard>
```

**Props:**
- `title` (optional): Section title displayed at top
- `padding` (optional): Tailwind padding class (default: 'p-6')

---

### ThemedInput

Text input field with theme colors.

```svelte
<script>
  import ThemedInput from '$lib/components/ui/ThemedInput.svelte';
  
  let email = '';
  let password = '';
</script>

<ThemedInput 
  type="email"
  name="email"
  bind:value={email}
  placeholder="Enter your email"
  required
/>

<ThemedInput 
  type="password"
  name="password"
  bind:value={password}
  maxlength={100}
  disabled={isLoading}
/>
```

**Props:**
- `type`: Input type (text, email, password, etc.)
- `name`: Input name attribute
- `value`: Input value (use `bind:value`)
- `placeholder` (optional): Placeholder text
- `required` (optional): Mark as required
- `maxlength` (optional): Maximum character length
- `readonly` (optional): Make read-only
- `disabled` (optional): Disable input

**Events:** Supports all standard HTML input events (input, change, blur, focus, click)

---

### ThemedTextarea

Multi-line text input with theme colors.

```svelte
<script>
  import ThemedTextarea from '$lib/components/ui/ThemedTextarea.svelte';
  
  let description = '';
</script>

<ThemedTextarea 
  name="description"
  bind:value={description}
  rows={4}
  maxlength={500}
  placeholder="Enter description..."
/>

<p class="text-sm" style="color: var(--theme-sidebar-muted);">
  {description.length}/500 characters
</p>
```

**Props:**
- `name`: Textarea name attribute
- `value`: Textarea value (use `bind:value`)
- `placeholder` (optional): Placeholder text
- `required` (optional): Mark as required
- `maxlength` (optional): Maximum character length
- `rows` (optional): Number of rows (default: 4)
- `readonly` (optional): Make read-only
- `disabled` (optional): Disable textarea

---

### ThemedButton

Button with theme-aware variants.

```svelte
<script>
  import ThemedButton from '$lib/components/ui/ThemedButton.svelte';
  
  function handleSubmit() {
    // Handle submission
  }
  
  function handleCancel() {
    // Handle cancellation
  }
</script>

<!-- Primary button (uses theme accent color) -->
<ThemedButton type="submit" variant="primary" onclick={handleSubmit}>
  Save Changes
</ThemedButton>

<!-- Secondary button (transparent with border) -->
<ThemedButton variant="secondary" onclick={handleCancel}>
  Cancel
</ThemedButton>

<!-- Danger button (uses theme error color) -->
<ThemedButton variant="danger" onclick={handleDelete}>
  Delete
</ThemedButton>

<!-- Warning button (uses theme warning color) -->
<ThemedButton variant="warning">
  Proceed with Caution
</ThemedButton>

<!-- Disabled button -->
<ThemedButton type="submit" variant="primary" disabled={!isValid}>
  Submit
</ThemedButton>

<!-- Full width button -->
<ThemedButton variant="primary" fullWidth>
  Full Width Button
</ThemedButton>
```

**Props:**
- `type` (optional): Button type ('button', 'submit', 'reset') - default: 'button'
- `variant` (optional): Button variant ('primary', 'secondary', 'danger', 'warning') - default: 'primary'
- `disabled` (optional): Disable button
- `fullWidth` (optional): Make button full width

**Events:** Supports `onclick`

---

### ThemedSelect

Dropdown select with theme colors.

```svelte
<script>
  import ThemedSelect from '$lib/components/ui/ThemedSelect.svelte';
  
  let role = 'member';
</script>

<ThemedSelect name="role" bind:value={role}>
  <option value="member">Member</option>
  <option value="admin">Admin</option>
  <option value="owner">Owner</option>
</ThemedSelect>

<!-- Required select -->
<ThemedSelect name="country" bind:value={country} required>
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</ThemedSelect>
```

**Props:**
- `name`: Select name attribute
- `value`: Selected value (use `bind:value`)
- `required` (optional): Mark as required
- `disabled` (optional): Disable select

**Events:** Supports change, blur, focus events

---

### ThemedAlert

Success/error/warning/info messages.

```svelte
<script>
  import ThemedAlert from '$lib/components/ui/ThemedAlert.svelte';
  
  let showAlert = true;
  
  function handleDismiss() {
    showAlert = false;
  }
</script>

{#if showAlert}
  <!-- Success message -->
  <ThemedAlert type="success">
    Team created successfully!
  </ThemedAlert>
  
  <!-- Error message -->
  <ThemedAlert type="error">
    Failed to save changes. Please try again.
  </ThemedAlert>
  
  <!-- Warning message -->
  <ThemedAlert type="warning">
    This action cannot be undone.
  </ThemedAlert>
  
  <!-- Info message -->
  <ThemedAlert type="info">
    Your changes have been saved as a draft.
  </ThemedAlert>
  
  <!-- Dismissible alert -->
  <ThemedAlert type="success" dismissible onDismiss={handleDismiss}>
    Operation completed!
  </ThemedAlert>
{/if}
```

**Props:**
- `type`: Alert type ('success', 'error', 'warning', 'info')
- `dismissible` (optional): Show dismiss button
- `onDismiss` (optional): Function to call when dismissed

---

## Complete Form Example

```svelte
<script>
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import ThemedInput from '$lib/components/ui/ThemedInput.svelte';
  import ThemedTextarea from '$lib/components/ui/ThemedTextarea.svelte';
  import ThemedSelect from '$lib/components/ui/ThemedSelect.svelte';
  import ThemedButton from '$lib/components/ui/ThemedButton.svelte';
  import ThemedAlert from '$lib/components/ui/ThemedAlert.svelte';
  
  let teamName = '';
  let description = '';
  let visibility = 'private';
  let showSuccess = false;
  
  function handleSubmit() {
    // Submit logic
    showSuccess = true;
  }
</script>

<ThemedCard title="Create New Team">
  {#if showSuccess}
    <ThemedAlert type="success" dismissible onDismiss={() => showSuccess = false}>
      Team created successfully!
    </ThemedAlert>
  {/if}
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium mb-2" style="color: var(--theme-foreground);">
        Team Name
      </label>
      <ThemedInput 
        type="text"
        name="name"
        bind:value={teamName}
        placeholder="My Awesome Team"
        required
        maxlength={100}
      />
    </div>
    
    <div>
      <label for="description" class="block text-sm font-medium mb-2" style="color: var(--theme-foreground);">
        Description
      </label>
      <ThemedTextarea 
        name="description"
        bind:value={description}
        rows={4}
        maxlength={500}
        placeholder="What's this team for?"
      />
      <p class="mt-1 text-sm" style="color: var(--theme-sidebar-muted);">
        {description.length}/500 characters
      </p>
    </div>
    
    <div>
      <label for="visibility" class="block text-sm font-medium mb-2" style="color: var(--theme-foreground);">
        Visibility
      </label>
      <ThemedSelect name="visibility" bind:value={visibility}>
        <option value="private">Private</option>
        <option value="public">Public</option>
      </ThemedSelect>
    </div>
    
    <div class="flex gap-3">
      <ThemedButton type="submit" variant="primary">
        Create Team
      </ThemedButton>
      <ThemedButton variant="secondary" onclick={() => history.back()}>
        Cancel
      </ThemedButton>
    </div>
  </form>
</ThemedCard>
```

## Theme Variables Reference

All themed components use these CSS custom properties:

```css
/* Backgrounds */
--theme-background        /* Main page background */
--theme-sidebar-bg        /* Card/sidebar background */
--theme-sidebar-hover     /* Hover state background */
--theme-sidebar-active    /* Active state background */

/* Text */
--theme-foreground        /* Primary text color */
--theme-sidebar-text      /* Sidebar text color */
--theme-sidebar-muted     /* Secondary/muted text */
--theme-sidebar-accent    /* Accent color (primary buttons) */

/* Borders */
--theme-sidebar-border    /* Border color */

/* Semantic Colors */
--theme-success           /* Success green (#10b981) */
--theme-error             /* Error red (#ef4444) */
--theme-warning           /* Warning orange (#f59e0b) */
--theme-info              /* Info blue (#3b82f6) */
```

## Best Practices

1. **Always use themed components** instead of raw HTML elements with inline styles
2. **Use Tailwind for layout/spacing** (flex, grid, gap, padding, margin) but not colors
3. **Test in both light and dark modes** to ensure theme variables work correctly
4. **Combine components** to build complex UIs (ThemedCard + ThemedInput + ThemedButton)
5. **Use semantic alert types** (success/error/warning/info) for consistent messaging

## Migration from Inline Styles

**Before:**
```svelte
<div class="shadow rounded-lg p-6" 
     style="background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border);">
  <h2 class="text-xl font-semibold mb-4" style="color: var(--theme-foreground);">
    Title
  </h2>
  <input type="text" name="field" 
         class="w-full px-3 py-2 border rounded-lg"
         style="background: var(--theme-sidebar-bg); color: var(--theme-foreground);" />
</div>
```

**After:**
```svelte
<ThemedCard title="Title">
  <ThemedInput type="text" name="field" />
</ThemedCard>
```

**Result:** 60% less code, automatic theme support, easier to maintain!
