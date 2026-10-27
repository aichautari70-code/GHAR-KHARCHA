import React, { useState, useEffect } from 'react';
import { Person, Expense, ExpenseCategory, PaymentMethod } from '../types';
import { CATEGORIES_CONFIG, PAYMENT_METHODS } from '../data/defaultData';
import { getTodayDateString } from '../utils/formatters';
import { X, Receipt, PlusCircle, Check, Calendar, DollarSign } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: {
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    personId: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => void;
  people: Person[];
  currency: string;
  onQuickAddPerson: () => void;
  initialExpense?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  people,
  currency,
  onQuickAddPerson,
  initialExpense,
}) => {
  const activePeople = people.filter((p) => !p.isArchived);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Groceries');
  const [date, setDate] = useState(getTodayDateString());
  const [personId, setPersonId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialExpense) {
      setTitle(initialExpense.title);
      setAmount(initialExpense.amount.toString());
      setCategory(initialExpense.category);
      setDate(initialExpense.date);
      setPersonId(initialExpense.personId);
      setPaymentMethod(initialExpense.paymentMethod);
      setNotes(initialExpense.notes || '');
      setError('');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Groceries');
      setDate(getTodayDateString());
      // Default to first active person
      if (activePeople.length > 0) {
        setPersonId(activePeople[0].id);
      }
      setPaymentMethod('Cash');
      setNotes('');
      setError('');
    }
  }, [initialExpense, isOpen, people]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please provide a title or item description.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!personId) {
      setError('Please select who paid for this expense.');
      return;
    }

    onSave({
      title: trimmedTitle,
      amount: numAmount,
      category,
      date,
      personId,
      paymentMethod,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  const categoriesList = Object.keys(CATEGORIES_CONFIG) as ExpenseCategory[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {initialExpense ? 'Edit Expense Record' : 'Record Household Expense'}
              </h3>
              <p className="text-xs text-slate-500">
                Record what was purchased and assign the actual payer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          {/* Amount & Date in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Amount ({currency}) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  {currency}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  autoFocus
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-base font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-medium text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Expense Item / Description <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Groceries at Bhatbhateni, Fresh Veggies, Electric bill"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-medium"
            />
          </div>

          {/* Who Paid (Selectable list of registered people) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Paid By (Actual Payer) <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={onQuickAddPerson}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add New Person
              </button>
            </div>

            {/* Bubble selector for people */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activePeople.map((person) => {
                const isSelected = personId === person.id;
                return (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => setPersonId(person.id)}
                    className={`flex items-center gap-2 p-2 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                    style={{
                      borderColor: isSelected ? person.color : '#e2e8f0',
                      backgroundColor: isSelected ? `${person.color}15` : undefined,
                      boxShadow: isSelected ? `0 0 0 1px ${person.color}` : undefined,
                    }}
                  >
                    <span className="text-lg">{person.avatar || '👤'}</span>
                    <span
                      className="text-xs font-bold truncate flex-1"
                      style={{ color: isSelected ? person.color : '#1e293b' }}
                    >
                      {person.name}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" style={{ color: person.color }} />
                    )}
                  </button>
                );
              })}
            </div>
            {activePeople.length === 0 && (
              <p className="text-xs text-rose-500 mt-1">
                No active people found. Please add a household member first.
              </p>
            )}
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto p-1 bg-slate-50/70 rounded-2xl border border-slate-200/80">
              {categoriesList.map((catKey) => {
                const config = CATEGORIES_CONFIG[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-white shadow-xs font-bold text-slate-900 border border-slate-300 ring-1 ring-slate-300'
                        : 'text-slate-600 hover:bg-white/80'
                    }`}
                  >
                    <span>{config.icon}</span>
                    <span className="truncate">{catKey}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Payment Method
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {method}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notes / Receipt Reference <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Paid via eSewa / Bill receipt #4928"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs font-medium"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-sm font-bold text-white shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              {initialExpense ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
