export interface Person {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isArchived?: boolean;
  createdAt: string;
}

export type ExpenseCategory =
  | 'Groceries'
  | 'Vegetables & Fruits'
  | 'Utilities & Bills'
  | 'Rent & Housing'
  | 'Dining & Snacks'
  | 'Transport & Fuel'
  | 'Healthcare & Medical'
  | 'Household & Repair'
  | 'Education & Books'
  | 'Personal Care & Shopping'
  | 'Other';

export type PaymentMethod =
  | 'Cash'
  | 'Mobile Banking / QR / UPI'
  | 'Credit Card'
  | 'Debit Card'
  | 'Bank Transfer';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  personId: string; // Reference to Person.id
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface HouseholdSummary {
  totalSpent: number;
  expenseCount: number;
  averageExpense: number;
  topContributor: {
    person: Person | null;
    amount: number;
  };
  personBreakdown: {
    person: Person;
    amount: number;
    count: number;
    percentage: number;
  }[];
  categoryBreakdown: {
    category: ExpenseCategory;
    amount: number;
    count: number;
    percentage: number;
  }[];
}
