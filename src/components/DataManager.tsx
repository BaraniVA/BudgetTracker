import { Budget } from '../types';

interface DataManagerProps {
  budget: Budget;
  onImport: (data: Budget) => void;
  onMerge: (data: Budget) => void; // Add this prop
}

export function DataManager({ budget, onImport, onMerge }: DataManagerProps) {
  const handleExport = () => {
    const dataStr = JSON.stringify(budget);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `budget-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    // Add this line to track backup date
    localStorage.setItem('lastBackupDate', new Date().toISOString());
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        
        // Validate imported data structure
        if (!validateBudgetData(importedData)) {
          alert('Invalid budget data format. The file appears to be corrupted or in the wrong format.');
          return;
        }
        
        // Ask user if they want to replace or merge
        const mergeMode = window.confirm(
          'Do you want to merge with your existing data?\n\n' +
          'Click OK to merge data.\n' +
          'Click Cancel to replace all existing data.'
        );
        
        if (mergeMode) {
          onMerge(importedData);
        } else {
          onImport(importedData);
        }
      } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  const validateBudgetData = (data: unknown): data is Budget => {
    if (!data || typeof data !== 'object') return false;
    
    // Need to use type assertion after basic check
    const budgetData = data as Partial<Budget>;
    
    // Check basic structure
    if (!Array.isArray(budgetData.transactions) || 
        !Array.isArray(budgetData.categories) || 
        !Array.isArray(budgetData.members)) {
      return false;  
    }
    
    // Check transactions format
    for (const tx of budgetData.transactions) {
      if (!tx.id || !tx.date || typeof tx.amount !== 'number' || 
          !['income', 'expense'].includes(tx.type)) {
        return false;
      }
    }
    
    // Check members format
    for (const member of budgetData.members) {
      if (!member.id || !member.name) {
        return false;
      }
    }
    
    return true;
  };

  return (
    <div className="flex space-x-4">
      <button 
        onClick={handleExport}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Export Data
      </button>
      
      <label className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer">
        Import Data
        <input 
          type="file" 
          accept=".json" 
          className="hidden"
          onChange={handleImport} 
        />
      </label>
    </div>
  );
}