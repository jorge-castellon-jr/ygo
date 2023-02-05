<template>
  <div class="bar top-0">
    <div class="grid grid-cols-3 px-4 w-full">
      <div class="flex">
        <div class="button" :class="sessionStore.whos_turn">
          Team {{ sessionStore.whos_turn }}'s Turn
        </div>
      </div>
      <div class="flex justify-center">
        <div class="button">Turns Left: {{ sessionStore.turns_left }}</div>
      </div>
      <div class="flex justify-end">
        <div class="button">Summoning Points: {{ sessionStore.currentTeamSP() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// future pinia stores
const sessionStore = useSessionStore();
</script>

<style lang="scss" scoped>
.button {
  &.White {
    @apply bg-slate-300 text-slate-600;
  }
  &.Red {
    @apply bg-red-400 text-red-900;
  }
}
</style>
