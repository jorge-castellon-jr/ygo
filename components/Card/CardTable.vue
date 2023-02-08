<template>
  <div :class="sessionStore.is_card_table_open ? 'open' : ''" class="card-table">
    <div class="close button hover" @click="closeCardTable()">x</div>
    <div class="flex items-end h-full p-4 space-x-4">
      <Card v-for="card in cards" :key="card.id" :card="card" />
    </div>
  </div>
</template>

<script setup lang="ts">
const sessionStore = useSessionStore();

const closeCardTable = () => sessionStore.closeCardTable();
const cards = sessionStore.cards;
</script>

<style lang="scss" scoped>
.card-table {
  bottom: -100%;
  @apply h-80 w-full fixed z-50 bg-slate-200 border-t-2 border-slate-400 transition-all duration-300;
  &.open {
    @apply bottom-0;
  }
  .close {
    @apply absolute right-0 top-0 m-2;
  }

  .card {
    &:hover {
      @apply scale-110 -translate-y-3;
    }
  }
}
</style>
