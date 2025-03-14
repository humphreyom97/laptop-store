/**
 * @file ErrorMessage.tsx
 * @description A reusable component to display error messages using MUI Alert.
 */

import { Alert } from '@mui/material';
import { JSX } from 'react';

// Define the props interface for ErrorMessage
interface ErrorMessageProps {
  message?: string;
}

/**
 * ErrorMessage component renders an error alert if a message is provided.
 * @param {ErrorMessageProps} props - Component props
 * @returns {JSX.Element | null} The error alert UI or null if no message
 */
function ErrorMessage({ message }: ErrorMessageProps): JSX.Element | null {
  if (!message) return null;
  return <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>;
}

export default ErrorMessage;