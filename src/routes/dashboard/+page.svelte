<script lang="ts">
  import DashboardLayout from '$lib/components/dashboard/DashboardLayout.svelte';
  
  // In a real app, these would come from authentication/routing
  const userId = 'demo-user-123';
  const teamId = 'demo-team-456';
</script>

<svelte:head>
  <title>Dashboard - Cosplans</title>
  <meta name="description" content="Real-time dashboard for cosplay team collaboration" />
</svelte:head>

<DashboardLayout {userId} {teamId} />