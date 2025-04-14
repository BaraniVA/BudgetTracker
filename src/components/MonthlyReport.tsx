import { useState } from 'react';
import { Download, TrendingDown, TrendingUp, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import { Transaction, FamilyMember } from '../types';

interface MonthlyReportProps {
  transactions: Transaction[];
  members: FamilyMember[];
}

export function MonthlyReport({ transactions, members }: MonthlyReportProps) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const filterTransactionsByMonth = (transactions: Transaction[], monthStr: string) => {
    return transactions.filter(t => t.date.startsWith(monthStr));
  };

  const monthlyTransactions = filterTransactionsByMonth(transactions, selectedMonth);

  const getCategoryTotal = (category: string) => {
    return monthlyTransactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMemberSpending = (memberId: string) => {
    return monthlyTransactions
      .filter(t => t.memberId === memberId && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categories = [...new Set(monthlyTransactions
    .filter(t => t.type === 'expense')
    .map(t => t.category))];

  const categoryData = categories.map(category => ({
    name: category,
    amount: getCategoryTotal(category)
  }));

  const memberData = members.map(member => ({
    name: member.name,
    amount: getMemberSpending(member.id)
  }));

  const downloadReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.text(`Monthly Financial Report - ${selectedMonth}`, pageWidth / 2, 20, { align: 'center' });
    
    // Summary
    doc.setFontSize(14);
    doc.text('Summary:', 20, 40);
    doc.setFontSize(12);
    doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 30, 50);
    doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 30, 60);
    doc.text(`Net: $${(totalIncome - totalExpenses).toFixed(2)}`, 30, 70);
    
    // Category Breakdown
    doc.setFontSize(14);
    doc.text('Expense Categories:', 20, 90);
    doc.setFontSize(12);
    categories.forEach((category, index) => {
      const amount = getCategoryTotal(category);
      const percentage = ((amount / totalExpenses) * 100).toFixed(1);
      doc.text(`${category}: $${amount.toFixed(2)} (${percentage}%)`, 30, 100 + (index * 10));
    });
    
    // Member Breakdown
    doc.setFontSize(14);
    doc.text('Member Spending:', 20, 160);
    doc.setFontSize(12);
    members.forEach((member, index) => {
      const amount = getMemberSpending(member.id);
      const percentage = ((amount / totalExpenses) * 100).toFixed(1);
      doc.text(`${member.name}: $${amount.toFixed(2)} (${percentage}%)`, 30, 170 + (index * 10));
    });
    
    doc.save(`financial-report-${selectedMonth}.pdf`);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Monthly Report</h2>
        <div className="flex items-center gap-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <Download className="w-5 h-5" />
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-green-50 rounded-xl border-2 border-green-100">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">Income</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
        </div>

        <div className="p-6 bg-red-50 rounded-xl border-2 border-red-100">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-900">Expenses</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Spending by Category</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Spending by Member</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}