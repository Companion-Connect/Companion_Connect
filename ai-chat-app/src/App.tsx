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
import React, { useState, useEffect } from "react";
import { Preferences } from "@capacitor/preferences";
import { IonButton, IonContent, IonCard, IonCardContent, IonItem, IonInput, IonText } from "@ionic/react";

const USER_CREDENTIALS_KEY = "user_credentials";
const LOGGED_IN_USER_KEY = "logged_in_user";

const App: React.FC = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
	(async () => {
	  const storedUser = await Preferences.get({ key: LOGGED_IN_USER_KEY });
	  //if (storedUser.value) {
	//	setLoggedInUser(storedUser.value);
	//	setShowLogin(false);
	 // }
	  const credsRaw = await Preferences.get({ key: USER_CREDENTIALS_KEY });
	  if (!credsRaw.value) setRegisterMode(true);
	})();
  }, []);

  async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  const handleLogin = async () => {
	setLoginError("");
	if (!loginUsername || !loginPassword) {
	  setLoginError("Please enter username and password.");
	  return;
	}
	const credsRaw = await Preferences.get({ key: USER_CREDENTIALS_KEY });
	if (!credsRaw.value) {
	  setLoginError("No account found. Please register.");
	  setRegisterMode(true);
	  return;
	}
	const creds = JSON.parse(credsRaw.value);
	if (!creds[loginUsername]) {
	  setLoginError("Username not found.");
	  return;
	}
	const hash = await hashPassword(loginPassword);
	if (creds[loginUsername] !== hash) {
	  setLoginError("Incorrect password.");
	  return;
	}
	setLoggedInUser(loginUsername);
	setShowLogin(false);
	await Preferences.set({ key: LOGGED_IN_USER_KEY, value: loginUsername });
  };

  const handleRegister = async () => {
	setLoginError("");
	if (!loginUsername || !loginPassword) {
	  setLoginError("Please enter username and password.");
	  return;
	}
	const credsRaw = await Preferences.get({ key: USER_CREDENTIALS_KEY });
	const creds = credsRaw.value ? JSON.parse(credsRaw.value) : {};
	if (creds[loginUsername]) {
	  setLoginError("Username already exists.");
	  return;
	}
	const hash = await hashPassword(loginPassword);
	creds[loginUsername] = hash;
	await Preferences.set({ key: USER_CREDENTIALS_KEY, value: JSON.stringify(creds) });
	setLoggedInUser(loginUsername);
	setShowLogin(false);
	await Preferences.set({ key: LOGGED_IN_USER_KEY, value: loginUsername });
  };

  const handleLogout = async () => {
	setLoggedInUser(null);
	setShowLogin(true);
	setLoginUsername("");
	setLoginPassword("");
	setLoginError("");
	await Preferences.remove({ key: LOGGED_IN_USER_KEY });
  };

  if (showLogin) {
	return (
	  <IonApp>
		<IonContent fullscreen style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
		  <IonCard style={{ maxWidth: 400, margin: "auto", padding: 24 }}>
			<IonCardContent>
			  <h2 style={{ textAlign: "center", marginBottom: 16 }}>{registerMode ? "Register Account" : "Login"}</h2>
			  <IonItem>
				<IonLabel position="stacked">Username</IonLabel>
				<IonInput value={loginUsername} onIonInput={e => setLoginUsername(e.detail.value!)} />
			  </IonItem>
			  <IonItem>
				<IonLabel position="stacked">Password</IonLabel>
				<IonInput type="password" value={loginPassword} onIonInput={e => setLoginPassword(e.detail.value!)} />
			  </IonItem>
			  {loginError && <IonText color="danger" style={{ marginTop: 8 }}>{loginError}</IonText>}
			  <IonButton expand="block" style={{ marginTop: 16 }} onClick={registerMode ? handleRegister : handleLogin}>
				{registerMode ? "Register" : "Login"}
			  </IonButton>
			  <IonButton fill="clear" expand="block" style={{ marginTop: 8 }} onClick={() => setRegisterMode(!registerMode)}>
				{registerMode ? "Already have an account? Login" : "No account? Register"}
			  </IonButton>
			</IonCardContent>
		  </IonCard>
		</IonContent>
	  </IonApp>
	);
  }

  // Pass loggedInUser and handleLogout as props to pages if needed
  return (
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
			  <IonIcon aria-hidden="true" icon={chatbubbles} style={{ fontSize: "24px" }} />
			  <IonLabel style={{ fontSize: "12px", fontWeight: "500" }}>Chat</IonLabel>
			</IonTabButton>
			<IonTabButton tab="tab2" href="/tab2">
			  <IonIcon aria-hidden="true" icon={heart} style={{ fontSize: "24px" }} />
			  <IonLabel style={{ fontSize: "12px", fontWeight: "500" }}>Challenge</IonLabel>
			</IonTabButton>
			<IonTabButton tab="tab3" href="/tab3">
			  <IonIcon aria-hidden="true" icon={settings} style={{ fontSize: "24px" }} />
			  <IonLabel style={{ fontSize: "12px", fontWeight: "500" }}>Settings</IonLabel>
			</IonTabButton>
			<IonTabButton tab="journal" href="/journal">
			  <IonIcon aria-hidden="true" icon={receiptSharp} style={{ fontSize: "24px" }} />
			  <IonLabel style={{ fontSize: "12px", fontWeight: "500" }}>Journal</IonLabel>
			</IonTabButton>
			{/* Logout button removed from tab bar. Now only in SettingsPage. */}
		  </IonTabBar>
		</IonTabs>
	  </IonReactRouter>
	</IonApp>
  );
};
export default App;