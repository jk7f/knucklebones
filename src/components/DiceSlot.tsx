export function DiceSlot({ value }: { value: number }) {
  return (
    <div
      className={
        "w-10 h-10 rounded bg-slate-300 flex justify-center items-center dice-" +
        value
      }
    >
      {value}
    </div>
  );
}
