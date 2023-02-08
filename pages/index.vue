<template>
  <div>
    <TopBar />
    <Board class="my-16" :h="7" :w="7" />
    <OverlayAttack />
    <BottomBar />
    <CardTable />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
