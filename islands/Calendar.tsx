import { useState, useEffect } from "preact/hooks";

export default function Calendar() {
  const [shifts, setShifts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);



  const toggleDropdown = () => { 
    setIsOpen(!isOpen); 
    };

  useEffect(() => {
    const savedShifts = localStorage.getItem('shift_history');
    if (savedShifts) {
      try {
        const parsedShifts = JSON.parse(savedShifts);
        
        if (Array.isArray(parsedShifts)) {
          setShifts(parsedShifts);
        }
      } 
      
      catch (e) {
        console.error("Error parsing shifts from localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'shift_history') {
        try {
          const parsedShifts = JSON.parse(e.newValue);
          if (Array.isArray(parsedShifts)) {
            setShifts(parsedShifts);
          }
        } 
        
        catch (error) {
          console.error("Error parsing shifts from storage event:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    window.addEventListener('shiftsUpdated', () => {

      const savedShifts = localStorage.getItem('shift_history');

      if (savedShifts) {
        try {
          const parsedShifts = JSON.parse(savedShifts);
          if (Array.isArray(parsedShifts)) {
            setShifts(parsedShifts);
          }
        } catch (e) {
          console.error("Error parsing shifts from custom event:", e);
        }
      }
    });

    return () => {

      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('shiftsUpdated', handleStorageChange);

    };
  }, []);

  const deleteShift = (id) => {

    const updatedShifts = shifts.filter(shift => shift.id !== id);
    setShifts(updatedShifts);
    localStorage.setItem('shift_history', JSON.stringify(updatedShifts));
    
    
    window.dispatchEvent(new CustomEvent('shiftsUpdated'));
  };

  return (
    <div class="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg pb-4">
        <div 
        class="flex flex-col-2 justify-between p-4 cursor-pointer items-center"
        onClick={toggleDropdown}
      >
        <div class="text-2xl font-semibold text-center w-full text-indigo-700">
            Shifts

            

        </div>

        <div class="text-sm text-indigo-700 ">
                {isOpen ? '▲' : '▼'}
            </div>
        
      </div>

     {isOpen && (
      
      <div class="rounded-lg shadow-md">
        <div class=" p-4 bg-indigo-100 rounded-t-lg">
          <div class="grid grid-cols-6 font-medium text-sm ">
            <div class="flex items-center justify-center">Date</div>
            <div class="flex items-center justify-center">Start Time</div>
            <div class="flex items-center justify-center">End Time</div>
            <div class="flex items-center justify-center">Duration</div>
            <div class="flex items-center justify-center">Earnings</div>
            <div class="flex items-center justify-center">
              <button 

                onClick={() => {

                  localStorage.setItem('shift_history', JSON.stringify([]));
                  setShifts([]);
                  window.dispatchEvent(new CustomEvent('shiftsUpdated'));
                }}
                class="bg-red-500 text-white p-2 rounded hover:bg-red-700"
              >
                Delete All
              </button>

            </div>
          </div>
        </div>
        
        <div class="bg-gray-100 bg-opacity-80 text-gray-700 text-lg rounded-b-lg text-center align-text-center
        ">
          {shifts.length === 0 ? (
            <div class="px-4 py-6 text-center">
              No shifts recorded yet
            </div>
          ) : (
            shifts.map(shift => {
              return (
                <div key={shift.id} class="p-4 grid grid-cols-6 text-sm ">
                <div class="flex items-center justify-center">{(() => {
                  const [year, month, day] = shift.date.split('-');
                  return `${month}/${day}/${year}`;
                })()}</div>
                  
                  <div class="flex items-center justify-center">{shift.startTime}</div>
                  <div class="flex items-center justify-center">{shift.endTime}</div>
                  <div class="flex items-center justify-center">{shift.duration}</div>
                  <div class="flex items-center justify-center">${shift.earnings}</div>
                  <div class="flex items-center justify-center">
                  <button 
                    onClick={() => deleteShift(shift.id)}
                    class="bg-red-500 text-white p-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>)}
      

      {shifts.length > 0 && isOpen && (
        <div class="mt-6 p-4 text-center rounded-lg shadow-md bg-gray-200 bg-opacity-80 ">

          <div class="text-lg font-semibold mb-2 text-indigo-700">Summary</div>

          <div class="grid grid-cols-3 gap-4">
            <div class="bg-white p-3 rounded shadow-sm">
              <div class="text-sm ">Total Shifts</div>
              <div class="text-xl font-semibold">{shifts.length}</div>
            </div>
            <div class="bg-white p-3 rounded shadow-sm">
              <div class="text-sm ">Total Hours</div>
              <div class="text-xl font-semibold">
                {shifts.reduce((total, shift) => {
                  return total + (shift.totalHours || 0);
                }, 0).toFixed(1)}
              </div>
            </div>
            <div class="bg-white p-3 rounded shadow-sm">

              <div class="text-sm">Total Earnings</div>

              <div class="text-xl font-semibold">
                ${shifts.reduce((total, shift) => {
                  return total + parseFloat(shift.earnings || 0);
                }, 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}