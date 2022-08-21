export function DiceToPlay({ value }: { value: number }) {
  return (
    <div className="w-10 h-10 rounded bg-slate-100 flex justify-center items-center mr-2">
      {value}
    </div>
  );
}
