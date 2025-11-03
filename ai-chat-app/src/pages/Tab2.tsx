import ChallengeGamification from '../components/ChallengeGamification';
import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Challenge</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ChallengeGamification />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;