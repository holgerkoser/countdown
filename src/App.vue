<template>
  <div
    ref="tick"
    class="tick"
  >
    <div
      data-repeat="true"
      data-layout="horizontal fit"
      data-transform="preset(d, h, m, s) -> delay"
    >
      <div class="tick-group">
        <div
          data-key="value"
          data-repeat="true"
          data-transform="pad(00) -> split -> delay"
        >
          <span data-view="flip" />
        </div>

        <span
          data-key="label"
          data-view="text"
          class="tick-label"
        />
      </div>
    </div>
  </div>

  <div
    class="tick-onended-message"
    style="display: none"
  >
    <p>Time's up</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Tick from '@pqina/flip'
import '@pqina/flip/dist/flip.min.css'

const tick = ref(null)

const endDate = new Date('2024-12-31')
console.log(endDate.toISOString())
const excludedDays = ['2024-10-25', '2024-11-01', '2024-12-24', '2024-12-25', '2024-12-26', '2024-12-31']

function calculateDuration () {
  let date = new Date()
  let days = 0
  let hours = 0
  let minutes = 0
  let seconds = 0
  while (date <= endDate) {
    const dayOfWeek = date.getDay()
    const dateString = date.toISOString().slice(0, 10)
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !excludedDays.includes(dateString)) {
      days += 1
    }
    date = new Date(date.getTime() + 24 * 3600 * 1000)
  }
  date = new Date()
  const dateString = date.toISOString().slice(0, 10)
  let time = Math.floor((date.getTime() - Date.parse(dateString + ' 00:00:00')) / 1000)
  if (time >= 9 * 3600) {
    time -= 9 * 3600
    days -= 1
    if (time <= 8 * 3600) {
      time = 8 * 3600 - time
      hours = Math.trunc(time / 3600)
      minutes = Math.trunc(time / 60) % 60
      seconds = time % 60
    }
  }
  days = Math.max(0, days - 2)
  return [days, hours, minutes, seconds]
}

onMounted(() => {
  Tick.DOM.create(tick.value, {
    credits: false,
    didInit (tick) {
      const counter = Tick.count.down(endDate)

      counter.onupdate = value => {
        tick.value = calculateDuration(value)
      }

      counter.onended = () => {
        console.log('onended')
      }

      console.log('initialized')
    },
  })
})
</script>

<style lang="scss" scoped>
.tick {
  font-size: 1rem;
  white-space: nowrap;
  font-family: arial, sans-serif;
}

.tick-flip,
.tick-text-inline {
  font-size: 2.5em;
}

.tick-label {
  margin-top: 1em;
  font-size: 1em;
}

.tick-char {
  width: 1.5em;
}

.tick-text-inline {
  display: inline-block;
  text-align: center;
  min-width: 1em;
}

.tick-text-inline + .tick-text-inline {
  margin-left: -0.325em;
}

.tick-group {
  margin: 0 0.5em;
  text-align: center;
}

.tick-text-inline {
  color: rgb(90, 93, 99) !important;
}

.tick-label {
  color: rgb(90, 93, 99) !important;
}

.tick-flip-panel {
  color: rgb(255, 255, 255) !important;
}

.tick-flip {
  font-family: arial, sans-serif !important;
}

.tick-flip-panel-text-wrapper {
  line-height: 1.45 !important;
}

.tick-flip-panel {
  background-color: rgb(59, 61, 59) !important;
}

.tick-flip {
  border-radius: 0.12em !important;
}
</style>
