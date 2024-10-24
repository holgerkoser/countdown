<template>
  <div
    ref="tick"
    class="tick"
  >
    <div
      data-repeat="true"
      aria-hidden="true"
    >
      <span data-view="flip" />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  toRef,
  watch,
  onMounted,
  onUnmounted,
} from 'vue'
import Tick from '@pqina/flip'
import '@pqina/flip/dist/flip.min.css'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
})

const tick = ref(null)

let flipTick = null

const modelValue = toRef(props, 'modelValue')

watch(modelValue, value => {
  if (flipTick) {
    flipTick.value = value
  }
})

onMounted(() => {
  flipTick = Tick.DOM.create(tick.value, {
    value: modelValue.value,
    credits: false,
  })
})

onUnmounted(() => {
  Tick.DOM.destroy(tick.value)
})
</script>

<style lang="css" scoped>
.tick {
  font-size: 3em;
}
</style>
