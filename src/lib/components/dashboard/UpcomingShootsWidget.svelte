<script lang="ts">
  import { onMount } from "svelte";
  import type { DashboardWidget } from "$lib/types/dashboard";

  // Props
  export let widget: DashboardWidget;
  export let teamId: string;

  // Component state
  let shoots: any[] = [];
  let loading = true;
  let error: string | null = null;
  const loadingDayPlaceholders = Array.from({ length: 7 }, (_, index) => index);

  // Mock data for demonstration
  const mockShoots = [
    {
      id: "1",
      title: "Convention Shoot",
      date: "2025-10-25",
      time: "14:00",
      status: "upcoming",
      location: "Convention Center Hall A",
      characters: ["Sailor Moon", "Tuxedo Mask"],
      photographer: "Alex Chen",
      teamMembers: 4,
      costumeImage: null, // Will use placeholder
      type: "shoot",
      team_id: "demo-team",
    },
    {
      id: "2",
      title: "Studio Session",
      date: "2025-11-02",
      time: "10:00",
      status: "planning",
      location: "Downtown Studio",
      characters: ["Asuka Langley"],
      photographer: "Sarah Kim",
      teamMembers: 6,
      costumeImage: null,
      type: "shoot",
      team_id: "demo-team",
    },
    {
      id: "3",
      title: "Outdoor Cosplay",
      date: "2025-11-15",
      time: "09:00",
      status: "confirmed",
      location: "Cherry Blossom Park",
      characters: ["Nezuko", "Tanjiro"],
      photographer: "Mike Rodriguez",
      teamMembers: 3,
      costumeImage: null,
      type: "shoot",
      team_id: "demo-team",
    },
  ];

  // Mock external calendar events (synced from team members)
  const mockExternalEvents = [
    {
      id: "ext-1",
      title: "Family Dinner",
      date: "2025-10-18",
      time: "18:00",
      type: "external",
      owner: "Sarah Kim",
      calendar: "personal",
    },
    {
      id: "ext-2",
      title: "Dentist Appointment",
      date: "2025-10-19",
      time: "14:30",
      type: "external",
      owner: "Alex Chen",
      calendar: "personal",
    },
    {
      id: "ext-3",
      title: "Team Meeting",
      date: "2025-10-21",
      time: "10:00",
      type: "external",
      owner: "Mike Rodriguez",
      calendar: "work",
    },
    {
      id: "ext-4",
      title: "Out of Town",
      date: "2025-10-22",
      time: "00:00",
      type: "external",
      owner: "Jordan Lee",
      calendar: "personal",
      allDay: true,
    },
  ];

  // Combine all events
  $: allEvents = [...shoots, ...mockExternalEvents];

  // Get next upcoming shoot
  $: nextShoot = shoots.length > 0 ? shoots[0] : null;

  // Current week offset (0 = current week, -1 = previous week, +1 = next week)
  let weekOffset = 0;

  // Get week view data (Sunday through Saturday of the current week + offset)
  $: weekDays = Array.from({ length: 7 }, (_, i) => {
    const today = new Date();
    // Get the Sunday of the current week
    const currentDayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDayOfWeek + weekOffset * 7);

    // Calculate each day from Sunday
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    // Get all events for this day
    const dayEvents = allEvents.filter((e) => e.date === dateStr);
    const dayShootCount = dayEvents.filter((e) => e.type === "shoot").length;
    const dayExternalCount = dayEvents.filter((e) => e.type === "external").length;

    return {
      date,
      dateStr,
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: date.getDate(),
      monthName: date.toLocaleDateString("en-US", { month: "short" }),
      events: dayEvents.slice(0, 3), // Limit to 3 events shown per day
      shootCount: dayShootCount,
      externalCount: dayExternalCount,
      totalEvents: dayEvents.length,
      hasMore: dayEvents.length > 3,
    };
  });

  // Get current week label
  $: currentWeekLabel = (() => {
    if (weekOffset === 0) return "This Week";
    if (weekOffset === -1) return "Last Week";
    if (weekOffset === 1) return "Next Week";
    const startDate = weekDays[0].date;
    return startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  })();

  function navigateWeek(direction: number) {
    weekOffset += direction;
  }

  onMount(async () => {
    try {
      loading = true;
      // In a real app, this would fetch from Supabase for the specific team
      // const { data, error: fetchError } = await supabase
      //   .from('shoots')
      //   .select('*')
      //   .eq('team_id', teamId)
      //   .gte('shoot_date', new Date().toISOString())
      //   .order('shoot_date', { ascending: true })
      //   .limit(widget.settings.limit || 5);

      // For now, use mock data
      shoots = mockShoots
        .filter((shoot) => shoot.team_id === teamId)
        .slice(0, widget.settings.limit || 5);
      error = null;
    } catch (err) {
      error = "Failed to load upcoming shoots";
      console.error("Error loading shoots:", err);
    } finally {
      loading = false;
    }
  });

  function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      upcoming: "bg-blue-100 text-blue-800",
      planning: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  function getCostumeImage(shoot: any): string {
    // In a real app, this would return the uploaded image URL
    // For now, we return a placeholder
    return shoot.costumeImage || "";
  }

  function isToday(dateStr: string): boolean {
    const today = new Date().toISOString().split("T")[0];
    return dateStr === today;
  }
</script>

<div class="space-y-6">
  {#if loading}
    <!-- Loading State -->
    <div class="space-y-4">
      <div class="animate-pulse">
        <div class="h-20 rounded-lg mb-4" style="background: var(--theme-sidebar-hover);"></div>
        <div class="flex space-x-2">
          {#each loadingDayPlaceholders as placeholder (placeholder)}
            <div class="h-16 rounded flex-1" style="background: var(--theme-sidebar-hover);"></div>
          {/each}
        </div>
      </div>
    </div>
  {:else if error}
    <!-- Error State -->
    <div class="text-center py-6">
      <div class="mb-2" style="color: var(--theme-sidebar-accent);">
        <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p class="text-sm" style="color: var(--theme-sidebar-text);">{error}</p>
      <button
        onclick={() => window.location.reload()}
        class="mt-2 text-xs"
        style="color: var(--theme-sidebar-accent);"
      >
        Retry
      </button>
    </div>
  {:else if shoots.length === 0}
    <!-- Empty State -->
    <div class="text-center py-12">
      <div class="mb-3" style="color: var(--theme-sidebar-text); opacity: 0.4;">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4h4m-4 4h4m-8 4h8a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p class="text-sm font-medium mb-1" style="color: var(--theme-foreground);">
        No shoots scheduled
      </p>
      <p class="text-xs" style="color: var(--theme-sidebar-text); opacity: 0.6;">
        Your calendar is clear. Schedule your first shoot to get started!
      </p>
    </div>
  {:else}
    <!-- Next Shoot Notification Bar -->
    {#if nextShoot}
      <div
        class="rounded-lg p-5 shadow-lg"
        style="background: var(--theme-sidebar-accent); color: white; border: 2px solid var(--theme-sidebar-accent);"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1">
            <p class="text-xs font-bold uppercase tracking-wider mb-2" style="opacity: 0.9;">
              Next Scheduled Shoot
            </p>
            <p class="text-2xl font-bold mb-1">{nextShoot.title}</p>
            <p class="text-sm" style="opacity: 0.9;">
              {formatDate(nextShoot.date)} at {formatTime(nextShoot.time)}
            </p>
          </div>
          <a
            href="/shoots/{nextShoot.id}"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-white shadow-md transition-all duration-150 hover:scale-105 hover:shadow-lg"
            style="color: var(--theme-sidebar-accent);"
          >
            <span>View Details</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    {/if}

    <!-- Week View Calendar (Full Width with Navigation) -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <p
          class="text-sm font-bold uppercase tracking-wide"
          style="color: var(--theme-foreground); opacity: 0.9;"
        >
          {currentWeekLabel}
        </p>
        <div class="flex items-center gap-2">
          <button
            onclick={() => navigateWeek(-1)}
            class="p-1.5 rounded-lg transition-all hover:opacity-70"
            style="color: var(--theme-sidebar-text); background: var(--theme-sidebar-hover);"
            aria-label="Previous week"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onclick={() => navigateWeek(1)}
            class="p-1.5 rounded-lg transition-all hover:opacity-70"
            style="color: var(--theme-sidebar-text); background: var(--theme-sidebar-hover);"
            aria-label="Next week"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {#each weekDays as day (day.dateStr)}
          <a
            href="/calendar?date={day.dateStr}"
            class="rounded-lg overflow-hidden transition-all duration-200 cursor-pointer min-h-[160px] flex flex-col hover:scale-105 hover:shadow-lg hover:z-10"
            style={isToday(day.dateStr)
              ? "background: var(--theme-sidebar-hover); border: 2px solid var(--theme-sidebar-accent); box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
              : "background: var(--theme-sidebar-hover); border: 1px solid var(--theme-sidebar-border);"}
          >
            <!-- Compact Day Header -->
            <div
              class="px-2.5 py-1.5 flex items-center justify-between"
              style={isToday(day.dateStr)
                ? "background: var(--theme-sidebar-accent); color: white;"
                : "color: var(--theme-sidebar-text); opacity: 0.5;"}
            >
              <span class="text-[10px] font-semibold uppercase tracking-wide">{day.dayName}</span>
              <span class="text-sm font-bold">{day.dayNum}</span>
            </div>

            <!-- Events List (More Space) -->
            <div class="flex-1 p-2 space-y-2 overflow-y-auto">
              {#each day.events as event (event.id)}
                <div
                  class="px-3 py-2.5 rounded-lg text-xs transition-all duration-150 cursor-pointer hover:scale-105 hover:shadow-md hover:z-10"
                  style={event.type === "shoot"
                    ? "background: var(--theme-sidebar-accent); color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-weight: 600;"
                    : "background: var(--theme-sidebar-border); color: var(--theme-sidebar-text); opacity: 0.7; font-weight: 400;"}
                  title="{event.title} {event.time ? `at ${event.time}` : ''}{event.owner
                    ? ` (${event.owner})`
                    : ''}"
                >
                  <div class="flex items-start gap-2">
                    {#if event.type === "shoot"}
                      <svg
                        class="w-4 h-4 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        stroke-width="2.5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                      </svg>
                    {:else}
                      <svg
                        class="w-3 h-3 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    {/if}
                    <div class="flex-1 min-w-0">
                      {#if event.time && event.time !== "00:00"}
                        <p class="font-bold leading-tight text-sm mb-0.5">
                          {event.time.slice(0, 5)}
                        </p>
                      {/if}
                      <p
                        class="leading-snug {event.time && event.time !== '00:00'
                          ? 'text-xs'
                          : 'font-bold text-sm'}"
                        style="word-break: break-word;"
                      >
                        {event.title}
                      </p>
                      {#if event.owner}
                        <p class="text-[10px] mt-1" style="opacity: 0.75;">{event.owner}</p>
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}

              {#if day.hasMore}
                <button
                  class="w-full px-2 py-2 text-xs font-semibold text-center rounded-lg cursor-pointer transition-all duration-150 hover:scale-105 hover:shadow-sm hover:opacity-90"
                  style="color: var(--theme-sidebar-accent); background: var(--theme-sidebar-border);"
                >
                  +{day.totalEvents - 3} more
                </button>
              {/if}

              {#if day.events.length === 0}
                <div class="h-full flex items-center justify-center">
                  <p class="text-[11px]" style="color: var(--theme-sidebar-text); opacity: 0.3;">
                    No events
                  </p>
                </div>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    </div>

    <!-- Section Divider -->
    <div class="pt-6 pb-2">
      <div class="flex items-center justify-between mb-4">
        <h3
          class="text-base font-bold uppercase tracking-wide"
          style="color: var(--theme-foreground);"
        >
          All Upcoming Shoots
        </h3>
        <span
          class="text-xs font-semibold px-3 py-1 rounded-full"
          style="background: var(--theme-sidebar-border); color: var(--theme-sidebar-text);"
        >
          {shoots.length}
          {shoots.length === 1 ? "Shoot" : "Shoots"}
        </span>
      </div>
      <div class="h-px mb-4" style="background: var(--theme-sidebar-border); opacity: 0.5;"></div>
    </div>

    <!-- Shoots List with Images -->
    <div class="space-y-4">
      {#each shoots as shoot (shoot.id)}
        <a
          href="/shoots/{shoot.id}"
          class="group block overflow-hidden rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl hover:z-10"
          style="background: var(--theme-sidebar-hover); border: 2px solid var(--theme-sidebar-border); box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
        >
          <div class="flex gap-4 p-5">
            <!-- Image Container (Left) -->
            <div
              class="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden flex items-center justify-center"
              style="background: rgba(255, 255, 255, 0.05); border: 3px solid var(--theme-sidebar-border);"
            >
              {#if getCostumeImage(shoot)}
                <img
                  src={getCostumeImage(shoot)}
                  alt={shoot.characters.join(", ")}
                  class="w-full h-full object-cover"
                />
              {:else}
                <div class="text-center">
                  <svg
                    class="w-10 h-10 mx-auto mb-2"
                    style="color: var(--theme-sidebar-text); opacity: 0.3;"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p
                    class="text-xs font-medium"
                    style="color: var(--theme-sidebar-text); opacity: 0.4;"
                  >
                    No image
                  </p>
                </div>
              {/if}
            </div>

            <!-- Details Container (Right) -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 class="text-lg font-bold mb-1" style="color: var(--theme-foreground);">
                      {shoot.title}
                    </h3>
                    {#if shoot.characters.length > 0}
                      <p
                        class="text-sm font-medium"
                        style="color: var(--theme-sidebar-text); opacity: 0.8;"
                      >
                        {shoot.characters.join(", ")}
                      </p>
                    {/if}
                  </div>
                  <span
                    class={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 ${getStatusColor(shoot.status)}`}
                  >
                    {shoot.status.charAt(0).toUpperCase() + shoot.status.slice(1)}
                  </span>
                </div>

                <div class="space-y-2">
                  <div
                    class="flex items-center gap-2 text-sm font-medium"
                    style="color: var(--theme-sidebar-text);"
                  >
                    <svg
                      class="w-4 h-4 flex-shrink-0"
                      style="color: var(--theme-sidebar-accent);"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{formatDate(shoot.date)} at {formatTime(shoot.time)}</span>
                  </div>
                  <div
                    class="flex items-start gap-2 text-sm"
                    style="color: var(--theme-sidebar-text); opacity: 0.8;"
                  >
                    <svg
                      class="w-4 h-4 flex-shrink-0 mt-0.5"
                      style="color: var(--theme-sidebar-text); opacity: 0.6;"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{shoot.location}</span>
                  </div>
                </div>
              </div>

              <div
                class="flex items-center justify-between pt-2"
                style="border-top: 1px solid var(--theme-sidebar-border);"
              >
                {#if shoot.photographer}
                  <div
                    class="flex items-center gap-1 text-xs"
                    style="color: var(--theme-sidebar-text); opacity: 0.7;"
                  >
                    <svg
                      class="w-3 h-3 flex-shrink-0"
                      style="color: var(--theme-sidebar-text); opacity: 0.6;"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{shoot.photographer}</span>
                  </div>
                {:else}
                  <div></div>
                {/if}

                <div
                  class="flex items-center gap-2 text-sm font-medium"
                  style="color: var(--theme-sidebar-text); opacity: 0.7;"
                >
                  <svg
                    class="w-4 h-4 flex-shrink-0"
                    style="color: var(--theme-sidebar-text); opacity: 0.6;"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  <span>{shoot.teamMembers}</span>
                </div>
              </div>
            </div>
          </div>
        </a>
      {/each}
    </div>

    <!-- View More Link -->
    {#if shoots.length >= (widget.settings.limit || 5)}
      <div class="pt-4 text-center">
        <a
          href="/shoots"
          class="inline-block text-sm font-bold px-6 py-2.5 rounded-lg transition-all hover:opacity-80"
          style="background: var(--theme-sidebar-accent); color: white;"
        >
          View All Upcoming Shoots →
        </a>
      </div>
    {/if}
  {/if}
</div>
