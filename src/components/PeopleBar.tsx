import React from 'react';
import { Person } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Plus, Edit2, Trash2, Users, Check } from 'lucide-react';

interface PeopleBarProps {
  people: Person[];
  selectedPersonId: string | null;
  onSelectPerson: (id: string | null) => void;
  onAddPerson: () => void;
  onEditPerson: (person: Person) => void;
  onDeletePerson: (person: Person) => void;
  onManageAll: () => void;
  personSpendingMap: Record<string, number>;
  currency: string;
}

export const PeopleBar: React.FC<PeopleBarProps> = ({
  people,
  selectedPersonId,
  onSelectPerson,
  onAddPerson,
  onEditPerson,
  onDeletePerson,
  onManageAll,
  personSpendingMap,
  currency,
}) => {
  const activePeople = people.filter((p) => !p.isArchived);

  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-sm transition-all mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Household Members
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {activePeople.length} People
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Filter expenses by member or click edit to update profile
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onManageAll}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
          >
            Manage People
          </button>
          <button
            onClick={onAddPerson}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Person
          </button>
        </div>
      </div>

      {/* Bubble Row */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {/* All Members Bubble */}
        <button
          onClick={() => onSelectPerson(null)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            selectedPersonId === null
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-900/10'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          <span className="text-sm">🏠</span>
          <span>All Household</span>
          {selectedPersonId === null && <Check className="w-3.5 h-3.5 text-emerald-400" />}
        </button>

        {/* Member Bubbles */}
        {activePeople.map((person) => {
          const isSelected = selectedPersonId === person.id;
          const spent = personSpendingMap[person.id] || 0;

          return (
            <div
              key={person.id}
              className={`group relative flex items-center rounded-full border transition-all shrink-0 pl-1.5 pr-2 py-1 ${
                isSelected
                  ? 'ring-2 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
              style={{
                borderColor: isSelected ? person.color : '#e2e8f0',
                backgroundColor: isSelected ? `${person.color}10` : undefined,
                boxShadow: isSelected ? `0 0 0 1px ${person.color}` : undefined,
              }}
            >
              {/* Select & Details trigger */}
              <button
                type="button"
                onClick={() => onSelectPerson(isSelected ? null : person.id)}
                className="flex items-center gap-2 cursor-pointer text-left focus:outline-none"
                title={`Filter by ${person.name}`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-xs"
                  style={{ backgroundColor: `${person.color}25`, color: person.color }}
                >
                  {person.avatar || '👤'}
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-xs font-bold leading-tight"
                    style={{ color: isSelected ? person.color : '#1e293b' }}
                  >
                    {person.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {formatCurrency(spent, currency)}
                  </span>
                </div>
              </button>

              {/* Action Buttons: Edit and Delete */}
              <div className="flex items-center ml-2 pl-1.5 border-l border-slate-200/80 gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditPerson(person);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
                  title={`Edit ${person.name}`}
                  aria-label={`Edit ${person.name}`}
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePerson(person);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title={`Delete ${person.name}`}
                  aria-label={`Delete ${person.name}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Quick Add Person Bubble CTA */}
        <button
          onClick={onAddPerson}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-dashed border-slate-300 hover:border-emerald-500 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/50 text-xs font-semibold transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-600" />
          <span>Add Member</span>
        </button>
      </div>
    </div>
  );
};
