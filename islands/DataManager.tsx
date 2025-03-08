import { useState } from "preact/hooks";

export default function DataManager() {


  const exportData = () => {
    try {
      const shiftData = localStorage.getItem('shift_history');


      const blob = new Blob([shiftData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shift-history-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } 
    
    
     catch (error) {
      console.error('Error exporting data:', error);
      }
  };

  const importData = (event: Event) => {

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        
        if (!Array.isArray(parsedData)) {
          throw new Error('Invalid data format');
        }

        localStorage.setItem('shift_history', JSON.stringify(parsedData));
        window.dispatchEvent(new CustomEvent('shiftsUpdated'));
        
      } 
      
      catch (error) {
        console.error('Error importing data:', error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div class="w-full max-w-[100%] p-4 bg-white rounded-lg shadow-lg">
      <div class="text-2xl font-semibold text-center mb-4 text-indigo-700">
        Data Management
      </div>
      
      <div class="flex justify-center gap-4">
        <button
          onClick={exportData}
          class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition duration-300 shadow-md"
        >
          Export Shifts
        </button>

        <label class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition duration-300 shadow-md cursor-pointer">
          Import Shifts
          
          <input
            type="file"
            accept=".json,application/json"
            onChange={importData}
            class="hidden"
          />
        </label>
      </div>
    </div>
  );
} 