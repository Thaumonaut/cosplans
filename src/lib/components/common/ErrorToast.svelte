<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { TranslatedErrorMessage } from "$lib/utils/errors";

  export let message: TranslatedErrorMessage | null = null;
  export let correlationId: string | null | undefined = null;
  export let showSupportAction = true;
  export let supportHref = "mailto:support@cosplans.io";
  export let retryLabel = "Retry";
  export let dismissible = false;

  const dispatch = createEventDispatcher<{
    retry: void;
    dismiss: void;
  }>();

  const severityStyles: Record<string, string> = {
    info: "border-blue-200 bg-blue-50 text-blue-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    error: "border-red-200 bg-red-50 text-red-900",
    critical: "border-red-300 bg-red-100 text-red-900",
  };

  const iconMap: Record<string, string> = {
    info: "ℹ️",
    warning: "⚠️",
    error: "❌",
    critical: "🚨",
  };

  $: severity = message?.severity ?? "error";
  $: wrapperClasses = severityStyles[severity] ?? severityStyles.error;

  const handleRetry = () => {
    dispatch("retry");
  };

  const handleDismiss = () => {
    dispatch("dismiss");
  };
</script>

{#if message}
  <div
    role="alert"
    class={`flex flex-col gap-3 rounded-lg border px-4 py-3 text-sm shadow ${wrapperClasses}`}
    aria-live={severity === "info" ? "polite" : "assertive"}
    data-testid="error-toast"
  >
    <header class="flex items-start gap-2">
      <span class="text-base" aria-hidden="true">{iconMap[severity]}</span>
      <div class="flex-1 space-y-1">
        <p class="text-sm font-semibold">{message.title}</p>
        <p class="text-sm leading-snug">{message.description}</p>
      </div>
      {#if dismissible}
        <button
          type="button"
          class="text-xs font-medium text-[var(--theme-muted)] transition hover:text-[var(--theme-foreground)]"
          onclick={() => handleDismiss()}
        >
          Dismiss
        </button>
      {/if}
    </header>

    {#if message.supportRecommendation}
      <p class="rounded-md bg-white/60 px-3 py-2 text-xs text-[var(--theme-muted-foreground)]">
        {message.supportRecommendation}
      </p>
    {/if}

    {#if correlationId}
      <p class="text-xs text-[var(--theme-muted-foreground)]">
        Correlation ID: <span class="font-mono">{correlationId}</span>
      </p>
    {/if}

    <div class="flex flex-wrap items-center gap-3">
      {#if message.retry}
        <button
          type="button"
          class="rounded-md bg-[var(--theme-accent)] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
          onclick={() => handleRetry()}
        >
          {retryLabel}
        </button>
      {/if}

      {#if showSupportAction && supportHref}
        <a
          class="text-xs font-medium underline"
          href={supportHref}
          target={supportHref.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
        >
          Contact support
        </a>
      {/if}
    </div>
  </div>
{/if}
