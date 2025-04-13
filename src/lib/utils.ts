
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a Date object to a time string (HH:MM format)
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Generate a random avatar URL using DiceBear API
 */
export function getAvatarUrl(userId: string): string {
  return `https://api.dicebear.com/7.x/micah/svg?seed=${userId}`;
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  return name.split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
