import React, { useState, useEffect, useRef } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonIcon,
  IonTextarea,
  IonSpinner,
  IonToast,
  IonChip,
  IonLabel,
  IonText,
  IonAvatar,
  IonBadge,
  useIonViewWillEnter,
} from "@ionic/react";

import * as colors from "./colors";

import {
  send,
  mic,
  micOff,
  heart,
  chatbubbles,
  person,
  sparkles,
  happy,
  time,
} from "ionicons/icons";
import { Preferences } from "@capacitor/preferences";

// Core CSS imports for Ionic components
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

// Types
export interface ChatMessage {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
  messageType: string;
}

export interface UserProfile {
  userName: string;
  userAge: number;
  userPronouns: string;
  userPrefTime: string;
  interests: string[];
  goals: string[];
  challenges: string[];
  currentMood: string;
  communicationStyle: string;
  motivationalStyle: string;
  conversationCount: number;
  lastChatDate: string;
  relationshipLevel: string;
}

interface AppSettings {
  aiName: string;
  personality: string;
  typingSpeed: number;
  responseDelay: number;
  enableSpeechToText: boolean;
  maxChatHistory: number;
  enableEmojis: boolean;
  enableTypingAnimation: boolean;
  enableNotifications: boolean;
}

// Default settings
const defaultAppSettings: AppSettings = {
  aiName: "Companion",
  personality: "supportive",
  typingSpeed: 50,
  responseDelay: 1000,
  enableSpeechToText: true,
  maxChatHistory: 100,
  enableEmojis: true,
  enableTypingAnimation: true,
  enableNotifications: true,
};

const defaultUserProfile: UserProfile = {
  userName: "",
  userAge: 0,
  userPronouns: "",
  userPrefTime: "",
  interests: [],
  goals: [],
  challenges: [],
  currentMood: "",
  communicationStyle: "",
  motivationalStyle: "",
  conversationCount: 0,
  lastChatDate: "",
  relationshipLevel: "new",
};

// Response templates
const responses: Record<string, Record<string, string[]>> = {
  supportive: {
    greeting: [
      "Hello! I'm here to support you today. How are you feeling?",
      "Hi there! It's wonderful to see you. What's on your mind?",
      "Welcome back! I'm glad you're here. How can I help you today?",
    ],
    encouragement: [
      "You're doing better than you think. Every step forward matters.",
      "I believe in your strength and resilience. You've got this!",
      "Remember, progress isn't always visible, but it's always happening.",
    ],
    affirmation: [
      "You are capable of amazing things.",
      "Your feelings are valid and important.",
      "You deserve kindness, especially from yourself.",
    ],
    general: [
      "Thank you for sharing that with me. I'm here to listen and support you.",
      "I appreciate you opening up to me. How does that make you feel?",
      "That's interesting. Tell me more about that.",
    ],
  },
  energetic: {
    greeting: [
      "Hey there! Ready to make today amazing?",
      "Hello superstar! What exciting things are happening today?",
      "Hi! I'm pumped to chat with you! Let's make magic happen!",
    ],
    encouragement: [
      "You're absolutely crushing it! Keep that momentum going!",
      "YES! That's the spirit! You're unstoppable!",
      "I'm so excited about your potential!",
    ],
    general: [
      "That's awesome! I love your energy! Tell me more!",
      "Fantastic! You're bringing such great vibes today!",
      "I'm totally here for this conversation!",
    ],
  },
  wise: {
    greeting: [
      "Greetings. I sense you seek guidance today.",
      "Welcome, traveler. What wisdom do you seek?",
      "Hello. Life has brought you here for a reason.",
    ],
    encouragement: [
      "Patience, young one. Great things take time to unfold.",
      "The strongest trees grow slowly but stand for centuries.",
      "Your struggles today become your strengths tomorrow.",
    ],
    general: [
      "Wisdom comes through reflection. What do you think this means?",
      "Every experience teaches us something. What lesson do you see here?",
      "The path forward often requires looking within first.",
    ],
  },
};

// Main Chat Component
export const AIChatManager: React.FC = () => {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showToast, setShowToast] = useState("");
  const [appSettings, setAppSettings] =
    useState<AppSettings>(defaultAppSettings);
  const [userProfile, setUserProfile] =
    useState<UserProfile>(defaultUserProfile);
  const [isRecording, setIsRecording] = useState(false);
  const [hasWelcomeBeenSent, setHasWelcomeBeenSent] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Refs
  const contentRef = useRef<HTMLIonContentElement>(null);
  const welcomeSentRef = useRef(false);

  // Initialize
  useEffect(() => {
    const initialize = async () => {
      await loadAppSettings();
      await loadUserProfile();

      // Use ref to prevent duplicate welcome messages in strict mode
      if (!welcomeSentRef.current) {
        welcomeSentRef.current = true;
        setTimeout(() => {
          sendWelcomeMessage();
        }, 500);
      }
    };

    initialize();
    initializeSpeechRecognition();
    requestNotificationPermission();
  }, []);

  // Initialize Speech Recognition
  const initializeSpeechRecognition = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsRecording(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setShowToast("Speech recognition error: " + event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ("Notification" in window && appSettings.enableNotifications) {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    }
  };

  // Send notification
  const sendNotification = (title: string, body: string) => {
    if (
      "Notification" in window &&
      Notification.permission === "granted" &&
      appSettings.enableNotifications &&
      document.hidden
    ) {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
      });
    }
  };

  // Storage functions
  const loadAppSettings = async () => {
    try {
      const { value } = await Preferences.get({ key: "chat_settings" });
      if (value) {
        const savedSettings = JSON.parse(value);
        setAppSettings({ ...defaultAppSettings, ...savedSettings });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const { value } = await Preferences.get({ key: "user_profile" });
      if (value) {
        const profile = JSON.parse(value);
        setUserProfile({ ...defaultUserProfile, ...profile });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  useIonViewWillEnter(() => {
    loadAppSettings();
    loadUserProfile();
  });

  // Message handling
  const addMessage = (
    content: string,
    isFromUser: boolean,
    messageType: string = "text"
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isFromUser,
      timestamp: new Date(),
      messageType,
    };

    setMessages((prev) => {
      const updated = [...prev, newMessage];
      if (updated.length > appSettings.maxChatHistory) {
        return updated.slice(-appSettings.maxChatHistory);
      }
      return updated;
    });

    // Send notification for AI responses if app is not visible
    if (!isFromUser && document.hidden) {
      sendNotification(appSettings.aiName, content);
    }

    // Scroll to bottom
    setTimeout(() => {
      contentRef.current?.scrollToBottom(300);
    }, 100);

    return newMessage;
  };

  const sendUserMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userInput = inputMessage.trim();
    setInputMessage("");

    // Add user message
    addMessage(userInput, true);

    // Update user profile
    await updateUserProfile(userInput);

    // Generate AI response
    await processUserMessage(userInput);
  };

  const processUserMessage = async (userInput: string) => {
    setIsTyping(true);

    try {
      let aiResponse = "";

      // Always use OpenAI with hardcoded API key for commercial use
      aiResponse = await callOpenAI(userInput);

      if (!aiResponse) {
        aiResponse = generateLocalAIResponse(userInput);
      }

      if (appSettings.enableTypingAnimation) {
        await new Promise((resolve) =>
          setTimeout(resolve, appSettings.responseDelay)
        );
      }

      const messageType = determineMessageType(aiResponse);

      if (appSettings.enableTypingAnimation) {
        await typeMessage(aiResponse, messageType);
      } else {
        addMessage(aiResponse, false, messageType);
      }
    } catch (error) {
      console.error("Error processing user message:", error);
      addMessage(
        "I'm sorry, I encountered an error. Please try again.",
        false,
        "system"
      );
    } finally {
      setIsTyping(false);
    }
  };

  const typeMessage = async (message: string, messageType: string) => {
    const words = message.split(" ");
    let typedMessage = "";

    for (let i = 0; i < words.length; i++) {
      typedMessage += (i > 0 ? " " : "") + words[i];

      setMessages((prev) => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];

        if (
          !lastMessage?.isFromUser &&
          lastMessage?.content.startsWith(typedMessage.split(" ")[0])
        ) {
          updated[updated.length - 1] = {
            ...lastMessage,
            content: typedMessage,
            messageType,
          };
        } else {
          updated.push({
            id: Date.now().toString(),
            content: typedMessage,
            isFromUser: false,
            timestamp: new Date(),
            messageType,
          });
        }

        return updated;
      });

      await new Promise((resolve) =>
        setTimeout(resolve, appSettings.typingSpeed)
      );
    }

    setTimeout(() => {
      contentRef.current?.scrollToBottom(300);
    }, 100);
  };

  // AI Response Generation
  const generateLocalAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    const context = analyzeInputContext(input);
    const personalityResponses =
      responses[appSettings.personality] || responses.supportive;
    const contextResponses =
      personalityResponses[context] || personalityResponses.general || [];

    let response =
      contextResponses[Math.floor(Math.random() * contextResponses.length)] ||
      "Thank you for sharing that with me.";

    if (userProfile.userName) {
      response = response.replace("{name}", userProfile.userName);
    }

    if (appSettings.enableEmojis) {
      response = addContextualEmojis(response, context);
    }

    return response;
  };

  const analyzeInputContext = (input: string): string => {
    if (
      containsAny(input, [
        "hello",
        "hi",
        "hey",
        "good morning",
        "good afternoon",
      ])
    )
      return "greeting";
    if (containsAny(input, ["sad", "depressed", "down", "upset", "crying"]))
      return "sadness";
    if (containsAny(input, ["happy", "excited", "great", "awesome", "amazing"]))
      return "happiness";
    if (containsAny(input, ["anxious", "worried", "stressed", "nervous"]))
      return "anxiety";
    if (containsAny(input, ["help", "advice", "what should i", "how do i"]))
      return "help";
    if (input.includes("?")) return "question";
    if (
      containsAny(input, ["affirmation", "encourage", "motivate", "positive"])
    )
      return "affirmation";
    if (containsAny(input, ["goal", "dream", "want to", "hope to", "aspire"]))
      return "goals";
    return "general";
  };

  const containsAny = (text: string, keywords: string[]): boolean => {
    return keywords.some((keyword) => text.includes(keyword));
  };

  const addContextualEmojis = (response: string, context: string): string => {
    const emojiMap: Record<string, string> = {
      greeting: " 😊",
      affirmation: " ✨",
      happiness: " 🌟",
      encouragement: " 💪",
    };
    return response + (emojiMap[context] || "");
  };

  const determineMessageType = (response: string): string => {
    const lower = response.toLowerCase();
    if (
      containsAny(lower, [
        "you are",
        "you can",
        "you deserve",
        "you're capable",
      ])
    )
      return "affirmation";
    if (response.includes("?")) return "question";
    return "text";
  };

  // OpenAI Integration with personality applied
  const callOpenAI = async (userMessage: string): Promise<string> => {
    //AI key should be set in environment variables or secure storage
    const OPENAI_API_KEY = atob("c2stcHJvai1kZ1gyN0thZHp0RnlGN3VFemc4SFZuYjVYejJtd01hU1JUQ3c4bmp2cmNFR1hhSG5iaGJ6Z0tHaXRBR2ZSZTZ6M0hYNmlRSEN5blQzQmxia0ZKczRVMHNTc19fMG81RDJmQjZoVUZERktPUU5WRlVkcUpZak5kcGJveFJzd3VsUWxpQlE2VVo5N0NPNWNpa1NBem11dVdMUkJxa0E=");

    console.log("Calling OpenAI API...");

    try {
      const systemPrompt = generateSystemPrompt();
      const conversationHistory = buildConversationHistory();

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: systemPrompt },
              ...conversationHistory,
              { role: "user", content: userMessage },
            ],
            max_tokens: 150,
            temperature: 0.7,
          }),
        }
      );

      console.log("OpenAI Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("OpenAI API Error:", response.status, errorData);

        if (response.status === 401) {
          console.error("Invalid API key configured");
        } else if (response.status === 429) {
          console.error("OpenAI rate limit exceeded");
        } else if (response.status === 403) {
          console.error("OpenAI access denied");
        }

        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("OpenAI response received successfully");

      const content = data.choices?.[0]?.message?.content?.trim();
      if (content) {
        return content;
      } else {
        console.warn("Empty response from OpenAI");
        return "";
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      return "";
    }
  };

  const generateSystemPrompt = (): string => {
    const personalityDescriptions: Record<string, string> = {
      supportive:
        "You are a supportive and caring AI companion. You listen with empathy, offer encouragement, and help users feel understood and valued. Use a warm, gentle tone.",
      energetic:
        "You are an energetic and enthusiastic AI companion. You're upbeat, motivational, and help users feel excited about their potential. Use an exciting, high-energy tone with lots of enthusiasm.",
      wise: "You are a wise and thoughtful AI companion. You offer deep insights, encourage reflection, and help users find their own answers. Use a calm, thoughtful tone with philosophical depth.",
    };

    let prompt =
      personalityDescriptions[appSettings.personality] ||
      personalityDescriptions.supportive;
    prompt += ` Your name is ${appSettings.aiName}. Keep responses concise (1-3 sentences). Be genuine and authentic.`;

    // Apply personality-specific instructions
    if (appSettings.personality === "supportive") {
      prompt +=
        " Focus on emotional support, validation, and gentle encouragement.";
    } else if (appSettings.personality === "energetic") {
      prompt +=
        " Be upbeat, use exclamation points, and help motivate the user with high energy.";
    } else if (appSettings.personality === "wise") {
      prompt +=
        " Ask thoughtful questions and encourage deep reflection and self-discovery.";
    }

    if (userProfile.userName) {
      prompt += ` The user's name is ${userProfile.userName}.`;
      if (userProfile.userAge > 0)
        prompt += ` They are ${userProfile.userAge} years old.`;
      if (userProfile.userPronouns)
        prompt += ` Their pronouns are ${userProfile.userPronouns}.`;
    }

    // Add MBTI personality type if available
    // Note: generateSystemPrompt cannot be async, so useEffect or load MBTI elsewhere if needed
    // This code will NOT work as-is because generateSystemPrompt is not async.
    // You must load MBTI into userProfile or appSettings in advance, then use it here synchronously.
    if ((userProfile as any).MBTI) {
      prompt += ` The user has an MBTI personality type of ${(userProfile as any).MBTI}.`;
    }

    prompt += ` Your relationship level is: ${userProfile.relationshipLevel}.`;
    if (userProfile.conversationCount > 0) {
      prompt += ` You've had ${userProfile.conversationCount} conversations together.`;
    }

    if (userProfile.interests.length > 0) {
      prompt += ` Their interests: ${userProfile.interests.join(", ")}.`;
    }
    if (userProfile.goals.length > 0) {
      prompt += ` Current goals: ${userProfile.goals.slice(0, 3).join("; ")}.`;
    }
    if (userProfile.currentMood) {
      prompt += ` Current mood: ${userProfile.currentMood}.`;
    }

    // Apply communication and motivational styles
    if (userProfile.communicationStyle) {
      prompt += ` Communicate in a ${userProfile.communicationStyle} style.`;
    }
    if (userProfile.motivationalStyle) {
      prompt += ` Use ${userProfile.motivationalStyle} motivational approach.`;
    }

    return prompt;
  };

  const buildConversationHistory = () => {
    return messages.slice(-10).map((msg) => ({
      role: msg.isFromUser ? "user" : "assistant",
      content: msg.content,
    }));
  };

  // User Profile Updates
  const updateUserProfile = async (input: string) => {
    const updates: Partial<UserProfile> = {
      conversationCount: userProfile.conversationCount + 1,
      lastChatDate: new Date().toISOString(),
    };

    const lowerInput = input.toLowerCase();

    // Extract interests only if explicitly mentioned
    if (
      containsAny(lowerInput, [
        "i love",
        "i enjoy",
        "i like",
        "i'm into",
        "i'm passionate about",
      ])
    ) {
      const interests = extractInterests(lowerInput);
      if (interests.length > 0) {
        updates.interests = [
          ...new Set([...userProfile.interests, ...interests]),
        ];
      }
    }

    // Extract mood
    if (
      containsAny(lowerInput, [
        "feeling good",
        "great day",
        "happy",
        "excited",
        "amazing",
      ])
    ) {
      updates.currentMood = "positive";
    } else if (
      containsAny(lowerInput, ["tired", "exhausted", "drained", "worn out"])
    ) {
      updates.currentMood = "tired";
    } else if (
      containsAny(lowerInput, ["anxious", "worried", "stressed", "nervous"])
    ) {
      updates.currentMood = "anxious";
    } else if (
      containsAny(lowerInput, ["sad", "down", "upset", "disappointed"])
    ) {
      updates.currentMood = "sad";
    }

    // Update relationship level
    if (userProfile.conversationCount >= 20) {
      updates.relationshipLevel = "close";
    } else if (userProfile.conversationCount >= 5) {
      updates.relationshipLevel = "familiar";
    }

    const updatedProfile = { ...userProfile, ...updates };
    await saveUserProfile(updatedProfile);
  };

  const saveUserProfile = async (profile: UserProfile) => {
    try {
      await Preferences.set({
        key: "user_profile",
        value: JSON.stringify(profile),
      });
      setUserProfile(profile);
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  const extractInterests = (input: string): string[] => {
    const interestKeywords = [
      "music",
      "reading",
      "gaming",
      "sports",
      "art",
      "cooking",
      "travel",
      "movies",
      "books",
      "exercise",
      "yoga",
      "meditation",
      "photography",
      "writing",
      "dancing",
      "singing",
    ];
    return interestKeywords.filter((keyword) => input.includes(keyword));
  };

  // Welcome message - only send once
  const sendWelcomeMessage = () => {
    const timeGreeting = getTimeBasedGreeting();
    const personalTouch = getPersonalizedTouch();

    let welcomeMessage = `${timeGreeting}!`;
    if (userProfile.userName) {
      welcomeMessage += ` ${userProfile.userName}!`;
    }
    welcomeMessage += ` ${personalTouch}`;

    addMessage(welcomeMessage, false);
  };

  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getPersonalizedTouch = (): string => {
    if (userProfile.motivationalStyle === "energetic")
      return "Ready to make today amazing?";
    if (userProfile.motivationalStyle === "gentle")
      return "I'm here to support you.";
    if (userProfile.challenges.length > 0)
      return "I'm here to help you with whatever you're facing.";
    return "I'm glad you're here.";
  };

  // Voice chat functionality
  const toggleRecording = async () => {
    if (!appSettings.enableSpeechToText) {
      setShowToast("Speech-to-text is disabled in settings");
      return;
    }

    if (isRecording) {
      // Stop recording
      if (recognition) {
        recognition.stop();
      }
      setIsRecording(false);
      setShowToast("Recording stopped");
    } else {
      // Start recording
      if (recognition) {
        try {
          recognition.start();
          setIsRecording(true);
          setShowToast("Listening... Speak now");
        } catch (error) {
          console.error("Error starting speech recognition:", error);
          setShowToast("Error starting speech recognition");
        }
      } else {
        setShowToast("Speech recognition not supported in this browser");
      }
    }
  };
  // Handle tab/window close to save state and stop recording
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRecording && recognition) {
        recognition.stop();
      }
      // Optionally save messages or user profile here if needed
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (isRecording && recognition) {
        recognition.stop();
      }
    };
  }, [isRecording, recognition]);
  // Get personality color
  const getPersonalityColor = () => {
    switch (appSettings.personality) {
      case "supportive":
        return "#10b981";
      case "energetic":
        return "#f59e0b";
      case "wise":
        return "#8b5cf6";
      default:
        return "#667eea";
    }
  };

  // Get relationship badge
  const getRelationshipBadge = () => {
    const badges = {
      new: { text: "New Friend", color: "#6b7280", icon: person },
      familiar: { text: "Good Friend", color: "#3b82f6", icon: happy },
      close: { text: "Best Friend", color: "#10b981", icon: heart },
    };
    return (
      badges[userProfile.relationshipLevel as keyof typeof badges] || badges.new
    );
  };

  // Render message
  const renderMessage = (message: ChatMessage) => {
    return (
      <div key={message.id} style={getMessageStyle(message)}>
        <div style={getMessageContentStyle(message)}>
          <IonText>{message.content}</IonText>
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#94a3b8",
            marginTop: "8px",
            textAlign: message.isFromUser ? "right" : "left",
            display: "flex",
            alignItems: "center",
            justifyContent: message.isFromUser ? "flex-end" : "flex-start",
            gap: "4px",
          }}
        >
          <IonIcon icon={time} style={{ fontSize: "12px" }} />
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    );
  };

  const getMessageStyle = (message: ChatMessage) => {
    return {
      marginBottom: "20px",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: message.isFromUser ? "flex-end" : "flex-start",
      maxWidth: "100%",
    };
  };

  const getMessageContentStyle = (message: ChatMessage) => {
    const baseStyle = {
      maxWidth: "85%",
      padding: "16px 20px",
      borderRadius: "24px",
      wordWrap: "break-word" as const,
      lineHeight: "1.6",
      fontSize: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      position: "relative" as const,
    };

    if (message.isFromUser) {
      return {
        ...baseStyle,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        borderBottomRightRadius: "8px",
        marginLeft: "auto",
        boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
      };
    } else {
      let background =
        "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)";
      let color = "#2d3748";
      let borderColor = "rgba(226, 232, 240, 0.8)";

      // Different colors for different message types
      if (message.messageType === "affirmation") {
        background =
          "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)";
        color = "#8b5cf6";
        borderColor = "rgba(139, 92, 246, 0.2)";
      } else if (message.messageType === "question") {
        background =
          "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)";
        color = "#059669";
        borderColor = "rgba(16, 185, 129, 0.2)";
      }

      return {
        ...baseStyle,
        background,
        color,
        borderBottomLeftRadius: "8px",
        border: `1px solid ${borderColor}`,
        boxShadow: "0 4px 20px rgba(102, 126, 234, 0.1)",
      };
    }
  };

  return (
    <IonPage
      style={{
        "--background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "--color": "#2d3748",
      }}
    >
      <IonHeader
        style={{
          "--background": "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
        }}
      >
        <IonToolbar
          style={{ "--background": "transparent", "--color": "#2d3748" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 16px",
            }}
          >
            <IonAvatar
              style={{
                width: "40px",
                height: "40px",
                background: `linear-gradient(135deg, ${getPersonalityColor()} 0%, #667eea 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IonIcon
                icon={sparkles}
                style={{
                  fontSize: "20px",
                  color: "white",
                }}
              />
            </IonAvatar>

            <div style={{ flex: 1 }}>
              <IonTitle
                style={{
                  color: colors.titleColor,
                  fontWeight: "600",
                  fontSize: "20px",
                  padding: 0,
                  margin: 0,
                }}
              >
                {appSettings.aiName}
              </IonTitle>
              <div
                style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}
              >
              </div>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent
        ref={contentRef}
        style={{
          "--background":
            "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #ddd6fe 100%)",
          "--padding-top": "20px",
        }}
      >
        {/* User Profile Info */}
        {userProfile.userName && (
          <div
            style={{
              padding: "12px 20px",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <IonChip
              style={{
                "--background": "rgba(255, 255, 255, 0.9)",
                "--color": "#374151",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                borderRadius: "20px",
                padding: "8px 16px",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                backdropFilter: "blur(20px)",
              }}
            >
              <IonIcon
                icon={person}
                style={{ marginRight: "6px", color: "#667eea" }}
              />
              <IonLabel style={{ fontWeight: "500" }}>
                {userProfile.userName}
              </IonLabel>
            </IonChip>

            {userProfile.currentMood && (
              <IonChip
                style={{
                  "--background": "rgba(255, 255, 255, 0.9)",
                  "--color": "#8b5cf6",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                  borderRadius: "20px",
                  padding: "8px 16px",
                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <IonIcon icon={heart} style={{ marginRight: "6px" }} />
                <IonLabel style={{ fontWeight: "500" }}>
                  {userProfile.currentMood}
                </IonLabel>
              </IonChip>
            )}

            {userProfile.relationshipLevel !== "new" && (
              <IonChip
                style={{
                  "--background": "rgba(255, 255, 255, 0.9)",
                  "--color": getRelationshipBadge().color,
                  border: `1px solid ${getRelationshipBadge().color}40`,
                  borderRadius: "20px",
                  padding: "8px 16px",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <IonIcon
                  icon={getRelationshipBadge().icon}
                  style={{ marginRight: "6px" }}
                />
                <IonLabel style={{ fontWeight: "500" }}>
                  {getRelationshipBadge().text}
                </IonLabel>
              </IonChip>
            )}
          </div>
        )}

        {/* Messages */}
        <div
          style={{
            padding: "0 20px",
            paddingBottom: "140px",
            maxWidth: "800px",
            margin: "0 auto",
            minHeight: "calc(100vh - 200px)",
          }}
        >
          {messages.map(renderMessage)}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={getMessageStyle({ isFromUser: false } as ChatMessage)}>
              <div
                style={{
                  ...getMessageContentStyle({
                    isFromUser: false,
                    messageType: "text",
                  } as ChatMessage),
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  minHeight: "56px",
                }}
              >
                <IonAvatar
                  style={{
                    width: "32px",
                    height: "32px",
                    background: `linear-gradient(135deg, ${getPersonalityColor()} 0%, #667eea 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IonIcon
                    icon={sparkles}
                    style={{
                      fontSize: "16px",
                      color: "white",
                    }}
                  />
                </IonAvatar>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <IonSpinner
                    name="dots"
                    style={{
                      "--color": getPersonalityColor(),
                      width: "24px",
                      height: "24px",
                    }}
                  />
                  <IonText
                    style={{
                      color: getPersonalityColor(),
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {appSettings.aiName} is thinking...
                  </IonText>
                </div>
              </div>
            </div>
          )}
        </div>
      </IonContent>

      {/* Enhanced Input Area */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(30px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.8)",
          padding: "20px",
          zIndex: 1000,
          boxShadow: "0 -8px 32px rgba(102, 126, 234, 0.15)",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <IonItem
            style={{
              "--border-radius": "28px",
              "--background": "rgba(248, 250, 252, 0.95)",
              "--color": "#2d3748",
              border: "2px solid rgba(255, 255, 255, 0.8)",
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
              "--padding-start": "20px",
              "--padding-end": "12px",
              "--min-height": "56px",
              backdropFilter: "blur(20px)",
            }}
          >
            <IonTextarea
              value={inputMessage}
              onIonInput={(e) => setInputMessage(e.detail.value!)}
              placeholder="Share what's on your mind..."
              autoGrow
              rows={1}
              maxlength={500}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendUserMessage();
                }
              }}
              style={{
                "--color": "#2d3748",
                "--placeholder-color": "#94a3b8",
                fontSize: "16px",
                lineHeight: "1.5",
                padding: "8px 0",
              }}
            />

            {appSettings.enableSpeechToText && (
              <IonButton
                fill="clear"
                onClick={toggleRecording}
                style={{
                  "--color": isRecording ? "#ef4444" : getPersonalityColor(),
                  margin: "0 8px",
                  "--border-radius": "50%",
                  width: "44px",
                  height: "44px",
                  "--background": isRecording
                    ? "rgba(239, 68, 68, 0.1)"
                    : `${getPersonalityColor()}20`,
                }}
              >
                <IonIcon
                  icon={isRecording ? micOff : mic}
                  style={{ fontSize: "20px" }}
                />
              </IonButton>
            )}

            <IonButton
              onClick={sendUserMessage}
              disabled={!inputMessage.trim() || isTyping}
              style={{
                "--background":
                  inputMessage.trim() && !isTyping
                    ? `linear-gradient(135deg, ${getPersonalityColor()} 0%, #667eea 100%)`
                    : "rgba(148, 163, 184, 0.3)",
                "--color":
                  inputMessage.trim() && !isTyping ? "white" : "#94a3b8",
                "--border-radius": "50%",
                width: "44px",
                height: "44px",
                margin: "0",
                transition: "all 0.3s ease",
                boxShadow:
                  inputMessage.trim() && !isTyping
                    ? `0 4px 16px ${getPersonalityColor()}40`
                    : "none",
              }}
            >
              <IonIcon icon={send} style={{ fontSize: "20px" }} />
            </IonButton>
          </IonItem>
        </div>
      </div>

      {/* Toast */}
      <IonToast
        isOpen={!!showToast}
        message={showToast}
        duration={2000}
        onDidDismiss={() => setShowToast("")}
        style={{
          "--background": "rgba(45, 55, 72, 0.95)",
          "--color": "white",
          "--border-radius": "12px",
        }}
      />
    </IonPage>
  );
};