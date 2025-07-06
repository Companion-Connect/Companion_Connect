import { Redirect, Route } from "react-router-dom";
import {
IonApp,
IonIcon,
IonLabel,
IonRouterOutlet,
IonTabBar,
IonTabButton,
IonTabs,
setupIonicReact,
withIonLifeCycle,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { chatbubbles, heart, receiptSharp, settings } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";
import Tab4 from "./pages/Tab4";
import JournalManager from "./components/journalManager";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */
/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";
/* Theme variables */
import "./theme/variables.css";
setupIonicReact();
const App: React.FC = () => (
<IonApp>
<IonReactRouter>
<IonTabs>
  <IonRouterOutlet>
	<Route exact path="/tab1">
	  <Tab1 />
	</Route>
	<Route exact path="/tab2">
	  <Tab2 />
	</Route>
	<Route exact path="/tab3">
	  <Tab3 />
	</Route>
	<Route exact path="/journal">
		<JournalManager />
	</Route>
	<Route exact path="/">
	  <Redirect to="/tab1" />
	</Route>
  </IonRouterOutlet>
  <IonTabBar
	slot="bottom"
	style={{
	  "--background": "rgba(255, 255, 255, 0.95)",
	  backdropFilter: "blur(20px)",
	  borderTop: "1px solid rgba(226, 232, 240, 0.8)",
	  "--color": "#64748b",
	  "--color-selected": "#667eea",
	}}
  >
	<IonTabButton tab="tab1" href="/tab1">
	  <IonIcon
		aria-hidden="true"
		icon={chatbubbles}
		style={{ fontSize: "24px" }}
	  />
	  <IonLabel style={{ fontSize: "12px", fontWeight: "500" }}>
		Chat
	  </IonLabel>
	</IonTabButton>
	<IonTabButton tab="tab2" href="/tab2">
	  <IonIcon
		aria-hidden="true"
		icon={heart}
		style={{ fontSize: "24px" }}
	  />
	  <IonLabel style={{ fontSize: "12px", fontWeight: "500" }}>
		Challenge
	  </IonLabel>
	</IonTabButton>
	<IonTabButton tab="tab3" href="/tab3">
	  <IonIcon
		aria-hidden="true"
		icon={settings}
		style={{ fontSize: "24px" }}
	  />
	  <IonLabel style={{ fontSize: "12px", fontWeight: "500" }}>
		Settings
	  </IonLabel>
	</IonTabButton>
	<IonTabButton tab="journal" href="/journal">
		<IonIcon
			aria-hidden="true"
			icon={receiptSharp}
			style={{ fontSize: "24px" }}
		/>
		<IonLabel style={{ fontSize: "12px", fontWeight: "500" }}>
			Journal
		</IonLabel>
	</IonTabButton>
  </IonTabBar>
</IonTabs>
</IonReactRouter>
</IonApp>
);
export default App;