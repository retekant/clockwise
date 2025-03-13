import { useState, useEffect } from "preact/hooks";

export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const [bgColor, setBgColor] = useState("#d35b5b");
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  useEffect(() => {
    const savedColor = localStorage.getItem('app_background_color');
    if (savedColor) {
      setBgColor(savedColor);
      document.body.style.backgroundColor = savedColor;
      
      const appContainer = document.querySelector('.min-h-screen');
      if (appContainer) {
        appContainer.className = appContainer.className.replace(/bg-\[#[0-9a-fA-F]+\]/, `bg-[${savedColor}]`);
      }
    }
  }, []);

  const toggleSettings = () => {
    setIsOpen(!isOpen);
    setShowColorPicker(false);
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const changeBackgroundColor = (color) => {
    setBgColor(color);
    localStorage.setItem('app_background_color', color);
    
    document.body.style.backgroundColor = color;
    
    const appContainer = document.querySelector('.min-h-screen');
    if (appContainer) {
      appContainer.className = appContainer.className.replace(/bg-\[#[0-9a-fA-F]+\]/, `bg-[${color}]`);
    }
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    changeBackgroundColor(newColor);
  };

  const exportData = () => {
    try {
      const shiftData = localStorage.getItem('shift_history');
      if (!shiftData) {
        alert('No shift data to export');
        return;
      }

      const blob = new Blob([shiftData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shift-history-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const importData = (event) => {
    const input = event.target;
    const file = input?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {


      try {
        const content = e.target?.result;
        const parsedData = JSON.parse(content);
        
        if (!Array.isArray(parsedData)) {
          throw new Error('Invalid data format');
        }


        localStorage.setItem('shift_history', JSON.stringify(parsedData));
        window.dispatchEvent(new CustomEvent('shiftsUpdated'));
        alert('Data imported successfully');
      } 
      catch (error) {
        console.error('Error importing data:', error);
        alert('Error importing data. Please check the file format.');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div class="relative">

      <button 
        onClick={toggleSettings}
        class="fixed bottom-4 right-4 z-50 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-3 shadow-lg"
        aria-label="Settings"
      >

        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>

      </button>


      {isOpen && (

        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black opacity-50" onClick={toggleSettings}></div>
          <div class="bg-white rounded-lg shadow-xl z-10 w-full max-w-md p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-semibold text-indigo-700">Settings</h2>
              <button onClick={toggleSettings} class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
        
              <div class="border-b pb-4">
                <div class="text-lg font-medium text-gray-800 mb-2">Data Management</div>
                <div class="flex gap-2">
                  
                  <button
                    onClick={exportData}
                    class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition duration-300 shadow-md flex-1"
                  >
                    Export Data
                  </button>
                  <label class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition duration-300 shadow-md cursor-pointer flex-1 text-center">
                    Import Data
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={importData}
                      class="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <div class="text-lg font-medium text-gray-800 mb-2">Appearance</div>
                <div class="flex flex-col gap-2">
                  <button
                    onClick={toggleColorPicker}
                    class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition duration-300 shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Background Color</span>
                    <div class="w-4 h-4 rounded-full" style={{ backgroundColor: bgColor }}></div>
                  </button>

                  {showColorPicker && (
                    <div class="mt-2 p-4 bg-gray-100 rounded-md flex flex-col items-center gap-3">
                      <input 
                        type="color" 
                        value={bgColor} 
                        onChange={handleColorChange}
                        class="w-32 h-12 cursor-pointer"
                      />
                      <div class="flex items-center gap-2">
                        <div class="text-sm font-medium">Selected color:</div>
                        <div class="px-2 py-1 rounded bg-white border border-gray-300 text-sm font-mono">{bgColor}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}