import ChallengeGamification from '../components/ChallengeGamification';
import React from 'react';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { chatbubblesOutline, settingsOutline } from 'ionicons/icons';
import { Route, Redirect } from 'react-router-dom';


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