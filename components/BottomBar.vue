<template>
  <div class="bar bottom-0">
    <div class="flex items-baseline space-x-4">
      <div v-if="!sessionStore.has_summoned" class="button hover" @click="summonCard">
        Summon Card
      </div>
      <div class="button hover" @click="finishTurn">Finish Turn</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sessionStore = useSessionStore();
const finishTurn = () => {
  sessionStore.changeTurn();
};
const summonCard = () => {
  sessionStore.openCardTable();
  // sessionStore.highlightSummonArea();
};
</script>

<style scoped></style>
