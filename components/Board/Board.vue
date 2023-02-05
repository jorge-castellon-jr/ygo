<template>
  <div class="board">
    <div v-for="r in h" :key="`board-row-${r}`" class="row">
      <div
        v-for="c in w"
        :key="`board-cell-${c}`"
        class="cell"
        :class="[getLayout(r, c), getActiveTeam(r, c)]"
      >
        <board-piece
          v-if="sessionStore.hasPiece(r, c)"
          :piece="sessionStore.getPiece(r, c)"
          @click="highlightMovePiece(r, c)"
        />
        <div
          v-if="sessionStore.isMoveHighlight(r, c)"
          class="highlight move"
          @click="movePiece(r, c)"
        ></div>
        <div
          v-if="sessionStore.isSummonHighlight(r, c)"
          class="highlight summon"
          @click="summonPiece(r, c)"
        ></div>
        <div
          v-if="sessionStore.isAttackHighlight(r, c)"
          class="highlight attack"
          @click="attackPiece(r, c)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { PieceInterface } from "@/types/piece";
import { Card } from "~~/types/card";

const sessionStore = useSessionStore();
defineProps({
  h: Number,
  w: Number,
});

const highlight_positions: Ref<number[]> = ref([]);
const pieceToMove: any = ref({
  name: "",
  position: 0,
});

const isMoving = ref(false);

const getLayout = (row: number, cell: number) => {
  switch (sessionStore.getLayoutPosition(row, cell)) {
    case "plains":
      return "bg-green-400";
    case "forest":
      return "bg-green-900";
    case "mountains":
      return "bg-slate-200";
    case "wasteland":
      return "bg-orange-300";
    case "dark":
      return "bg-purple-500";
    case "highlight":
      return "bg-yellow-500";
    case "locked":
      return "bg-black";

    default:
      return "bg-slate-900";
  }
};
const getActiveTeam = (row: number, cell: number) => {
  if (sessionStore.isCurrentTeam(sessionStore.getPiece(row, cell)?.team)) return "active";
  return "";
};

const highlightMovePiece = (row: number, cell: number) => {
  let piece = sessionStore.getPiece(row, cell) as PieceInterface;
  if (!sessionStore.isCurrentTeam(piece.team)) return false;

  const hasMoved = piece.history[sessionStore.turns_left];

  if (hasMoved) return false;

  if (!sessionStore.is_moving) {
    sessionStore.resetHighlights();
    sessionStore.is_moving = true;
    sessionStore.move_highlight_positions = [
      sessionStore.currentPosition(row, cell) - 10,
      sessionStore.currentPosition(row, cell) + 10,
      sessionStore.currentPosition(row, cell) - 1,
      sessionStore.currentPosition(row, cell) + 1,
    ];
    pieceToMove.value = sessionStore.getPiece(row, cell);
  } else {
    sessionStore.resetHighlights();
  }
};
const movePiece = (row: number, cell: number) => {
  const piece = sessionStore.getPiece(
    pieceToMove.value.position.toString()[0],
    pieceToMove.value.position.toString()[1]
  ) as PieceInterface;

  sessionStore.changePiecePosition(piece, row, cell);
  sessionStore.resetHighlights();
};
const summonPiece = (row: number, cell: number) => {
  const summonCard: Card = sessionStore.getSummonCard;
  const piece: PieceInterface = {
    name: summonCard.name,
    id: summonCard.id,
    team: sessionStore.whos_turn,
    position: sessionStore.currentPosition(row, cell),
    history: { [sessionStore.turns_left]: false },
  };

  sessionStore.addPiece(piece);
  sessionStore.resetHighlights();
};
const attackPiece = (row: number, cell: number) => {
  alert("attacking " + sessionStore.getPiece(row, cell)?.name);
  // const summonCard: Card = sessionStore.getSummonCard;
  // const piece: PieceInterface = {
  //   name: summonCard.name,
  //   id: summonCard.id,
  //   team: sessionStore.whos_turn,
  //   position: sessionStore.currentPosition(row, cell),
  //   history: { [sessionStore.turns_left]: false },
  // };
  // sessionStore.addPiece(piece);
  // sessionStore.resetHighlights();
};
</script>

<style lang="scss" scoped>
.board {
  @apply bg-slate-500 p-6;
  .row {
    @apply bg-slate-700 p-6 flex justify-between;
    .cell {
      @apply h-20 w-20 flex justify-center items-center text-slate-500;
      &.active:hover {
        @apply bg-sky-500  cursor-pointer;
      }

      .highlight {
        @apply absolute w-16 h-16 cursor-pointer;
        &.move {
          @apply bg-yellow-500;
        }
        &.summon {
          @apply bg-blue-500;
        }
        &.attack {
          @apply bg-red-500;
        }
      }
    }
  }
}
</style>
