import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonText,
  IonButton,
  IonLoading,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { chatbubbles, heart, receiptSharp, settings } from "ionicons/icons";
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
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.system.css";
import "./theme/variables.css";

import React, { useState, useEffect } from "react";

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
    console.log("🚀 App starting up...");
    
    const checkSession = async () => {
      console.log("🔍 Checking existing session...");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("❌ Session check error:", error);
      }
      
      if (session?.user) {
        console.log("✅ Found existing session for user:", session.user.id);
        setUser(session.user);
        setShowLogin(false);
      } else {
        console.log("ℹ️ No existing session found");
      }
      setInitializing(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state changed:", event, session?.user?.id);
        if (session?.user) {
          setUser(session.user);
          setShowLogin(false);
        } else {
          setUser(null);
          setShowLogin(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const formatEmail = (username: string): string => {
    return username.includes("@") ? username : `${username}@yourapp.com`;
  };

  const handleLogin = async () => {
    console.log("🔑 Starting login process...");
    setLoginError("");
    
    if (!loginUsername || !loginPassword) {
      setLoginError("Please enter username and password.");
      return;
    }

    setLoading(true);
    const email = formatEmail(loginUsername);
    console.log("📧 Using email:", email);

    try {
      console.log("🔐 Attempting auth login...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: loginPassword,
      });

      if (error) {
        console.error("❌ Auth login error:", error);
        setLoginError("Invalid login credentials.");
      } else if (data.user) {
        console.log("✅ Auth login successful for user:", data.user.id);
        
        // Now try to save to profiles table
        console.log("💾 Saving to profiles table...");
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: data.user.id, 
            username: loginUsername,
            password: loginPassword 
          })
          .select();

        if (profileError) {
          console.error("❌ Profile save error:", profileError);
          console.error("Error details:", JSON.stringify(profileError, null, 2));
        } else {
          console.log("✅ Profile saved successfully:", profileData);
        }

        setUser(data.user);
        setShowLogin(false);
        setLoginUsername("");
        setLoginPassword("");
      }
    } catch (error) {
      console.error("❌ Unexpected login error:", error);
      setLoginError("An error occurred during login.");
    }

    setLoading(false);
  };

  const handleRegister = async () => {
    console.log("📝 Starting registration process...");
    setLoginError("");
    
    if (!loginUsername || !loginPassword) {
      setLoginError("Please enter username and password.");
      return;
    }

    if (loginPassword.length < 6) {
      setLoginError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const email = formatEmail(loginUsername);
    console.log("📧 Registering with email:", email);

    try {
      console.log("🔐 Attempting auth signup...");
      const { data, error } = await supabase.auth.signUp({
        email,
        password: loginPassword,
        options: { data: { username: loginUsername } },
      });

      if (error) {
        console.error("❌ Auth signup error:", error);
        if (error.message.includes("User already registered")) {
          setLoginError("Username already exists.");
        } else {
          setLoginError(error.message);
        }
      } else if (data.user) {
        console.log("✅ Auth signup successful for user:", data.user.id);
        
        // Wait a moment for the trigger to potentially create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log("💾 Saving to profiles table...");
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: data.user.id, 
            username: loginUsername,
            password: loginPassword 
          })
          .select();

        if (profileError) {
          console.error("❌ Profile save error:", profileError);
          console.error("Error details:", JSON.stringify(profileError, null, 2));
        } else {
          console.log("✅ Profile saved successfully:", profileData);
        }

        if (!data.session) {
          console.log("📧 Email confirmation required");
          setLoginError("Please check your email to confirm your account.");
        } else {
          setUser(data.user);
          setShowLogin(false);
          setLoginUsername("");
          setLoginPassword("");
        }
      }
    } catch (error) {
      console.error("❌ Unexpected registration error:", error);
      setLoginError("An error occurred during registration.");
    }

    setLoading(false);
  };

  const testDatabaseConnection = async () => {
    console.log("🧪 Testing database connection...");
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(1);
      if (error) {
        console.error("❌ Database test failed:", error);
      } else {
        console.log("✅ Database connection works! Sample data:", data);
      }
    } catch (error) {
      console.error("❌ Database test exception:", error);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setShowLogin(true);
    setLoginUsername("");
    setLoginPassword("");
    setLoginError("");
    setLoading(false);
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
                {registerMode ? "Create Account" : "Login"}
              </h2>
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
              <IonButton 
                fill="outline" 
                expand="block" 
                style={{ marginTop: 8 }} 
                onClick={testDatabaseConnection}
                disabled={loading}
              >
                🧪 Test Database Connection
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
            <Route exact path="/tab1"><Tab1 user={user} onLogout={handleLogout} /></Route>
            <Route exact path="/tab2"><Tab2 user={user} onLogout={handleLogout} /></Route>
            <Route exact path="/tab3"><Tab3 user={user} onLogout={handleLogout} /></Route>
            <Route exact path="/journal"><JournalManager user={user} onLogout={handleLogout} /></Route>
            <Route exact path="/"><Redirect to="/tab1" /></Route>
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
