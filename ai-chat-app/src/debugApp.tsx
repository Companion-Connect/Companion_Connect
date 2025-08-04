import React from "react";
import { IonApp, IonContent, setupIonicReact } from "@ionic/react";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";

setupIonicReact();

// These should show in console immediately
console.log("🚀 APP STARTING");
console.log("📅 Current time:", new Date().toISOString());

const App: React.FC = () => {
  console.log("🎯 APP COMPONENT RENDERING");

  // Test if we can import supabase
  try {
    console.log("📦 Trying to import supabase...");
    const { supabase } = require("./lib/supabase");
    console.log("✅ Supabase imported successfully");
    console.log("🔗 Supabase client:", supabase);
  } catch (error) {
    console.error("❌ Failed to import supabase:", error);
  }

  return (
    <IonApp>
      <IonContent style={{ padding: "20px" }}>
        <h1>🧪 Minimal Test</h1>
        <p>Check the browser console for messages!</p>
        <button onClick={() => console.log("🔘 Button clicked!")}>
          Test Button
        </button>
      </IonContent>
    </IonApp>
  );
};

console.log("✅ APP COMPONENT DEFINED");

export default App;
