import { Dice } from "./Dice";

export function DiceSlot({ value }: { value: number }) {
  return (
    <div className={"w-10 h-10 rounded bg-slate-300 p-2  dice-" + value}>
      <Dice />
    </div>
  );
}
