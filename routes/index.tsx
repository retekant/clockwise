import ShiftTracker from "../islands/ShiftTracker.tsx";
import Calendar from "../islands/Calendar.tsx";
import ProgressTracker from "../islands/ProgressTracker.tsx";


//</div><div class="px-4 py-8 mx-auto bg-[#df7070] min-h-screen min-w-screen 
   //  flex flex-col space-y-8">
export default function Home() {
  return (
    <div class="min-h-screen min-w-screen flex-row bg-[#d35b5b] pb-10">
      <div class="p-5 flex flex-row gap-3">
        <div class="w-[90%]">
       <ProgressTracker />
       </div>
       <div class="">
        <ShiftTracker />
        </div>
      </div>
      <div class="flex justify-center"><Calendar /></div>

      </div>
  );
}