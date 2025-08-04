import React, { useState } from "react";
import {
  IonApp,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  setupIonicReact,
} from "@ionic/react";
import { supabase } from "./lib/supabase";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

setupIonicReact();

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setMessage("Testing connection...");
    console.log("🧪 Testing Supabase connection...");
    
    try {
      const { data, error } = await supabase.from('profiles').select('count');
      if (error) {
        console.error("❌ Connection test failed:", error);
        setMessage(`❌ Connection failed: ${error.message}`);
      } else {
        console.log("✅ Connection successful:", data);
        setMessage("✅ Connection successful!");
      }
    } catch (err) {
      console.error("❌ Connection test exception:", err);
      setMessage(`❌ Exception: ${err}`);
    }
  };

  const createProfile = async () => {
    if (!username || !password) {
      setMessage("Please enter username and password");
      return;
    }

    setLoading(true);
    setMessage("Creating profile...");
    console.log("💾 Creating profile for:", username);

    try {
      // Generate a fake user ID for testing
      const fakeUserId = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: fakeUserId,
            username: username,
            password: password
          }
        ])
        .select();

      if (error) {
        console.error("❌ Profile creation failed:", error);
        setMessage(`❌ Failed: ${error.message}`);
      } else {
        console.log("✅ Profile created:", data);
        setMessage(`✅ Profile created successfully! ID: ${data[0]?.id}`);
      }
    } catch (err) {
      console.error("❌ Profile creation exception:", err);
      setMessage(`❌ Exception: ${err}`);
    }

    setLoading(false);
  };

  const viewProfiles = async () => {
    setMessage("Loading profiles...");
    console.log("👀 Fetching all profiles...");

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error("❌ Fetch failed:", error);
        setMessage(`❌ Fetch failed: ${error.message}`);
      } else {
        console.log("✅ Profiles fetched:", data);
        setMessage(`✅ Found ${data.length} profiles. Check console for details.`);
      }
    } catch (err) {
      console.error("❌ Fetch exception:", err);
      setMessage(`❌ Exception: ${err}`);
    }
  };

  return (
    <IonApp>
      <IonContent style={{ padding: "20px" }}>
        <h1>🧪 Supabase Test</h1>
        
        <IonButton expand="block" onClick={testConnection} style={{ marginBottom: "10px" }}>
          Test Connection
        </IonButton>

        <IonItem>
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput 
            value={username} 
            onIonInput={e => setUsername(e.detail.value!)}
            placeholder="Enter username"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput 
            value={password} 
            onIonInput={e => setPassword(e.detail.value!)}
            placeholder="Enter password"
          />
        </IonItem>

        <IonButton 
          expand="block" 
          onClick={createProfile} 
          disabled={loading}
          style={{ marginTop: "10px" }}
        >
          {loading ? "Creating..." : "Create Profile"}
        </IonButton>

        <IonButton 
          expand="block" 
          fill="outline" 
          onClick={viewProfiles}
          style={{ marginTop: "10px" }}
        >
          View All Profiles
        </IonButton>

        {message && (
          <IonText style={{ display: "block", marginTop: "20px", padding: "10px", background: "#f0f0f0" }}>
            {message}
          </IonText>
        )}

        <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
          <p>🔍 Check browser console for detailed logs</p>
          <p>📊 Check Supabase Table Editor for data</p>
        </div>
      </IonContent>
    </IonApp>
  );
};

export default App;
