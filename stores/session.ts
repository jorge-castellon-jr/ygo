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

    const piece_to_move: PieceInterface = {
      name: "",
      id: "",
      team: "",
      position: 0,
      history: {},
    };

    const attacking_cards: Card[] = [];

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
      is_attacking: false,
      is_card_table_open: false,
      card_to_summon: "",

      summoning_points,
      cards,
      move_highlight_positions,
      summon_highlight_positions,
      piece_to_move,
      attacking_cards,
      board_pieces,
    };
  },
  actions: {
    changeTurn() {
      this.turns_left--;
      this.player_turn = !this.player_turn;
      this.has_summoned = false;
    },
    changePiecePosition(newRow: number, newCell: number) {
      let piece = this.piece_to_move;
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
          position: this.getFullPosition(newRow, newCell),
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
        this.getFullPosition(row, cell) - 9, // Top Left
        this.getFullPosition(row, cell) - 10, // Top Center
        this.getFullPosition(row, cell) - 11, // Top Right
        this.getFullPosition(row, cell) + 9, // Bottom Left
        this.getFullPosition(row, cell) + 10, // Bottom Center
        this.getFullPosition(row, cell) + 11, // Bottom Right
        this.getFullPosition(row, cell) - 1, // Left Center
        this.getFullPosition(row, cell) + 1, // Right Center
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
    openAttackOverlay(defenderId: string) {
      this.is_attacking = true;

      const attacker_card = this.cards.find(
        (c) => c.id == this.piece_to_move.id
      ) as Card;
      const deffender_card = this.cards.find((c) => c.id == defenderId) as Card;

      this.attacking_cards = [attacker_card, deffender_card];
    },
    closeAttackingOverlay() {
      console.log("closing overlay");

      this.is_attacking = false;
    },
    setAttackingCards(firstId: string, secondId: string) {},
  },
  getters: {
    whos_turn: (state) => (state.player_turn ? "White" : "Red"),
    getCurrentMaster(state) {
      const master = state.board_pieces.find((bp) => bp.name == "Master");
      return master;
    },
    getFullPosition() {
      return (row: number, cell: number) => {
        return Number(`${row}${cell}`);
      };
    },
    getSplitPosition() {
      return (position: number | string): number[] => {
        return [Number(position.toString()[0]), Number(position.toString()[1])];
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
          (bp) => bp.position == this.getFullPosition(row, cell)
        );
        return find_piece;
      };
    },
    hasPiece() {
      return (row: number, cell: number) => {
        const find_piece = this.board_pieces.find(
          (bp) => bp.position == this.getFullPosition(row, cell)
        );

        if (find_piece) {
          return true;
        }
      };
    },
    nextToPiece() {
      return (row: number, cell: number) => {
        return this.move_highlight_positions.find(
          (mhp) => mhp === this.getFullPosition(row, cell)
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
            (hp: number) => hp == this.getFullPosition(row, cell)
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
            (hp: number) => hp == this.getFullPosition(row, cell)
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
