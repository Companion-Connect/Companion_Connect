import ChallengeGamification from '../components/ChallengeGamification';
import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import type { User } from '@supabase/supabase-js';

interface Tab2Props {
  user?: User;
  onLogout: () => void;
}

const Tab2: React.FC<Tab2Props> = ({ user, onLogout }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Challenge</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ChallengeGamification user={user} />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;