import { useState, useEffect } from "preact/hooks";

export default function ProgressTrackerIsland() {

  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [payPerHour, setPayPerHour] = useState(0);
  const [lunchBreak, setLunchBreak] = useState(false);



  useEffect(() => {
    const savedStartTime = localStorage.getItem('shift_startTime');
    const savedEndTime = localStorage.getItem('shift_endTime');
    const savedPayPerHour = localStorage.getItem('shift_payPerHour');
    
    if (savedStartTime) setStartTime(savedStartTime);
    if (savedEndTime) setEndTime(savedEndTime);
    if (savedPayPerHour) setPayPerHour(Number(savedPayPerHour));
  }, []);


  const calculateProgress = () => {
    const now = new Date();
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const start = new Date();
    start.setHours(startHours, startMinutes, 0);
    
    const end = new Date();
    end.setHours(endHours, endMinutes, 0);
    
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    if (now < start) {
      setProgress(0);
    } else if (now > end) {
      setProgress(100);
    } else {
      const totalDuration = end - start;
      const elapsed = now - start;
      setProgress(Math.round((elapsed / totalDuration) * 100));
    }
    
    
    setCurrentTime(new Date());
  };


  const calculateCurrentEarnings = () => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let hours = endHours - startHours;
    let minutes = endMinutes - startMinutes;
    



    if (hours < 0 || (hours === 0 && minutes < 0)) {
      hours += 24;
    }
    
    const totalHours = hours + (minutes / 60);
    const fullEarnings = (lunchBreak ? totalHours - 0.5 : totalHours) * parseFloat(payPerHour || 0);
    
    return ((fullEarnings * progress) / 100).toFixed(2);
  };

  useEffect(() => {
    const handleStorageChange = () => {

      const savedStartTime = localStorage.getItem('shift_startTime');
      const savedEndTime = localStorage.getItem('shift_endTime');
      const savedPayPerHour = localStorage.getItem('shift_payPerHour');
      
      if (savedStartTime) setStartTime(savedStartTime);
      if (savedEndTime) setEndTime(savedEndTime);
      if (savedPayPerHour) setPayPerHour(Number(savedPayPerHour));
    };
    

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);


  }, []);

  useEffect(() => {
    calculateProgress();
    
    const interval = setInterval(() => {
      calculateProgress();
    }, 3000); 
    
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  return (
    <div class="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div class="text-2xl text-center mb-4 font-semibold text-indigo-700">
        Shift Progress
      </div>
      
      <div class="relative pt-1">
        <div class="flex items-center justify-between mb-3 ">
          <div class="text-sm font-medium">{startTime}</div>
          <div class="text-sm font-medium">{endTime}</div>
        </div>

        <div class="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-200">
          <div 
            style={{ width: `${progress}%` }} 
            class="flex flex-col text-center whitespace-nowrap justify-center bg-indigo-500 transition-all duration-300 rounded-full"
          ></div>
        </div>
        
        <div class="flex flex-col items-center text-center mb-2">
          <div class="text-sm text-indigo-600 font-medium">{progress}% Complete</div>

          <div class="text-4xl font-bold text-indigo-700 mt-2">
            ${calculateCurrentEarnings()}
          </div>
          <div class="text-sm text-gray-700">earned so far</div>
        </div>
      </div>
    </div>
  );
}