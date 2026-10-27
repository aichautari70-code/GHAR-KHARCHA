import React, { useState } from 'react';
import { Person, Expense } from '../types';
import { formatCurrency } from '../utils/formatters';
import { AlertTriangle, Archive, RefreshCw, Trash2, X, ShieldAlert, Check } from 'lucide-react';

interface DeletePersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person | null;
  expenses: Expense[];
  allPeople: Person[];
  currency: string;
  onArchive: (personId: string) => void;
  onReassign: (fromPersonId: string, toPersonId: string) => void;
  onConfirmDelete: (personId: string, deleteExpenses: boolean) => void;
}

export const DeletePersonModal: React.FC<DeletePersonModalProps> = ({
  isOpen,
  onClose,
  person,
  expenses,
  allPeople,
  currency,
  onArchive,
  onReassign,
  onConfirmDelete,
}) => {
  if (!isOpen || !person) return null;

  // Filter expenses tied to this person
  const personExpenses = expenses.filter((e) => e.personId === person.id);
  const expenseCount = personExpenses.length;
  const totalAmount = personExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Remaining other active people for reassigning
  const otherPeople = allPeople.filter((p) => p.id !== person.id && !p.isArchived);
  const [selectedReassignId, setSelectedReassignId] = useState<string>(
    otherPeople.length > 0 ? otherPeople[0].id : ''
  );

  const [chosenMode, setChosenMode] = useState<'archive' | 'reassign' | 'delete'>(
    expenseCount > 0 ? 'archive' : 'delete'
  );

  const handleAction = () => {
    if (expenseCount === 0 || chosenMode === 'delete') {
      onConfirmDelete(person.id, expenseCount > 0);
    } else if (chosenMode === 'archive') {
      onArchive(person.id);
    } else if (chosenMode === 'reassign') {
      if (selectedReassignId) {
        onReassign(person.id, selectedReassignId);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Remove {person.name}
              </h3>
              <p className="text-xs text-slate-500">
                Confirm profile removal and protect historical records
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
          {/* Person highlight badge */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{person.avatar || '👤'}</span>
              <div>
                <p className="text-sm font-bold text-slate-900">{person.name}</p>
                <p className="text-xs text-slate-500">
                  {expenseCount > 0
                    ? `${expenseCount} expenses recorded`
                    : 'No expense records linked'}
                </p>
              </div>
            </div>
            {expenseCount > 0 && (
              <span className="text-sm font-bold text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-xl">
                {formatCurrency(totalAmount, currency)}
              </span>
            )}
          </div>

          {/* If the person has expenses, show the consequences and safe choices */}
          {expenseCount > 0 ? (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>Expense History Notice:</strong> {person.name} has paid for{' '}
                  <strong>{expenseCount} household expenses</strong> totaling{' '}
                  <strong>{formatCurrency(totalAmount, currency)}</strong>. To preserve
                  your family budget integrity, choose how to handle their records:
                </div>
              </div>

              {/* Option 1: Archive & Preserve (Recommended) */}
              <label
                onClick={() => setChosenMode('archive')}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  chosenMode === 'archive'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/10'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="mt-0.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      chosenMode === 'archive'
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-400'
                    }`}
                  >
                    {chosenMode === 'archive' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Keep Historical Records (Recommended)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Hides {person.name} from new expense entries, but safely keeps all {expenseCount}{' '}
                    past transactions intact with historical accuracy.
                  </p>
                </div>
              </label>

              {/* Option 2: Reassign expenses */}
              {otherPeople.length > 0 && (
                <label
                  onClick={() => setChosenMode('reassign')}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    chosenMode === 'reassign'
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/10'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="mt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        chosenMode === 'reassign'
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-400'
                      }`}
                    >
                      {chosenMode === 'reassign' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900">
                        Transfer All Expenses to Another Member
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 mb-2">
                      Moves all {expenseCount} expenses to another member before deleting this profile.
                    </p>
                    {chosenMode === 'reassign' && (
                      <div className="mt-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                          Transfer expenses to:
                        </label>
                        <select
                          value={selectedReassignId}
                          onChange={(e) => setSelectedReassignId(e.target.value)}
                          className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          {otherPeople.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.avatar})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </label>
              )}

              {/* Option 3: Permanently delete expenses */}
              <label
                onClick={() => setChosenMode('delete')}
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  chosenMode === 'delete'
                    ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-600/10'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="mt-0.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      chosenMode === 'delete'
                        ? 'border-rose-600 bg-rose-600 text-white'
                        : 'border-slate-400'
                    }`}
                  >
                    {chosenMode === 'delete' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-rose-700">
                    Delete Person and All Associated Expenses
                  </span>
                  <p className="text-[11px] text-rose-600/90 mt-0.5">
                    Permanent deletion. Removes {person.name} and permanently erases all{' '}
                    {expenseCount} expenses ({formatCurrency(totalAmount, currency)}).
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              {person.name} has no logged expenses. Removing this profile will not affect any family
              budget records. Are you sure you want to proceed?
            </p>
          )}

          {/* Action buttons */}
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
              onClick={handleAction}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                chosenMode === 'delete'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : chosenMode === 'reassign'
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {chosenMode === 'archive' && <Archive className="w-4 h-4" />}
              {chosenMode === 'reassign' && <RefreshCw className="w-4 h-4" />}
              {chosenMode === 'delete' && <Trash2 className="w-4 h-4" />}
              {chosenMode === 'archive'
                ? 'Keep Records & Archive'
                : chosenMode === 'reassign'
                ? 'Transfer & Remove'
                : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
