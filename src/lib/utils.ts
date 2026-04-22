import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number) {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)} tỷ`;
  }
  return `${amount} triệu`;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('vi-VN');
}
