import { Preferences } from '@capacitor/preferences';

// Helper function to trigger sync events after data changes
export const triggerSync = (eventType: string) => {
  console.log('🔔 Triggering sync event:', eventType);
  window.dispatchEvent(new CustomEvent(eventType));
};

// Wrapper functions for common data updates that trigger sync
export const updateUserProfile = async (profile: any) => {
  console.log('💾 updateUserProfile called with:', profile);
  await Preferences.set({
    key: 'user_profile',
    value: JSON.stringify(profile)
  });
  console.log('💾 Profile saved to local storage, triggering sync...');
  triggerSync('profile-updated');
};

export const updateChatSettings = async (settings: any) => {
  await Preferences.set({
    key: 'chat_settings',
    value: JSON.stringify(settings)
  });
  triggerSync('settings-updated');
};

export const updateGoals = async (goals: any[]) => {
  await Preferences.set({
    key: 'challenge_goals',
    value: JSON.stringify(goals)
  });
  triggerSync('goal-completed');
};

export const updateMood = async (mood: string) => {
  // Get existing mood history
  const { value } = await Preferences.get({ key: 'mood_history' });
  const moodHistory = value ? JSON.parse(value) : [];
  
  // Add new mood entry
  moodHistory.unshift({
    date: new Date().toISOString(),
    mood: mood
  });
  
  // Keep only last 100 mood entries
  if (moodHistory.length > 100) {
    moodHistory.splice(100);
  }
  
  await Preferences.set({
    key: 'mood_history',
    value: JSON.stringify(moodHistory)
  });
  
  triggerSync('mood-updated');
};

export const updateBadges = async (badges: any[]) => {
  await Preferences.set({
    key: 'challenge_badges',
    value: JSON.stringify(badges)
  });
  triggerSync('badge-unlocked');
};