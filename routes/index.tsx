import ShiftTracker from "../islands/ShiftTracker.tsx";
import Calendar from "../islands/Calendar.tsx";
import ProgressTracker from "../islands/ProgressTracker.tsx";
import Settings from "../islands/Settings.tsx";

//</div><div class="px-4 py-8 mx-auto bg-[#df7070] min-h-screen min-w-screen 
   //  flex flex-col space-y-8">
export default function Home() {
  return (
    <div className="min-h-screen min-w-screen bg-[#d35b5b] pb-10">
      <div className="p-5 flex flex-col md:flex-row gap-3">
        <div className="w-full md:w-[50%] flex"> 
          <ProgressTracker />
        </div>
        <div className="w-full md:w-[50%] flex"> 
          <ShiftTracker />
        </div>
      </div>
      <div className="flex flex-col justify-center px-5 gap-3">
        <Calendar />
      </div>
      <Settings />
    </div>
  );
}