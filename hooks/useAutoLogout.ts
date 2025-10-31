import { useState, useEffect, useCallback, useRef } from 'react';
import { UseAutoLogoutOptions } from '@/models';

export const useAutoLogout = ({
  timeoutMinutes = 10,
  warningSeconds = 60,
  onLogout
}: UseAutoLogoutOptions) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(warningSeconds);
  const lastActivityRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const showWarningRef = useRef<boolean>(false);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    showWarningRef.current = false;
    setShowWarning(false);
    setTimeLeft(warningSeconds);
  }, [warningSeconds]);

  const handleStayLoggedIn = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const handleLogoutNow = useCallback(() => {
    onLogout();
  }, [onLogout]);

  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      const timeoutMs = timeoutMinutes * 60 * 1000;
      const warningMs = warningSeconds * 1000;
      const warningStartMs = timeoutMs - warningMs;

      if (timeSinceLastActivity >= timeoutMs) {
        onLogout();
        return;
      }

      if (timeSinceLastActivity >= warningStartMs) {
        if (!showWarningRef.current) {
          showWarningRef.current = true;
          setShowWarning(true);
        }
        const remainingSeconds = Math.ceil((timeoutMs - timeSinceLastActivity) / 1000);
        setTimeLeft(Math.max(0, remainingSeconds));
      } else {
        if (showWarningRef.current) {
          showWarningRef.current = false;
          setShowWarning(false);
        }
      }
    };

    intervalRef.current = setInterval(checkInactivity, 1000);

    const handleActivity = () => {
      if (showWarningRef.current) {
        return;
      }
      lastActivityRef.current = Date.now();
      resetTimer();
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [timeoutMinutes, warningSeconds, onLogout, showWarning, resetTimer]);

  return {
    showWarning,
    timeLeft,
    handleStayLoggedIn,
    handleLogoutNow
  };
};