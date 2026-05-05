import { CancelButton } from "components/CancelButton";
import { Score } from "./Score";
import { Timer } from "./Timer";
import { Tries } from "./Tries";

export function Infobar() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6 px-3 sm:px-5 py-3 sm:py-3.5 rounded-card bg-infobar border border-line shadow-infobar">
      <div className="flex items-center gap-3 sm:gap-[18px]">
        <div className="hidden sm:contents">
          <CancelButton />
          <div className="h-7 w-px bg-line" />
        </div>
        <Score />
      </div>
      <Timer />
      <div className="flex justify-end items-center">
        <Tries />
      </div>
    </div>
  );
}
