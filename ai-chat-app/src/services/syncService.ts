import { supabase } from '../lib/supabase';
import { Preferences } from '@capacitor/preferences';

export interface UserProfile {
  userName: string;
  userAge: number;
  userPronouns: string;
  userPrefTime: string;
  MBTI: string;
  interests: string[];
  goals: string[];
  challenges: string[];
  currentMood: string;
  communicationStyle: string;
  motivationalStyle: string;
  conversationCount: number;
  lastChatDate: string;
  relationshipLevel: string;
}

export interface ChatSettings {
  aiName: string;
  personality: string;
  typingSpeed: number;
  responseDelay: number;
  enableSpeechToText: boolean;
  maxChatHistory: number;
  enableEmojis: boolean;
  enableTypingAnimation: boolean;
  enableNotifications: boolean;
}

// Helper function to trigger sync events
export const triggerSync = (eventType: string) => {
  window.dispatchEvent(new CustomEvent(eventType));
};

export class SyncService {
  /**
   * Sync user profile data to Supabase
   */
  static async syncUserProfile(userId: string): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: 'user_profile' });
      if (!value) return;

      const profile: UserProfile = JSON.parse(value);
      const { value: interestsStr } = await Preferences.get({ key: 'profile_interests' });
      const interests = interestsStr ? JSON.parse(interestsStr) : profile.interests;

      await supabase
        .from('profiles')
        .upsert({
          id: userId,
          username: profile.userName,
          user_age: profile.userAge,
          user_pronouns: profile.userPronouns,
          pref_time: profile.userPrefTime,
          mbti: profile.MBTI,
          interests,
          goals: profile.goals,
          challenges: profile.challenges,
          current_mood: profile.currentMood,
          communication_style: profile.communicationStyle,
          motivational_style: profile.motivationalStyle,
          conversation_count: profile.conversationCount,
          last_chat_date: profile.lastChatDate,
          relationship_level: profile.relationshipLevel,
          updated_at: new Date().toISOString()
        });

      console.log('User profile synced to Supabase');
    } catch (error) {
      console.error('Error syncing user profile:', error);
    }
  }

  /**
   * Sync chat settings to Supabase
   */
  static async syncChatSettings(userId: string): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: 'chat_settings' });
      if (!value) return;

      const settings: ChatSettings = JSON.parse(value);

      await supabase
        .from('user_settings')
        .upsert({
          id: userId,
          ai_name: settings.aiName,
          personality: settings.personality,
          typing_speed: settings.typingSpeed,
          response_delay: settings.responseDelay,
          enable_speech_to_text: settings.enableSpeechToText,
          max_chat_history: settings.maxChatHistory,
          enable_emojis: settings.enableEmojis,
          enable_typing_animation: settings.enableTypingAnimation,
          enable_notifications: settings.enableNotifications,
          updated_at: new Date().toISOString()
        });

      console.log('Chat settings synced to Supabase');
    } catch (error) {
      console.error('Error syncing chat settings:', error);
    }
  }

  /**
   * Sync mood history to Supabase
   */
  static async syncMoodHistory(userId: string): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: 'mood_history' });
      if (!value) return;

      const moodHistory: Array<{ date: string; mood: string }> = JSON.parse(value);

      // Get existing mood records to avoid duplicates
      const { data: existingMoods } = await supabase
        .from('mood_history')
        .select('recorded_at, mood')
        .eq('user_id', userId);

      const existingDates = new Set(
        existingMoods?.map(m => new Date(m.recorded_at).toDateString()) || []
      );

      // Only sync new mood entries
      const newMoods = moodHistory.filter(
        mood => !existingDates.has(new Date(mood.date).toDateString())
      );

      if (newMoods.length > 0) {
        const moodInserts = newMoods.map(mood => ({
          user_id: userId,
          mood: mood.mood,
          recorded_at: mood.date
        }));

        await supabase.from('mood_history').insert(moodInserts);
        console.log(`Synced ${newMoods.length} new mood entries`);
      }
    } catch (error) {
      console.error('Error syncing mood history:', error);
    }
  }

  /**
   * Sync goals to Supabase
   */
  static async syncGoals(userId: string): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: 'challenge_goals' });
      if (!value) return;

      const goals: Array<{ id: string; text: string; completed: boolean }> = JSON.parse(value);

      // Clear existing goals and insert current ones
      await supabase.from('user_goals').delete().eq('user_id', userId);

      const goalInserts = goals.map(goal => ({
        user_id: userId,
        goal_id: goal.id,
        text: goal.text,
        completed: goal.completed,
        completed_at: goal.completed ? new Date().toISOString() : null
      }));

      if (goalInserts.length > 0) {
        await supabase.from('user_goals').insert(goalInserts);
        console.log(`Synced ${goals.length} goals`);
      }
    } catch (error) {
      console.error('Error syncing goals:', error);
    }
  }

  /**
   * Sync badges to Supabase
   */
  static async syncBadges(userId: string): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: 'challenge_badges' });
      if (!value) return;

      const badges: Array<{
        id: string;
        name: string;
        description: string;
        unlocked: boolean;
        icon: string;
        colorIcon: string;
      }> = JSON.parse(value);

      // Clear existing badges and insert current ones
      await supabase.from('user_badges').delete().eq('user_id', userId);

      const badgeInserts = badges.map(badge => ({
        user_id: userId,
        badge_id: badge.id,
        name: badge.name,
        description: badge.description,
        unlocked: badge.unlocked,
        icon: badge.icon,
        color_icon: badge.colorIcon,
        unlocked_at: badge.unlocked ? new Date().toISOString() : null
      }));

      if (badgeInserts.length > 0) {
        await supabase.from('user_badges').insert(badgeInserts);
        console.log(`Synced ${badges.length} badges`);
      }
    } catch (error) {
      console.error('Error syncing badges:', error);
    }
  }

  /**
   * Sync user badges to Supabase
   */
  static async syncUserBadges(userId: string): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: 'challenge_badges' });
      if (!value) return;

      const badges = JSON.parse(value);

      // Clear existing badges for this user
      await supabase.from('user_badges').delete().eq('user_id', userId);

      // Insert current badges
      const badgeInserts = badges.map((badge: any) => ({
        user_id: userId,
        badge_id: badge.id,
        name: badge.name,
        description: badge.description,
        unlocked: badge.unlocked,
        icon: badge.icon,
        color_icon: badge.colorIcon,
        unlocked_at: badge.unlocked ? new Date().toISOString() : null
      }));

      if (badgeInserts.length > 0) {
        await supabase.from('user_badges').insert(badgeInserts);
      }

      console.log('User badges synced to Supabase');
    } catch (error) {
      console.error('Error syncing user badges:', error);
    }
  }

  /**
   * Sync all local data to Supabase
   */
  static async syncAllToSupabase(userId: string): Promise<void> {
    console.log('Starting sync to Supabase...');
    
    try {
      await Promise.all([
        this.syncUserProfile(userId).catch(e => console.error('Profile sync error:', e)),
        this.syncChatSettings(userId).catch(e => console.error('Settings sync error:', e)),
        this.syncUserBadges(userId).catch(e => console.error('Badges sync error:', e))
      ]);
      
      console.log('Sync to Supabase completed');
    } catch (error) {
      console.error('Sync to Supabase failed:', error);
      throw error;
    }
  }

  /**
   * Load data from Supabase to local storage
   */
  static async loadFromSupabase(userId: string): Promise<void> {
    console.log('Loading data from Supabase...');

    const loadOperations = [
      this.loadProfileData(userId).catch(e => console.error('Profile load error:', e)),
      this.loadChatSettings(userId).catch(e => console.error('Settings load error:', e)),
      this.loadBadgesData(userId).catch(e => console.error('Badges load error:', e)),
      this.loadGoalsData(userId).catch(e => console.error('Goals load error:', e))
    ];

    try {
      await Promise.allSettled(loadOperations);
      console.log('Data loaded from Supabase successfully');
    } catch (error) {
      console.error('Error loading data from Supabase:', error);
    }
  }

  private static async loadProfileData(userId: string): Promise<void> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && profile) {
        const userProfile: UserProfile = {
          userName: profile.username || '',
          userAge: profile.user_age || 0,
          userPronouns: profile.user_pronouns || '',
          userPrefTime: profile.pref_time || '',
          MBTI: profile.mbti || '',
          interests: profile.interests || [],
          goals: profile.goals || [],
          challenges: profile.challenges || [],
          currentMood: profile.current_mood || '',
          communicationStyle: profile.communication_style || '',
          motivationalStyle: profile.motivational_style || '',
          conversationCount: profile.conversation_count || 0,
          lastChatDate: profile.last_chat_date || '',
          relationshipLevel: profile.relationship_level || ''
        };

        console.log('Converted userProfile:', userProfile);

        console.log('Saving profile to local storage:', userProfile);
        await Preferences.set({
          key: 'user_profile',
          value: JSON.stringify(userProfile)
        });

        if (profile.interests) {
          await Preferences.set({
            key: 'profile_interests',
            value: JSON.stringify(profile.interests)
          });
          console.log('Saved interests to local storage:', profile.interests);
        }
        
        console.log('Profile successfully saved to local storage');
        
        // Verify the save worked
        const { value: savedProfile } = await Preferences.get({ key: 'user_profile' });
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          console.log('Verification - profile in local storage:', parsed.userName);
          
          // Trigger profile update events so components refresh
          window.dispatchEvent(new CustomEvent('profile-loaded'));
          window.dispatchEvent(new CustomEvent('storage'));
        } else {
          console.error('Verification failed - no profile found in local storage');
        }
      } else {
        console.log('No profile data returned from Supabase');
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  }

  private static async loadChatSettings(userId: string): Promise<void> {
    try {
      const { data: settings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', userId)
        .single();

      if (settings) {
        const chatSettings: ChatSettings = {
          aiName: settings.ai_name || 'AI Assistant',
          personality: settings.personality || 'friendly',
          typingSpeed: settings.typing_speed || 50,
          responseDelay: settings.response_delay || 1000,
          enableSpeechToText: settings.enable_speech_to_text ?? false,
          maxChatHistory: settings.max_chat_history || 50,
          enableEmojis: settings.enable_emojis ?? true,
          enableTypingAnimation: settings.enable_typing_animation ?? true,
          enableNotifications: settings.enable_notifications ?? false
        };

        await Preferences.set({
          key: 'chat_settings',
          value: JSON.stringify(chatSettings)
        });
      }
    } catch (error) {
      console.log('No chat settings found, using defaults');
    }
  }

  private static async loadChallengeProgress(userId: string): Promise<void> {
    try {
      const { data: progress } = await supabase
        .from('challenge_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (progress) {
        await Promise.all([
          Preferences.set({ key: 'challenge_streak', value: progress.streak_count?.toString() || '0' }),
          Preferences.set({ key: 'challenge_last_completed', value: progress.last_completed || '' }),
          Preferences.set({ key: 'weekly_challenge', value: JSON.stringify(progress.weekly_challenge || {}) }),
          Preferences.set({ key: 'weekly_challenge_week', value: progress.challenge_week?.toString() || '1' }),
          Preferences.set({ key: 'challenge_completed_count', value: progress.completed_count?.toString() || '0' }),
          Preferences.set({ key: 'display_badge_id', value: progress.display_badge_id || '' }),
          Preferences.set({ key: 'lastCompletedChallenge', value: JSON.stringify(progress.last_completed_challenge || {}) })
        ]);
      }
    } catch (error) {
      console.log('No challenge progress found, using defaults');
    }
  }

  private static async loadGoalsData(userId: string): Promise<void> {
    try {
      const { data: goals } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId);

      if (goals && goals.length > 0) {
        const goalData = goals.map(goal => ({
          id: goal.goal_id,
          text: goal.text,
          completed: goal.completed
        }));

        await Preferences.set({
          key: 'challenge_goals',
          value: JSON.stringify(goalData)
        });

        // Trigger events so components refresh
        window.dispatchEvent(new CustomEvent('goals-loaded'));
        window.dispatchEvent(new CustomEvent('storage'));
        console.log('Goals loaded from Supabase:', goalData.length);
      }
    } catch (error) {
      console.log('No goals found, using defaults');
    }
  }

  private static async loadBadgesData(userId: string): Promise<void> {
    try {
      const { data: badges } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId);

      if (badges && badges.length > 0) {
        const badgeData = badges.map(badge => ({
          id: badge.badge_id,
          name: badge.name,
          description: badge.description,
          unlocked: badge.unlocked,
          icon: badge.icon,
          colorIcon: badge.color_icon
        }));

        await Preferences.set({
          key: 'challenge_badges',
          value: JSON.stringify(badgeData)
        });

        // Trigger events so components refresh
        window.dispatchEvent(new CustomEvent('badges-loaded'));
        window.dispatchEvent(new CustomEvent('storage'));
        console.log('Badges loaded from Supabase:', badgeData.length);
      }
    } catch (error) {
      console.log('No badges found, using defaults');
    }
  }

  private static async loadMoodHistory(userId: string): Promise<void> {
    try {
      const { data: moods } = await supabase
        .from('mood_history')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: true });

      if (moods && moods.length > 0) {
        const moodData = moods.map(mood => ({
          date: mood.recorded_at,
          mood: mood.mood
        }));

        await Preferences.set({
          key: 'mood_history',
          value: JSON.stringify(moodData)
        });
      }
    } catch (error) {
      console.log('No mood history found, using defaults');
    }
  }
}