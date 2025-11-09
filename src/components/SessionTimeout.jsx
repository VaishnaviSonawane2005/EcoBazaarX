import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Clock } from 'lucide-react';

// Warning appears 2 minutes before session expires
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 2 * 60 * 1000; // 2 minutes before expiry
const CHECK_INTERVAL = 30 * 1000; // Check every 30 seconds

export default function SessionTimeout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!user) return;

    const checkSession = setInterval(() => {
      const lastActivityTime = parseInt(localStorage.getItem('lastActivity') || Date.now().toString());
      const currentTime = Date.now();
      const timeSinceActivity = currentTime - lastActivityTime;
      const remainingTime = SESSION_TIMEOUT - timeSinceActivity;

      if (remainingTime <= WARNING_TIME && remainingTime > 0) {
        setTimeLeft(Math.floor(remainingTime / 1000));
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, CHECK_INTERVAL);

    return () => clearInterval(checkSession);
  }, [user]);

  const handleContinue = () => {
    // Reset activity time
    localStorage.setItem('lastActivity', Date.now().toString());
    setShowWarning(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowWarning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-100 rounded-full">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <AlertDialogTitle>Session Expiring Soon</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            Your session will expire in <span className="font-semibold text-amber-600">{formatTime(timeLeft)}</span> due to inactivity.
            <br /><br />
            Would you like to continue your session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleLogout}>
            Logout
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleContinue}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Continue Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
