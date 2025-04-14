import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';

interface SummaryProps {
  total: number;
  income: number;
  expenses: number;
}

export function Summary({ total, income, expenses }: SummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-medium text-gray-600 mb-2">Total Balance</p>
            <p className={`text-4xl font-bold ${total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${total.toFixed(2)}
            </p>
          </div>
          <DollarSign className={`w-12 h-12 ${total >= 0 ? 'text-green-600' : 'text-red-600'}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-medium text-gray-600 mb-2">Money Coming In</p>
              <p className="text-3xl font-bold text-green-600">${income.toFixed(2)}</p>
            </div>
            <ArrowUpCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-medium text-gray-600 mb-2">Money Going Out</p>
              <p className="text-3xl font-bold text-red-600">${expenses.toFixed(2)}</p>
            </div>
            <ArrowDownCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}