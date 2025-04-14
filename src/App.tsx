import { Wallet } from 'lucide-react';
import { ExpenseForm } from './components/ExpenseForm';
import { IncomeForm } from './components/IncomeForm';
import { TransactionList } from './components/TransactionList';
import { Summary } from './components/Summary';
import { MemberSummary } from './components/MemberSummary';
import { MonthlyReport } from './components/MonthlyReport';
import { FamilyMemberManager } from './components/FamilyMemberManager';
import { DataManager } from './components/DataManager'; // Add this import
import { BackupReminder } from './components/BackupReminder';
import { useBudget } from './hooks/useBudget';
import { Budget } from './types'; // Make sure to import Budget type

function App() {
  const {
    transactions,
    categories,
    members,
    addTransaction,
    deleteTransaction,
    addMember,
    removeMember,
    getTotal,
    getIncomeTotal,
    getExpenseTotal,
    getMemberTotal,
    getMemberIncome,
    getMemberExpenses,
    importBudgetData,
    mergeBudgetData,
  } = useBudget();

  // Add the handleImport function here, before the return
  const handleImport = (importedData: Budget) => {
    if (window.confirm('This will replace your current budget data. Continue?')) {
      importBudgetData(importedData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex items-center justify-center">
            <Wallet className="h-10 w-10 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">Family Budget Tracker</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="space-y-8">
          <Summary
            total={getTotal()}
            income={getIncomeTotal()}
            expenses={getExpenseTotal()}
          />
          
          {/* Add the BackupReminder component here, right before DataManager */}
          <BackupReminder onBackup={() => {
            const exportBtn = document.querySelector('[data-export-btn]');
            if (exportBtn) {
              (exportBtn as HTMLButtonElement).click();
            }
          }} />

          <DataManager 
            budget={{transactions, categories, members}} 
            onImport={handleImport}
            onMerge={(data) => mergeBudgetData(data)}
          />

          <FamilyMemberManager
            members={members}
            onAddMember={addMember}
            onRemoveMember={removeMember}
          />

          {members && members.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Member Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {members.map((member) => (
                  <MemberSummary
                    key={member.id}
                    member={member}
                    total={getMemberTotal(member.id)}
                    income={getMemberIncome(member.id)}
                    expenses={getMemberExpenses(member.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {members.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-semibold text-green-600 mb-4">Add Income</h2>
                  <IncomeForm
                    members={members}
                    onSubmit={addTransaction}
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-red-600 mb-4">Add Expense</h2>
                  <ExpenseForm
                    categories={categories}
                    members={members}
                    onSubmit={addTransaction}
                  />
                </div>
              </div>


              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
                <TransactionList
                  transactions={transactions}
                  members={members}
                  onDelete={deleteTransaction}
                />
              </div>
              <MonthlyReport transactions={transactions} members={members} />
            </>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-gray-100 text-center">
              <p className="text-xl text-gray-500">Please add family members to start tracking your budget!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App