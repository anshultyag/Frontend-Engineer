export interface UseAutoLogoutOptions {
  timeoutMinutes?: number;
  warningSeconds?: number;
  onLogout: () => void;
}
