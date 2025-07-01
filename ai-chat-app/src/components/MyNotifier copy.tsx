import { Preferences } from '@capacitor/preferences';
import React, { useState, useEffect } from 'react';

interface SocialChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const NotificationAutoStart: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState<SocialChallenge | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  const challenges: SocialChallenge[] = [
    {
      id: '1',
      title: 'Compliment a Stranger',
      description: 'Give a genuine compliment to someone you don\'t know well',
      difficulty: 'easy'
    },
    {
      id: '2',
      title: 'Start a Conversation',
      description: 'Initiate a conversation with someone in a waiting area or coffee shop',
      difficulty: 'medium'
    },
    {
      id: '3',
      title: 'Join a New Group',
      description: 'Attend a meetup, class, or social event where you don\'t know anyone',
      difficulty: 'hard'
    },
    {
      id: '4',
      title: 'Ask for Help',
      description: 'Ask someone for directions, recommendations, or assistance',
      difficulty: 'easy'
    },
    {
      id: '5',
      title: 'Make Small Talk',
      description: 'Engage in friendly conversation with a cashier, barista, or service worker',
      difficulty: 'easy'
    },
    {
      id: '6',
      title: 'Invite Someone Out',
      description: 'Ask an acquaintance to grab coffee, lunch, or attend an event together',
      difficulty: 'medium'
    },
    {
      id: '7',
      title: 'Share Something Personal',
      description: 'Open up about a hobby, experience, or opinion with someone',
      difficulty: 'medium'
    },
    {
      id: '8',
      title: 'Volunteer Together',
      description: 'Find and participate in a volunteer activity with others',
      difficulty: 'hard'
    }
  ];

  const getRandomChallenge = (): SocialChallenge => {
    return challenges[Math.floor(Math.random() * challenges.length)];
  };

  const showNotification = (challenge: SocialChallenge) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Weekly Social Challenge! 🤝', {
        body: `${challenge.title}: ${challenge.description}`,
        icon: '🤝',
        badge: '🤝'
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setShowNotificationPrompt(false);
    }
  };

  const handleNewChallenge = () => {
    const challenge = getRandomChallenge();
    setCurrentChallenge(challenge);
    showNotification(challenge);
  };

  const handleCompleteChallenge = () => {
    if (currentChallenge && typeof Preferences !== 'undefined') {
      Preferences.set({
        key: 'lastCompletedChallenge',
        value: JSON.stringify(currentChallenge)
      });
    }
    alert(`Great job completing: ${currentChallenge?.title}! 🎉`);
    setCurrentChallenge(null);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleReopen = () => {
    setIsVisible(true);
    setIsMinimized(false);
  };

  useEffect(() => {
    setIsLoaded(true);
    
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        setShowNotificationPrompt(true);
      }
    }
    
    // Auto-assign a challenge on first load
    const challenge = getRandomChallenge();
    setCurrentChallenge(challenge);
  }, []);

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return { background: '#d4edda', color: '#155724', borderColor: '#c3e6cb' };
      case 'medium':
        return { background: '#fff3cd', color: '#856404', borderColor: '#ffeaa7' };
      case 'hard':
        return { background: '#f8d7da', color: '#721c24', borderColor: '#f5c6cb' };
      default:
        return { background: '#e2e3e5', color: '#383d41', borderColor: '#d6d8db' };
    }
  };

  if (!isLoaded) {
    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        background: 'rgba(248, 249, 250, 0.95)',
        padding: '20px',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ color: '#6c757d' }}>Loading...</div>
      </div>
    );
  }

  // Floating action button when closed
  if (!isVisible) {
    return (
      <>
        <style>{`
          .fab {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 24px;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
            z-index: 10001;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .fab:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
          }
          
          .fab:active {
            transform: scale(0.95);
          }
        `}</style>
        <button onClick={handleReopen} className="fab" title="Open Social Challenge">
          🤝
        </button>
      </>
    );
  }

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          backdrop-filter: blur(5px);
        }
        
        .challenge-modal {
          background: white;
          border-radius: 18px;
          padding: 0;
          max-width: 400px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          animation: modalSlideIn 0.3s ease-out;
          position: relative;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .challenge-modal.minimized {
          position: fixed;
          top: 20px;
          right: 20px;
          max-width: 300px;
          transform: scale(0.9);
          z-index: 10001;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 20px 0 20px;
          border-bottom: 1px solid #e9ecef;
          margin-bottom: 20px;
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }
        
        .modal-controls {
          display: flex;
          gap: 8px;
        }
        
        .control-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        
        .minimize-btn {
          background: #ffc107;
          color: #212529;
        }
        
        .close-btn {
          background: #dc3545;
          color: white;
        }
        
        .control-btn:hover {
          transform: scale(1.1);
        }
        
        .modal-content {
          padding: 0 20px 20px 20px;
        }
        
        .notification-prompt {
          background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
          color: #856404;
          border: 1px solid #ffeaa7;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
          animation: fadeInUp 0.3s ease-out;
        }
        
        .notification-prompt p {
          margin: 0 0 12px 0;
          font-size: 14px;
        }
        
        .current-challenge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 18px;
          padding: 20px;
          margin-bottom: 20px;
          animation: fadeInUp 0.3s ease-out;
        }
        
        .challenge-content h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }
        
        .challenge-content p {
          font-size: 16px;
          margin: 0 0 16px 0;
          line-height: 1.4;
        }
        
        .difficulty-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid;
        }
        
        .no-challenge {
          text-align: center;
          padding: 40px 20px;
          color: #6c757d;
        }
        
        .no-challenge p {
          margin: 0 0 20px 0;
          font-size: 16px;
        }
        
        .button-container {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        
        .btn {
          flex: 1;
          padding: 14px 20px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }
        
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .btn-primary {
          background: #667eea;
          color: white;
        }
        
        .btn-success {
          background: #28a745;
          color: white;
        }
        
        .btn-warning {
          background: #ffc107;
          color: #212529;
        }
        
        .btn-single {
          flex: none;
          padding: 16px 32px;
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (prefers-color-scheme: dark) {
          .challenge-modal {
            background: #2d2d2d;
            color: #ffffff;
          }
          
          .modal-title {
            color: #ffffff;
          }
          
          .no-challenge {
            color: #adb5bd;
          }
          
          .modal-header {
            border-bottom-color: #495057;
          }
        }
        
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 12px;
          }
          
          .challenge-modal {
            max-width: 100%;
          }
          
          .challenge-modal.minimized {
            max-width: 280px;
            top: 10px;
            right: 10px;
          }
        }
      `}</style>
      
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
        <div className={`challenge-modal ${isMinimized ? 'minimized' : ''}`}>
          <div className="modal-header">
            <h2 className="modal-title">Weekly Social Challenge</h2>
            <div className="modal-controls">
              <button
                onClick={handleMinimize}
                className="control-btn minimize-btn"
                title={isMinimized ? "Restore" : "Minimize"}
              >
                {isMinimized ? '□' : '−'}
              </button>
              <button
                onClick={handleClose}
                className="control-btn close-btn"
                title="Close"
              >
                ×
              </button>
            </div>
          </div>
          
          {!isMinimized && (
            <div className="modal-content">
              {showNotificationPrompt && (
                <div className="notification-prompt">
                  <p>🔔 Enable notifications to get weekly challenge reminders!</p>
                  <button
                    onClick={requestNotificationPermission}
                    className="btn btn-warning"
                    style={{ width: '100%' }}
                  >
                    Enable Notifications
                  </button>
                </div>
              )}
              
              {currentChallenge ? (
                <div>
                  <div className="current-challenge">
                    <div className="challenge-content">
                      <h3>{currentChallenge.title}</h3>
                      <p>{currentChallenge.description}</p>
                      <div
                        className="difficulty-badge"
                        style={getDifficultyStyle(currentChallenge.difficulty)}
                      >
                        Difficulty: {currentChallenge.difficulty}
                      </div>
                    </div>
                  </div>
                  
                  <div className="button-container">
                    <button
                      onClick={handleCompleteChallenge}
                      className="btn btn-success"
                    >
                      ✓ Mark Complete
                    </button>
                    <button
                      onClick={handleNewChallenge}
                      className="btn btn-primary"
                    >
                      🔄 New Challenge
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-challenge">
                  <p>🎉 Great job! Ready for your next challenge?</p>
                  <button
                    onClick={handleNewChallenge}
                    className="btn btn-primary btn-single"
                  >
                    Get New Challenge
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationAutoStart;