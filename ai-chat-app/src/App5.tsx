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
  IonButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonText,
  IonLoading,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { chatbubbles, heart, receiptSharp, settings } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";
import Tab4 from "./pages/Tab4";
import JournalManager from "./components/journalManager";
import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import type { User } from '@supabase/supabase-js';

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

const App: React.FC = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error checking session:', error);
        } else if (session?.user) {
          setUser(session.user);
          setShowLogin(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setInitializing(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        if (session?.user) {
          setUser(session.user);
          setShowLogin(false);
        } else {
          setUser(null);
          setShowLogin(true);
        }
        setInitializing(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const validateInput = (username: string, password: string): string | null => {
    if (!username.trim() || !password.trim()) {
      return "Please enter username and password.";
    }
    if (registerMode && password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return null;
  };

  const formatEmail = (username: string): string => {
    return username.includes('@') ? username : `${username}@yourapp.com`;
  };

  const handleLogin = async () => {
    const validationError = validateInput(loginUsername, loginPassword);
    if (validationError) {
      setLoginError(validationError);
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      const email = formatEmail(loginUsername);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: loginPassword,
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login credentials') || 
            error.message.includes('Email not confirmed')) {
          setLoginError("Invalid username or password.");
        } else {
          setLoginError(error.message);
        }
      } else if (data.user) {
        setUser(data.user);
        setShowLogin(false);
        setLoginUsername("");
        setLoginPassword("");
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const validationError = validateInput(loginUsername, loginPassword);
    if (validationError) {
      setLoginError(validationError);
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      const email = formatEmail(loginUsername);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: loginPassword,
        options: {
          data: {
            username: loginUsername,
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        if (error.message.includes('User already registered')) {
          setLoginError("Username already exists. Try logging in instead.");
          setRegisterMode(false);
        } else if (error.message.includes('Password should be at least 6 characters')) {
          setLoginError("Password must be at least 6 characters long.");
        } else {
          setLoginError(error.message);
        }
      } else if (data.user) {
        // Check if email confirmation is required
        if (data.user && !data.session) {
          setLoginError("Please check your email to confirm your account.");
        } else {
          setUser(data.user);
          setShowLogin(false);
          setLoginUsername("");
          setLoginPassword("");
        }
      }
    } catch (error) {
      console.error('Unexpected registration error:', error);
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      } else {
        setUser(null);
        setShowLogin(true);
        setLoginUsername("");
        setLoginPassword("");
        setLoginError("");
      }
    } catch (error) {
      console.error('Unexpected logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      registerMode ? handleRegister() : handleLogin();
    }
  };

  if (initializing) {
    return (
      <IonApp>
        <IonContent fullscreen style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IonLoading isOpen={true} message="Loading..." />
        </IonContent>
      </IonApp>
    );
  }

  if (showLogin) {
    return (
      <IonApp>
        <IonContent fullscreen style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IonCard style={{ maxWidth: 400, margin: "auto", padding: 24 }}>
            <IonCardContent>
              <h2 style={{ textAlign: "center", marginBottom: 16 }}>
                {registerMode ? "Create Account" : "Welcome Back"}
              </h2>
              <IonItem>
                <IonLabel position="stacked">Username</IonLabel>
                <IonInput 
                  value={loginUsername} 
                  onIonInput={e => {
                    setLoginUsername(e.detail.value!);
                    setLoginError(""); // Clear error when user types
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  placeholder="Enter your username"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput 
                  type="password" 
                  value={loginPassword} 
                  onIonInput={e => {
                    setLoginPassword(e.detail.value!);
                    setLoginError(""); // Clear error when user types
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  placeholder="Enter your password"
                />
              </IonItem>
              {loginError && (
                <IonText color="danger" style={{ display: 'block', marginTop: 8, fontSize: '14px' }}>
                  {loginError}
                </IonText>
              )}
              <IonButton 
                expand="block" 
                style={{ marginTop: 16 }} 
                onClick={registerMode ? handleRegister : handleLogin}
                disabled={loading || !loginUsername.trim() || !loginPassword.trim()}
                color="primary"
              >
                {loading ? "Please wait..." : (registerMode ? "Create Account" : "Sign In")}
              </IonButton>
              <IonButton 
                fill="clear" 
                expand="block" 
                style={{ marginTop: 8 }} 
                onClick={() => {
                  setRegisterMode(!registerMode);
                  setLoginError("");
                }}
                disabled={loading}
              >
                {registerMode ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonApp>
    );
  }

  // Main app with tabs
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/tab1">
              <Tab1 user={user} onLogout={handleLogout} />
            </Route>
            <Route exact path="/tab2">
              <Tab2 user={user} onLogout={handleLogout} />
            </Route>
            <Route exact path="/tab3">
              <Tab3 user={user} onLogout={handleLogout} />
            </Route>
            <Route exact path="/journal">
              <JournalManager user={user} onLogout={handleLogout} />
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
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
