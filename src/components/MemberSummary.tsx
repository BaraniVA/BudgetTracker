import { FamilyMember } from '../types';
import { User } from 'lucide-react';

interface MemberSummaryProps {
  member: FamilyMember;
  total: number;
  income: number;
  expenses: number;
}

export function MemberSummary({ member, total, income, expenses }: MemberSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border-2" style={{ borderColor: member.color }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full" style={{ backgroundColor: member.color }}>
          <User className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Balance</p>
          <p className={`text-lg font-semibold ${total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${total.toFixed(2)}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Income</p>
            <p className="text-lg font-semibold text-green-600">
              ${income.toFixed(2)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Expenses</p>
            <p className="text-lg font-semibold text-red-600">
              ${expenses.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}