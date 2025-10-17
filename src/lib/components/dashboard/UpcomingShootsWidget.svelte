<script lang="ts">
  import { onMount } from 'svelte';
  import type { DashboardWidget } from '$lib/types/dashboard';

  // Props
  export let widget: DashboardWidget;
  export let teamId: string;

  // Component state
  let shoots: any[] = [];
  let loading = true;
  let error: string | null = null;

  // Mock data for demonstration
  const mockShoots = [
    {
      id: '1',
      title: 'Convention Shoot',
      date: '2025-10-25',
      time: '14:00',
      status: 'upcoming',
      location: 'Convention Center Hall A',
      characters: ['Sailor Moon', 'Tuxedo Mask'],
      photographer: 'Alex Chen',
      teamMembers: 4,
      costumeImage: null // Will use placeholder
    },
    {
      id: '2', 
      title: 'Studio Session',
      date: '2025-11-02',
      time: '10:00',
      status: 'planning',
      location: 'Downtown Studio',
      characters: ['Asuka Langley'],
      photographer: 'Sarah Kim',
      teamMembers: 6,
      costumeImage: null
    },
    {
      id: '3',
      title: 'Outdoor Cosplay',
      date: '2025-11-15',
      time: '09:00', 
      status: 'confirmed',
      location: 'Cherry Blossom Park',
      characters: ['Nezuko', 'Tanjiro'],
      photographer: 'Mike Rodriguez',
      teamMembers: 3,
      costumeImage: null
    }
  ];

  // Get next upcoming shoot
  $: nextShoot = shoots.length > 0 ? shoots[0] : null;
  
  // Get week view data (7 days from today)
  $: weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date,
      dateStr: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      shootCount: shoots.filter(s => s.date === date.toISOString().split('T')[0]).length
    };
  });

  onMount(async () => {
    try {
      loading = true;
      // In a real app, this would fetch from Supabase for the specific team
      console.log('Loading shoots for team:', teamId);
      // const { data, error: fetchError } = await supabase
      //   .from('shoots')
      //   .select('*')
      //   .eq('team_id', teamId)
      //   .gte('shoot_date', new Date().toISOString())
      //   .order('shoot_date', { ascending: true })
      //   .limit(widget.settings.limit || 5);
      
      // For now, use mock data
      shoots = mockShoots.slice(0, widget.settings.limit || 5);
      error = null;
    } catch (err) {
      error = 'Failed to load upcoming shoots';
      console.error('Error loading shoots:', err);
    } finally {
      loading = false;
    }
  });

  function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      upcoming: 'bg-blue-100 text-blue-800',
      planning: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  function formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  function getCostumeImage(shoot: any): string {
    // In a real app, this would return the uploaded image URL
    // For now, we return a placeholder
    return shoot.costumeImage || '';
  }

  function isToday(dateStr: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  }

  function isUpcoming(dateStr: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateStr >= today;
  }
</script>

<div class="space-y-6">
  {#if loading}
    <!-- Loading State -->
    <div class="space-y-4">
      <div class="animate-pulse">
        <div class="h-20 bg-gray-200 rounded-lg mb-4"></div>
        <div class="flex space-x-2">
          {#each Array(7) as _}
            <div class="h-16 bg-gray-200 rounded flex-1"></div>
          {/each}
        </div>
      </div>
    </div>
  
  {:else if error}
    <!-- Error State -->
    <div class="text-center py-6">
      <div class="text-red-500 mb-2">
        <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p class="text-sm text-red-600">{error}</p>
      <button 
        on:click={() => window.location.reload()}
        class="mt-2 text-xs text-blue-600 hover:text-blue-800"
      >
        Retry
      </button>
    </div>
  
  {:else if shoots.length === 0}
    <!-- Empty State -->
    <div class="text-center py-12">
      <div class="text-gray-400 mb-3">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4h4m-4 4h4m-8 4h8a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      </div>
      <p class="text-sm font-medium text-gray-700 mb-1">No shoots scheduled</p>
      <p class="text-xs text-gray-500">Your calendar is clear. Schedule your first shoot to get started!</p>
    </div>
  
  {:else}
    <!-- Next Shoot Notification Bar -->
    {#if nextShoot}
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Next Scheduled Shoot</p>
            <p class="text-lg font-semibold text-gray-900">{nextShoot.title}</p>
            <p class="text-sm text-gray-700 mt-1">
              {formatDate(nextShoot.date)} at {formatTime(nextShoot.time)}
            </p>
          </div>
          <span class={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(nextShoot.status)}`}>
            {nextShoot.status.charAt(0).toUpperCase() + nextShoot.status.slice(1)}
          </span>
        </div>
      </div>
    {/if}

    <!-- Week View Calendar (Simple) -->
    <div>
      <p class="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3">This Week</p>
      <div class="flex gap-2 overflow-x-auto pb-2">
        {#each weekDays as day (day.dateStr)}
          <div class={`flex-shrink-0 w-16 p-3 rounded-lg text-center transition-all ${
            isToday(day.dateStr) 
              ? 'bg-blue-600 text-white shadow-md' 
              : day.shootCount > 0 
                ? 'bg-blue-100 border-2 border-blue-400 text-gray-900' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
            <p class="text-xs font-semibold">{day.dayName}</p>
            <p class="text-lg font-bold mt-1">{day.dayNum}</p>
            {#if day.shootCount > 0}
              <p class="text-xs font-medium mt-1">{day.shootCount} shoot{day.shootCount > 1 ? 's' : ''}</p>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Shoots List with Images -->
    <div class="space-y-3">
      {#each shoots as shoot (shoot.id)}
        <div class="group overflow-hidden bg-white rounded-lg border border-gray-200 hover:border-blue-400 transition-all hover:shadow-md">
          <div class="flex gap-4 p-4">
            <!-- Image Container (Left) -->
            <div class="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center">
              {#if getCostumeImage(shoot)}
                <img src={getCostumeImage(shoot)} alt={shoot.characters.join(', ')} class="w-full h-full object-cover" />
              {:else}
                <div class="text-center">
                  <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p class="text-xs text-gray-500">No image</p>
                </div>
              {/if}
            </div>

            <!-- Details Container (Right) -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 class="text-sm font-semibold text-gray-900">{shoot.title}</h3>
                    {#if shoot.characters.length > 0}
                      <p class="text-xs text-gray-600 mt-0.5">
                        {shoot.characters.join(', ')}
                      </p>
                    {/if}
                  </div>
                  <span class={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusColor(shoot.status)}`}>
                    {shoot.status.charAt(0).toUpperCase() + shoot.status.slice(1)}
                  </span>
                </div>

                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-xs text-gray-700">
                    <svg class="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M8 7h8"/>
                    </svg>
                    <span>{formatDate(shoot.date)} at {formatTime(shoot.time)}</span>
                  </div>
                  <div class="flex items-start gap-2 text-xs text-gray-700">
                    <svg class="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span>{shoot.location}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                {#if shoot.photographer}
                  <div class="flex items-center gap-1 text-xs text-gray-600">
                    <svg class="w-3 h-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span>{shoot.photographer}</span>
                  </div>
                {:else}
                  <div></div>
                {/if}
                
                <div class="flex items-center gap-1 text-xs text-gray-600">
                  <svg class="w-3 h-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                  <span>{shoot.teamMembers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- View More Link -->
    {#if shoots.length >= (widget.settings.limit || 5)}
      <div class="pt-2">
        <a href="/shoots" class="text-xs text-blue-600 hover:text-blue-800 font-medium">
          View all upcoming shoots →
        </a>
      </div>
    {/if}
  {/if}
</div>