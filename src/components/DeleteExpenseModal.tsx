import React from 'react';
import { Expense, Person } from '../types';
import { formatCurrency, formatDate, getPersonName } from '../utils/formatters';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expense: Expense | null;
  people: Person[];
  currency: string;
}

export const DeleteExpenseModal: React.FC<DeleteExpenseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  expense,
  people,
  currency,
}) => {
  if (!isOpen || !expense) return null;

  const payerName = getPersonName(people, expense.personId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Expense</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove this record?
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

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {formatDate(expense.date)}
              </span>
              <span className="text-base font-bold text-slate-900">
                {formatCurrency(expense.amount, currency)}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-800">{expense.title}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Paid by: <strong className="text-slate-700">{payerName}</strong></span>
              <span>•</span>
              <span>{expense.category}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            This transaction will be permanently removed from household records and spending summaries.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-sm font-bold text-white shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Delete Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
