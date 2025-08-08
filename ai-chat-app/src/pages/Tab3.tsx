import React from 'react';
import SettingsPage from '../components/SettingsPage';
import type { User } from '@supabase/supabase-js';

interface Tab3Props {
  user: User;
  onLogout: () => void;
}

const Tab3: React.FC<Tab3Props> = ({ user, onLogout }) => {
  return <SettingsPage />;
};

export default Tab3;