import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind classes
 * Matches React-plugin pattern
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

