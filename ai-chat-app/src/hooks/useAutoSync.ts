import { useEffect, useRef } from 'react';
import { SyncService } from '../services/syncService';
import { Preferences } from '@capacitor/preferences';

export const useAutoSync = (userId: string | null) => {
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<number>(0);

  const debouncedSync = async () => {
    console.log('🔄 debouncedSync called, userId:', userId);
    if (!userId) {
      console.log('❌ No userId, skipping sync');
      return;
    }

    // Clear any existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Set a new timeout to sync after 1 second of inactivity
    syncTimeoutRef.current = setTimeout(async () => {
      const now = Date.now();
      
      // Only sync if it's been at least 3 seconds since last sync
      if (now - lastSyncRef.current > 3000) {
        console.log('⚡ Auto-syncing data to Supabase...');
        await SyncService.syncAllToSupabase(userId);
        lastSyncRef.current = now;
      } else {
        console.log('⏱️ Skipping sync - too soon since last sync');
      }
    }, 1000);
  };

  const syncNow = async () => {
    if (!userId) return;
    
    // Clear any pending sync
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    console.log('Manual sync to Supabase...');
    await SyncService.syncAllToSupabase(userId);
    lastSyncRef.current = Date.now();
  };

  useEffect(() => {
    // Clear any pending sync when userId becomes null
    if (!userId) {
      if (syncTimeoutRef.current) {
        console.log('🛑 Clearing pending sync - no userId');
        clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }
      return;
    }

    // Set up storage change listeners
    const handleStorageChange = () => {
      debouncedSync();
    };

    // Listen for custom events that indicate data changes
    const handleDataChange = (event: Event) => {
      console.log('🎯 Auto-sync received event:', event.type);
      debouncedSync();
    };

    // Add event listeners for data changes
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profile-updated', handleDataChange);
    window.addEventListener('settings-updated', handleDataChange);
    window.addEventListener('goal-completed', handleDataChange);
    window.addEventListener('mood-updated', handleDataChange);
    window.addEventListener('badge-unlocked', handleDataChange);

    // Initial sync on mount (reduced delay)
    const initialSyncTimeout = setTimeout(() => {
      debouncedSync();
    }, 1000);

    return () => {
      // Cleanup
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      clearTimeout(initialSyncTimeout);
      
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profile-updated', handleDataChange);
      window.removeEventListener('settings-updated', handleDataChange);
      window.removeEventListener('goal-completed', handleDataChange);
      window.removeEventListener('mood-updated', handleDataChange);
      window.removeEventListener('badge-unlocked', handleDataChange);
    };
  }, [userId]);

  return { syncNow };
};

// Helper function to trigger sync events
export const triggerSync = (eventType: string) => {
  window.dispatchEvent(new CustomEvent(eventType));
};