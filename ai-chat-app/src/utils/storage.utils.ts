import { Preferences } from '@capacitor/preferences';

export const StorageKeys = {
    CHAT_SETTINGS: 'chat_settings',
    USER_PROFILE: 'user_profile',
    CHAT_HISTORY: 'chat_history',
    NOTIFICATION_SETTINGS: 'notification_settings'
} as const;

export class StorageUtil {
    // Optional current user id for scoping keys. Set when user logs in.
    static currentUserId: string | null = null;

    // Build a storage key scoped to a user when available, fallback to provided key
    static scopedKey(key: string, forUser?: string | null) {
        const uid = forUser ?? StorageUtil.currentUserId;
        if (!uid) return key;
        return `user_${uid}::${key}`;
    }

    // Convenience: set the current user id (or null to clear)
    static setCurrentUserId(id: string | null) {
        StorageUtil.currentUserId = id;
    }
    static async get<T>(key: string, defaultValue?: T, forUser?: string | null): Promise<T | null> {
        const k = StorageUtil.scopedKey(key, forUser);
        try {
            // Try Capacitor Preferences first, fallback to localStorage
            let value: string | null = null;
            try {
                const result = await Preferences.get({ key: k });
                value = result.value;
            } catch (capacitorError) {
                console.warn('Capacitor Preferences failed, using localStorage:', capacitorError);
                value = localStorage.getItem(k);
            }
            
            console.log(`Getting ${k} from storage:`, value);
            return value ? JSON.parse(value) : defaultValue || null;
        } catch (error) {
            console.error(`Error getting ${k} from storage:`, error);
            return defaultValue || null;
        }
    }

    static async set<T>(key: string, value: T, forUser?: string | null): Promise<void> {
        const k = StorageUtil.scopedKey(key, forUser);
        try {
            const jsonValue = JSON.stringify(value);
            console.log(`Setting ${k} in storage:`, jsonValue);
            
            // Try Capacitor Preferences first, fallback to localStorage
            try {
                await Preferences.set({
                    key: k,
                    value: jsonValue
                });
                console.log(`Successfully saved ${k} with Capacitor Preferences`);
            } catch (capacitorError) {
                console.warn('Capacitor Preferences failed, using localStorage:', capacitorError);
                localStorage.setItem(k, jsonValue);
                console.log(`Successfully saved ${k} with localStorage`);
            }
        } catch (error) {
            console.error(`Error setting ${k} in storage:`, error);
        }
    }

    static async remove(key: string, forUser?: string | null): Promise<void> {
        const k = StorageUtil.scopedKey(key, forUser);
        try {
            // Try Capacitor Preferences first, fallback to localStorage
            try {
                await Preferences.remove({ key: k });
            } catch (capacitorError) {
                console.warn('Capacitor Preferences failed, using localStorage:', capacitorError);
                localStorage.removeItem(k);
            }
        } catch (error) {
            console.error(`Error removing ${k} from storage:`, error);
        }
    }

    static async clear(): Promise<void> {
        try {
            // Try Capacitor Preferences first, fallback to localStorage
            try {
                await Preferences.clear();
            } catch (capacitorError) {
                console.warn('Capacitor Preferences failed, using localStorage:', capacitorError);
                localStorage.clear();
            }
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }

    // Migrate a key from anonymous (unscoped) into a user's scoped key and then remove the anonymous key
    static async migrateToUser(key: string, userId: string) {
        try {
            const anon = await StorageUtil.get<any>(key, null, null);
            if (anon !== null) {
                await StorageUtil.set(key, anon, userId);
                await StorageUtil.remove(key, null);
            }
        } catch (e) {
            console.error('Migration error for', key, e);
        }
    }
}