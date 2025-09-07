import React from 'react';
import { AIChatManager } from '../components/AIChatManager';
import '../styles/AIChatManager.css';
import type { User } from '@supabase/supabase-js';

interface Tab1Props {
  user?: User;
  onLogout: () => void;
}

const Tab1: React.FC<Tab1Props> = ({ user, onLogout }) => {
  return <AIChatManager />;
};

export default Tab1;