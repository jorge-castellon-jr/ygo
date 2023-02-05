<template>
  <div class="card" :class="getType()" @click="summonCard">
    <div class="card__element">{{ $capFirstLetter(card.element) }}</div>
    <div class="card__content">
      <div class="card__title">{{ card.name }}</div>
      <div class="card__description">{{ card.desc }}</div>
    </div>
    <div class="card__cost">{{ card.cost }}</div>
    <div class="card__atk">{{ card.atk }}</div>
    <div class="card__def">{{ card.def }}</div>
  </div>
</template>

<script setup lang="ts">
import { Card } from "@/types/card";

const sessionStore = useSessionStore();

interface Props {
  card: Card;
}
const { card } = defineProps<Props>();

const getType = () => {
  return card.type;
};

const summonCard = () => sessionStore.highlightSummonArea(card.id);
</script>

<style lang="scss" scoped>
.card {
  @apply relative p-3 pb-6 w-full h-60 border-2 border-slate-400 rounded-lg  overflow-hidden transition-transform cursor-pointer;

  &:hover {
    @apply scale-110 -translate-y-3;
  }

  &__title {
    @apply font-bold;
  }
  &__description {
    @apply font-light text-sm;
  }
  &__element {
    @apply text-sm font-semibold text-slate-500;
    .normal & {
      @apply text-orange-900;
    }
    .effect & {
      @apply text-orange-900;
    }
    .magic & {
      @apply text-emerald-900;
    }
    .trap & {
      @apply text-violet-900;
    }
  }

  &__cost,
  &__atk,
  &__def {
    @apply absolute  flex justify-center items-center font-bold text-slate-200 rounded-full border-2 border-slate-500;
  }

  &__cost {
    top: -2px;
    right: -2px;
    @apply w-8 h-8 bg-slate-900  rounded-tr-none;
  }
  &__atk {
    bottom: -2px;
    left: -2px;
    @apply w-10 h-10  bg-red-900 rounded-bl-none;
  }
  &__def {
    bottom: -2px;
    right: -2px;
    @apply w-10 h-10  bg-blue-400 rounded-br-none;
  }

  &.normal {
    @apply bg-orange-200;
  }
  &.effect {
    @apply bg-orange-300;
  }
  &.magic {
    @apply bg-emerald-400;
  }
  &.trap {
    @apply bg-violet-400;
  }
}
</style>
