import { useState } from "react";
import { PlayerState } from ".";
import { PlayArea } from "./components/PlayArea";
import WinnerIndicator from "./components/WinnerIndicator";

function getRandomInt(max: number) {
  return 1 + Math.floor(Math.random() * max);
}

const playerState = {
  playerId: null,
  total: 0,
  diceToPlay: 0,
  rowTotals: [0, 0, 0] as [number, number, number],
  dice: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ] as [
    [number, number, number],
    [number, number, number],
    [number, number, number]
  ],
};

function App() {
  const [winner, setWinner] = useState<null | number>(null);
  const [gameState, setGameState] = useState([
    { ...playerState, playerId: 0, diceToPlay: getRandomInt(6) },
    { ...playerState, playerId: 1 },
  ]);
  const playerAction = (playerId: number, row: number, val: number) => {
    const stateCopy: [PlayerState, PlayerState] = JSON.parse(
      JSON.stringify(gameState)
    );
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

    const isGameOver = stateOfPlayer.dice.reduce((prev, cur) => {
      if (cur.includes(0)) {
        return false;
      }
      return prev;
    }, true);
    if (isGameOver) {
      const p1Score = stateCopy[0].total;
      const p2Score = stateCopy[1].total;
      if (p1Score > p2Score) {
        setWinner(0);
      } else if (p2Score > p1Score) {
        setWinner(1);
      } else {
        // draw
        setWinner(2);
      }
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between items-center py-4">
      <div style={{ transform: "rotate(180deg)" }}>
        <PlayArea {...gameState[0]} playerAction={playerAction}></PlayArea>
      </div>
      <WinnerIndicator winner={winner}></WinnerIndicator>
      <PlayArea {...gameState[1]} playerAction={playerAction}></PlayArea>
    </div>
  );
}

export default App;
