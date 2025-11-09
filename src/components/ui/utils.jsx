import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to combine class names.
 * - clsx handles conditional and dynamic classes.
 * - twMerge intelligently merges Tailwind classes to avoid conflicts.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
