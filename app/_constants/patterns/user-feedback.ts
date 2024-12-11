import { AlertCircle, Bell, Cookie, Loader, LoaderCircle, Loader as ProgressLoader } from "lucide-react";

export const userFeedbackPatterns = [
  {
    title: 'Empty States',
    description: 'Guide users when no content is available',
    icon: AlertCircle
  },
  {
    title: 'Loading Indicator',
    description: 'Show users that content is being loaded',
    icon: Loader
  },
  {
    title: 'Notification',
    description: 'Inform users about important updates',
    icon: Bell
  },
  {
    title: 'Progress Indicator',
    description: 'Show completion status of an operation',
    icon: ProgressLoader
  },
  {
    title: 'Skeleton',
    description: 'Show users that content is being loaded',
    icon: LoaderCircle
  },
  {
    title: 'Cookie Consent',
    description: 'Inform users about the use of cookies',
    icon: Cookie
  }
] as const;
