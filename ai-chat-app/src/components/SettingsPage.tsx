import { heart } from 'ionicons/icons';

function CurrentMoodDisplay({ mood }: { mood: string }) {
  let moodText = mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : "Unknown";
  let color = "medium";
  if (mood === "positive") color = "success";
  else if (mood === "sad") color = "danger";
  else if (mood === "angry") color = "warning";
  else if (mood === "tired") color = "tertiary";
  else if (mood === "anxious") color = "primary";
  else if (mood === "neutral") color = "medium";
  else if (!mood || mood === "" || mood === "unknown") color = "medium";
  return (
    <div style={{ marginTop: 16, marginBottom: 8 }}>
      <span style={{ fontWeight: 500, fontSize: 14 }}>Current Mood:</span>
      <IonChip color={color} style={{ fontSize: 14, marginLeft: 8 }}>
        <IonIcon icon={heart} style={{ marginRight: 6 }} />
        <IonLabel>{moodText}</IonLabel>
      </IonChip>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonList,
  IonModal,
  IonAvatar,
  IonText,
  IonAccordion,
  IonAccordionGroup,
  IonRadioGroup,
  IonRadio,
  IonListHeader,
  IonButtons,
  IonChip,
} from '@ionic/react';
import {
  person,
  colorPalette,
  notifications,
  mic,
  chatbubbles,
  information,
  close,
  checkmark,
  brush,
} from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';
import { StorageUtil } from '../utils/storage.utils';
import { trophyOutline, checkmarkCircle, checkmarkCircleOutline, flameOutline, flame } from 'ionicons/icons';
const DISPLAY_BADGE_KEY = 'display_badge_id';
interface Badge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
  colorIcon: string;
}

const BADGES_KEY = 'challenge_badges';
const initialBadges: Badge[] = [
  { id: 'streak10', name: '10-Week Streak', description: 'Get a streak of 10', unlocked: false, icon: flameOutline, colorIcon: flame },
  { id: 'streak4', name: '4-Week Streak', description: 'Get a streak of 4', unlocked: false, icon: flameOutline, colorIcon: flame },
  { id: 'streak1', name: 'First Streak', description: 'Get your first streak', unlocked: false, icon: flameOutline, colorIcon: flame },
  { id: 'setGoal', name: 'Goal Setter', description: 'Set a new goal', unlocked: false, icon: checkmarkCircleOutline, colorIcon: checkmarkCircle },
  { id: 'completeChallenge', name: 'First Challenge', description: 'Complete your first weekly challenge', unlocked: false, icon: trophyOutline, colorIcon: trophyOutline },
  { id: 'goalMaster', name: 'Goal Master', description: 'Complete 10 goals', unlocked: false, icon: checkmarkCircleOutline, colorIcon: checkmarkCircle },
  { id: 'challenge5', name: '5 Challenges', description: 'Complete 5 challenges', unlocked: false, icon: trophyOutline, colorIcon: trophyOutline },
];
import '../styles/responsive.css';

interface UserProfile {
  userName: string;
  userAge: number;
  userPronouns: string;
  MBTI: string;
  interests: string[];
  goals: string[];
  currentMood: string;
  relationshipLevel: string;
}
interface AppSettings {
  aiName: string;
  personality: string;
  enableEmojis: boolean;
  enableTypingAnimation: boolean;
  enableSpeechToText: boolean;
  enableNotifications: boolean;
}

interface MBTIQuestion {
  id: string;
  text: string;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
}
const mbtiQuestions: MBTIQuestion[] = [
  { id: 'q1', text: "I feel energized when I'm in a large group of people.", dimension: 'EI' },
  { id: 'q2', text: 'I prefer quiet reflection over social gatherings.', dimension: 'EI' },

  { id: 'q3', text: 'I focus on facts and details.', dimension: 'SN' },
  { id: 'q4', text: 'I enjoy imagining future possibilities.', dimension: 'SN' },

  { id: 'q5', text: 'I make decisions based on logic.', dimension: 'TF' },
  { id: 'q6', text: "I consider others' feelings when deciding.", dimension: 'TF' },

  { id: 'q7', text: 'I like having a clear plan and schedule.', dimension: 'JP' },
  { id: 'q8', text: 'I prefer to stay open to new information.', dimension: 'JP' },
];

const defaultUserProfile: UserProfile = {
  userName: '', userAge: 0, userPronouns: '', MBTI: '',
  interests: [], goals: [], currentMood: '', relationshipLevel: 'new',
};
const defaultAppSettings: AppSettings = {
  aiName: 'Companion', personality: 'supportive',
  enableEmojis: true, enableTypingAnimation: true,
  enableSpeechToText: true, enableNotifications: true,
};

const getPersonalityColor = (p: string) => ({ supportive: '#10b981', energetic: '#f59e0b', wise: '#8b5cf6' } as any)[p] || '#666';

const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
  const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [mbti, setMbti] = useState('');

  const [editingProfile, setEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(defaultUserProfile);
  const [goals, setGoals] = useState<string[]>([]);
  useEffect(() => {
    const loadGoals = async () => {
      const storedGoals = await StorageUtil.get<any[]>('challenge_goals', []);
      setGoals((storedGoals || []).filter((g: any) => !g.completed).map((g: any) => g.text));
    };
    loadGoals();
    
    const handler = () => loadGoals();
    window.addEventListener('goals-updated', handler);
    return () => window.removeEventListener('goals-updated', handler);
  }, []);
  
  const [profileInterests, setProfileInterests] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const stored = await Preferences.get({ key: 'profile_interests' });
      if (stored.value) setProfileInterests(JSON.parse(stored.value));
    })();
  }, []);

  const openProfileModal = () => {
    setTempProfile(profile => ({ ...profile, goals: goals, interests: profileInterests }));
    setEditingProfile(true);
  };
  const [newInterest, setNewInterest] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [displayBadgeId, setDisplayBadgeId] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const storedId = await StorageUtil.get<string>(DISPLAY_BADGE_KEY);
      setDisplayBadgeId(storedId || null);
    })();
  }, []);
  const modalRef = useRef<HTMLIonModalElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  useEffect(() => {
    (async () => {
      const storedBadges = await StorageUtil.get<Badge[]>(BADGES_KEY, initialBadges);
      setBadges(storedBadges || initialBadges);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const [p, s, m] = await Promise.all([
        Preferences.get({ key: 'user_profile' }),
        Preferences.get({ key: 'chat_settings' }),
        Preferences.get({ key: 'mbti' }),
      ]);
      if (p.value) setProfile(JSON.parse(p.value));
      if (s.value) setSettings(JSON.parse(s.value));
      if (m.value) setMbti(m.value);
    })();
  }, []);

  const updateMbti = async () => {
    const a = answers;
    const e = a['q1'] ?? 3;
    const i = a['q2'] ?? 3;
    const s = a['q3'] ?? 3;
    const n = a['q4'] ?? 3;
    const t = a['q5'] ?? 3;
    const f = a['q6'] ?? 3;
    const j = a['q7'] ?? 3;
    const p2 = a['q8'] ?? 3;

    const typeEI = e >= i ? 'E' : 'I';
    const typeSN = s >= n ? 'S' : 'N';
    const typeTF = t >= f ? 'T' : 'F';
    const typeJP = j >= p2 ? 'J' : 'P';

    const result = [typeEI, typeSN, typeTF, typeJP].join('');
    setMbti(result);
    await Preferences.set({ key: 'mbti', value: result });

    const updated = { ...profile, MBTI: result };
    setProfile(updated);
    await Preferences.set({ key: 'user_profile', value: JSON.stringify(updated) });
  };

  const openModal = () => { setTempProfile(profile); setEditingProfile(true); };
  const closeModal = () => setEditingProfile(false);
  const saveProfile = async () => {
    setProfile(tempProfile);
    await Preferences.set({ key: 'user_profile', value: JSON.stringify(tempProfile) });
    await Preferences.set({ key: 'profile_interests', value: JSON.stringify(tempProfile.interests || []) });
    setProfileInterests(tempProfile.interests || []);
    const storedGoals = await StorageUtil.get<any[]>('challenge_goals', []);
    const completedGoals = (storedGoals || []).filter((g: any) => g.completed);
    const newGoals = (tempProfile.goals || []).map((text: string) => {
      const existing = (storedGoals || []).find((g: any) => g.text === text);
      return existing ? existing : { id: Date.now().toString() + Math.random().toString(36).slice(2), text, completed: false };
    });
    const updatedGoals = [...newGoals, ...completedGoals];
    await StorageUtil.set('challenge_goals', updatedGoals);
    window.dispatchEvent(new Event('goals-updated'));
    setGoals(newGoals.map(g => g.text));
    setEditingProfile(false);
  };
  const saveSettings = async (ns: AppSettings) => {
    setSettings(ns);
    await Preferences.set({ key: 'chat_settings', value: JSON.stringify(ns) });
  };

  return (
    <IonPage ref={pageRef}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Profile Card */}
        <IonCard button onClick={openProfileModal} style={{ margin: 20 }}>
          <IonCardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div>
                <h2>{profile.userName || 'Your Profile'}</h2>
                <p>Relationship: {profile.relationshipLevel}</p>
                <CurrentMoodDisplay mood={profile.currentMood} />
                {profile.MBTI && <p>MBTI Type: <strong>{profile.MBTI}</strong></p>}
                {/* Profile Goals Display */}
                {goals.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>My Goals:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                      {goals.map(g => (
                        <IonChip key={g} color="primary" style={{ fontSize: 12 }}>{g}</IonChip>
                      ))}
                    </div>
                  </div>
                )}
                {/* Profile Interests Display */}
                {profileInterests.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>My Interests:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                      {profileInterests.map(i => (
                        <IonChip key={i} color="secondary" style={{ fontSize: 12 }}>{i}</IonChip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {displayBadgeId && badges.length > 0 && (() => {
                const badge = badges.find(b => b.id === displayBadgeId && b.unlocked);
                if (!badge) return null;
                return (
                  <div style={{ textAlign: 'center', marginLeft: 8 }}>
                    <IonIcon icon={badge.colorIcon} style={{ fontSize: 32, color: 'orange' }} />
                    <div style={{ fontSize: 10, color: '#10b981' }}>Display Badge</div>
                  </div>
                );
              })()}
            </div>
            <IonAvatar><IonIcon icon={person} /></IonAvatar>
          </IonCardContent>
        </IonCard>

        {/* MBTI Accordion */}
        <IonAccordionGroup>
          <IonAccordion value='mbti'>
            <IonItem slot='header' lines='none' style={{ background: '#f0f0f0', padding: '12px 16px' }}>
              <IonLabel style={{ fontWeight: 600, color: '#667eea' }}>Advanced MBTI Quiz</IonLabel>
            </IonItem>
            <div slot='content' style={{ padding: 16 }}>
              <IonText style={{ fontSize: '0.9rem', color: '#555', marginBottom: '8px' }}>
                1 = Strongly Disagree, 5 = Strongly Agree
              </IonText>
              <IonList>
                {mbtiQuestions.map(q => (
                  <React.Fragment key={q.id}>
                    <IonListHeader>{q.text}</IonListHeader>
                    <IonRadioGroup
                      value={answers[q.id]?.toString()}
                      onIonChange={e => setAnswers(a => ({ ...a, [q.id]: Number(e.detail.value) }))}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <IonItem key={n} lines='none' style={{ flex: 1, textAlign: 'center' }}>
                            <IonText>{n}</IonText>
                            <IonRadio slot='start' value={n.toString()} />
                          </IonItem>
                        ))}
                      </div>
                    </IonRadioGroup>
                  </React.Fragment>
                ))}
              </IonList>
              <IonButton expand='block' onClick={updateMbti} style={{ marginTop: 12, '--background': '#764ba2' }}>
                Calculate MBTI
              </IonButton>
              {mbti && (
                <IonCard style={{ marginTop: 12, background: 'linear-gradient(135deg,#764ba2,#667eea)', color: '#fff', textAlign: 'center' }}>
                  <IonCardContent>
                    <h1 style={{ fontSize: '2.5rem' }}>{mbti}</h1>
                    <p>Your MBTI Type</p>
                  </IonCardContent>
                </IonCard>
              )}
            </div>
          </IonAccordion>
        </IonAccordionGroup>

        {/* AI Personality */}
        <IonCard style={{ margin: 20 }}>
          <IonCardContent>
            <h3>AI Personality</h3>
            <IonItem>
              <IonIcon icon={colorPalette} style={{ marginRight: 12, color: getPersonalityColor(settings.personality) }} />
              <IonSelect
                value={settings.personality}
                onIonChange={e => saveSettings({ ...settings, personality: e.detail.value })}
              >
                <IonSelectOption value='supportive'>🤗 Supportive</IonSelectOption>
                <IonSelectOption value='energetic'>⚡ Energetic</IonSelectOption>
                <IonSelectOption value='wise'>🧘 Wise</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem lines='none' style={{ paddingTop: 16 }}>
              <IonLabel position='stacked'>AI Name</IonLabel>
              <IonInput
                value={settings.aiName}
                onIonInput={e => saveSettings({ ...settings, aiName: e.detail.value! })}
              />
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* Preferences */}
        <IonCard style={{ margin: 20 }}>
          <IonCardContent>
            <h3>Preferences</h3>
            <IonList>
              {[
                { icon: chatbubbles, label: 'Emojis', prop: 'enableEmojis' },
                { icon: brush, label: 'Typing Anim', prop: 'enableTypingAnimation' },
                { icon: mic, label: 'Voice Input', prop: 'enableSpeechToText' },
                { icon: notifications, label: 'Notifications', prop: 'enableNotifications' },
              ].map(item => (
                <IonItem key={item.prop} lines='none'>
                  <IonIcon icon={item.icon} style={{ marginRight: 12 }} />
                  <IonLabel>{item.label}</IonLabel>
                  <IonToggle
                    checked={(settings as any)[item.prop]}
                    onIonChange={e => saveSettings({ ...settings, [item.prop]: e.detail.checked })}
                  />
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* About */}
        <IonCard style={{ margin: 20 }}>
          <IonCardContent style={{ textAlign: 'center' }}>
            <IonIcon icon={information} size='large' />
            <h3>About</h3>
            <p>AI Companion v1.0</p>
            <p>Additional information can be found at companionconnect.online</p>
          </IonCardContent>
        </IonCard>

        {/* Mood History Previous Week Section */}
        <MoodHistoryPreviousWeek />

        {/* Profile Modal */}
        <IonModal ref={modalRef} isOpen={editingProfile} onDidDismiss={closeModal} presentingElement={pageRef.current!}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Profile</IonTitle>
              <IonButtons slot='end'>
                <IonButton onClick={saveProfile}>
                  <IonIcon icon={checkmark} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent style={{ padding: 16 }}>
            <IonItem>
              <IonLabel position='stacked'>Name</IonLabel>
              <IonInput
                value={tempProfile.userName}
                onIonInput={e => setTempProfile({ ...tempProfile, userName: e.detail.value! })}
              />
            </IonItem>
            <IonItem>
              <IonLabel position='stacked'>Age</IonLabel>
              <IonInput
                type='number'
                value={tempProfile.userAge.toString()}
                onIonInput={e => setTempProfile({ ...tempProfile, userAge: Number(e.detail.value) })}
              />
            </IonItem>
            <IonItem>
              <IonLabel position='stacked'>Pronouns</IonLabel>
              <IonInput
                value={tempProfile.userPronouns}
                onIonInput={e => setTempProfile({ ...tempProfile, userPronouns: e.detail.value! })}
              />
            </IonItem>

            {/* Interests */}
            <IonItem lines='none'>
              <IonLabel position='stacked'>Add Interest</IonLabel>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <IonInput
                  value={newInterest}
                  placeholder='New interest'
                  onIonInput={e => setNewInterest(e.detail.value!)}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <IonButton onClick={() => {
                  if (newInterest.trim()) {
                    const updatedInterests = [...(tempProfile.interests || []), newInterest.trim()];
                    setTempProfile({ ...tempProfile, interests: updatedInterests });
                    setNewInterest('');
                  }
                }}>Add</IonButton>
              </div>
            </IonItem>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '8px 0' }}>
              {(tempProfile.interests || []).map(i => (
                <IonChip key={i}>
                  {i}
                  <IonIcon icon={close} onClick={() => {
                    const updatedInterests = (tempProfile.interests || []).filter(x => x !== i);
                    setTempProfile({ ...tempProfile, interests: updatedInterests });
                  }} />
                </IonChip>
              ))}
            </div>

            {/* Goals */}
            <IonItem lines='none'>
              <IonLabel position='stacked'>Add Goal</IonLabel>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <IonInput
                  value={newGoal}
                  placeholder='New goal'
                  onIonInput={e => setNewGoal(e.detail.value!)}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <IonButton onClick={() => {
                  if (newGoal.trim()) {
                    const updatedGoals = [...(tempProfile.goals || []), newGoal.trim()];
                    setTempProfile({ ...tempProfile, goals: updatedGoals });
                    setNewGoal('');
                  }
                }}>Add</IonButton>
              </div>
            </IonItem>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '8px 0' }}>
              {(tempProfile.goals || []).map(g => (
                <IonChip key={g}>
                  {g}
                  <IonIcon icon={close} onClick={() => {
                    const updatedGoals = (tempProfile.goals || []).filter(x => x !== g);
                    setTempProfile({ ...tempProfile, goals: updatedGoals });
                  }} />
                </IonChip>
              ))}
            </div>

            {/* Relationship Level */}
            <IonItem>
              <IonLabel position='stacked'>Relationship Level</IonLabel>
              <IonSelect
                value={tempProfile.relationshipLevel}
                onIonChange={e => setTempProfile({ ...tempProfile, relationshipLevel: e.detail.value })}
              >
                <IonSelectOption value='new'>New Friend</IonSelectOption>
                <IonSelectOption value='familiar'>Good Friend</IonSelectOption>
                <IonSelectOption value='close'>Best Friend</IonSelectOption>
              </IonSelect>
            </IonItem>
            {/* Badges Section */}
            <div style={{ margin: '32px 0 0 0', padding: 0 }}>
              <IonLabel style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, display: 'block', textAlign: 'center' }}>My Badges</IonLabel>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {badges.filter(b => b.unlocked).length === 0 && (
                  <span style={{ color: '#888', fontSize: 14 }}>No badges earned yet.</span>
                )}
                {badges.filter(b => b.unlocked).map(badge => (
                  <div key={badge.id} style={{ textAlign: 'center' }}>
                    <IonIcon icon={badge.colorIcon} style={{ fontSize: 32, color: 'orange' }} />
                    <div style={{ fontSize: 12 }}>{badge.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

// --- Mood History for Previous Week ---

function MoodHistoryPreviousWeek() {
  const [history, setHistory] = React.useState<{ date: string; mood: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    (async () => {
      try {
        const stored = await Preferences.get({ key: "mood_history" });
        if (stored.value) setHistory(JSON.parse(stored.value));
      } catch {}
      setLoading(false);
    })();
  }, []);

  // Get previous week range
  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay()); // Sunday
  const startOfPrevWeek = new Date(startOfThisWeek);
  startOfPrevWeek.setDate(startOfThisWeek.getDate() - 7);
  const endOfPrevWeek = new Date(startOfThisWeek);
  endOfPrevWeek.setDate(startOfThisWeek.getDate() - 1); // Saturday

  // Filter for previous week
  const prevWeekEntries = history.filter(e => {
    const entryDate = new Date(e.date);
    return entryDate >= startOfPrevWeek && entryDate <= endOfPrevWeek;
  }).sort((a, b) => a.date.localeCompare(b.date));

  if (loading) return null;
  return (
    <div style={{ marginTop: 32, marginBottom: 24 }}>
      <span style={{ fontWeight: 500, fontSize: 15 }}>Mood History (Previous Week):</span>
      {prevWeekEntries.length === 0 ? (
        <div style={{ marginTop: 8, color: '#888', fontSize: 13 }}>
          No mood data for last week yet. Start chatting to track your emotions!
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {prevWeekEntries.map((entry, idx) => (
            <IonChip key={entry.date + idx} color="tertiary" style={{ fontSize: 12 }}>
              {entry.date}: {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
            </IonChip>
          ))}
        </div>
      )}
    </div>
  );
}

// ...existing code...

export default SettingsPage;