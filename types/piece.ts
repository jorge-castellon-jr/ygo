interface PieceInterface {
  name: string;
  id: string;
  team: string;
  position: number;
  history: PieceHistory;
}

interface PieceHistory {
  [name: number]: boolean;
}

export { PieceInterface };
