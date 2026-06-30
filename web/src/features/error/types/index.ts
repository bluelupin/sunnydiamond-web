export type ErrorPageVariant =
  | "server-unavailable"
  | "deploying"
  | "content-load-failed"
  | "service-unavailable"
  | "unexpected";

export type ErrorPageProps = {
  variant?: ErrorPageVariant;
  headline?: string;
  description?: string;
  errorCode?: string;
  estimatedMinutes?: number;
  onRetry?: () => void;
  autoRetry?: boolean;
  retryIntervalMs?: number;
  showStatusCard?: boolean;
  className?: string;
};
