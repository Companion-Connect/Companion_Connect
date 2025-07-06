import React, { useState, useEffect, useRef } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonTextarea,
  IonButton,
  IonIcon,
  IonItem,
  IonToast,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { send, mic, micOff, download } from "ionicons/icons";
import { Preferences } from "@capacitor/preferences";

interface JournalMessage {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
}

const STARTER_PROMPTS = [
  "How are you feeling today, and what's contributing to that?",
  "What's one thing you're looking forward to this week?",
  "Describe a recent interaction that made you think.",
];

const FOLLOW_UPS = [
  {
    check: (msg: string) => /\b(plan|will|going to|look forward|hope|future)\b/i.test(msg),
    fn: (msg: string) => `What are you hoping will happen, and how might you prepare for it?`,
  },
  {
    check: (msg: string) => /\b(started|begin|new|project|working on|trying|goal)\b/i.test(msg),
    fn: (msg: string) => `What inspired you to pursue this, and what are your first steps?`,
  },
  {
    check: (msg: string) => /\b(feel|felt|emotion|experience|affect|impact)\b/i.test(msg),
    fn: (msg: string) => `How did that make you feel?`,
  },
  {
    check: (msg: string) => /\b(problem|issue|challenge|difficult|hard|struggle)\b/i.test(msg),
    fn: (msg: string) => `What did you learn from this challenge?`,
  },  
  {
     check: (msg: string) => true,
     fn: (msg: string) => ``,
  },
];

const JournalManager: React.FC = () => {
  const [messages, setMessages] = useState<JournalMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [showToast, setShowToast] = useState("");
  const contentRef = useRef<HTMLIonContentElement>(null);
  const starterSent = useRef(false)

  const generateStarterPrompt = async (): Promise<string> => {
    const OPENAI_API_KEY = atob("c2stcHJvai1kZ1gyN0thZHp0RnlGN3VFemc4SFZuYjVYejJtd01hU1JUQ3c4bmp2cmNFR1hhSG5iaGJ6Z0tHaXRBR2ZSZTZ6M0hYNmlRSEN5blQzQmxia0ZKczRVMHNTc19fMG81RDJmQjZoVUZERktPUU5WRlVkcUpZak5kcGJveFJzd3VsUWxpQlE2VVo5N0NPNWNpa1NBem11dVdMUkJxa0E=");
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a journaling companion. Start a new journaling conversation with a thoughtful, open-ended question that encourages self-reflection. Do not repeat previous questions.",
            },
          ],
          max_tokens: 60,
          temperature: 0.9,
        }),
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim() || "How are you feeling today?";
    } catch (err) {
      return "How are you feeling today?";
    }
  };

  useEffect(() => {
    initSpeech();
    if (!starterSent.current && messages.length === 0) {
      starterSent.current = true;
      (async () => {
        setIsTyping(true);
        const starter = await generateStarterPrompt();
        addMessage(starter, false);
        setIsTyping(false);
      })();
    }
  }, []);

  const initSpeech = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const r = new SpeechRecognition();
    r.lang = "en-US";
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);
    };
    r.onerror = () => setIsRecording(false);
    r.onend = () => setIsRecording(false);
    setRecognition(r);
  };

  const toggleRecording = () => {
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsRecording(!isRecording);
  };

  const addMessage = (text: string, fromUser: boolean) => {
    const newMsg = {
      id: Date.now().toString(),
      content: text,
      isFromUser: fromUser,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setTimeout(() => contentRef.current?.scrollToBottom(300), 100);
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    setSessionEnded(false);
    const userText = input.trim();
    setInput("");
    addMessage(userText, true);
    setIsTyping(true);

    const updatedMessages = [
      ...messages,
      {
        id: Date.now().toString(),
        content: userText,
        isFromUser: true,
        timestamp: new Date(),
      },
    ];

    const aiReply = await callOpenAI(userText);
    if (aiReply) addMessage(aiReply, false);
    else addMessage("Sorry, I had trouble responding. Please try again.", false);
    setIsTyping(false);
  };

  const callOpenAI = async (userMessage: string): Promise<string> => {
    const OPENAI_API_KEY = atob("c2stcHJvai1kZ1gyN0thZHp0RnlGN3VFemc4SFZuYjVYejJtd01hU1JUQ3c4bmp2cmNFR1hhSG5iaGJ6Z0tHaXRBR2ZSZTZ6M0hYNmlRSEN5blQzQmxia0ZKczRVMHNTc19fMG81RDJmQjZoVUZERktPUU5WRlVkcUpZak5kcGJveFJzd3VsUWxpQlE2VVo5N0NPNWNpa1NBem11dVdMUkJxa0E=");

    const systemPrompt =
      "You are Companion, a reflective journaling AI. Help the user unpack their thoughts, explore emotions, and reflect deeply. Be supportive and inquisitive.";
    const history = messages.map((m) => ({
      role: m.isFromUser ? "user" : "assistant",
      content: m.content,
    }));

    const followUpObj = FOLLOW_UPS.find(f => f.check(userMessage))!;
    const followUp = followUpObj.fn(userMessage);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: userMessage },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      const aiContent = data.choices?.[0]?.message?.content || "";
      return aiContent
        ? `${aiContent}\n\n${followUp}`
        : followUp;
    } catch (err) {
      console.error("OpenAI error:", err);
      return "";
    }
  };

  const downloadJournal = () => {
    const text = messages
      .map((m) => `${m.isFromUser ? "You" : "Companion"}: ${m.content}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `journal_${new Date().toISOString()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const [sessionEnded, setSessionEnded] = useState(false);

  const summarizeSession = async () => {
    setIsTyping(true);
    const OPENAI_API_KEY = atob("c2stcHJvai1kZ1gyN0thZHp0RnlGN3VFemc4SFZuYjVYejJtd01hU1JUQ3c4bmp2cmNFR1hhSG5iaGJ6Z0tHaXRBR2ZSZTZ6M0hYNmlRSEN5blQzQmxia0ZKczRVMHNTc19fMG81RDJmQjZoVUZERktPUU5WRlVkcUpZak5kcGJveFJzd3VsUWxpQlE2VVo5N0NPNWNpa1NBem11dVdMUkJxa0E=");
    try {
      const conversation = messages
        .map((m) => `${m.isFromUser ? "User" : "Companion"}: ${m.content}`)
        .join("\n");
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a journaling companion. Summarize the following journaling session in a supportive, concise way, highlighting key themes and insights.",
            },
            { role: "user", content: conversation },
          ],
          max_tokens: 120,
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      const summary = data.choices?.[0]?.message?.content?.trim() || "Session summary unavailable.";
      addMessage(summary, false);
      setSessionEnded(true);
    } catch (err) {
      addMessage("Sorry, I couldn't summarize the session.", false);
    }
    setIsTyping(false);
  };

  const newTopic = async () => {
    setIsTyping(true);
    const starter = await generateStarterPrompt();
    addMessage(starter, false);
    setIsTyping(false);
    setSessionEnded(false);
  };
  
  const renderMessage = (m: JournalMessage) => (
    <div
      key={m.id}
      style={{
        display: "flex",
        justifyContent: m.isFromUser ? "flex-end" : "flex-start",
        padding: "4px 0",
      }}
    >
      <div
        style={{
          background: m.isFromUser
            ? "linear-gradient(135deg, #667eea, #764ba2)"
            : "#f1f5f9",
          color: m.isFromUser ? "white" : "#1e293b",
          borderRadius: "18px",
          padding: "10px 16px",
          maxWidth: "75%",
          fontSize: "15px",
          lineHeight: "1.5",
          boxShadow: m.isFromUser
            ? "0 2px 8px rgba(102,126,234,0.12)"
            : "0 2px 8px rgba(30,41,59,0.06)",
        }}
      >
        <IonText>{m.content}</IonText>
      </div>
    </div>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Journaling</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef}>
        <div style={{ padding: "16px", paddingBottom: "120px" }}>
          {messages.map(renderMessage)}
          {isTyping && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px" }}>
              <IonSpinner name="dots" />
              <IonText>Companion is thinking...</IonText>
            </div>
          )}
        </div>
      </IonContent>
      {/* Fixed input bar with action buttons */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          padding: "10px 16px 0 16px",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.05)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IonItem lines="none" style={{ flex: 1, borderRadius: 20 }}>
            <IonTextarea
              value={input}
              placeholder="Write your response..."
              autoGrow
              onIonInput={(e) => setInput(e.detail.value!)}
              rows={1}
              style={{ background: "transparent" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <IonButton
              fill="clear"
              onClick={toggleRecording}
              color={isRecording ? "danger" : "medium"}
            >
              <IonIcon icon={isRecording ? micOff : mic} />
            </IonButton>
            <IonButton onClick={sendMessage} disabled={!input.trim()}>
              <IonIcon icon={send} />
            </IonButton>
          </IonItem>
        </div>
        {/* Action buttons row */}
        <div style={{ display: "flex", gap: "10px", margin: "10px 0 0 0", justifyContent: "center" }}>
          <IonButton
            color="tertiary"
            onClick={summarizeSession}
            disabled={isTyping || messages.length === 0 || sessionEnded}
            size="small"
            fill="outline"
          >
            End Session & Summarize
          </IonButton>
          <IonButton
            color="primary"
            onClick={newTopic}
            disabled={isTyping}
            size="small"
            fill="outline"
          >
            New Topic
          </IonButton>
          <IonButton
            color="medium"
            onClick={downloadJournal}
            disabled={messages.length === 0}
            size="small"
            fill="outline"
          >
            Download
          </IonButton>
        </div>
      </div>
      <IonToast
        isOpen={!!showToast}
        message={showToast}
        duration={2000}
        onDidDismiss={() => setShowToast("")}
      />
    </IonPage>
  );
};

export default JournalManager;