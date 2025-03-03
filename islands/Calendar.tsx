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
    <div class="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
        <div 
        class="flex flex-col-2 justify-between p-4 cursor-pointer items-center"
        onClick={toggleDropdown}
      >
        <div class="text-xl font-semibold text-center w-full">
            Shifts

            

        </div>

        <div class="text-sm">
                {isOpen ? '▲' : '▼'}
            </div>
        
      </div>

     {isOpen && (
      
      <div class="rounded-lg">
        <div class=" p-4 border-b-2">
          <div class="grid grid-cols-6 font-medium text-sm ">
            <div>Date</div>
            <div>Start Time</div>
            <div>End Time</div>
            <div>Duration</div>
            <div>Earnings</div>
            <div>
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
        
        <div class="bg-white">
          {shifts.length === 0 ? (
            <div class="px-4 py-6 text-center">
              No shifts recorded yet
            </div>
          ) : (
            shifts.map(shift => {
              return (
                <div key={shift.id} class="p-4 grid grid-cols-6 text-sm">
                <div>{(() => {
                    const [year, month, day] = shift.date.split('-');
                    return `${month}/${day}/${year}`;
                })()}</div>
                  
                  <div>{shift.startTime}</div>
                  <div>{shift.endTime}</div>
                  <div>{shift.duration}</div>
                  <div>${shift.earnings}</div>
                  <div>
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
        <div class="mt-6 rounded-lg p-4 text-center">

          <div class="text-lg font-medium mb-2">Summary</div>

          <div class="grid grid-cols-3 gap-4">
            <div class="bg-white p-3 rounded border border-gray-300">
              <div class="text-sm ">Total Shifts</div>
              <div class="text-xl font-semibold">{shifts.length}</div>
            </div>
            <div class="bg-white p-3 rounded border border-gray-300">
              <div class="text-sm ">Total Hours</div>
              <div class="text-xl font-semibold">
                {shifts.reduce((total, shift) => {
                  return total + (shift.totalHours || 0);
                }, 0).toFixed(1)}
              </div>
            </div>
            <div class="bg-white p-3 rounded border border-gray-300">

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