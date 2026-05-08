import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Day names in Romanian
export const dayNamesRo = [
  'Duminica',
  'Luni',
  'Marti',
  'Miercuri',
  'Joi',
  'Vineri',
  'Sambata',
];

// Age group labels in Romanian
export const ageGroupLabelsRo: Record<string, string> = {
  kids: 'Copii',
  adults: 'Adulti',
  all: 'Toti',
};

// Generate dynamic class name from day_of_week and target_age_group
export function getClassName(dayOfWeek: number, targetAgeGroup: string): string {
  const day = dayNamesRo[dayOfWeek] || `Ziua ${dayOfWeek}`;
  const ageGroup = ageGroupLabelsRo[targetAgeGroup] || targetAgeGroup;
  return `${day} - ${ageGroup}`;
}

// Format time (remove seconds if present)
export function formatTime(time: string): string {
  return time.slice(0, 5);
}

// Get day name from day number
export function getDayName(dayOfWeek: number): string {
  return dayNamesRo[dayOfWeek] || `Ziua ${dayOfWeek}`;
}
