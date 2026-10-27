import { Person, Expense, ExpenseCategory, PaymentMethod } from '../types';

export const COLOR_PALETTE = [
  { name: 'Emerald', hex: '#059669', bgLight: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  { name: 'Indigo', hex: '#4f46e5', bgLight: '#eef2ff', text: '#3730a3', border: '#c7d2fe' },
  { name: 'Amber', hex: '#d97706', bgLight: '#fffbeb', text: '#92400e', border: '#fde68a' },
  { name: 'Rose', hex: '#e11d48', bgLight: '#fff1f2', text: '#9f1239', border: '#fecdd3' },
  { name: 'Cyan', hex: '#0891b2', bgLight: '#ecfeff', text: '#155e75', border: '#a5f3fc' },
  { name: 'Violet', hex: '#7c3aed', bgLight: '#f5f3ff', text: '#5b21b6', border: '#ddd6fe' },
  { name: 'Orange', hex: '#ea580c', bgLight: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
  { name: 'Teal', hex: '#0d9488', bgLight: '#f0fdfa', text: '#115e59', border: '#99f6e4' },
  { name: 'Blue', hex: '#2563eb', bgLight: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  { name: 'Fuchsia', hex: '#c026d3', bgLight: '#fdf4ff', text: '#86198f', border: '#f5d0fe' },
];

export const AVATAR_OPTIONS = [
  '👨‍💻', '🧑‍💼', '👩‍🌾', '🧑‍🍳', '👩‍⚕️', '👨‍🎓', 
  '👩‍🏫', '👵', '👴', '👶', '🧑‍🎨', '🏃‍♂️', 
  '🏡', '⭐', '☕', '🛒', '⚡', '🚗', 
  '🌸', '🌻', '🐶', '🐱', '✨', '💼'
];

export const CATEGORIES_CONFIG: Record<
  ExpenseCategory,
  { icon: string; color: string; bgColor: string }
> = {
  'Groceries': { icon: '🛒', color: '#059669', bgColor: '#ecfdf5' },
  'Vegetables & Fruits': { icon: '🥦', color: '#16a34a', bgColor: '#f0fdf4' },
  'Utilities & Bills': { icon: '💡', color: '#d97706', bgColor: '#fffbeb' },
  'Rent & Housing': { icon: '🏠', color: '#4f46e5', bgColor: '#eef2ff' },
  'Dining & Snacks': { icon: '🍲', color: '#ea580c', bgColor: '#fff7ed' },
  'Transport & Fuel': { icon: '🛵', color: '#0891b2', bgColor: '#ecfeff' },
  'Healthcare & Medical': { icon: '💊', color: '#e11d48', bgColor: '#fff1f2' },
  'Household & Repair': { icon: '🔧', color: '#64748b', bgColor: '#f1f5f9' },
  'Education & Books': { icon: '📚', color: '#7c3aed', bgColor: '#f5f3ff' },
  'Personal Care & Shopping': { icon: '🛍️', color: '#db2777', bgColor: '#fdf2f8' },
  'Other': { icon: '📦', color: '#6b7280', bgColor: '#f3f4f6' },
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'Mobile Banking / QR / UPI',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
];

export const DEFAULT_PEOPLE: Person[] = [
  {
    id: 'person-aaraj-1',
    name: 'Aaraj',
    avatar: '👨‍💻',
    color: '#059669', // Emerald
    isArchived: false,
    createdAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'person-saroj-2',
    name: 'Saroj',
    avatar: '🧑‍💼',
    color: '#4f46e5', // Indigo
    isArchived: false,
    createdAt: '2026-10-01T08:05:00.000Z',
  },
  {
    id: 'person-asha-3',
    name: 'Asha',
    avatar: '👩‍🌾',
    color: '#d97706', // Amber
    isArchived: false,
    createdAt: '2026-10-01T08:10:00.000Z',
  },
];

export const DEFAULT_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'Supermarket Monthly Rice, Dal & Cooking Oil',
    amount: 4850,
    category: 'Groceries',
    date: '2026-10-24',
    personId: 'person-aaraj-1',
    paymentMethod: 'Mobile Banking / QR / UPI',
    notes: 'Bought from Bhatbhateni supermarket',
    createdAt: '2026-10-24T10:15:00.000Z',
  },
  {
    id: 'exp-2',
    title: 'Electricity & 4x Drinking Water Cans',
    amount: 1650,
    category: 'Utilities & Bills',
    date: '2026-10-22',
    personId: 'person-saroj-2',
    paymentMethod: 'Mobile Banking / QR / UPI',
    notes: 'Electricity bill paid online via mobile app',
    createdAt: '2026-10-22T14:30:00.000Z',
  },
  {
    id: 'exp-3',
    title: 'Fresh Vegetables & Seasonal Fruits',
    amount: 920,
    category: 'Vegetables & Fruits',
    date: '2026-10-25',
    personId: 'person-asha-3',
    paymentMethod: 'Cash',
    notes: 'Potatoes, tomatoes, spinach, apples from local mandi',
    createdAt: '2026-10-25T09:00:00.000Z',
  },
  {
    id: 'exp-4',
    title: 'High-Speed Home Fiber Internet Bill',
    amount: 1450,
    category: 'Utilities & Bills',
    date: '2026-10-18',
    personId: 'person-aaraj-1',
    paymentMethod: 'Credit Card',
    notes: 'Monthly 200Mbps unlimited home connection',
    createdAt: '2026-10-18T11:00:00.000Z',
  },
  {
    id: 'exp-5',
    title: 'LPG Gas Cylinder Refill',
    amount: 1900,
    category: 'Household & Repair',
    date: '2026-10-15',
    personId: 'person-saroj-2',
    paymentMethod: 'Cash',
    notes: 'Kitchen cooking gas delivered',
    createdAt: '2026-10-15T16:20:00.000Z',
  },
  {
    id: 'exp-6',
    title: 'Monthly Milk, Curd & Paneer Supply',
    amount: 1200,
    category: 'Groceries',
    date: '2026-10-26',
    personId: 'person-asha-3',
    paymentMethod: 'Cash',
    notes: 'Daily dairy coupon settlement',
    createdAt: '2026-10-26T07:45:00.000Z',
  },
  {
    id: 'exp-7',
    title: 'Family Festive Dinner & Sweets',
    amount: 2100,
    category: 'Dining & Snacks',
    date: '2026-10-20',
    personId: 'person-aaraj-1',
    paymentMethod: 'Mobile Banking / QR / UPI',
    notes: 'Mithai box & family dinner',
    createdAt: '2026-10-20T20:10:00.000Z',
  },
];
