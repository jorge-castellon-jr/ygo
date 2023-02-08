<template>
  <div v-if="sessionStore.is_attacking" class="overlay attacking-overlay">
    <div class="cards">
      <Card v-for="card in sessionStore.attacking_cards" :key="card.id" :card="card" />
    </div>
    <div class="buttons">
      <div class="button hover" @click="cancel()">Cancel</div>
      <div class="button hover">Attack</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sessionStore = useSessionStore();

const cancel = () => sessionStore.closeAttackingOverlay();
</script>

<style lang="scss" scoped>
.attacking-overlay {
  @apply w-full h-full flex flex-col justify-center fixed z-40 top-0 my-16 p-4;

  .cards,
  .buttons {
    @apply flex;
  }

  .cards {
    @apply space-x-6;
  }

  .buttons {
    @apply justify-center space-x-4 p-4;
  }
}
</style>
