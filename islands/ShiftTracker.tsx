import {useState, useEffect} from "preact/hooks";



export default function ShiftProgressTracker() {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [progress, setProgress] = useState(0);
  const [payPerHour, setPayPerHour] = useState(0);
  const [date, setDate] = useState(formatDateForInput(new Date()));
  const [lunchBreak, setLunchBreak] = useState(false);

  
  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // shift management
  const saveShift = () => {
    // Get existing shifts from localStorage
    const savedShifts = localStorage.getItem('shift_history');
    let shifts = [];
    
    if (savedShifts) {
      try {
        const parsedShifts = JSON.parse(savedShifts);
        if (Array.isArray(parsedShifts)) {
          shifts = parsedShifts;
        }
      } 
      
      catch (e) {
        console.error("Error parsing shifts from localStorage:", e);
      }
    }
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let hours = endHours - startHours;
    let minutes = endMinutes - startMinutes;
    
  

    const totalHours = hours + (minutes / 60);

    const earnings = (lunchBreak ? totalHours-0.5 : totalHours) * parseFloat(payPerHour);
    
    const newShift = {
      id: Date.now(),
      date: date,
      startTime: startTime,
      endTime: endTime,
      payPerHour: parseFloat(payPerHour) || 0,
      duration: `${hours}h ${minutes}m`,
      totalHours: totalHours,
      earnings: earnings.toFixed(2),
      completed: true
    };
    
    const updatedShifts = [...shifts, newShift];
    localStorage.setItem('shift_history', JSON.stringify(updatedShifts));
    
    window.dispatchEvent(new Event('storage'));
  };
    
  //Local storage loading on component mount
  useEffect(() => {

    const savedStartTime = localStorage.getItem('shift_startTime');
    const savedEndTime = localStorage.getItem('shift_endTime');
    const savedPayPerHour = localStorage.getItem('shift_payPerHour');
    
    if (savedStartTime) setStartTime(savedStartTime);
    if (savedEndTime) setEndTime(savedEndTime);
    if (savedPayPerHour) setPayPerHour(Number(savedPayPerHour));

  }, []);

  //updating local storage on change
  useEffect(() => {
    localStorage.setItem('shift_startTime', startTime);
    localStorage.setItem('shift_endTime', endTime);
    localStorage.setItem('shift_payPerHour', payPerHour.toString());

    window.dispatchEvent(new Event('storage'));
  }, [startTime, endTime, payPerHour]);

 
  return (
    <div class="w-full mx-auto p-4 bg-white rounded-lg shadow-lg flex-shrink h-full">
      <div class="mb-8">
        <div class="text-2xl text-center justify-center mb-2 font-semibold text-indigo-700">
          Enter Shift
        </div>
        
        </div>
      
      <div class="grid grid-cols-4 gap-4 text-center mb-6">
        <div>
          <div class="text-sm mb-1">Date</div>
          <input 
            type="date" 
            class="text-center w-full p-2 border border-gray-300 rounded shadow-sm"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
        </div>
        
        <div>
          <div class="text-sm mb-1">Shift Start</div>
          <input 
            type="time" 
            class="text-center w-full p-2 border border-gray-300 rounded shadow-sm"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
            }}
          />
        </div>

        

        <div>
          <div class="block text-sm mb-1">Shift End</div>
          <input 
            type="time" 
            class="text-center w-full p-2 border border-gray-300 rounded shadow-sm"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
            }}
          />
        </div>

        <div>
          <div class="block text-sm mb-1">Hourly Pay</div>
          <input 
            type="number" 
            class="w-full p-2 border text-center border-gray-300 rounded shadow-sm"
            value={payPerHour}
            onChange={(e) => {
              setPayPerHour(e.target.value);
            }}
          />
        </div>

      </div>


      
      
      <div class="flex justify-center flex flex-col items-center mt-11 ">
        <button 
          onClick={saveShift}
          class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded
           transition duration-300 shadow-md"
        >
          Save Shift
        </button>
        <div class="flex items-center mt-4">
          <input 
            type="checkbox" id="lunchBreak" checked={lunchBreak}
            onChange={(e) => setLunchBreak(e.target.checked)}
            class="h-4 w-4 rounded"
          />
          <label htmlFor="lunchBreak" class="ml-2 text-sm text-gray-700">
            30 Minute Lunch Break
          </label>
        </div>
      </div>
    </div>
  );
}