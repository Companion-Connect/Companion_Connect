import React, { useEffect, useState } from "react";
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
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { chatbubbles, heart, receiptSharp, settings, logIn } from "ionicons/icons";
import { setupIonicReact } from "@ionic/react";

import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";
import Tab4 from "./pages/Tab4";
import JournalManager from "./components/journalManager";
import { supabase } from "./lib/supabase";
import { StorageUtil } from './utils/storage.utils';
import { SyncService } from "./services/syncService";
import { useAutoSync } from "./hooks/useAutoSync";
import type { User } from "@supabase/supabase-js";
// ...existing imports...

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/flex-utils.css";
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      try {
        // Wait for session but don't hang forever - timeout after 8s
        const p = supabase.auth.getSession();
        const res: any = await Promise.race([
          p,
          new Promise((_, rej) => setTimeout(() => rej(new Error('session_timeout')), 8000)),
        ]);
        const session = res?.data?.session;
        if (session?.user) setUser(session.user);
        StorageUtil.setCurrentUserId(session?.user?.id ?? null);
      } catch (e) {
        console.warn('Failed to get session during init or timed out:', e);
        StorageUtil.setCurrentUserId(null);
      } finally {
        setInitializing(false);
      }
    };
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      const uid = session?.user?.id ?? null;
      StorageUtil.setCurrentUserId(uid);
      try { window.dispatchEvent(new CustomEvent('auth-changed', { detail: { userId: uid } }) as Event); } catch {}
    });

    return () => subscription.unsubscribe();
  }, []);

  const formatEmail = (username: string) =>
    username.includes("@") ? username : `${username}@yourapp.com`;

  // ...existing code...

  const handleLogin = async () => {
    setLoginError("");
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setLoginError('Supabase not configured (missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY).');
      return;
    }
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
        setLoginError(error.message || "Invalid login credentials.");
      } else if (data.user) {
        setUser(data.user);
        setShowLogin(false);
        setLoginUsername("");
        setLoginPassword("");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setLoginError(err?.message || String(err) || "An error occurred during login (network error or CORS). Please check Supabase URL and network.");
    }

    setLoading(false);
  };

  const handleRegister = async () => {
    setLoginError("");
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setLoginError('Supabase not configured (missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY). Registration cannot proceed.');
      return;
    }
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

    // Diagnostic: print Supabase config presence (do not expose keys in UI)
    try {
      console.log('Supabase URL (runtime):', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase anon key present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    } catch (e) { console.warn('Could not read import.meta.env at runtime', e); }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: loginPassword,
        options: { data: { username: loginUsername } },
      });

      if (error) {
        setLoginError(error.message || "Registration error");
      } else if (data.user) {
        // If we received a session, we're logged in
        if (data.session && data.user) {
          setUser(data.user);
          // ensure StorageUtil uses the new user's id
          const newUserId = data.user?.id ?? null;
          StorageUtil.setCurrentUserId(newUserId);
          // migrate anonymous data into user-scoped keys (only if we have an id)
          if (newUserId) {
            (async () => {
              try {
                // Migrate common anonymous keys into the new user-scoped keys
                await StorageUtil.migrateToUser('mood_history', newUserId);
                await StorageUtil.migrateToUser('challenge_goals', newUserId);
                await StorageUtil.migrateToUser('challenge_badges', newUserId);
                await StorageUtil.migrateToUser('user_profile', newUserId);
                await StorageUtil.migrateToUser('profile_interests', newUserId);
                await StorageUtil.migrateToUser('display_badge_id', newUserId);
                await StorageUtil.migrateToUser('chat_settings', newUserId);
              } catch (e) {
                console.warn('Data migration after registration failed:', e);
              }
            })();
          }

          setShowLogin(false);
          setLoginUsername("");
          setLoginPassword("");
        } else {
          // Some Supabase setups return a user but require email confirmation (no session)
          // Try to sign the user in automatically (this will succeed for email-less test setups)
          try {
            const signIn = await supabase.auth.signInWithPassword({ email, password: loginPassword });
            if (signIn.data?.user) {
              setUser(signIn.data.user);
              setShowLogin(false);
              setLoginUsername("");
              setLoginPassword("");
            } else {
              setLoginError("Account created. Please check your email to confirm and then login.");
            }
          } catch (siErr) {
            console.warn('Auto sign-in failed after sign-up:', siErr);
            setLoginError("Account created — please check your email to confirm your account.");
          }
        }
      }
    } catch (err: any) {
      console.error("Registration error (full):", err);
      const msg = (err && err.message) || String(err || '');
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setLoginError('Network request failed while contacting Supabase. Likely causes: incorrect VITE_SUPABASE_URL, missing anon key, CORS blocked, or network offline. Check browser Network tab. I logged the Supabase URL to the console for inspection.');
      } else {
        setLoginError(msg || "An error occurred during registration (network or config). Please check Supabase settings.");
      }
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  if (initializing) {
    return (
      <IonApp>
        <IonContent fullscreen>
          <IonLoading isOpen={true} message="Initializing..." />
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
              <Tab1 user={user as User} onLogout={handleLogout} />
            </Route>
            <Route exact path="/tab2">
              <Tab2 user={user as User} onLogout={handleLogout} />
            </Route>
            <Route exact path="/tab3">
              <Tab3 user={user as User} onLogout={handleLogout} />
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
              <span>Chat</span>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon icon={heart} />
              <span>Challenge</span>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/tab3">
              <IonIcon icon={settings} />
              <span>Settings</span>
            </IonTabButton>
            <IonTabButton tab="journal" href="/journal">
              <IonIcon icon={receiptSharp} />
              <span>Journal</span>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>

        {/* Floating top-right login/logout button (no extra header) */}
        <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 1200 }}>
          {user ? (
            <IonButton color="medium" onClick={handleLogout}>
              Logout
            </IonButton>
          ) : (
            <IonButton color="primary" onClick={() => setShowLogin(true)}>
              Login
            </IonButton>
          )}
        </div>

        {/* Login Modal (optional) */}
        <IonModal isOpen={showLogin} onDidDismiss={() => setShowLogin(false)}>
          <IonContent className="ion-padding" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <IonCard style={{ width: '100%', maxWidth: 520 }}>
              <IonCardContent>
                <h2 style={{ textAlign: 'center' }}>{registerMode ? 'Create Account' : 'Login'}</h2>
                <IonItem>
                  <IonLabel position="stacked">Username</IonLabel>
                  <IonInput 
                    value={loginUsername} 
                    onIonInput={e => setLoginUsername((e.target as any).value ?? "")}
                    disabled={loading}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Password</IonLabel>
                  <IonInput 
                    type="password" 
                    value={loginPassword} 
                    onIonInput={e => setLoginPassword((e.target as any).value ?? "")}
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
                  {loading ? 'Please wait...' : registerMode ? 'Register' : 'Login'}
                </IonButton>
                <IonButton 
                  fill="clear" 
                  expand="block" 
                  style={{ marginTop: 8 }} 
                  onClick={() => setRegisterMode(!registerMode)}
                  disabled={loading}
                >
                  {registerMode ? 'Already have an account? Login' : 'No account? Register'}
                </IonButton>
                <div style={{ marginTop: 8, textAlign: 'center' }}  >
                  <IonButton fill="clear" onClick={() => setShowLogin(false)}>Close</IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonModal>

      </IonReactRouter>
    </IonApp>
  );
};

export default App;