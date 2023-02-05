<template>
  <div class="board-piece" :class="piece.team">
    {{ piece.name }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  piece: Object,
});
</script>

<style lang="scss" scoped>
.board-piece {
  @apply h-10 w-10 bg-white flex justify-center items-center z-10 border-solid border-2;
  &.White {
    @apply border-blue-300;
  }
  &.Red {
    @apply border-red-400;
  }
}
</style>
