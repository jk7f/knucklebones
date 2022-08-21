export default function WinnerIndicator({ winner }: { winner: number | null }) {
  if (winner === 0) {
    return <div style={{ translate: "rotate(180deg)" }}>You won!</div>;
  }
  if (winner === 1) {
    return <>You won!</>;
  }
  if (winner === 2) {
    return <>Draw!</>;
  }

  return null;
}
