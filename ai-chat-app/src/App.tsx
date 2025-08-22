import React, { useState, useEffect } from "react";
import {
  IonApp,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonLabel,
  IonText,
  IonButton,
  IonLoading,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { chatbubbles, heart, receiptSharp, settings } from "ionicons/icons";
import { setupIonicReact } from "@ionic/react";

import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";
import Tab4 from "./pages/Tab4";
import JournalManager from "./components/journalManager";
import { supabase } from "./lib/supabase";
import type { User } from "@supabase/supabase-js";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/flex-utils.css";
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  console.log('App render - user:', !!user, 'checking:', checking, 'isLoggingOut:', isLoggingOut);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          setUser(session?.user ?? null);
          setChecking(false);
        }
      } catch (error) {
        console.error('Auth init error:', error);
        if (mounted) {
          setChecking(false);
        }
      }
    };

    // Fallback timeout
    const timeout = setTimeout(() => {
      if (mounted) {
        console.log('Auth timeout, proceeding...');
        setChecking(false);
      }
    }, 3000);

    // Start auth check
    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted && !isLoggingOut) {
        console.log('Auth event:', event, 'Has user:', !!session?.user);
        setUser(session?.user ?? null);
        setChecking(false);
        clearTimeout(timeout); // Clear timeout when auth event fires
      } else if (isLoggingOut) {
        console.log('Ignoring auth event during logout:', event);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const formatEmail = (username: string) =>
    username.includes("@") ? username : `${username}@yourapp.com`;

  const handleLogin = async () => {
    setLoginError("");
    if (!loginUsername || !loginPassword) {
      setLoginError("Username and password required.");
      return;
    }

    setLoading(true);
    const email = formatEmail(loginUsername);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: loginPassword,
      });

      if (error) {
        setLoginError("Invalid login credentials.");
        console.error('Login error:', error);
      } else if (data.user) {
        setLoginUsername("");
        setLoginPassword("");
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError("Connection error. Please try again.");
    }

    setLoading(false);
  };

  const handleRegister = async () => {
    setLoginError("");
    if (!loginUsername || !loginPassword) {
      setLoginError("Username and password required.");
      return;
    }

    if (loginPassword.length < 6) {
      setLoginError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const email = formatEmail(loginUsername);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: loginPassword,
        options: { data: { username: loginUsername } },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setLoginError("Username already exists.");
        } else {
          setLoginError(error.message);
        }
      } else if (data.user) {
        // Insert into profiles table
        await supabase
          .from('profiles')
          .insert({ 
            id: data.user.id, 
            username: loginUsername,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (!data.session) {
          setLoginError("Registration successful! Please check your email to confirm your account, then try logging in.");
          setRegisterMode(false);
        } else {
          setLoginUsername("");
          setLoginPassword("");
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setLoginError("An error occurred during registration.");
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLoading(true);
    
    try {
      // Clear user immediately
      setUser(null);
      
      // Sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear storage
      localStorage.removeItem('sb-vhybrejllnjyoskvxcka-auth-token');
      sessionStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
    
    setLoading(false);
    
    // Reset logout flag after a delay to allow auth events to settle
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 1000);
  };

  if (checking) {
    return (
      <IonApp>
        <IonContent fullscreen>
          <IonLoading isOpen={true} message="Loading..." />
        </IonContent>
      </IonApp>
    );
  }

  if (!user) {
    return (
      <IonApp>
        <IonContent fullscreen className="ion-padding" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IonCard style={{ width: "100%", maxWidth: 400 }}>
            <IonCardContent>
              <h2>{registerMode ? "Create Account" : "Login"}</h2>
              <IonItem>
                <IonLabel position="stacked">Username</IonLabel>
                <IonInput 
                  value={loginUsername} 
                  onIonInput={e => setLoginUsername(e.detail.value!)}
                  disabled={loading}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput 
                  type="password" 
                  value={loginPassword} 
                  onIonInput={e => setLoginPassword(e.detail.value!)}
                  disabled={loading}
                />
              </IonItem>
              {loginError && (
                <IonText color="danger" style={{ display: 'block', marginTop: 8 }}>
                  {loginError}
                </IonText>
              )}
              <IonButton 
                expand="block" 
                style={{ marginTop: 16 }} 
                onClick={registerMode ? handleRegister : handleLogin}
                disabled={loading}
              >
                {loading ? "Please wait..." : registerMode ? "Register" : "Login"}
              </IonButton>
              <IonButton 
                fill="clear" 
                expand="block" 
                style={{ marginTop: 8 }} 
                onClick={() => setRegisterMode(!registerMode)}
                disabled={loading}
              >
                {registerMode ? "Already have an account? Login" : "No account? Register"}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonApp>
    );
  }

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
              <JournalManager />
            </Route>
            <Route exact path="/">
              <Redirect to="/tab1" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/tab1">
              <IonIcon icon={chatbubbles} />
              <IonLabel>Chat</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon icon={heart} />
              <IonLabel>Challenge</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/tab3">
              <IonIcon icon={settings} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
            <IonTabButton tab="journal" href="/journal">
              <IonIcon icon={receiptSharp} />
              <IonLabel>Journal</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;