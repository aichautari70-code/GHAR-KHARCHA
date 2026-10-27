import React, { useState, useMemo } from 'react';
import { Expense, Person, ExpenseCategory } from '../types';
import { formatCurrency, formatDate, getPerson } from '../utils/formatters';
import { CATEGORIES_CONFIG } from '../data/defaultData';
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Calendar,
  CreditCard,
  Plus,
  FileSpreadsheet,
  X,
  FileText,
} from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  people: Person[];
  currency: string;
  selectedPersonId: string | null;
  onSelectPerson: (id: string | null) => void;
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  people,
  currency,
  selectedPersonId,
  onSelectPerson,
  selectedCategory,
  onSelectCategory,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [monthFilter, setMonthFilter] = useState<string>('all');

  // Unique months available
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((e) => {
      if (e.date) {
        set.add(e.date.substring(0, 7)); // YYYY-MM
      }
    });
    return Array.from(set).sort().reverse();
  }, [expenses]);

  // Filter & sort
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((exp) => {
        // Person filter
        if (selectedPersonId && exp.personId !== selectedPersonId) {
          return false;
        }
        // Category filter
        if (selectedCategory && exp.category !== selectedCategory) {
          return false;
        }
        // Month filter
        if (monthFilter !== 'all' && !exp.date.startsWith(monthFilter)) {
          return false;
        }
        // Search term
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const person = getPerson(people, exp.personId);
          const payerName = person ? person.name.toLowerCase() : '';
          const matchesTitle = exp.title.toLowerCase().includes(term);
          const matchesNotes = exp.notes?.toLowerCase().includes(term) ?? false;
          const matchesCategory = exp.category.toLowerCase().includes(term);
          const matchesPayer = payerName.includes(term);
          const matchesAmount = exp.amount.toString().includes(term);

          if (!matchesTitle && !matchesNotes && !matchesCategory && !matchesPayer && !matchesAmount) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return b.date.localeCompare(a.date);
        if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [expenses, selectedPersonId, selectedCategory, monthFilter, searchTerm, sortBy, people]);

  const activeFilterCount =
    (selectedPersonId ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    (monthFilter !== 'all' ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  const clearAllFilters = () => {
    onSelectPerson(null);
    onSelectCategory(null);
    setMonthFilter('all');
    setSearchTerm('');
  };

  const totalFilteredAmount = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header and Controls */}
      <div className="p-4 md:p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              Expense History
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filteredExpenses.length} Records
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Showing filtered total: <strong className="text-slate-800">{formatCurrency(totalFilteredAmount, currency)}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters ({activeFilterCount})
              </button>
            )}
            <button
              onClick={onAddExpense}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses, notes, payers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* Filter by Month */}
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
          >
            <option value="all">All Months</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {new Date(m + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>

          {/* Filter by Category */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => onSelectCategory(e.target.value ? e.target.value : null)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
          >
            <option value="">All Categories</option>
            {Object.keys(CATEGORIES_CONFIG).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
            >
              <option value="date-desc">Newest Date First</option>
              <option value="date-asc">Oldest Date First</option>
              <option value="amount-desc">Highest Amount First</option>
              <option value="amount-asc">Lowest Amount First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expense Items List */}
      {filteredExpenses.length === 0 ? (
        <div className="py-12 px-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-700">No matching expenses found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {activeFilterCount > 0
              ? 'Try resetting the filters or searching for something else.'
              : 'Start logging your household expenses to see them here.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={onAddExpense}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
            >
              + Add Expense
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredExpenses.map((expense) => {
            const person = getPerson(people, expense.personId);
            const categoryConfig = CATEGORIES_CONFIG[expense.category] || {
              icon: '📦',
              color: '#64748b',
              bgColor: '#f1f5f9',
            };

            const personName = person ? (person.isArchived ? `${person.name} (Archived)` : person.name) : 'Unknown Member';
            const personColor = person ? person.color : '#64748b';
            const personAvatar = person ? person.avatar || '👤' : '👤';

            return (
              <div
                key={expense.id}
                className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                {/* Left info: Icon, Title, Date, Notes */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-xs"
                    style={{
                      backgroundColor: categoryConfig.bgColor,
                      border: `1px solid ${categoryConfig.color}25`,
                    }}
                  >
                    {categoryConfig.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {expense.title}
                      </h4>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {expense.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(expense.date)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        {expense.paymentMethod}
                      </span>
                      {expense.notes && (
                        <>
                          <span>•</span>
                          <span className="italic text-slate-500 truncate max-w-xs">
                            "{expense.notes}"
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Payer Bubble, Amount, Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Payer Rounded Bubble */}
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-2xs transition-all"
                    style={{
                      borderColor: personColor,
                      backgroundColor: `${personColor}12`,
                    }}
                    title={`Paid by ${personName}`}
                  >
                    <span className="text-sm">{personAvatar}</span>
                    <span
                      className="text-xs font-bold leading-none"
                      style={{ color: personColor }}
                    >
                      {personName}
                    </span>
                  </div>

                  {/* Amount Display */}
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900 tracking-tight">
                      {formatCurrency(expense.amount, currency)}
                    </span>
                  </div>

                  {/* Row Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditExpense(expense)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                      title="Edit expense"
                      aria-label="Edit expense"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteExpense(expense)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete expense"
                      aria-label="Delete expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
