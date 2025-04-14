import { useState, useEffect } from 'react';
import { Transaction, Budget, FamilyMember } from '../types';

const DEFAULT_CATEGORIES = [
  'Food & Groceries',
  'Housing & Utilities',
  'Healthcare',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Income & Salary',
  'Other'
];

const INITIAL_STATE: Budget = {
  transactions: [],
  categories: DEFAULT_CATEGORIES,
  members: []
};

const MEMBER_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#8B5CF6', // purple
  '#F59E0B', // amber
  '#EF4444', // red
  '#EC4899', // pink
  '#6366F1', // indigo
  '#14B8A6', // teal
];

export function useBudget() {
  const [budget, setBudget] = useState<Budget>(() => {
    try {
      const saved = localStorage.getItem('budget');
      return saved ? JSON.parse(saved) : INITIAL_STATE;
    } catch (error) {
      console.error('Error loading budget from localStorage:', error);
      return INITIAL_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('budget', JSON.stringify(budget));
    } catch (error) {
      console.error('Error saving budget to localStorage:', error);
    }
  }, [budget]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      amount: Number(transaction.amount.toFixed(2))
    };
    setBudget(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions]
    }));
  };

  const deleteTransaction = (id: string) => {
    setBudget(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const addMember = (name: string) => {
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      name,
      color: MEMBER_COLORS[budget.members.length % MEMBER_COLORS.length]
    };
    setBudget(prev => ({
      ...prev,
      members: [...prev.members, newMember]
    }));
  };

  const removeMember = (id: string) => {
    setBudget(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id),
      transactions: prev.transactions.filter(t => t.memberId !== id)
    }));
  };

  const getMemberTotal = (memberId: string) => {
    return Number(budget.transactions
      .filter(t => t.memberId === memberId)
      .reduce((acc, curr) => {
        return acc + (curr.type === 'income' ? curr.amount : -curr.amount);
      }, 0)
      .toFixed(2));
  };

  const getMemberIncome = (memberId: string) => {
    return Number(budget.transactions
      .filter(t => t.memberId === memberId && t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0)
      .toFixed(2));
  };

  const getMemberExpenses = (memberId: string) => {
    return Number(budget.transactions
      .filter(t => t.memberId === memberId && t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0)
      .toFixed(2));
  };

  const getTotal = () => {
    return Number(budget.transactions.reduce((acc, curr) => {
      return acc + (curr.type === 'income' ? curr.amount : -curr.amount);
    }, 0).toFixed(2));
  };

  const getIncomeTotal = () => {
    return Number(budget.transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0)
      .toFixed(2));
  };

  const getExpenseTotal = () => {
    return Number(budget.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0)
      .toFixed(2));
  };

  const importBudgetData = (data: Budget) => {
    setBudget(data);
  };

  const mergeBudgetData = (data: Budget) => {
    setBudget(prev => {
      // Create sets of existing IDs for deduplication
      const existingTransactionIds = new Set(prev.transactions.map(t => t.id));
      const existingMemberIds = new Set(prev.members.map(m => m.id));
      
      // Filter out duplicates
      const newTransactions = data.transactions.filter(t => !existingTransactionIds.has(t.id));
      const newMembers = data.members.filter(m => !existingMemberIds.has(m.id));
      
      // Combine categories without duplicates
      const mergedCategories = Array.from(new Set([...prev.categories, ...data.categories]));
      
      return {
        transactions: [...prev.transactions, ...newTransactions],
        categories: mergedCategories,
        members: [...prev.members, ...newMembers]
      };
    });
  };

  return {
    transactions: budget.transactions,
    categories: budget.categories,
    members: budget.members,
    addTransaction,
    deleteTransaction,
    addMember,
    removeMember,
    getMemberTotal,
    getMemberIncome,
    getMemberExpenses,
    getTotal,
    getIncomeTotal,
    getExpenseTotal,
    importBudgetData,
    mergeBudgetData
  };
}