import { defineStore } from "pinia";
import { PieceInterface } from "@/types/piece";
import { TeamSummoningPoint } from "@/types/team";
import { Card } from "@/types/card";

export const useSessionStore = defineStore("SessionStore", {
  state: () => {
    const board_pieces: PieceInterface[] = [
      {
        name: "Master",
        id: "white0",
        team: "White",
        position: 74,
        history: { 99: false },
      },
      {
        name: "Master",
        id: "red0",
        team: "Red",
        position: 14,
        history: { 99: false },
      },
    ];
    const move_highlight_positions: number[] = [];
    const summon_highlight_positions: number[] = [];

    const summoning_points: TeamSummoningPoint = { White: 9, Red: 3 };

    const cards: Card[] = [
      {
        id: "1",
        name: "Summons Skull",
        cost: 6,
        atk: 25,
        def: 12,
        desc: "A fiend with dark powers for confusing the enemy. Among the Fiend-Type monsters, this monster boasts considerable force",
        type: "trap",
        element: "trap",
      },
      {
        id: "2",
        name: "Dark Magician",
        cost: 7,
        atk: 25,
        def: 21,
        desc: "",
        type: "normal",
        element: "light",
      },
      {
        id: "3",
        name: "Blue-Eyes White Dragon",
        cost: 8,
        atk: 30,
        def: 25,
        desc: "",
        type: "normal",
        element: "light",
      },
      {
        id: "4",
        name: "Red-Eyes Black Dragon",
        cost: 7,
        atk: 24,
        def: 20,
        desc: "",
        type: "effect",
        element: "dark",
      },
      {
        id: "5",
        name: "Mystical Elf",
        cost: 4,
        atk: 8,
        def: 20,
        desc: "",
        type: "magic",
        element: "magic",
      },
    ];

    return {
      player_turn: true,
      turns_left: 99,
      has_summoned: false,
      board_layout: [
        ["forest", "plains", "plains", "plains", "plains", "plains", "forest"],
        ["plains", "plains", "locked", "dark", "locked", "plains", "plains"],
        ["plains", "locked", "dark", "dark", "dark", "locked", "plains"],
        ["plains", "dark", "dark", "dark", "dark", "dark", "plains"],
        ["plains", "locked", "dark", "dark", "dark", "locked", "plains"],
        ["plains", "plains", "locked", "dark", "locked", "plains", "plains"],
        ["forest", "plains", "plains", "plains", "plains", "plains", "forest"],
      ],
      is_moving: false,
      is_summoning: false,
      is_card_table_open: false,
      card_to_summon: "",

      summoning_points,
      cards,
      move_highlight_positions,
      summon_highlight_positions,
      board_pieces,
    };
  },
  actions: {
    changeTurn() {
      this.turns_left--;
      this.player_turn = !this.player_turn;
      this.has_summoned = false;
    },
    changePiecePosition(
      piece: PieceInterface,
      newRow: number,
      newCell: number
    ) {
      this.resetHighlights();
      let pieceIndex = this.board_pieces.findIndex(
        (bp) => bp.position == piece.position
      );

      piece.history = Object.assign(
        {},
        { ...piece.history, [this.turns_left]: true }
      );
      piece = Object.assign(
        {},
        {
          ...piece,
          position: this.currentPosition(newRow, newCell),
        }
      );

      this.board_pieces[pieceIndex] = Object.assign({}, piece);
    },
    highlightSummonArea(cardId: string) {
      if (this.has_summoned) return false;
      if (this.is_summoning) return (this.is_summoning = false);

      this.resetHighlights();
      const master_piece = this.board_pieces.find(
        (bp) => bp.name == "Master" && bp.team == this.whos_turn
      ) as PieceInterface;
      const row = Number(master_piece.position.toString()[0]);
      const cell = Number(master_piece.position.toString()[1]);

      this.summon_highlight_positions = [
        this.currentPosition(row, cell) - 9, // Top Left
        this.currentPosition(row, cell) - 10, // Top Center
        this.currentPosition(row, cell) - 11, // Top Right
        this.currentPosition(row, cell) + 9, // Bottom Left
        this.currentPosition(row, cell) + 10, // Bottom Center
        this.currentPosition(row, cell) + 11, // Bottom Right
        this.currentPosition(row, cell) - 1, // Left Center
        this.currentPosition(row, cell) + 1, // Right Center
      ];
      this.is_summoning = true;
      this.card_to_summon = cardId;
      this.closeCardTable();
    },
    addPiece(newPiece: PieceInterface) {
      this.board_pieces.push(newPiece);
      this.has_summoned = true;
    },
    resetHighlights() {
      this.is_moving = false;
      this.is_summoning = false;
      this.move_highlight_positions = [];
      this.summon_highlight_positions = [];
    },
    openCardTable() {
      this.is_card_table_open = true;
    },
    closeCardTable() {
      this.is_card_table_open = false;
    },
  },
  getters: {
    whos_turn: (state) => (state.player_turn ? "White" : "Red"),
    getCurrentMaster(state) {
      const master = state.board_pieces.find((bp) => bp.name == "Master");
      return master;
    },
    currentPosition() {
      return (row: number, cell: number) => {
        return Number(`${row}${cell}`);
      };
    },
    getLayoutPosition() {
      return (row: number, cell: number) =>
        this.board_layout[row - 1][cell - 1];
    },
    isCurrentTeam() {
      return (team: string = "") => team == this.whos_turn;
    },
    currentTeamSP() {
      return () => this.summoning_points[this.whos_turn];
    },

    getPiece() {
      return (row: number, cell: number) => {
        const find_piece = this.board_pieces.find(
          (bp) => bp.position == this.currentPosition(row, cell)
        );
        return find_piece;
      };
    },
    hasPiece() {
      return (row: number, cell: number) => {
        const find_piece = this.board_pieces.find(
          (bp) => bp.position == this.currentPosition(row, cell)
        );

        if (find_piece) {
          return true;
        }
      };
    },
    nextToPiece() {
      return (row: number, cell: number) => {
        return this.move_highlight_positions.find(
          (mhp) => mhp === this.currentPosition(row, cell)
        );
      };
    },
    canHighlight() {
      return (row: number, cell: number) => {
        if (this.getLayoutPosition(row, cell) === "locked") return false;
        if (this.hasPiece(row, cell)) return false;
        return true;
      };
    },
    isMoveHighlight() {
      return (row: number, cell: number) => {
        if (this.is_moving && this.canHighlight(row, cell)) {
          const has_highlights = this.move_highlight_positions.find(
            (hp: number) => hp == this.currentPosition(row, cell)
          );

          if (has_highlights) return true;
        }
        return false;
      };
    },
    isSummonHighlight() {
      return (row: number, cell: number) => {
        if (this.is_summoning && this.canHighlight(row, cell)) {
          const has_highlights = this.summon_highlight_positions.find(
            (hp: number) => hp == this.currentPosition(row, cell)
          );

          if (has_highlights) return true;
        }
        return false;
      };
    },
    isAttackHighlight() {
      return (row: number, cell: number) => {
        if (
          this.hasPiece(row, cell) &&
          this.getPiece(row, cell)?.team != this.whos_turn &&
          this.is_moving &&
          this.nextToPiece(row, cell)
        ) {
          return true;
        }
        return false;
      };
    },
    getSummonCard: (state) =>
      state.cards.find((c) => c.id == state.card_to_summon) as Card,
  },
});
