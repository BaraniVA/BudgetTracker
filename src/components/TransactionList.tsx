import { Transaction, FamilyMember } from '../types';
import { Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  members: FamilyMember[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, members, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-gray-100 text-center">
        <p className="text-xl text-gray-500">No transactions yet. Add your first one above!</p>
      </div>
    );
  }

  const getMemberColor = (memberId: string) => {
    return members.find(m => m.id === memberId)?.color || '#666666';
  };

  const getMemberName = (memberId: string) => {
    return members.find(m => m.id === memberId)?.name || 'Unknown Member';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600">When</th>
              <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600">Who</th>
              <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600">What</th>
              <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600">Category</th>
              <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600">Amount</th>
              <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600">Remove</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y-2 divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-lg text-gray-900">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-lg">
                  <span className="inline-flex items-center">
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getMemberColor(transaction.memberId) }}
                    />
                    {getMemberName(transaction.memberId)}
                  </span>
                </td>
                <td className="px-6 py-4 text-lg text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 text-lg text-gray-900">
                  {transaction.category}
                </td>
                <td className={`px-6 py-4 text-lg font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to remove this transaction?')) {
                        onDelete(transaction.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}