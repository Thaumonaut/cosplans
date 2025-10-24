<script lang="ts">
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import ThemedInput from '$lib/components/ui/ThemedInput.svelte';
  import ThemedTextarea from '$lib/components/ui/ThemedTextarea.svelte';
  import ThemedButton from '$lib/components/ui/ThemedButton.svelte';
  import ThemedSelect from '$lib/components/ui/ThemedSelect.svelte';
  import ThemedAlert from '$lib/components/ui/ThemedAlert.svelte';
  import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';

  let textValue = '';
  let emailValue = '';
  let textareaValue = '';
  let selectValue = 'option1';
  let showModal = false;
  let modalResult = '';

  function handleModalConfirm() {
    modalResult = 'Confirmed!';
    setTimeout(() => modalResult = '', 3000);
  }
</script>

<svelte:head>
  <title>Component Showcase - Cosplans Dev</title>
</svelte:head>

<div class="min-h-screen py-8 px-4" style="background: var(--theme-background);">
  <div class="max-w-6xl mx-auto space-y-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-2" style="color: var(--theme-foreground);">
        Themed Components Showcase
      </h1>
      <p class="text-lg" style="color: var(--theme-sidebar-muted);">
        All reusable UI components with automatic theme support
      </p>
      <p class="text-sm mt-2" style="color: var(--theme-sidebar-muted);">
        💡 Try switching between light/dark themes to see components adapt automatically
      </p>
    </div>

    <!-- ThemedCard -->
    <div class="rounded-lg p-6" style="background: var(--theme-section-bg); border: 1px solid var(--theme-border-subtle); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);">
      <h2 class="text-2xl font-semibold mb-4" style="color: var(--theme-foreground);">ThemedCard Component</h2>
      <div class="space-y-4">
        <p style="color: var(--theme-foreground);">
          A card container component with optional title and customizable padding.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ThemedCard title="Card with Title">
            <p style="color: var(--theme-foreground);">This card has a title.</p>
          </ThemedCard>
          <ThemedCard>
            <p style="color: var(--theme-foreground);">This card has no title.</p>
          </ThemedCard>
          <ThemedCard title="Custom Padding" padding="p-4">
            <p style="color: var(--theme-foreground);">This card uses p-4 padding.</p>
          </ThemedCard>
          <ThemedCard title="Default Padding" padding="p-8">
            <p style="color: var(--theme-foreground);">This card uses p-8 padding.</p>
          </ThemedCard>
        </div>
        <div class="mt-4 p-4 rounded" style="background: var(--theme-code-bg);">
          <code class="text-sm" style="color: var(--theme-foreground);">
            &lt;ThemedCard title="Card Title"&gt;Content&lt;/ThemedCard&gt;
          </code>
        </div>
      </div>
    </div>

    <!-- ThemedInput -->
    <div class="rounded-lg p-6" style="background: var(--theme-section-bg); border: 1px solid var(--theme-border-subtle); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);">
      <h2 class="text-2xl font-semibold mb-4" style="color: var(--theme-foreground);">ThemedInput Component</h2>
      <div class="space-y-4">
        <p style="color: var(--theme-foreground);">
          Text input fields with theme-aware styling. Supports all standard input types.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Text Input
            </label>
            <ThemedInput
              type="text"
              name="text"
              placeholder="Enter text..."
              bind:value={textValue}
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Email Input
            </label>
            <ThemedInput
              type="email"
              name="email"
              placeholder="email@example.com"
              bind:value={emailValue}
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Password Input
            </label>
            <ThemedInput
              type="password"
              name="password"
              placeholder="Enter password..."
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Disabled Input
            </label>
            <ThemedInput
              type="text"
              name="disabled"
              value="Disabled input"
              disabled
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Required Input
            </label>
            <ThemedInput
              type="text"
              name="required"
              placeholder="Required field"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Readonly Input
            </label>
            <ThemedInput
              type="text"
              name="readonly"
              value="Read-only value"
              readonly
            />
          </div>
        </div>
        <div class="mt-4 p-4 rounded" style="background: var(--theme-code-bg);">
          <code class="text-sm" style="color: var(--theme-foreground);">
            &lt;ThemedInput type="text" name="field" bind:value={'{value}'} /&gt;
          </code>
        </div>
      </div>
    </div>

    <!-- ThemedTextarea -->
    <ThemedCard title="ThemedTextarea Component">
      <div class="space-y-4">
        <p style="color: var(--theme-foreground);">
          Multi-line text input with customizable rows and theme styling.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Default (4 rows)
            </label>
            <ThemedTextarea
              name="textarea1"
              placeholder="Enter description..."
              bind:value={textareaValue}
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Custom (6 rows)
            </label>
            <ThemedTextarea
              name="textarea2"
              rows={6}
              placeholder="Larger textarea..."
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              With Maxlength (100)
            </label>
            <ThemedTextarea
              name="textarea3"
              maxlength={100}
              placeholder="Max 100 characters..."
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Disabled
            </label>
            <ThemedTextarea
              name="textarea4"
              value="This textarea is disabled"
              disabled
            />
          </div>
        </div>
        <div class="mt-4 p-4 rounded" style="background: var(--theme-sidebar-hover);">
          <code class="text-sm" style="color: var(--theme-foreground);">
            &lt;ThemedTextarea name="description" rows={'{4}'} bind:value={'{value}'} /&gt;
          </code>
        </div>
      </div>
    </ThemedCard>

    <!-- ThemedButton -->
    <ThemedCard title="ThemedButton Component">
      <div class="space-y-4">
        <p style="color: var(--theme-foreground);">
          Buttons with different variants: primary, secondary, danger, and warning.
        </p>
        
        <div>
          <h3 class="text-lg font-semibold mb-3" style="color: var(--theme-foreground);">
            Button Variants
          </h3>
          <div class="flex flex-wrap gap-3">
            <ThemedButton variant="primary">Primary Button</ThemedButton>
            <ThemedButton variant="secondary">Secondary Button</ThemedButton>
            <ThemedButton variant="danger">Danger Button</ThemedButton>
            <ThemedButton variant="warning">Warning Button</ThemedButton>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3" style="color: var(--theme-foreground);">
            Button Types
          </h3>
          <div class="flex flex-wrap gap-3">
            <ThemedButton type="button" variant="primary">Type: Button</ThemedButton>
            <ThemedButton type="submit" variant="primary">Type: Submit</ThemedButton>
            <ThemedButton type="reset" variant="secondary">Type: Reset</ThemedButton>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3" style="color: var(--theme-foreground);">
            Button States
          </h3>
          <div class="flex flex-wrap gap-3">
            <ThemedButton variant="primary">Enabled</ThemedButton>
            <ThemedButton variant="primary" disabled>Disabled</ThemedButton>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3" style="color: var(--theme-foreground);">
            Full Width Button
          </h3>
          <ThemedButton variant="primary" fullWidth>Full Width Button</ThemedButton>
        </div>

        <div class="mt-4 p-4 rounded" style="background: var(--theme-sidebar-hover);">
          <code class="text-sm" style="color: var(--theme-foreground);">
            &lt;ThemedButton type="submit" variant="primary"&gt;Click Me&lt;/ThemedButton&gt;
          </code>
        </div>
      </div>
    </ThemedCard>

    <!-- ThemedSelect -->
    <ThemedCard title="ThemedSelect Component">
      <div class="space-y-4">
        <p style="color: var(--theme-foreground);">
          Dropdown select with theme-aware styling.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Default Select
            </label>
            <ThemedSelect name="select1" bind:value={selectValue}>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </ThemedSelect>
            <p class="text-sm mt-1" style="color: var(--theme-sidebar-muted);">
              Selected: {selectValue}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Required Select
            </label>
            <ThemedSelect name="select2" required>
              <option value="">-- Select an option --</option>
              <option value="a">Option A</option>
              <option value="b">Option B</option>
              <option value="c">Option C</option>
            </ThemedSelect>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Disabled Select
            </label>
            <ThemedSelect name="select3" disabled>
              <option value="disabled">This is disabled</option>
            </ThemedSelect>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Role Select
            </label>
            <ThemedSelect name="role">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </ThemedSelect>
          </div>
        </div>
        <div class="mt-4 p-4 rounded" style="background: var(--theme-sidebar-hover);">
          <code class="text-sm" style="color: var(--theme-foreground);">
            &lt;ThemedSelect name="role" bind:value={'{value}'}&gt;&lt;option&gt;...&lt;/option&gt;&lt;/ThemedSelect&gt;
          </code>
        </div>
      </div>
    </ThemedCard>

    <!-- ThemedAlert -->
    <ThemedCard title="ThemedAlert Component">
      <div class="space-y-4">
        <p style="color: var(--theme-foreground);">
          Alert messages with different types: success, error, warning, and info.
        </p>
        <div class="space-y-3">
          <ThemedAlert type="success">
            ✅ Success! Your changes have been saved successfully.
          </ThemedAlert>
          <ThemedAlert type="error">
            ❌ Error! Something went wrong. Please try again.
          </ThemedAlert>
          <ThemedAlert type="warning">
            ⚠️ Warning! This action cannot be undone.
          </ThemedAlert>
          <ThemedAlert type="info">
            ℹ️ Info: Here's some helpful information for you.
          </ThemedAlert>
        </div>
        <div class="mt-4 p-4 rounded" style="background: var(--theme-sidebar-hover);">
          <code class="text-sm" style="color: var(--theme-foreground);">
            &lt;ThemedAlert type="success"&gt;Success message!&lt;/ThemedAlert&gt;
          </code>
        </div>
      </div>
    </ThemedCard>

    <!-- ConfirmModal -->
    <ThemedCard title="ConfirmModal Component">
      <div class="space-y-4">
        <p style="color: var(--theme-foreground);">
          Confirmation dialog for destructive or important actions.
        </p>
        <div class="space-y-3">
          <ThemedButton variant="danger" onclick={() => showModal = true}>
            Open Confirm Modal
          </ThemedButton>
          {#if modalResult}
            <ThemedAlert type="success">
              {modalResult}
            </ThemedAlert>
          {/if}
        </div>
        <div class="mt-4 p-4 rounded" style="background: var(--theme-sidebar-hover);">
          <code class="text-sm" style="color: var(--theme-foreground);">
            &lt;ConfirmModal bind:isOpen={'{showModal}'} title="Confirm" onConfirm={'{handleConfirm}'} /&gt;
          </code>
        </div>
      </div>
    </ThemedCard>

    <!-- Complete Form Example -->
    <ThemedCard title="Complete Form Example">
      <div class="space-y-4">
        <p style="color: var(--theme-foreground);">
          A complete form using all themed components together.
        </p>
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Full Name *
            </label>
            <ThemedInput
              type="text"
              name="fullName"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Email Address *
            </label>
            <ThemedInput
              type="email"
              name="email"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Role *
            </label>
            <ThemedSelect name="role" required>
              <option value="">-- Select a role --</option>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </ThemedSelect>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
              Bio
            </label>
            <ThemedTextarea
              name="bio"
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>

          <ThemedAlert type="info">
            ℹ️ All fields marked with * are required.
          </ThemedAlert>

          <div class="flex gap-3">
            <ThemedButton type="submit" variant="primary">
              Submit Form
            </ThemedButton>
            <ThemedButton type="reset" variant="secondary">
              Reset
            </ThemedButton>
          </div>
        </form>
      </div>
    </ThemedCard>

    <!-- Theme Variables Reference -->
    <ThemedCard title="Theme Variables Reference">
      <div class="space-y-4">
        <p style="color: var(--theme-foreground);">
          All components use CSS custom properties for theming. Here are the available variables:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded" style="background: var(--theme-background);">
            <code class="text-sm" style="color: var(--theme-foreground);">--theme-background</code>
          </div>
          <div class="p-4 rounded" style="background: var(--theme-foreground); color: var(--theme-background);">
            <code class="text-sm">--theme-foreground</code>
          </div>
          <div class="p-4 rounded" style="background: var(--theme-sidebar);">
            <code class="text-sm" style="color: var(--theme-foreground);">--theme-sidebar</code>
          </div>
          <div class="p-4 rounded" style="background: var(--theme-sidebar-bg);">
            <code class="text-sm" style="color: var(--theme-foreground);">--theme-sidebar-bg</code>
          </div>
          <div class="p-4 rounded" style="background: var(--theme-sidebar-hover);">
            <code class="text-sm" style="color: var(--theme-foreground);">--theme-sidebar-hover</code>
          </div>
          <div class="p-4 rounded border" style="border-color: var(--theme-sidebar-border);">
            <code class="text-sm" style="color: var(--theme-foreground);">--theme-sidebar-border</code>
          </div>
          <div class="p-4 rounded" style="background: var(--theme-sidebar-accent); color: white;">
            <code class="text-sm">--theme-sidebar-accent</code>
          </div>
          <div class="p-4 rounded" style="color: var(--theme-sidebar-muted);">
            <code class="text-sm">--theme-sidebar-muted</code>
          </div>
          <div class="p-4 rounded" style="background: var(--theme-success); color: white;">
            <code class="text-sm">--theme-success</code>
          </div>
          <div class="p-4 rounded" style="background: var(--theme-error); color: white;">
            <code class="text-sm">--theme-error</code>
          </div>
          <div class="p-4 rounded" style="background: var(--theme-warning); color: white;">
            <code class="text-sm">--theme-warning</code>
          </div>
          <div class="p-4 rounded" style="background: var(--theme-info); color: white;">
            <code class="text-sm">--theme-info</code>
          </div>
        </div>
      </div>
    </ThemedCard>
  </div>
</div>

<ConfirmModal
  bind:isOpen={showModal}
  title="Confirm Action"
  message="Are you sure you want to proceed with this action?"
  confirmText="Yes, Proceed"
  confirmStyle="danger"
  onConfirm={handleModalConfirm}
/>
