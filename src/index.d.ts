export interface PlayerState {
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
