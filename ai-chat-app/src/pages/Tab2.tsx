// src/AppTabs.tsx
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

import NotificationAutoStart from '../components/MyNotifier';

const AppTabs: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <NotificationAutoStart />
      <IonTabs>
        <IonRouterOutlet>
          {/* Challenges Tab */}
          <Route exact path="/challenges">
        {/* NotificationAutoStart is now started globally above */}
          </Route>

          {/* Redirect root → challenges */}
          <Route exact path="/">
        <Redirect to="/challenges" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="challenges" href="/challenges">
        <IonIcon icon={chatbubblesOutline} />
        <IonLabel>Challenges</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
      
    </IonReactRouter>
    
  </IonApp>
);

export default AppTabs;
