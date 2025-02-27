import {useState, useEffect} from "preact/hooks";



export default function ShiftProgressTracker() {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  
  
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
    <div class="w-1/2 mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div class="mb-8 ">
        <div class="text-lg text-center justify-center mb-2 ">
            Input Shift
        </div>
        
        <div class="relative pt-1">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs ">{startTime}</div>
            <div class="text-right">
              <span class="text-xs text-indigo-600">{progress}%</span>
            </div>
            <div class="text-xs ">{endTime}</div>
          </div>

          <div class="overflow-hidden h-2 mb-4 text-xs flex rounded">
            <div 
              style={{ width: `${progress}%` }} 
              class="shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-indigo-500 transition-all duration-300"
            ></div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4 text-center">
        <div>
          <div class="text-sm  mb-1">Shift Start</div>
          <input 
            type="time" 
            class="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
            value={startTime}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setStartTime(target.value);
            }}
          />
        </div>

        <div>
          <div class="block text-sm  mb-1">Shift End</div>
          <input 
            type="time" 
            class="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
            value={endTime}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setEndTime(target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}