<script lang="ts">
  import ConnectionForm from "$lib/components/service-connections/ConnectionForm.svelte";
  import ConnectionList from "$lib/components/service-connections/ConnectionList.svelte";
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
      name: (first.connectionMetadata?.displayName as string | undefined) ?? first.supabaseProjectRef,
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

<div class="grid gap-6 lg:grid-cols-[3fr_2fr]">
  <ConnectionForm teamId={data.teamId} form={form} formDefaults={formDefaults} />
  <ConnectionList connections={data.connections} />
</div>