import React, { useState, useEffect } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonInput, IonList, IonItem, IonLabel, IonCheckbox, IonGrid, IonRow, IonCol, IonIcon, IonBadge } from '@ionic/react';
import { StorageUtil } from '../utils/storage.utils';
import { trophyOutline, checkmarkCircle, checkmarkCircleOutline, flameOutline, flame } from 'ionicons/icons';

// Types

interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
  colorIcon: string;
}

interface SocialChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}


const STREAK_KEY = 'challenge_streak';
const GOALS_KEY = 'challenge_goals';
const BADGES_KEY = 'challenge_badges';
const LAST_COMPLETED_KEY = 'challenge_last_completed';
const WEEKLY_CHALLENGE_KEY = 'weekly_challenge';
const WEEKLY_CHALLENGE_WEEK_KEY = 'weekly_challenge_week';
const CHALLENGES_COMPLETED_KEY = 'challenge_completed_count';

const initialBadges: Badge[] = [
  { id: 'streak10', name: '10-Week Streak', description: 'Get a streak of 10', unlocked: false, icon: flameOutline, colorIcon: flame },
  { id: 'streak4', name: '4-Week Streak', description: 'Get a streak of 4', unlocked: false, icon: flameOutline, colorIcon: flame },
  { id: 'streak1', name: 'First Streak', description: 'Get your first streak', unlocked: false, icon: flameOutline, colorIcon: flame },
  { id: 'setGoal', name: 'Goal Setter', description: 'Set a new goal', unlocked: false, icon: checkmarkCircleOutline, colorIcon: checkmarkCircle },
  { id: 'completeChallenge', name: 'First Challenge', description: 'Complete your first weekly challenge', unlocked: false, icon: trophyOutline, colorIcon: trophyOutline },
  { id: 'goalMaster', name: 'Goal Master', description: 'Complete 10 goals', unlocked: false, icon: checkmarkCircleOutline, colorIcon: checkmarkCircle },
  { id: 'challenge5', name: '5 Challenges', description: 'Complete 5 challenges', unlocked: false, icon: trophyOutline, colorIcon: trophyOutline },
];

const socialChallenges: SocialChallenge[] = [
  { id: '1', title: 'Compliment a Stranger', description: 'Give a genuine compliment to someone you don\'t know well', difficulty: 'easy' },
  { id: '2', title: 'Start a Conversation', description: 'Initiate a conversation with someone in a waiting area or coffee shop', difficulty: 'medium' },
  { id: '3', title: 'Join a New Group', description: 'Attend a meetup, class, or social event where you don\'t know anyone', difficulty: 'hard' },
  { id: '4', title: 'Ask for Help', description: 'Ask someone for directions, recommendations, or assistance', difficulty: 'easy' },
  { id: '5', title: 'Make Small Talk', description: 'Engage in friendly conversation with a cashier, barista, or service worker', difficulty: 'easy' },
  { id: '6', title: 'Invite Someone Out', description: 'Ask an acquaintance to grab coffee, lunch, or attend an event together', difficulty: 'medium' },
  { id: '7', title: 'Share Something Personal', description: 'Open up about a hobby, experience, or opinion with someone', difficulty: 'medium' },
  { id: '8', title: 'Volunteer Together', description: 'Find and participate in a volunteer activity with others', difficulty: 'hard' },
];

const ChallengeGamification: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [lastCompleted, setLastCompleted] = useState<string | null>(null);
  const [weeklyChallenge, setWeeklyChallenge] = useState<SocialChallenge | null>(null);
  const [weeklyCompleted, setWeeklyCompleted] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState(0);

  // Get week number
  function getWeekNumber(d: Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil(((d.getTime() - yearStart.getTime())/86400000+1)/7);
  }

  // Load progress from storage
  useEffect(() => {
    (async () => {
      const [storedGoals, storedStreak, storedBadges, storedLastCompleted, storedWeekly, storedWeeklyWeek, storedCompletedChallenges] = await Promise.all([
        StorageUtil.get<Goal[]>(GOALS_KEY, []),
        StorageUtil.get<number>(STREAK_KEY, 0),
        StorageUtil.get<Badge[]>(BADGES_KEY, initialBadges),
        StorageUtil.get<string>(LAST_COMPLETED_KEY, undefined),
        StorageUtil.get<SocialChallenge>(WEEKLY_CHALLENGE_KEY, undefined),
        StorageUtil.get<number>(WEEKLY_CHALLENGE_WEEK_KEY, undefined),
        StorageUtil.get<number>(CHALLENGES_COMPLETED_KEY, 0),
      ]);
      setGoals(storedGoals || []);
      setStreak(storedStreak || 0);
      setBadges(storedBadges || initialBadges);
      setLastCompleted(storedLastCompleted);
      setCompletedChallenges(storedCompletedChallenges || 0);

      // Weekly challenge logic
      const now = new Date();
      const thisWeek = getWeekNumber(now);
      if (!storedWeekly || storedWeeklyWeek !== thisWeek) {
        // Pick a new challenge for this week
        const random = socialChallenges[Math.floor(Math.random() * socialChallenges.length)];
        setWeeklyChallenge(random);
        StorageUtil.set(WEEKLY_CHALLENGE_KEY, random);
        StorageUtil.set(WEEKLY_CHALLENGE_WEEK_KEY, thisWeek);
        setWeeklyCompleted(false);
      } else {
        setWeeklyChallenge(storedWeekly);
        // Check if already completed this week
        if (storedLastCompleted) {
          const last = new Date(storedLastCompleted);
          const lastWeek = getWeekNumber(last);
          setWeeklyCompleted(lastWeek === thisWeek);
        }
      }
      setLoaded(true);
    })();
  }, []);

  // Save progress to storage
  // Only save after initial load
  useEffect(() => {
    if (!loaded) return;
    StorageUtil.set(GOALS_KEY, goals);
  }, [goals, loaded]);
  useEffect(() => {
    if (!loaded) return;
    StorageUtil.set(STREAK_KEY, streak);
  }, [streak, loaded]);
  useEffect(() => {
    if (!loaded) return;
    StorageUtil.set(BADGES_KEY, badges);
  }, [badges, loaded]);
  useEffect(() => {
    if (!loaded) return;
    if (lastCompleted) StorageUtil.set(LAST_COMPLETED_KEY, lastCompleted);
  }, [lastCompleted, loaded]);
  useEffect(() => {
    if (!loaded) return;
    StorageUtil.set(CHALLENGES_COMPLETED_KEY, completedChallenges);
  }, [completedChallenges, loaded]);

  // Add a new goal
  const handleAddGoal = () => {
    if (newGoal.trim() === '') return;
    const newGoalObj: Goal = { id: Date.now().toString(), text: newGoal, completed: false };
    setGoals([...goals, newGoalObj]);
    setNewGoal('');
    unlockBadge('setGoal');
  };

  // Complete a goal
  const handleCompleteGoal = (id: string) => {
    const updatedGoals = goals.map(goal => goal.id === id ? { ...goal, completed: !goal.completed } : goal);
    setGoals(updatedGoals);
    // Unlock Goal Master badge if 10 or more completed
    const completedCount = updatedGoals.filter(g => g.completed).length;
    if (completedCount >= 10) unlockBadge('goalMaster');
  };

  // Mark challenge as completed
  const handleMarkAsCompleted = () => {
    if (!weeklyChallenge || weeklyCompleted) return;
    let newStreak = streak;
    if (!isStreakAlreadyCounted()) {
      newStreak = streak + 1;
      setStreak(newStreak);
      setLastCompleted(new Date().toISOString());
      unlockBadge('completeChallenge');
      if (newStreak === 1) unlockBadge('streak1');
      if (newStreak === 4) unlockBadge('streak4');
      if (newStreak === 10) unlockBadge('streak10');
    }
    // Count total completed challenges for challenge5 badge
    const newCompletedChallenges = completedChallenges + 1;
    setCompletedChallenges(newCompletedChallenges);
    if (newCompletedChallenges >= 5) unlockBadge('challenge5');
    setWeeklyCompleted(true);
  };

  // Get a new challenge (only after completed)
  const handleGetNewChallenge = () => {
    if (!weeklyCompleted) return;
    const now = new Date();
    const thisWeek = getWeekNumber(now);
    const available = socialChallenges.filter(c => c.id !== weeklyChallenge?.id);
    const random = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : weeklyChallenge;
    setWeeklyChallenge(random);
    StorageUtil.set(WEEKLY_CHALLENGE_KEY, random);
    StorageUtil.set(WEEKLY_CHALLENGE_WEEK_KEY, thisWeek);
    setWeeklyCompleted(false);
    // Show notification if enabled
    if (notificationPermission === 'granted' && random) {
      showNotification(random);
    }
  };

  // Notification logic
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setShowNotificationPrompt(false);
    }
  };

  const showNotification = (challenge: SocialChallenge) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Weekly Social Challenge! 🤝', {
        body: `${challenge.title}: ${challenge.description}`,
        icon: '🤝',
        badge: '🤝'
      });
    }
  };

  // Check if streak already counted for this week
  const isStreakAlreadyCounted = () => {
    if (!lastCompleted) return false;
    const last = new Date(lastCompleted);
    const now = new Date();
    const lastWeek = getWeekNumber(last);
    const thisWeek = getWeekNumber(now);
    return lastWeek === thisWeek;
  };

  // Lose streak if not completed by next week
  useEffect(() => {
    if (!lastCompleted) return;
    const interval = setInterval(() => {
      const last = new Date(lastCompleted);
      const now = new Date();
      const lastWeek = getWeekNumber(last);
      const thisWeek = getWeekNumber(now);
      if (thisWeek > lastWeek) {
        setStreak(0);
        setWeeklyCompleted(false);
      }
    }, 1000 * 60 * 60); // check every hour
    return () => clearInterval(interval);
  }, [lastCompleted]);

  // Unlock a badge

  // Badge popup state
  const [badgePopup, setBadgePopup] = useState<{ id: string; name: string; description: string } | null>(null);
  const [displayBadgeId, setDisplayBadgeId] = useState<string | null>(null);
  // Load display badge from storage
  useEffect(() => {
    (async () => {
      const storedId = await StorageUtil.get<string>('display_badge_id');
      setDisplayBadgeId(storedId || null);
    })();
  }, []);

  const unlockBadge = (id: string) => {
    setBadges(badges => badges.map(b => b.id === id ? { ...b, unlocked: true } : b));
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" sizeMd="8" offsetMd="2">
          {/* Gamified Challenge Experience */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Weekly Challenge Streak: <span style={{ color: streak > 0 ? 'orange' : 'gray' }}>{streak}</span></IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {/* Badges */}
              <div style={{ marginBottom: 24 }}>
                <strong>Badges:</strong>
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                  {badges.map(badge => (
                    <div key={badge.id} style={{ textAlign: 'center', cursor: 'pointer', position: 'relative', display: 'inline-block' }}>
                      <div
                        onClick={() => badge.unlocked && setBadgePopup({ id: badge.id, name: badge.name, description: badge.description })}
                      >
                        <IonIcon icon={badge.unlocked ? badge.colorIcon : badge.icon} style={{ fontSize: 32, color: badge.unlocked ? 'orange' : 'gray' }} />
                        <div style={{ fontSize: 12 }}>{badge.name}</div>
                        {displayBadgeId === badge.id && badge.unlocked && (
                          <div style={{ fontSize: 10, color: '#10b981', marginTop: 2 }}>(Display Badge)</div>
                        )}
                      </div>
                      {/* Inline popup under badge */}
                      {badgePopup && badgePopup.id === badge.id && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: '110%',
                            transform: 'translateX(-50%)',
                            background: 'white',
                            border: '1px solid #eee',
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                            padding: 12,
                            minWidth: 180,
                            zIndex: 10,
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{badgePopup.name}</div>
                          <div style={{ fontSize: 12, color: '#555', marginBottom: 8 }}>{badgePopup.description}</div>
                          <IonButton size="small" color="primary" style={{ marginBottom: 4 }}
                            onClick={async () => {
                              setDisplayBadgeId(badgePopup.id);
                              await StorageUtil.set('display_badge_id', badgePopup.id);
                              setBadgePopup(null);
                            }}>
                            Set as Display Badge
                          </IonButton>
                          <IonButton size="small" fill="clear" color="medium" onClick={() => setBadgePopup(null)}>
                            Close
                          </IonButton>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* No global popup, now inline under each badge */}
              </div>

              {/* Weekly Social Challenge (now integrated) */}
              {weeklyChallenge && (
                <div style={{ marginBottom: 32, border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#f8f8ff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <IonBadge color={
                      weeklyChallenge.difficulty === 'easy' ? 'success' :
                      weeklyChallenge.difficulty === 'medium' ? 'warning' : 'danger'
                    } style={{ marginRight: 8 }}>{weeklyChallenge.difficulty.toUpperCase()}</IonBadge>
                    <span style={{ fontWeight: 600 }}>{weeklyChallenge.title}</span>
                  </div>
                  <div style={{ marginBottom: 12 }}>{weeklyChallenge.description}</div>
                  {/* Mark as Completed button */}
                  {!weeklyCompleted && (
                    <IonButton onClick={handleMarkAsCompleted} color={'success'} style={{ marginRight: 8 }}>
                      Mark as Completed
                    </IonButton>
                  )}
                  {/* Get New Challenge button (only after completed) */}
                  {weeklyCompleted && (
                    <IonButton onClick={handleGetNewChallenge} color={'primary'} style={{ marginRight: 8 }}>
                      Get New Challenge
                    </IonButton>
                  )}
                  {notificationPermission !== 'granted' && (
                    <IonButton style={{ marginLeft: 8 }} color="medium" onClick={() => setShowNotificationPrompt(true)}>
                      Enable Notifications
                    </IonButton>
                  )}
                  {showNotificationPrompt && (
                    <div style={{ marginTop: 8 }}>
                      <IonButton onClick={requestNotificationPermission} color="primary">Allow Notifications</IonButton>
                    </div>
                  )}
                </div>
              )}

              {/* Goal Checklist */}
              <IonList>
                <IonItem lines="full">
                  <IonLabel><strong>My Goals</strong></IonLabel>
                </IonItem>
                {goals.filter(goal => !goal.completed).map(goal => (
                  <IonItem key={goal.id}>
                    <IonLabel>{goal.text}</IonLabel>
                    <IonCheckbox slot="end" checked={goal.completed} onIonChange={() => handleCompleteGoal(goal.id)} />
                  </IonItem>
                ))}
                <IonItem>
                  <IonInput
                    value={newGoal}
                    placeholder="Add a new goal..."
                    onIonChange={e => setNewGoal(e.detail.value!)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddGoal(); }}
                  />
                  <IonButton slot="end" onClick={handleAddGoal}>Add</IonButton>
                </IonItem>
              </IonList>

              {/* Completed Goals Section */}
              <IonList style={{ marginTop: 24 }}>
                <IonItem lines="full">
                  <IonLabel><strong>My Completed Goals</strong></IonLabel>
                </IonItem>
                {goals.filter(goal => goal.completed).length === 0 && (
                  <IonItem>
                    <IonLabel color="medium">No completed goals yet.</IonLabel>
                  </IonItem>
                )}
                {goals.filter(goal => goal.completed).map(goal => (
                  <IonItem key={goal.id}>
                    <IonLabel>{goal.text}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ChallengeGamification;
