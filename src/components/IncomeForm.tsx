import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { FamilyMember } from '../types';

interface IncomeFormProps {
  members: FamilyMember[];
  onSubmit: (transaction: {
    description: string;
    amount: number;
    type: 'income';
    category: string;
    date: string;
    memberId: string;
  }) => void;
}

export function IncomeForm({ members, onSubmit }: IncomeFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memberId, setMemberId] = useState(members[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description,
      amount: parseFloat(amount),
      type: 'income',
      category: 'Income & Salary',
      date,
      memberId
    });
    setDescription('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border-2 border-green-100">
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Family Member</label>
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            required
            className="block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Income Source</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Example: Salary, Bonus, Investment"
            required
            className="block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Amount</label>
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
              className="block w-full rounded-lg border-2 border-gray-200 pl-10 pr-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Date Received</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-6 py-4 text-xl font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-200"
        >
          <PlusCircle className="w-6 h-6 mr-2" />
          Add Income
        </button>
      </div>
    </form>
  );
}