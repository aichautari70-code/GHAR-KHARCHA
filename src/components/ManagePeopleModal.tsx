import React from 'react';
import { Person, Expense } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Users, Plus, Edit2, Trash2, X, Archive, CheckCircle, ShieldCheck } from 'lucide-react';

interface ManagePeopleModalProps {
  isOpen: boolean;
  onClose: () => void;
  people: Person[];
  expenses: Expense[];
  currency: string;
  onAddPerson: () => void;
  onEditPerson: (person: Person) => void;
  onDeletePerson: (person: Person) => void;
  onRestorePerson: (personId: string) => void;
}

export const ManagePeopleModal: React.FC<ManagePeopleModalProps> = ({
  isOpen,
  onClose,
  people,
  expenses,
  currency,
  onAddPerson,
  onEditPerson,
  onDeletePerson,
  onRestorePerson,
}) => {
  if (!isOpen) return null;

  const totalHouseholdSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group active and archived
  const activePeople = people.filter((p) => !p.isArchived);
  const archivedPeople = people.filter((p) => p.isArchived);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Manage Household Members</h3>
              <p className="text-xs text-slate-500">
                Add, rename, customize, and manage people in your home expense tracker
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top banner / Add CTA */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <p className="text-xs font-bold text-slate-800">
                Active Members ({activePeople.length})
              </p>
              <p className="text-[11px] text-slate-500">
                Each member can be assigned as the payer on any expense record.
              </p>
            </div>
            <button
              onClick={() => {
                onAddPerson();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>

          {/* Active Members List */}
          <div className="space-y-2.5">
            {activePeople.map((person) => {
              const personExpenses = expenses.filter((e) => e.personId === person.id);
              const count = personExpenses.length;
              const total = personExpenses.reduce((sum, e) => sum + e.amount, 0);
              const percentage =
                totalHouseholdSpent > 0 ? Math.round((total / totalHouseholdSpent) * 100) : 0;

              return (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    {/* Bubble display */}
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-xs"
                      style={{
                        backgroundColor: `${person.color}20`,
                        border: `1.5px solid ${person.color}`,
                      }}
                    >
                      {person.avatar || '👤'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{person.name}</span>
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: person.color }}
                          title={`Color code: ${person.color}`}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{count} expenses</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">
                          {formatCurrency(total, currency)}
                        </span>
                        {totalHouseholdSpent > 0 && (
                          <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-md">
                            {percentage}% of home spending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditPerson(person)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      title={`Edit ${person.name}`}
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDeletePerson(person)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-xs font-semibold text-rose-600 transition-colors cursor-pointer"
                      title={`Delete ${person.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Archived Members section (if any) */}
          {archivedPeople.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <Archive className="w-4 h-4 text-slate-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Archived Members ({archivedPeople.length})
                </h4>
              </div>
              <div className="space-y-2">
                {archivedPeople.map((person) => {
                  const personExpenses = expenses.filter((e) => e.personId === person.id);
                  const count = personExpenses.length;
                  const total = personExpenses.reduce((sum, e) => sum + e.amount, 0);

                  return (
                    <div
                      key={person.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-200 text-slate-600"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl opacity-60">{person.avatar || '👤'}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">{person.name}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                              Archived
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {count} past expenses ({formatCurrency(total, currency)})
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onRestorePerson(person.id)}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1 rounded-xl transition-colors cursor-pointer"
                      >
                        Restore Member
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* History Preservation Assurance */}
          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/70 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <strong>Stable Member IDs:</strong> When you rename a person, their entire past expense
              history stays perfectly linked and updates everywhere throughout GharKharcha. No
              transactions are ever lost or altered.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            All changes saved automatically
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
