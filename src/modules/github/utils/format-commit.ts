import { format, formatDistanceToNow } from 'date-fns';

interface FormattedCommitMessage {
  title: string;
  description: string[];
}

export function formatCommitMessage(message: string): FormattedCommitMessage {
  const [title, ...description] = message.split('\n').filter(Boolean);
  return {
    title: title || '',
    description: description || [],
  };
}

export function getRelativeTime(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
}

export function formatCommitDate(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, 'PPpp'); // Example: "Apr 29, 2021, 7:14:24 PM"
} 