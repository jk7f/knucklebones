import { useState } from "react";

interface PlayerState {
  playerId: number;
  total: number;
  rowTotals: [number, number, number];
  diceToPlay: number;
  dice: [
    [number, number, number],
    [number, number, number],
    [number, number, number]
  ];
}

interface PlayAreaProps extends PlayerState {
  playerAction: (playerId: number, row: number, val: number) => void;
}

function getRandomInt(max: number) {
  return 1 + Math.floor(Math.random() * max);
}

const playerState = {
  playerId: null,
  total: 0,
  diceToPlay: 0,
  rowTotals: [0, 0, 0],
  dice: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
};

function App() {
  const [gameState, setGameState] = useState([
    { ...playerState, playerId: 0, diceToPlay: getRandomInt(6) },
    { ...playerState, playerId: 1 },
  ]);
  const playerAction = (playerId: number, row: number, val: number) => {
    const stateCopy = JSON.parse(JSON.stringify(gameState));
    const setRowTotals = (player: PlayerState) => {
      player.rowTotals.forEach((_, rowIndex) => {
        let result = 0;
        const sorted = [...player.dice[rowIndex]].sort();
        sorted.forEach((item, index) => {
          if (index === 2 && sorted[0] === item && sorted[1] === item) {
            // triples
            result = item * 9;
          } else if (index > 0 && sorted[index - 1] === item) {
            // doubles
            result -= item;
            result += item * 4;
          } else {
            result += item;
          }
        });
        player.rowTotals[rowIndex] = result;
      });
    };

    const setTotal = (player: PlayerState) => {
      player.total = player.rowTotals.reduce((prev, cur) => prev + cur, 0);
    };

    const stateOfPlayer: PlayerState = stateCopy[playerId];
    const playerRowEmptySlot = [...stateOfPlayer.dice[row]]
      .reverse()
      .findIndex((i) => i === 0);
    if (playerRowEmptySlot < 0) {
      return;
    }
    stateOfPlayer.diceToPlay = 0;
    stateOfPlayer.dice[row][2 - playerRowEmptySlot] = val;

    const stateOfOpponent: PlayerState = stateCopy[1 - playerId];

    // delete any numbers of opponent in same row
    const mirrorRowOfOpponent = Math.abs(row - 2);
    stateOfOpponent.dice[mirrorRowOfOpponent] = stateOfOpponent.dice[
      mirrorRowOfOpponent
    ].map((colVal, colIndex) => {
      if (val === colVal) {
        return 0;
      }
      return colVal;
    }) as [number, number, number];
    stateOfOpponent.diceToPlay = getRandomInt(6);

    setRowTotals(stateOfPlayer);
    setRowTotals(stateOfOpponent);

    setTotal(stateOfPlayer);
    setTotal(stateOfOpponent);

    setGameState(stateCopy);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center py-4">
      <div style={{ transform: "rotate(180deg)" }}>
        <PlayArea {...gameState[0]} playerAction={playerAction}></PlayArea>
      </div>
      <PlayArea {...gameState[1]} playerAction={playerAction}></PlayArea>
    </div>
  );
}

export default App;

function PlayArea(props: PlayAreaProps) {
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
      <RollAnim value={props.diceToPlay}></RollAnim>
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

function RollAnim({ value }: { value: number }) {
  return (
    <div className="w-10 h-10 rounded bg-slate-100 flex justify-center items-center mr-2">
      {value}
    </div>
  );
}

function DiceSlot({ value }: { value: number }) {
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
