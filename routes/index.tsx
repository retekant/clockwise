import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import ShiftTracker from "../islands/ShiftTracker.tsx";

export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto bg-[#df7070] min-h-screen min-w-screen">
      <ShiftTracker />
    </div>
  );
}
