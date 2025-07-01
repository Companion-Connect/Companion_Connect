import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonList,
  IonText,
  IonRadioGroup,
  IonListHeader,
  IonRadio,
} from "@ionic/react";
import { Preferences } from "@capacitor/preferences";
import "../styles/responsive.css";
// Define UserProfile interface here since the import path is invalid
interface UserProfile {
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

interface MBTIQuestion {
  id: string;
  text: string;
  dimension: "EI" | "SN" | "TF" | "JP";
}

const questions: MBTIQuestion[] = [
  { id: "q1", text: "I feel energized when I'm in a large group of people.", dimension: "EI" },
  { id: "q2", text: "I prefer quiet reflection over social gatherings.", dimension: "EI" },
  { id: "q3", text: "I focus on facts and concrete details.", dimension: "SN" },
  { id: "q4", text: "I enjoy imagining future possibilities.", dimension: "SN" },
  { id: "q5", text: "I make decisions based on logical analysis.", dimension: "TF" },
  { id: "q6", text: "I consider personal values and others' feelings.", dimension: "TF" },
  { id: "q7", text: "I like having a clear plan and schedule.", dimension: "JP" },
  { id: "q8", text: "I prefer to stay open to new information and options.", dimension: "JP" },
  { id: "q9", text: "At work, I focus on immediate tasks rather than ideas.", dimension: "SN" },
  { id: "q10", text: "I find routine comforting and welcome predictability.", dimension: "JP" },
  { id: "q11", text: "I often check in with others to ensure they're okay.", dimension: "TF" },
  { id: "q12", text: "I recharge best by being alone with my thoughts.", dimension: "EI" },
];

const SettingsPage: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [mbtiResult, setMbtiResult] = useState<string | null>(null);

  const handleAnswer = (qid: string, value: number) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const computeMbti = async () => {
    const dims: Record<string, number[]> = { EI: [], SN: [], TF: [], JP: [] };
    questions.forEach(q => {
      const val = answers[q.id] || 3;
      dims[q.dimension].push(val);
    });
    const result = [
      dims.EI.reduce((a,b)=>a+b,0)/dims.EI.length > 3 ? 'E':'I',
      dims.SN.reduce((a,b)=>a+b,0)/dims.SN.length > 3 ? 'S':'N',
      dims.TF.reduce((a,b)=>a+b,0)/dims.TF.length > 3 ? 'T':'F',
      dims.JP.reduce((a,b)=>a+b,0)/dims.JP.length > 3 ? 'J':'P',
    ].join('');
    setMbtiResult(result);
    await Preferences.set({ key: 'mbti', value: result });
    // Update only the MBTI field in userProfile, preserving other fields
    const { value } = await Preferences.get({ key: 'userProfile' });
    let userProfile: UserProfile;
    if (value) {
      userProfile = { ...JSON.parse(value), MBTI: result };
    } else {
      userProfile = {
      userName: "",
      userAge: 0,
      userPronouns: "",
      userPrefTime: "",
      MBTI: result,
      interests: [],
      goals: [],
      challenges: [],
      currentMood: "",
      communicationStyle: "",
      motivationalStyle: "",
      conversationCount: 0,
      lastChatDate: "",
      relationshipLevel: "",
      };
    }
    await Preferences.set({ key: 'userProfile', value: JSON.stringify(userProfile) });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="container">
        {/* ... other settings cards ... */}
        <IonCard style={{ margin: '20px', border: '2px solid #667eea' }}>
          <IonCardContent>
            <h2 style={{ marginBottom: '12px', color: '#667eea' }}>Advanced MBTI Quiz</h2>
            <IonList>
              {questions.map(q => (
                <React.Fragment key={q.id}>
                  <IonListHeader style={{ fontSize: '14px', fontWeight: 500 }}>{q.text}</IonListHeader>
                  <IonRadioGroup
                    value={answers[q.id]?.toString() || ''}
                    onIonChange={e => handleAnswer(q.id, parseInt(e.detail.value,10))}
                  >
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                      {[1,2,3,4,5].map(n => (
                        <IonItem key={n} lines="none" style={{ flex: 1, textAlign: 'center' }}>
                          <IonLabel style={{ width: '100%' }}>{n}</IonLabel>
                          <IonRadio slot="start" value={n.toString()} />
                        </IonItem>
                      ))}
                    </div>
                  </IonRadioGroup>
                </React.Fragment>
              ))}
            </IonList>
            <IonButton expand="block" onClick={computeMbti} style={{ marginTop: 16, '--background': '#764ba2' }}>
              Calculate MBTI
            </IonButton>

            {mbtiResult && (
              <IonCard style={{ marginTop: 24, background: 'linear-gradient(135deg, #764ba2, #667eea)', color: '#fff', textAlign: 'center' }}>
                <IonCardContent>
                  <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{mbtiResult}</h1>
                  <p style={{ fontSize: '1rem', marginTop: '4px' }}>Your MBTI Type</p>
                </IonCardContent>
              </IonCard>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
