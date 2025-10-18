<script lang="ts">
  import { translateError } from "$lib/utils/errors";
  import {
    serviceConnectionEnvironments,
    type ServiceConnectionEnvironment,
  } from "$lib/types/service-connections";
  import type { ServiceConnectionFormInput } from "$lib/server/service-connections/validation";

  interface FormState {
    kind?: string;
    status?: "success" | "error";
    message?: string;
    code?: string;
    severity?: string;
    correlationId?: string;
    values?: Record<string, unknown>;
    errors?: Record<string, string>;
    activationPermitted?: boolean;
    blockingReasons?: string[];
    latencyMs?: number;
  }

  const defaults: ServiceConnectionFormInput = {
    name: "",
    environment: "development",
    serviceType: "supabase",
    supabaseUrl: "",
    supabaseProjectRef: "",
    supabaseServiceRoleKey: "",
    supabaseAnonKey: "",
    activationRequested: false,
  };

  export let form: FormState | { form: FormState } | null = null;
  export let teamId: string;
  export let formDefaults: Partial<ServiceConnectionFormInput> = {};

  const environmentOptions: ServiceConnectionEnvironment[] = [
    ...serviceConnectionEnvironments,
  ];

  const unwrapForm = (input: unknown): FormState | null => {
    if (!input || typeof input !== "object") {
      return null;
    }

    if ("kind" in input || "values" in input) {
      return input as FormState;
    }

    if ("form" in input && typeof (input as { form?: unknown }).form === "object") {
      return (input as { form?: FormState | null }).form ?? null;
    }

    return null;
  };

  $: currentForm = unwrapForm(form);

  $: values = (() => {
    const merged = {
      ...defaults,
      ...formDefaults,
      ...(currentForm?.values ?? {}),
    } satisfies ServiceConnectionFormInput & { id?: string };

    if (!merged.serviceType) {
      merged.serviceType = defaults.serviceType;
    }

    return merged;
  })();

  $: validationErrors = currentForm?.kind === "validation" ? currentForm.errors ?? {} : {};
  $: activationPermitted = Boolean(currentForm?.activationPermitted);
  $: verificationSuccess =
    currentForm?.kind === "verification" && currentForm?.status === "success"
      ? currentForm
      : null;
  $: verificationFailure =
    currentForm?.kind === "verification" && currentForm?.status === "error" ? currentForm : null;
  $: activationFailure =
    currentForm?.kind === "activation" && currentForm?.status === "error" ? currentForm : null;
  $: activationSuccess =
    currentForm?.kind === "save" && currentForm?.status === "success" ? currentForm : null;

  if (verificationSuccess?.activationPermitted) {
    activationPermitted = true;
  }

  $: translatedVerificationError = verificationFailure
    ? translateError({
        code: verificationFailure.code ?? "SERVICE_VERIFICATION_FAILED",
        severity: verificationFailure.severity ?? "error",
        userMessage: verificationFailure.message ?? "Verification failed",
        correlationId: verificationFailure.correlationId,
      })
    : null;

  $: translatedActivationError = activationFailure
    ? translateError({
        code: activationFailure.code ?? "SERVICE_ACTIVATION_FAILED",
        severity: activationFailure.severity ?? "error",
        userMessage:
          activationFailure.message ?? "Connection must pass verification before activation.",
        correlationId: activationFailure.correlationId,
      })
    : null;
</script>

<div class="space-y-6 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 shadow">
  <header class="space-y-1">
    <h2 class="text-lg font-semibold" style="color: var(--theme-foreground);">
      Configure Service Connection
    </h2>
    <p class="text-sm" style="color: var(--theme-muted);">
      Provide environment-specific Supabase credentials, test connectivity, then activate for your team.
    </p>
  </header>

  {#if verificationSuccess}
    <div
      role="status"
      class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
    >
      <p class="font-semibold">Connection verified</p>
      <p>
        {verificationSuccess.message ?? "Connection verified successfully."}
        {#if verificationSuccess.latencyMs}
          (latency: {verificationSuccess.latencyMs}ms)
        {/if}
      </p>
    </div>
  {/if}

  {#if verificationFailure && translatedVerificationError}
    <div
      role="alert"
      class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
    >
      <p class="font-semibold">{translatedVerificationError.title}</p>
      <p>{translatedVerificationError.description}</p>
      {#if translatedVerificationError.supportRecommendation}
        <p class="mt-2 text-xs">
          {translatedVerificationError.supportRecommendation}
        </p>
      {/if}
      {#if verificationFailure.correlationId}
        <p class="mt-2 text-xs">Correlation ID: {verificationFailure.correlationId}</p>
      {/if}
    </div>
  {/if}

  {#if activationSuccess}
    <div
      role="status"
      class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
    >
      <p class="font-semibold">Connection activated</p>
      <p>{activationSuccess.message ?? "Connection activated successfully."}</p>
    </div>
  {/if}

  {#if activationFailure && translatedActivationError}
    <div
      role="alert"
      class="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      <p class="font-semibold">{translatedActivationError.title}</p>
      <p>{translatedActivationError.description}</p>
      {#if translatedActivationError.supportRecommendation}
        <p class="mt-2 text-xs">
          {translatedActivationError.supportRecommendation}
        </p>
      {/if}
    </div>
  {/if}

  <form method="POST" class="space-y-5" autocomplete="off">
    <input type="hidden" name="serviceType" value={values.serviceType} />
    <input type="hidden" name="id" value={values.id ?? ""} />

    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-1">
        <label for="environment" class="text-sm font-medium" style="color: var(--theme-muted);">
          Environment
        </label>
        <select
          id="environment"
          name="environment"
          class="w-full rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-2 text-sm"
          bind:value={values.environment}
        >
          {#each environmentOptions as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
        {#if validationErrors.environment}
          <p class="text-xs text-red-600">{validationErrors.environment}</p>
        {/if}
      </div>

      <div class="space-y-1">
        <label for="name" class="text-sm font-medium" style="color: var(--theme-muted);">
          Connection name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          class="w-full rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-2 text-sm"
          bind:value={values.name}
          aria-invalid={Boolean(validationErrors.name)}
          aria-describedby={validationErrors.name ? "name-error" : undefined}
        />
        {#if validationErrors.name}
          <p id="name-error" class="text-xs text-red-600">{validationErrors.name}</p>
        {/if}
      </div>
    </div>

    <div class="space-y-1">
      <label for="supabaseUrl" class="text-sm font-medium" style="color: var(--theme-muted);">
        Supabase URL
      </label>
      <input
        id="supabaseUrl"
        name="supabaseUrl"
        type="url"
        inputmode="url"
        class="w-full rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-2 text-sm"
        bind:value={values.supabaseUrl}
        aria-invalid={Boolean(validationErrors.supabaseUrl)}
        aria-describedby={validationErrors.supabaseUrl ? "supabaseUrl-error" : undefined}
      />
      {#if validationErrors.supabaseUrl}
        <p id="supabaseUrl-error" class="text-xs text-red-600">{validationErrors.supabaseUrl}</p>
      {/if}
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-1">
        <label for="supabaseProjectRef" class="text-sm font-medium" style="color: var(--theme-muted);">
          Project reference
        </label>
        <input
          id="supabaseProjectRef"
          name="supabaseProjectRef"
          type="text"
          class="w-full rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-2 text-sm"
          bind:value={values.supabaseProjectRef}
          aria-invalid={Boolean(validationErrors.supabaseProjectRef)}
          aria-describedby={
            validationErrors.supabaseProjectRef ? "projectRef-error" : undefined
          }
        />
        {#if validationErrors.supabaseProjectRef}
          <p id="projectRef-error" class="text-xs text-red-600">
            {validationErrors.supabaseProjectRef}
          </p>
        {/if}
      </div>

      <div class="space-y-1">
        <label for="supabaseServiceRoleKey" class="text-sm font-medium" style="color: var(--theme-muted);">
          Service role key
        </label>
        <input
          id="supabaseServiceRoleKey"
          name="supabaseServiceRoleKey"
          type="password"
          class="w-full rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-2 text-sm"
          bind:value={values.supabaseServiceRoleKey}
          aria-invalid={Boolean(validationErrors.supabaseServiceRoleKey)}
          aria-describedby={
            validationErrors.supabaseServiceRoleKey ? "serviceRole-error" : undefined
          }
        />
        {#if validationErrors.supabaseServiceRoleKey}
          <p id="serviceRole-error" class="text-xs text-red-600">
            {validationErrors.supabaseServiceRoleKey}
          </p>
        {/if}
      </div>
    </div>

    <div class="space-y-1">
      <label for="supabaseAnonKey" class="text-sm font-medium" style="color: var(--theme-muted);">
        Anon key
      </label>
      <input
        id="supabaseAnonKey"
        name="supabaseAnonKey"
        type="password"
        class="w-full rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-2 text-sm"
        bind:value={values.supabaseAnonKey}
        aria-invalid={Boolean(validationErrors.supabaseAnonKey)}
        aria-describedby={validationErrors.supabaseAnonKey ? "anonKey-error" : undefined}
      />
      {#if validationErrors.supabaseAnonKey}
        <p id="anonKey-error" class="text-xs text-red-600">{validationErrors.supabaseAnonKey}</p>
      {/if}
    </div>

    <div class="flex items-center justify-between pt-2">
      <p class="text-xs" style="color: var(--theme-muted);">
        Team ID: {teamId}
      </p>
      <div class="flex gap-2">
        <button
          type="submit"
          class="rounded-md bg-[var(--theme-muted-bg)] px-4 py-2 text-sm font-medium text-[var(--theme-foreground)] transition hover:brightness-110"
          name="intent"
          value="verify"
          formaction="?/verify"
        >
          Test Connection
        </button>
        <button
          type="submit"
          class="rounded-md bg-[var(--theme-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          name="intent"
          value="activate"
          formaction="?/save"
          disabled={!activationPermitted}
        >
          Activate Connection
        </button>
      </div>
    </div>
  </form>
</div>
