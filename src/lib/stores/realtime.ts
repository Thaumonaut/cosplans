import { writable } from 'svelte/store';
import type { RealtimeUpdate } from '$lib/types/dashboard';

// Real-time connection status
export const connectionStatus = writable<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

// Real-time updates queue
export const realtimeUpdates = writable<RealtimeUpdate[]>([]);

// Server-Sent Events connection
let eventSource: EventSource | null = null;

// Real-time actions
export const realtimeActions = {
  // Connect to SSE stream
  connect: () => {
    if (typeof window === 'undefined') return; // Server-side guard
    
    connectionStatus.set('connecting');
    
    try {
      eventSource = new EventSource('/api/events');
      
      eventSource.onopen = () => {
        connectionStatus.set('connected');
      };
      
      eventSource.onmessage = (event) => {
        try {
          const update: RealtimeUpdate = JSON.parse(event.data);
          realtimeUpdates.update(updates => [...updates.slice(-99), update]); // Keep last 100 updates
        } catch (err) {
          console.warn('Failed to parse real-time update:', err);
        }
      };
      
      eventSource.onerror = (event) => {
        console.error('SSE error:', event);
        connectionStatus.set('error');
        
        // Attempt reconnection after 3 seconds
        setTimeout(() => {
          realtimeActions.reconnect();
        }, 3000);
      };
    } catch (err) {
      console.error('Failed to connect to SSE:', err);
      connectionStatus.set('error');
    }
  },

  // Disconnect from SSE stream
  disconnect: () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    connectionStatus.set('disconnected');
  },

  // Reconnect to SSE stream
  reconnect: () => {
    realtimeActions.disconnect();
    setTimeout(() => {
      realtimeActions.connect();
    }, 1000);
  },

  // Clear updates history
  clearUpdates: () => {
    realtimeUpdates.set([]);
  },

  // Manual update injection (for testing/fallback)
  injectUpdate: (update: RealtimeUpdate) => {
    realtimeUpdates.update(updates => [...updates.slice(-99), update]);
  }
};

// Auto-connect on browser load
if (typeof window !== 'undefined') {
  // Connect when the store is first accessed in the browser
  realtimeActions.connect();
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    realtimeActions.disconnect();
  });
}