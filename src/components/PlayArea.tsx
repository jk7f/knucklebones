import { PlayerState } from "..";
import { DiceSlot } from "./DiceSlot";
import { DiceToPlay } from "./DiceToPlay";

interface PlayAreaProps extends PlayerState {
  playerAction: (playerId: number, row: number, val: number) => void;
}

export function PlayArea(props: PlayAreaProps) {
  function selectSlot(row: number, val: number) {
    if (props.diceToPlay > 0) {
      props.playerAction(props.playerId, row, val);
    }
  }

  function getDuplicatesClass(row: [number, number, number]): string {
    const duplicates = [...row]
      .sort()
      .filter((val, index, arr) => arr.indexOf(val) !== index);
    if (duplicates.length) {
      return "dupe-" + duplicates[0];
    }

    return "";
  }

  return (
    <div className="flex ">
      <DiceToPlay value={props.diceToPlay}></DiceToPlay>
      <div className="flex  items-start">
        {props.dice.map((row, index) => (
          <div
            className={
              "flex flex-col gap-2 border-4 border-transparent hover:border-slate-200 " +
              getDuplicatesClass(row)
            }
            onClick={() => selectSlot(index, props.diceToPlay)}
            key={index}
          >
            <div className="w-10 h-50 rounded bg-slate-100 flex justify-center items-center">
              {props.rowTotals[index]}
            </div>
            {row.map((col, colIndex) => (
              <DiceSlot value={col} key={colIndex}></DiceSlot>
            ))}
          </div>
        ))}
        <div className="w-10 h-50 rounded bg-slate-100 flex justify-center items-center mt-1 ml-2">
          {props.total}
        </div>
      </div>
    </div>
  );
}
