<script lang="ts">
  import ConnectionForm from "$lib/components/service-connections/ConnectionForm.svelte";
  import ConnectionList from "$lib/components/service-connections/ConnectionList.svelte";
  import DiagnosticsPanel from "$lib/components/service-connections/DiagnosticsPanel.svelte";
  import HealthOverview from "$lib/components/service-connections/HealthOverview.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  export let form;

  const deriveDefaults = () => {
    const first = data.connections.at(0);
    if (!first) {
      return {};
    }

    return {
      id: first.id,
      name:
        (first.connectionMetadata?.displayName as string | undefined) ?? first.supabaseProjectRef,
      environment: first.environment,
      serviceType: first.serviceType,
      supabaseUrl: (first.connectionMetadata?.url as string | undefined) ?? "",
      supabaseProjectRef: first.supabaseProjectRef,
      supabaseServiceRoleKey: "",
      supabaseAnonKey: "",
      activationRequested: false,
    };
  };

  const formDefaults = deriveDefaults();
</script>

<div class="grid gap-6 xl:grid-cols-[3fr_2fr]">
  <div class="space-y-6">
    <ConnectionForm teamId={data.teamId} {form} {formDefaults} />
    <DiagnosticsPanel
      teamId={data.teamId}
      connections={data.connections}
      diagnostics={data.diagnostics}
      {form}
    />
  </div>
  <div class="space-y-6">
    <ConnectionList connections={data.connections} />
    <HealthOverview teamId={data.teamId} connections={data.connections} snapshots={data.health} />
  </div>
</div>
