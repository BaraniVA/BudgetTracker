import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { FamilyMember } from '../types';

interface TransactionFormProps {
  categories: string[];
  members: FamilyMember[];
  onSubmit: (transaction: {
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    memberId: string;
  }) => void;
}

export function TransactionForm({ categories, members, onSubmit }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memberId, setMemberId] = useState(members[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description,
      amount: parseFloat(amount),
      type,
      category,
      date,
      memberId
    });
    setDescription('');
    setAmount('');
    // Keep the same type, category, and member for convenience
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border-2 border-gray-100">
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Family Member</label>
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            required
            className="block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">What is it for?</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Example: Groceries, Rent, Salary"
            required
            className="block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">How much?</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-xl text-gray-500">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              className="block w-full rounded-lg border-2 border-gray-200 pl-10 pr-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Money coming in or going out?</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            className="block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="income">Money Coming In ↓</option>
            <option value="expense">Money Going Out ↑</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">When?</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-6 py-4 text-xl font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          <PlusCircle className="w-6 h-6 mr-2" />
          Add Transaction
        </button>
      </div>
    </form>
  );
}