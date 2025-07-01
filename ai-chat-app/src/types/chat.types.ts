export interface ChatMessage {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
  messageType: MessageType;
}

export enum MessageType {
  Text = 'text',
  Affirmation = 'affirmation',
  Question = 'question',
  System = 'system'
}

export enum AIPersonality {
  Supportive = 'supportive',
  Energetic = 'energetic',
  Wise = 'wise',
  Playful = 'playful',
  Professional = 'professional'
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

export interface ChatSettings {
  aiName: string;
  personality: AIPersonality;
  typingSpeed: number;
  responseDelay: number;
  useOpenAI: boolean;
  openAIApiKey: string;
  openAIModel: string;
  maxTokens: number;
  temperature: number;
  enableSpeechToText: boolean;
  maxChatHistory: number;
  enableEmojis: boolean;
  enableTypingAnimation: boolean;
}