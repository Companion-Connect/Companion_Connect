import { Preferences } from '@capacitor/preferences';

export const StorageKeys = {
    CHAT_SETTINGS: 'chat_settings',
    USER_PROFILE: 'user_profile',
    CHAT_HISTORY: 'chat_history',
    NOTIFICATION_SETTINGS: 'notification_settings'
} as const;

export class StorageUtil {
    static async get<T>(key: string, defaultValue?: T): Promise<T | null> {
        try {
            const { value } = await Preferences.get({ key });
            return value ? JSON.parse(value) : defaultValue || null;
        } catch (error) {
            console.error(`Error getting ${key} from storage:`, error);
            return defaultValue || null;
        }
    }

    static async set<T>(key: string, value: T): Promise<void> {
        try {
            await Preferences.set({
                key,
                value: JSON.stringify(value)
            });
        } catch (error) {
            console.error(`Error setting ${key} in storage:`, error);
        }
    }

    static async remove(key: string): Promise<void> {
        try {
            await Preferences.remove({ key });
        } catch (error) {
            console.error(`Error removing ${key} from storage:`, error);
        }
    }

    static async clear(): Promise<void> {
        try {
            await Preferences.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
}