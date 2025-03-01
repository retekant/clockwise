import {useState, useEffect} from "preact/hooks";



export default function ShiftProgressTracker() {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [payPerHour, setPayPerHour] = useState(0);
  const [date, setDate] = useState(formatDateForInput(new Date()));

  
  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  // Update calculation function when time inputs change
  const calculateProgress = () => {
    const now = new Date();
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const start = new Date();
    start.setHours(startHours, startMinutes, 0);
    
    const end = new Date();
    end.setHours(endHours, endMinutes, 0);
    
    //next day 
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
   
    if (now < start) {
      setProgress(0); 
    } 

    else if (now > end) {
      setProgress(100); 
    } 

    else {
      const totalDuration = end - start;
      const elapsed = now - start;
      setProgress(Math.round((elapsed / totalDuration) * 100));
    }
    
    // Update current time
    setCurrentTime(new Date());
  };


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
      } catch (e) {
        console.error("Error parsing shifts from localStorage:", e);
      }
    }
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let hours = endHours - startHours;
    let minutes = endMinutes - startMinutes;
    
    
    const totalHours = hours + (minutes / 60);
    const earnings = totalHours * parseFloat(payPerHour);
    
    const newShift = {
      id: Date.now(),
      date: date,
      startTime: startTime,
      endTime: endTime,
      payPerHour: parseFloat(payPerHour) || 0,
      duration: `${hours}h ${minutes}m`,
      totalHours: totalHours,
      earnings: earnings.toFixed(2),
      completed: progress === 100
    };
    
    const updatedShifts = [...shifts, newShift];
    localStorage.setItem('shift_history', JSON.stringify(updatedShifts));
    
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

  }, [startTime, endTime, payPerHour]);

  const calculateCurrentEarnings = () => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let hours = endHours - startHours;
    let minutes = endMinutes - startMinutes;
    
    const totalHours = hours + (minutes / 60);


    const fullEarnings = totalHours * parseFloat(payPerHour || 0);
    
    return ((fullEarnings * progress) / 100).toFixed(2);
  };

  useEffect(() => {
    calculateProgress();
  }, [startTime, endTime]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      calculateProgress();
    }, 3000);
    //Updating every 3 seconds becase it reloads the selector and want to give some time
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  // making it 24 hour time scale/military time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div class="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div class="mb-8">
        <div class="text-xl text-center justify-center mb-2 font-semibold">
          Enter Shift
        </div>
        
        <div class="relative pt-1">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs">{startTime}</div>
            <div class="text-right">
              <div class="text-xs text-indigo-600">{progress}%</div>
              <div class="text-xs text-indigo-600">
                $ {calculateCurrentEarnings()}
              </div>
            </div>
            <div class="text-xs">{endTime}</div>
          </div>

          <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div 
              style={{ width: `${progress}%` }} 
              class="shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-indigo-500 transition-all duration-300"
            ></div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-4 gap-4 text-center mb-6">
        <div>
          <div class="text-sm mb-1">Date</div>
          <input 
            type="date" 
            class="text-center w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
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
            class="text-center w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
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
            class="text-center w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
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
            class="w-full p-2 border text-center border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
            value={payPerHour}
            onChange={(e) => {
              setPayPerHour(e.target.value);
            }}
          />
        </div>

      </div>


      
      
      <div class="flex justify-center">
        <button 
          onClick={saveShift}
          class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition duration-300"
        >
          Save Shift
        </button>
      </div>
    </div>
  );
}