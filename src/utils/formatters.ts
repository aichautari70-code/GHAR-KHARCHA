import { Person, Expense, ExpenseCategory, HouseholdSummary } from '../types';

export function formatCurrency(amount: number, symbol: string = 'Rs.'): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);

  return `${symbol} ${formatted}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export function getPerson(people: Person[], personId: string): Person | undefined {
  return people.find((p) => p.id === personId);
}

export function getPersonName(people: Person[], personId: string): string {
  const person = people.find((p) => p.id === personId);
  if (!person) return 'Unknown Member';
  return person.isArchived ? `${person.name} (Archived)` : person.name;
}

export function calculateHouseholdSummary(
  people: Person[],
  expenses: Expense[]
): HouseholdSummary {
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const expenseCount = expenses.length;
  const averageExpense = expenseCount > 0 ? Math.round(totalSpent / expenseCount) : 0;

  // Person breakdown
  const personTotalsMap = new Map<string, { amount: number; count: number }>();
  expenses.forEach((exp) => {
    const existing = personTotalsMap.get(exp.personId) || { amount: 0, count: 0 };
    personTotalsMap.set(exp.personId, {
      amount: existing.amount + exp.amount,
      count: existing.count + 1,
    });
  });

  const personBreakdown = people.map((person) => {
    const stats = personTotalsMap.get(person.id) || { amount: 0, count: 0 };
    return {
      person,
      amount: stats.amount,
      count: stats.count,
      percentage: totalSpent > 0 ? Math.round((stats.amount / totalSpent) * 100) : 0,
    };
  }).sort((a, b) => b.amount - a.amount);

  // Top contributor
  const topContributor =
    personBreakdown.length > 0 && personBreakdown[0].amount > 0
      ? { person: personBreakdown[0].person, amount: personBreakdown[0].amount }
      : { person: null, amount: 0 };

  // Category breakdown
  const categoryMap = new Map<ExpenseCategory, { amount: number; count: number }>();
  expenses.forEach((exp) => {
    const existing = categoryMap.get(exp.category) || { amount: 0, count: 0 };
    categoryMap.set(exp.category, {
      amount: existing.amount + exp.amount,
      count: existing.count + 1,
    });
  });

  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([category, stats]) => ({
      category,
      amount: stats.amount,
      count: stats.count,
      percentage: totalSpent > 0 ? Math.round((stats.amount / totalSpent) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    totalSpent,
    expenseCount,
    averageExpense,
    topContributor,
    personBreakdown,
    categoryBreakdown,
  };
}
