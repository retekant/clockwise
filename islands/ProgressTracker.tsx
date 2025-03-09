import { useState, useEffect } from "preact/hooks";

export default function ProgressTrackerIsland() {

  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [breakProgress, setBreakProgress] = useState({ start: 0, end: 0 });
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [payPerHour, setPayPerHour] = useState(0);
  const [lunchBreak, setLunchBreak] = useState(false);
  const [breakTime, setBreakTime] = useState('12:00');
  const [currentlyOnBreak, setCurrentlyOnBreak] = useState(false);


  useEffect(() => {
    const savedStartTime = localStorage.getItem('shift_startTime');
    const savedEndTime = localStorage.getItem('shift_endTime');
    const savedPayPerHour = localStorage.getItem('shift_payPerHour');
    const savedBreakTime = localStorage.getItem('shift_breakTime');
    const savedLunchBreak = localStorage.getItem('shift_lunchBreak');
    
    if (savedStartTime) setStartTime(savedStartTime);
    if (savedEndTime) setEndTime(savedEndTime);
    if (savedPayPerHour) setPayPerHour(Number(savedPayPerHour));
    if (savedBreakTime) setBreakTime(savedBreakTime);
    if (savedLunchBreak) setLunchBreak(savedLunchBreak === 'true');
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
      setCurrentlyOnBreak(false);
    } 
    
    else if (now > end) {
      setProgress(100);
      setCurrentlyOnBreak(false);
    } 
    
    else {
      const totalDuration = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      setProgress(Math.round((elapsed / totalDuration) * 100));
      
      if (lunchBreak) {
        const [breakHours, breakMinutes] = breakTime.split(':').map(Number);
        const breakStart = new Date();
        breakStart.setHours(breakHours, breakMinutes, 0);
        
        const breakEnd = new Date(breakStart);
        breakEnd.setMinutes(breakEnd.getMinutes() + 30);
        
        if (breakStart < start) breakStart.setDate(breakStart.getDate() + 1);
        if (breakEnd < start) breakEnd.setDate(breakEnd.getDate() + 1);
        
      
        const breakStartPercent = Math.max(0, Math.min(100, Math.round(((breakStart.getTime() - start.getTime()) / totalDuration) * 100)));
        const breakEndPercent = Math.max(0, Math.min(100, Math.round(((breakEnd.getTime() - start.getTime()) / totalDuration) * 100)));
        
        setBreakProgress({ start: breakStartPercent, end: breakEndPercent });
        setCurrentlyOnBreak(now >= breakStart && now <= breakEnd);
      } 
      
      else {
        setBreakProgress({ start: 0, end: 0 });
        setCurrentlyOnBreak(false);
      }
    }
    
    setCurrentTime(now);
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

    if (currentlyOnBreak) {

      const now = new Date();

      const [startHr, startMin] = startTime.split(':').map(Number);
      const shiftStart = new Date();
      const [breakHr, breakMin] = breakTime.split(':').map(Number);
      const breakStartTime = new Date();

      shiftStart.setHours(startHr, startMin, 0);
      breakStartTime.setHours(breakHr, breakMin, 0);
      let progressUpToBreak = 0;


      if (breakStartTime > shiftStart) {
        const totalShiftMs = (totalHours * 60 * 60 * 1000);
        const msUpToBreak = breakStartTime.getTime() - shiftStart.getTime();
        progressUpToBreak = msUpToBreak / totalShiftMs;
      }
      
      return (fullEarnings * progressUpToBreak).toFixed(2);
    }

    if (lunchBreak && progress > breakProgress.end) {
      const adjustedProgress = progress - ((breakProgress.end - breakProgress.start) * (30 / (totalHours * 60)));
      return ((fullEarnings * adjustedProgress) / 100).toFixed(2);
    }
    
    return ((fullEarnings * progress) / 100).toFixed(2);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const savedStartTime = localStorage.getItem('shift_startTime');
      const savedEndTime = localStorage.getItem('shift_endTime');
      const savedPayPerHour = localStorage.getItem('shift_payPerHour');
      const savedBreakTime = localStorage.getItem('shift_breakTime');
      const savedLunchBreak = localStorage.getItem('shift_lunchBreak');
      
      if (savedStartTime) setStartTime(savedStartTime);
      if (savedEndTime) setEndTime(savedEndTime);
      if (savedPayPerHour) setPayPerHour(Number(savedPayPerHour));
      if (savedBreakTime) setBreakTime(savedBreakTime);
      if (savedLunchBreak) setLunchBreak(savedLunchBreak === 'true');
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('breakSettingsChanged', calculateProgress);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('breakSettingsChanged', calculateProgress);
    };
  }, []);

  useEffect(() => {
    calculateProgress();
    
    const interval = setInterval(() => {
      calculateProgress();
    }, 3000); 
    
    return () => clearInterval(interval);
  }, [startTime, endTime, breakTime, lunchBreak]);

  return (
    <div class="w-full p-9 bg-white rounded-lg shadow-lg pb-14">
      <div class="text-2xl text-center mb-4 font-semibold text-indigo-700">
        Shift Progress
      </div>
      
      <div class="relative pt-1">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-medium">{startTime}</div>
          <div class="text-sm font-medium">{endTime}</div>
        </div>

        <div class="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-200 relative">
          <div 
            style={{ width: `${progress}%` }} 
            class="flex flex-col text-center whitespace-nowrap justify-center bg-indigo-500 transition-all duration-300 rounded-full"
          ></div>
          
          {lunchBreak && breakProgress.end > breakProgress.start && (
            <div 
              style={{ 
                left: `${breakProgress.start}%`, 
                width: `${breakProgress.end - breakProgress.start}%`
              }} 
              class="bg-indigo-300 z-20 absolute top-0 h-full"
            ></div>
          )}
        </div>
        
        <div class="flex flex-col items-center text-center mt-11">
          <div class="text-sm text-indigo-600 font-medium">
            {progress}% Complete
            {currentlyOnBreak && <span class="ml-2 text-indigo-300">(On Break)</span>}
          </div>

          <div class="text-4xl font-bold text-indigo-700 mt-2">
            ${calculateCurrentEarnings()}
          </div>
          <div class="text-sm text-gray-700">earned so far</div>
          
          {lunchBreak && (
            <div class="text-xs text-indigo-400 mt-1">
              30 min break at {breakTime}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}