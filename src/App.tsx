import React, { useState, useEffect, useMemo } from 'react';
import { Person, Expense, ExpenseCategory, PaymentMethod } from './types';
import { DEFAULT_PEOPLE, DEFAULT_EXPENSES } from './data/defaultData';
import { calculateHouseholdSummary, generateId } from './utils/formatters';

import { Navbar } from './components/Navbar';
import { PeopleBar } from './components/PeopleBar';
import { DashboardStats } from './components/DashboardStats';
import { SpendingCharts } from './components/SpendingCharts';
import { ExpenseList } from './components/ExpenseList';
import { PersonModal } from './components/PersonModal';
import { DeletePersonModal } from './components/DeletePersonModal';
import { ManagePeopleModal } from './components/ManagePeopleModal';
import { ExpenseModal } from './components/ExpenseModal';
import { DeleteExpenseModal } from './components/DeleteExpenseModal';
import { DataToolsModal } from './components/DataToolsModal';

const STORAGE_PEOPLE_KEY = 'gharkharcha_people_v2';
const STORAGE_EXPENSES_KEY = 'gharkharcha_expenses_v2';
const STORAGE_CURRENCY_KEY = 'gharkharcha_currency_v2';

export default function App() {
  // 1. Persistent People State (Default: Aaraj, Saroj, Asha)
  const [people, setPeople] = useState<Person[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PEOPLE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse people from storage', e);
    }
    return DEFAULT_PEOPLE;
  });

  // 2. Persistent Expenses State
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_EXPENSES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse expenses from storage', e);
    }
    return DEFAULT_EXPENSES;
  });

  // 3. Persistent Currency State
  const [currency, setCurrency] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CURRENCY_KEY);
      if (saved) return saved;
    } catch (e) {
      console.error('Failed to read currency', e);
    }
    return 'Rs.';
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PEOPLE_KEY, JSON.stringify(people));
    } catch (e) {
      console.error('Failed to save people to localStorage', e);
    }
  }, [people]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EXPENSES_KEY, JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save expenses to localStorage', e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CURRENCY_KEY, currency);
    } catch (e) {
      console.error('Failed to save currency to localStorage', e);
    }
  }, [currency]);

  // Active Filters
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Modal States
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [deletingPerson, setDeletingPerson] = useState<Person | null>(null);
  const [isManagePeopleOpen, setIsManagePeopleOpen] = useState(false);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  const [isDataToolsOpen, setIsDataToolsOpen] = useState(false);

  // Active People
  const activePeople = useMemo(() => people.filter((p) => !p.isArchived), [people]);

  // Spending map for bubbles
  const personSpendingMap = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.personId] = (map[e.personId] || 0) + e.amount;
    });
    return map;
  }, [expenses]);

  // Calculate household summary for stats and charts
  const householdSummary = useMemo(() => {
    return calculateHouseholdSummary(people, expenses);
  }, [people, expenses]);

  // ==========================================
  // PEOPLE MANAGEMENT HANDLERS
  // ==========================================

  const handleOpenAddPerson = () => {
    setEditingPerson(null);
    setIsPersonModalOpen(true);
  };

  const handleOpenEditPerson = (person: Person) => {
    setEditingPerson(person);
    setIsPersonModalOpen(true);
  };

  const handleSavePerson = (personData: { name: string; avatar: string; color: string }) => {
    if (editingPerson) {
      // Edit existing person - preserve stable ID so history stays intact!
      setPeople((prev) =>
        prev.map((p) =>
          p.id === editingPerson.id
            ? {
                ...p,
                name: personData.name,
                avatar: personData.avatar,
                color: personData.color,
              }
            : p
        )
      );
    } else {
      // Add new person
      const newPerson: Person = {
        id: generateId('person'),
        name: personData.name,
        avatar: personData.avatar,
        color: personData.color,
        isArchived: false,
        createdAt: new Date().toISOString(),
      };
      setPeople((prev) => [...prev, newPerson]);
    }
  };

  const handleArchivePerson = (personId: string) => {
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, isArchived: true } : p))
    );
    if (selectedPersonId === personId) {
      setSelectedPersonId(null);
    }
  };

  const handleRestorePerson = (personId: string) => {
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, isArchived: false } : p))
    );
  };

  const handleReassignAndDeletePerson = (fromPersonId: string, toPersonId: string) => {
    // Reassign all expenses to target member
    setExpenses((prev) =>
      prev.map((e) => (e.personId === fromPersonId ? { ...e, personId: toPersonId } : e))
    );
    // Remove original person
    setPeople((prev) => prev.filter((p) => p.id !== fromPersonId));
    if (selectedPersonId === fromPersonId) {
      setSelectedPersonId(null);
    }
  };

  const handleConfirmDeletePerson = (personId: string, purgeExpenses: boolean) => {
    if (purgeExpenses) {
      setExpenses((prev) => prev.filter((e) => e.personId !== personId));
    }
    setPeople((prev) => prev.filter((p) => p.id !== personId));
    if (selectedPersonId === personId) {
      setSelectedPersonId(null);
    }
  };

  // ==========================================
  // EXPENSE MANAGEMENT HANDLERS
  // ==========================================

  const handleOpenAddExpense = () => {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (expenseData: {
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    personId: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => {
    if (editingExpense) {
      // Update expense
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === editingExpense.id
            ? {
                ...e,
                title: expenseData.title,
                amount: expenseData.amount,
                category: expenseData.category,
                date: expenseData.date,
                personId: expenseData.personId,
                paymentMethod: expenseData.paymentMethod,
                notes: expenseData.notes,
              }
            : e
        )
      );
    } else {
      // Add new expense
      const newExpense: Expense = {
        id: generateId('exp'),
        title: expenseData.title,
        amount: expenseData.amount,
        category: expenseData.category,
        date: expenseData.date,
        personId: expenseData.personId,
        paymentMethod: expenseData.paymentMethod,
        notes: expenseData.notes,
        createdAt: new Date().toISOString(),
      };
      setExpenses((prev) => [newExpense, ...prev]);
    }
  };

  const handleDeleteExpenseConfirm = () => {
    if (deletingExpense) {
      setExpenses((prev) => prev.filter((e) => e.id !== deletingExpense.id));
      setDeletingExpense(null);
    }
  };

  // ==========================================
  // BACKUP & RESTORE HANDLERS
  // ==========================================

  const handleImportData = (importedPeople: Person[], importedExpenses: Expense[]) => {
    setPeople(importedPeople);
    setExpenses(importedExpenses);
    setSelectedPersonId(null);
    setSelectedCategory(null);
  };

  const handleResetDefaults = () => {
    setPeople(DEFAULT_PEOPLE);
    setExpenses(DEFAULT_EXPENSES);
    setSelectedPersonId(null);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Sticky Header Navbar */}
      <Navbar
        currency={currency}
        onChangeCurrency={setCurrency}
        onOpenManagePeople={() => setIsManagePeopleOpen(true)}
        onOpenAddExpense={handleOpenAddExpense}
        onOpenDataTools={() => setIsDataToolsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* People Bubbles Bar */}
        <PeopleBar
          people={people}
          selectedPersonId={selectedPersonId}
          onSelectPerson={setSelectedPersonId}
          onAddPerson={handleOpenAddPerson}
          onEditPerson={handleOpenEditPerson}
          onDeletePerson={(p) => setDeletingPerson(p)}
          onManageAll={() => setIsManagePeopleOpen(true)}
          personSpendingMap={personSpendingMap}
          currency={currency}
        />

        {/* Dashboard Overview Cards */}
        <DashboardStats
          summary={householdSummary}
          currency={currency}
          activePeopleCount={activePeople.length}
          onManagePeopleClick={() => setIsManagePeopleOpen(true)}
        />

        {/* Member and Category Breakdown Charts */}
        <SpendingCharts
          summary={householdSummary}
          currency={currency}
          onFilterPerson={setSelectedPersonId}
          selectedPersonId={selectedPersonId}
          onFilterCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />

        {/* Complete Expense History List */}
        <ExpenseList
          expenses={expenses}
          people={people}
          currency={currency}
          selectedPersonId={selectedPersonId}
          onSelectPerson={setSelectedPersonId}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddExpense={handleOpenAddExpense}
          onEditExpense={handleOpenEditExpense}
          onDeleteExpense={(exp) => setDeletingExpense(exp)}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">
            <strong>GharKharcha (घरखर्च)</strong> — Household Expense & Contribution Manager
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Stable ID record protection</span>
            <span>•</span>
            <span>Local & persistent data</span>
            <span>•</span>
            <button
              onClick={() => setIsManagePeopleOpen(true)}
              className="text-emerald-700 hover:underline font-bold cursor-pointer"
            >
              Manage People ({activePeople.length})
            </button>
          </div>
        </div>
      </footer>

      {/* ========================================== */}
      {/* MODALS */}
      {/* ========================================== */}

      {/* Add / Edit Person Modal */}
      <PersonModal
        isOpen={isPersonModalOpen}
        onClose={() => {
          setIsPersonModalOpen(false);
          setEditingPerson(null);
        }}
        onSave={handleSavePerson}
        initialPerson={editingPerson}
      />

      {/* Delete Person Confirmation & Protection Modal */}
      <DeletePersonModal
        isOpen={Boolean(deletingPerson)}
        onClose={() => setDeletingPerson(null)}
        person={deletingPerson}
        expenses={expenses}
        allPeople={people}
        currency={currency}
        onArchive={handleArchivePerson}
        onReassign={handleReassignAndDeletePerson}
        onConfirmDelete={handleConfirmDeletePerson}
      />

      {/* Full Household Members Management Drawer / Modal */}
      <ManagePeopleModal
        isOpen={isManagePeopleOpen}
        onClose={() => setIsManagePeopleOpen(false)}
        people={people}
        expenses={expenses}
        currency={currency}
        onAddPerson={() => {
          setEditingPerson(null);
          setIsPersonModalOpen(true);
        }}
        onEditPerson={(person) => {
          setEditingPerson(person);
          setIsPersonModalOpen(true);
        }}
        onDeletePerson={(person) => {
          setDeletingPerson(person);
        }}
        onRestorePerson={handleRestorePerson}
      />

      {/* Add / Edit Expense Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        people={people}
        currency={currency}
        onQuickAddPerson={() => {
          setEditingPerson(null);
          setIsPersonModalOpen(true);
        }}
        initialExpense={editingExpense}
      />

      {/* Delete Expense Modal */}
      <DeleteExpenseModal
        isOpen={Boolean(deletingExpense)}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleDeleteExpenseConfirm}
        expense={deletingExpense}
        people={people}
        currency={currency}
      />

      {/* Backup, CSV Export & Restore Modal */}
      <DataToolsModal
        isOpen={isDataToolsOpen}
        onClose={() => setIsDataToolsOpen(false)}
        people={people}
        expenses={expenses}
        currency={currency}
        onImportData={handleImportData}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
